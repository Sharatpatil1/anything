"""Version 2 thermal calculations for the passive shelter model.

Heat-flow signs use positive values outward from the indoor thermal mass.
Solar gain is positive inward. Wall and roof surfaces solve one simplified
external energy balance, so radiation is not added a second time indoors.
"""

import math

import pandas as pd

from materials import get_material


SHELTER = {
    "length": 6.0,
    "width": 4.0,
    "height": 3.0,
    "wall_thickness": 0.2,
    "window_area": 0.0,
    "door_area": 0.0,
    "wall_density": None,
    "wall_specific_heat": None,
    "roof_mass": None,
    "floor_mass": None,
    "wind_speed": 2.0,
    "orientation_degrees": 0.0,
    "timestep_seconds": 3600.0,
}
DT_SECONDS = 3600.0
INITIAL_INDOOR_TEMPERATURE = 20.0
SIGMA = 5.670374419e-8
H_INSIDE = 8.0
H_GROUND = 1.5
WINDOW_U_VALUE = 2.5
DOOR_U_VALUE = 2.0
COMFORT_MIN = 18.0
COMFORT_MAX = 27.0
REQUIRED_CLIMATE_COLUMNS = {
    "hour",
    "ambient_temperature",
    "ground_temperature",
    "solar_irradiance",
}
MATERIAL_NAMES = (
    "Concrete",
    "Stone",
    "Adobe",
    "Insulated Composite",
)


def calculate_areas(shelter=SHELTER):
    """Calculate envelope areas, excluding openings from opaque wall area."""
    wall_area = 2 * (shelter["length"] + shelter["width"]) * shelter["height"]
    roof_area = shelter["length"] * shelter["width"]
    floor_area = roof_area
    opaque_wall_area = wall_area - shelter["window_area"] - shelter["door_area"]
    return {
        "wall_area": wall_area,
        "opaque_wall_area": opaque_wall_area,
        "roof_area": roof_area,
        "floor_area": floor_area,
        "envelope_volume": (opaque_wall_area + roof_area + floor_area)
        * shelter["wall_thickness"],
    }


def outside_convection_coefficient(wind_speed):
    """Estimate outside h in W/(m² K) using h = 5.7 + 3.8V."""
    return 5.7 + 3.8 * wind_speed


def thermal_resistance(k, area, thickness, h_inside=H_INSIDE, h_outside=10.0):
    """Return series resistances in K/W for a surface."""
    if area <= 0:
        return {"inside": 0.0, "conduction": 0.0, "outside": 0.0, "total": math.inf}
    inside = 1 / (h_inside * area)
    conduction = thickness / (k * area)
    outside = 1 / (h_outside * area)
    return {
        "inside": inside,
        "conduction": conduction,
        "outside": outside,
        "total": inside + conduction + outside,
    }


def radiation_heat_transfer(emissivity, area, surface_temperature, surrounding_temperature):
    """Return signed long-wave radiation in W, using Kelvin temperatures."""
    surface_kelvin = surface_temperature + 273.15
    surrounding_kelvin = surrounding_temperature + 273.15
    if surface_kelvin <= 0 or surrounding_kelvin <= 0:
        raise ValueError("Radiation temperatures must be above absolute zero.")
    return emissivity * SIGMA * area * (
        surface_kelvin**4 - surrounding_kelvin**4
    )


def solar_gain(irradiance, exposed_area, absorptivity):
    """Return absorbed solar power in W for an effective exposed area."""
    return irradiance * exposed_area * absorptivity


def effective_solar_area(areas, shelter):
    """Use roof plus one orientation-weighted wall for simple solar exposure.

    Orientation is the angle in degrees between a reference wall normal and
    the assumed solar direction. No hourly sun-position model is implied.
    """
    orientation_factor = max(
        0.0, math.cos(math.radians(shelter["orientation_degrees"]))
    )
    wall_area = areas["opaque_wall_area"] / 4 * orientation_factor
    return areas["roof_area"] + wall_area


def _surface_energy_balance(
    material,
    area,
    indoor_temperature,
    ambient_temperature,
    thickness,
    wind_speed,
    absorbed_solar,
):
    """Solve q_cond + q_solar = q_conv + q_rad for the outer surface.

    The indoor-to-surface path contains inside convection and solid
    conduction. Outside convection, radiation, and solar absorption are
    balanced at the surface. A bisection solve keeps this nonlinear radiation
    calculation transparent and avoids adding radiation twice to indoor heat.
    """
    h_outside = outside_convection_coefficient(wind_speed)
    resistance = thermal_resistance(
        material["k"], area, thickness, H_INSIDE, h_outside
    )
    inside_to_surface_resistance = resistance["inside"] + resistance["conduction"]

    def residual(surface_temperature):
        q_conduction = (
            indoor_temperature - surface_temperature
        ) / inside_to_surface_resistance
        q_convection = h_outside * area * (
            surface_temperature - ambient_temperature
        )
        q_radiation = radiation_heat_transfer(
            material["emissivity"], area, surface_temperature, ambient_temperature
        )
        return q_conduction + absorbed_solar - q_convection - q_radiation

    lower = min(indoor_temperature, ambient_temperature) - 100.0
    upper = max(indoor_temperature, ambient_temperature) + 100.0
    for _ in range(10):
        if residual(lower) > 0 and residual(upper) < 0:
            break
        lower -= 100.0
        upper += 100.0
    else:
        raise ValueError("Could not bracket the outside surface temperature.")

    for _ in range(100):
        middle = (lower + upper) / 2
        if residual(middle) > 0:
            lower = middle
        else:
            upper = middle
    surface_temperature = (lower + upper) / 2
    q_conduction = (
        indoor_temperature - surface_temperature
    ) / inside_to_surface_resistance
    q_convection = h_outside * area * (surface_temperature - ambient_temperature)
    q_radiation = radiation_heat_transfer(
        material["emissivity"], area, surface_temperature, ambient_temperature
    )
    return {
        "conduction": q_conduction,
        "convection": q_convection,
        "radiation": q_radiation,
        "solar": absorbed_solar,
        "surface_temperature": surface_temperature,
    }


def _validate_positive(value, name):
    if not isinstance(value, (int, float)) or not math.isfinite(value) or value <= 0:
        raise ValueError(f"{name} must be a finite value greater than zero.")


def validate_inputs(material_name, climate, shelter=SHELTER):
    """Validate material, shelter, timestep, and climate inputs."""
    material = get_material(material_name)
    for property_name in ("k", "density", "Cp"):
        _validate_positive(material[property_name], f"Material {property_name}")
    for property_name in ("emissivity", "solar_absorptivity"):
        value = material[property_name]
        if not isinstance(value, (int, float)) or not 0 <= value <= 1:
            raise ValueError(f"Material {property_name} must be between 0 and 1.")

    for property_name in ("length", "width", "height", "wall_thickness"):
        _validate_positive(shelter[property_name], f"Shelter {property_name}")
    _validate_positive(shelter["timestep_seconds"], "Timestep")
    if not isinstance(shelter["wind_speed"], (int, float)) or not math.isfinite(
        shelter["wind_speed"]
    ):
        raise ValueError("Shelter wind_speed must be a finite numeric value.")
    if shelter["wind_speed"] < 0:
        raise ValueError("Shelter wind_speed cannot be negative.")
    if not isinstance(shelter["orientation_degrees"], (int, float)) or not math.isfinite(
        shelter["orientation_degrees"]
    ):
        raise ValueError("Shelter orientation_degrees must be a finite numeric value.")
    for property_name in ("window_area", "door_area"):
        if shelter[property_name] < 0:
            raise ValueError(f"Shelter {property_name} cannot be negative.")
    wall_area = 2 * (shelter["length"] + shelter["width"]) * shelter["height"]
    if shelter["window_area"] + shelter["door_area"] > wall_area:
        raise ValueError("Window and door area cannot exceed total wall area.")
    for property_name in ("roof_mass", "floor_mass"):
        if shelter[property_name] is not None and shelter[property_name] < 0:
            raise ValueError(f"Shelter {property_name} cannot be negative.")

    missing = REQUIRED_CLIMATE_COLUMNS - set(climate.columns)
    if missing:
        raise ValueError(
            "Climate data is missing required columns: " + ", ".join(sorted(missing))
        )
    for column_name in ("ambient_temperature", "ground_temperature", "solar_irradiance"):
        values = pd.to_numeric(climate[column_name], errors="coerce")
        if values.isna().any() or not values.map(math.isfinite).all():
            raise ValueError(f"Climate column {column_name} must contain numeric values.")
    if (pd.to_numeric(climate["solar_irradiance"]) < 0).any():
        raise ValueError("Climate solar_irradiance cannot be negative.")
    temperatures = climate[["ambient_temperature", "ground_temperature"]].apply(
        pd.to_numeric
    )
    if (temperatures <= -273.15).any().any():
        raise ValueError("Climate temperatures must be above absolute zero.")


def calculate_thermal_capacity(material, areas, shelter):
    """Calculate lumped wall, roof, and floor capacity in J/K."""
    density = shelter["wall_density"] or material["density"]
    specific_heat = shelter["wall_specific_heat"] or material["Cp"]
    _validate_positive(density, "Wall density")
    _validate_positive(specific_heat, "Wall specific heat")
    wall_mass = areas["opaque_wall_area"] * shelter["wall_thickness"] * density
    roof_mass = shelter["roof_mass"]
    floor_mass = shelter["floor_mass"]
    if roof_mass is None:
        roof_mass = areas["roof_area"] * shelter["wall_thickness"] * density
    if floor_mass is None:
        floor_mass = areas["floor_area"] * shelter["wall_thickness"] * density
    return wall_mass * specific_heat + (roof_mass + floor_mass) * specific_heat


def _energy_columns(results, timestep_seconds):
    """Add per-step and cumulative J/Wh columns for every power component."""
    power_columns = (
        "conduction_heat_transfer_W",
        "convection_heat_transfer_W",
        "radiation_heat_transfer_W",
        "opening_heat_transfer_W",
        "solar_gain_W",
        "net_heat_transfer_W",
        "total_heat_loss_W",
    )
    for power_column in power_columns:
        base_name = power_column.removesuffix("_W")
        results[f"{base_name}_energy_J"] = results[power_column] * timestep_seconds
        results[f"{base_name}_energy_Wh"] = results[f"{base_name}_energy_J"] / 3600
        results[f"cumulative_{base_name}_energy_J"] = results[
            f"{base_name}_energy_J"
        ].cumsum()
        results[f"cumulative_{base_name}_energy_Wh"] = results[
            f"{base_name}_energy_Wh"
        ].cumsum()
    return results


def simulate(material_name, climate, shelter=SHELTER):
    """Run a simulation; indoor_temperature is end-of-timestep temperature in °C."""
    validate_inputs(material_name, climate, shelter)
    material = get_material(material_name)
    climate = climate.copy()
    for column_name in ("ambient_temperature", "ground_temperature", "solar_irradiance"):
        climate[column_name] = pd.to_numeric(climate[column_name])
    areas = calculate_areas(shelter)
    timestep_seconds = shelter["timestep_seconds"]
    thermal_capacity = calculate_thermal_capacity(material, areas, shelter)
    indoor_temperature = INITIAL_INDOOR_TEMPERATURE
    results = []
    wall_solar_area = effective_solar_area(areas, shelter) - areas["roof_area"]

    for climate_row in climate.itertuples(index=False):
        ambient_temperature = float(climate_row.ambient_temperature)
        ground_temperature = float(climate_row.ground_temperature)
        irradiance = float(climate_row.solar_irradiance)
        roof_solar = solar_gain(
            irradiance, areas["roof_area"], material["solar_absorptivity"]
        )
        wall_solar = solar_gain(
            irradiance, wall_solar_area, material["solar_absorptivity"]
        )
        wall = _surface_energy_balance(
            material,
            areas["opaque_wall_area"],
            indoor_temperature,
            ambient_temperature,
            shelter["wall_thickness"],
            shelter["wind_speed"],
            wall_solar,
        )
        roof = _surface_energy_balance(
            material,
            areas["roof_area"],
            indoor_temperature,
            ambient_temperature,
            shelter["wall_thickness"],
            shelter["wind_speed"],
            roof_solar,
        )
        floor_resistance = thermal_resistance(
            material["k"],
            areas["floor_area"],
            shelter["wall_thickness"],
            H_INSIDE,
            H_GROUND,
        )
        floor_conduction = (
            indoor_temperature - ground_temperature
        ) / floor_resistance["total"]
        window_heat = WINDOW_U_VALUE * shelter["window_area"] * (
            indoor_temperature - ambient_temperature
        )
        door_heat = DOOR_U_VALUE * shelter["door_area"] * (
            indoor_temperature - ambient_temperature
        )
        opening_heat = window_heat + door_heat
        solar_power = wall_solar + roof_solar
        conduction_power = wall["conduction"] + roof["conduction"] + floor_conduction
        convection_power = wall["convection"] + roof["convection"]
        radiation_power = wall["radiation"] + roof["radiation"]
        total_heat_loss = convection_power + radiation_power + floor_conduction + opening_heat
        net_heat = solar_power - total_heat_loss
        next_indoor_temperature = indoor_temperature + (
            net_heat * timestep_seconds / thermal_capacity
        )
        results.append(
            {
                "hour": int(climate_row.hour),
                "ambient_temperature_C": ambient_temperature,
                "ground_temperature_C": ground_temperature,
                "indoor_temperature_start_C": indoor_temperature,
                "indoor_temperature": next_indoor_temperature,
                "solar_irradiance_W_m2": irradiance,
                "wall_surface_temperature_C": wall["surface_temperature"],
                "roof_surface_temperature_C": roof["surface_temperature"],
                "conduction_heat_transfer_W": conduction_power,
                "convection_heat_transfer_W": convection_power,
                "radiation_heat_transfer_W": radiation_power,
                "opening_heat_transfer_W": opening_heat,
                "solar_gain_W": solar_power,
                "total_heat_loss_W": total_heat_loss,
                "net_heat_transfer_W": net_heat,
                "thermal_capacity_J_K": thermal_capacity,
            }
        )
        indoor_temperature = next_indoor_temperature

    return _energy_columns(pd.DataFrame(results), timestep_seconds)


def summarize_simulation(results, comfort_min=COMFORT_MIN, comfort_max=COMFORT_MAX):
    """Return end-of-hour temperature and accumulated-energy summary values."""
    return {
        "minimum_indoor_temperature_C": results["indoor_temperature"].min(),
        "maximum_indoor_temperature_C": results["indoor_temperature"].max(),
        "average_indoor_temperature_C": results["indoor_temperature"].mean(),
        "total_heat_loss_J": results["total_heat_loss_energy_J"].sum(),
        "total_heat_loss_Wh": results["total_heat_loss_energy_Wh"].sum(),
        "total_solar_gain_J": results["solar_gain_energy_J"].sum(),
        "total_solar_gain_Wh": results["solar_gain_energy_Wh"].sum(),
        "hours_within_comfort_range": (
            (results["indoor_temperature"] >= comfort_min)
            & (results["indoor_temperature"] <= comfort_max)
        ).sum(),
    }


def compare_materials(
    climate,
    shelter=SHELTER,
    comfort_min=COMFORT_MIN,
    comfort_max=COMFORT_MAX,
):
    """Run the same validated climate and shelter conditions for each material."""
    comparison = []
    for material_name in MATERIAL_NAMES:
        summary = summarize_simulation(
            simulate(material_name, climate, shelter), comfort_min, comfort_max
        )
        summary["material"] = material_name
        comparison.append(summary)
    return pd.DataFrame(comparison)[
        [
            "material",
            "minimum_indoor_temperature_C",
            "maximum_indoor_temperature_C",
            "average_indoor_temperature_C",
            "total_heat_loss_J",
            "total_heat_loss_Wh",
            "total_solar_gain_J",
            "total_solar_gain_Wh",
            "hours_within_comfort_range",
        ]
    ]
