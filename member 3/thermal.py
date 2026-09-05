"""Core calculations for the simple shelter thermal model."""

import pandas as pd

from materials import get_material


SHELTER = {
    "length": 6.0,
    "width": 4.0,
    "height": 3.0,
    "wall_thickness": 0.2,
}
DT_SECONDS = 3600
INITIAL_INDOOR_TEMPERATURE = 20.0


def calculate_areas(shelter=SHELTER):
    """Calculate the exposed areas and material volume of the shelter envelope."""
    wall_area = 2 * (shelter["length"] + shelter["width"]) * shelter["height"]
    roof_area = shelter["length"] * shelter["width"]
    floor_area = roof_area
    envelope_volume = (wall_area + roof_area + floor_area) * shelter["wall_thickness"]

    return {
        "wall_area": wall_area,
        "roof_area": roof_area,
        "floor_area": floor_area,
        "envelope_volume": envelope_volume,
    }


def conduction_heat_loss(k, area, indoor_temperature, ambient_temperature, thickness):
    """Calculate conduction heat flow in watts using the requested equation."""
    return k * area * (indoor_temperature - ambient_temperature) / thickness


def solar_gain(irradiance, exposed_area, absorptivity):
    """Calculate simplified solar gain in watts."""
    return irradiance * exposed_area * absorptivity


def simulate(material_name, climate, shelter=SHELTER):
    """Run an hourly simulation and return one result row per climate row."""
    material = get_material(material_name)
    areas = calculate_areas(shelter)
    thickness = shelter["wall_thickness"]
    thermal_capacity = areas["envelope_volume"] * material["density"] * material["Cp"]
    indoor_temperature = INITIAL_INDOOR_TEMPERATURE
    results = []

    for climate_row in climate.itertuples(index=False):
        ambient_temperature = float(climate_row.ambient_temperature)
        irradiance = float(climate_row.solar_irradiance)
        wall_loss = conduction_heat_loss(
            material["k"],
            areas["wall_area"],
            indoor_temperature,
            ambient_temperature,
            thickness,
        )
        roof_loss = conduction_heat_loss(
            material["k"],
            areas["roof_area"],
            indoor_temperature,
            ambient_temperature,
            thickness,
        )
        floor_loss = conduction_heat_loss(
            material["k"],
            areas["floor_area"],
            indoor_temperature,
            ambient_temperature,
            thickness,
        )
        total_loss = wall_loss + roof_loss + floor_loss
        gain = solar_gain(
            irradiance,
            areas["roof_area"],
            material["solar_absorptivity"],
        )
        net_heat = gain - total_loss
        next_indoor_temperature = indoor_temperature + net_heat * DT_SECONDS / thermal_capacity

        results.append(
            {
                "hour": int(climate_row.hour),
                "ambient_temperature": ambient_temperature,
                "indoor_temperature": indoor_temperature,
                "solar_irradiance": irradiance,
                "wall_heat_loss": wall_loss,
                "roof_heat_loss": roof_loss,
                "floor_heat_loss": floor_loss,
                "total_heat_loss": total_loss,
                "solar_gain": gain,
                "net_heat": net_heat,
            }
        )
        indoor_temperature = next_indoor_temperature

    return pd.DataFrame(results)


def summarize_simulation(results):
    """Return the requested summary values for a simulation."""
    return {
        "minimum_indoor_temperature": results["indoor_temperature"].min(),
        "maximum_indoor_temperature": results["indoor_temperature"].max(),
        "average_indoor_temperature": results["indoor_temperature"].mean(),
        "total_heat_loss": results["total_heat_loss"].sum(),
        "total_solar_gain": results["solar_gain"].sum(),
    }


def compare_materials(climate, shelter=SHELTER):
    """Run the same climate simulation for every supplied material."""
    comparison = []
    for material_name in (
        "Concrete",
        "Stone",
        "Adobe",
        "Insulated Composite",
    ):
        summary = summarize_simulation(simulate(material_name, climate, shelter))
        summary["material"] = material_name
        comparison.append(summary)
    return pd.DataFrame(comparison)[
        [
            "material",
            "minimum_indoor_temperature",
            "maximum_indoor_temperature",
            "average_indoor_temperature",
            "total_heat_loss",
            "total_solar_gain",
        ]
    ]
