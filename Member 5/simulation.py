from materials import materials
from climate import climate_data


def simulate_shelter(
    wall_material,
    insulation_material,
    thickness,
    orientation,
    window_area,
    location="Ladakh",
    shelter_length=5,
    shelter_width=5,
    occupants=0,
    season="Winter"
):

    # --------------------------------
    # 1. MATERIAL PROPERTIES
    # --------------------------------

    wall_k = materials[wall_material]["thermal_conductivity"]

    insulation_k = materials[insulation_material]["thermal_conductivity"]


    # --------------------------------
    # 2. THICKNESS OF EACH LAYER
    # --------------------------------

    wall_thickness = thickness / 2

    insulation_thickness = thickness / 2


    # --------------------------------
    # 3. THERMAL RESISTANCE
    # --------------------------------

    wall_resistance = (
        wall_thickness / wall_k
    )

    insulation_resistance = (
        insulation_thickness / insulation_k
    )

    # Indoor and outdoor surface resistance
    inside_resistance = 0.12
    outside_resistance = 0.03

    total_resistance = (
        inside_resistance +
        wall_resistance +
        insulation_resistance +
        outside_resistance
    )

    # U-value
    u_value = 1 / total_resistance


    # --------------------------------
    # 4. SHELTER GEOMETRY
    # --------------------------------

    shelter_height = 2.5

    floor_area = (
        shelter_length *
        shelter_width
    )

    roof_area = floor_area

    wall_area = (
        2 *
        (shelter_length + shelter_width) *
        shelter_height
    )


    # --------------------------------
    # 5. WINDOW AREA
    # --------------------------------

    window_surface_area = (
        wall_area *
        window_area
    )

    opaque_wall_area = max(
        0,
        wall_area - window_surface_area
    )


    # --------------------------------
    # 6. CLIMATE DATA
    # --------------------------------

    outdoor_temperature = (
        climate_data[location][season]["temperature"]
    )

    solar_radiation = (
        climate_data[location][season]["solar_radiation"]
    )

    indoor_target_temperature = 20


    # --------------------------------
    # 7. TEMPERATURE DIFFERENCE
    # --------------------------------

    temperature_difference = abs(
        indoor_target_temperature -
        outdoor_temperature
    )


    # --------------------------------
    # 8. HEAT LOSS
    # --------------------------------

    wall_heat_loss = (
        u_value *
        opaque_wall_area *
        temperature_difference
    )

    roof_heat_loss = (
        u_value *
        roof_area *
        temperature_difference
    )

    floor_heat_loss = (
        u_value *
        floor_area *
        temperature_difference
    )

    # Windows have higher heat transfer
    window_u_value = 2.5

    window_heat_loss = (
        window_u_value *
        window_surface_area *
        temperature_difference
    )

    heat_loss = (
        wall_heat_loss +
        roof_heat_loss +
        floor_heat_loss +
        window_heat_loss
    )


    # --------------------------------
    # 9. SOLAR HEAT GAIN
    # --------------------------------

    if orientation == "South":

        orientation_factor = 1.0

    elif orientation == "East":

        orientation_factor = 0.8

    elif orientation == "West":

        orientation_factor = 0.7

    else:

        orientation_factor = 0.5


    solar_gain = (
        solar_radiation *
        window_surface_area *
        0.60 *
        orientation_factor
    )


    # --------------------------------
    # 10. INTERNAL HEAT FROM OCCUPANTS
    # --------------------------------

    # Approximate sensible heat released
    # by one person inside the shelter.

    heat_per_person = 100

    internal_heat = (
        occupants *
        heat_per_person
    )


    # --------------------------------
    # 11. NET HEATING / COOLING LOAD
    # --------------------------------

    if outdoor_temperature < indoor_target_temperature:

        # Cold climate:
        # Solar gain and occupant heat
        # reduce the heating requirement.

        heating_load = max(
            0,
            heat_loss -
            solar_gain -
            internal_heat
        )

        cooling_load = 0

    else:

        # Warm climate:
        # Solar gain and occupant heat
        # increase the cooling requirement.

        heating_load = 0

        cooling_load = max(
            0,
            heat_loss +
            solar_gain +
            internal_heat
        )


    # --------------------------------
    # 12. DAILY ENERGY REQUIREMENT
    # --------------------------------

    energy_load = (
        heating_load +
        cooling_load
    )

    # Convert W to kWh/day
    energy_required = (
        energy_load *
        24 /
        1000
    )


    # --------------------------------
    # 13. SIMPLIFIED INDOOR TEMPERATURE
    # --------------------------------

    if outdoor_temperature < indoor_target_temperature:

        # Solar and occupant heat help
        # maintain the indoor temperature.

        useful_heat = (
            solar_gain +
            internal_heat
        )

        heat_offset = min(
            5,
            (
                useful_heat /
                max(heat_loss, 1)
            ) * 5
        )

        indoor_temperature = (
            outdoor_temperature +
            (
                indoor_target_temperature -
                outdoor_temperature
            ) * 0.85 +
            heat_offset
        )

    else:

        # In warm climates, solar and
        # occupant heat can increase
        # indoor thermal load.

        extra_heat = (
            solar_gain +
            internal_heat
        )

        heat_effect = min(
            3,
            (
                extra_heat /
                max(heat_loss, 1)
            ) * 3
        )

        indoor_temperature = (
            indoor_target_temperature +
            heat_effect
        )


    # --------------------------------
    # 14. LIMIT INDOOR TEMPERATURE
    # --------------------------------

    indoor_temperature = max(
        0,
        min(
            40,
            indoor_temperature
        )
    )


    # --------------------------------
    # 15. THERMAL COMFORT
    # --------------------------------

    temperature_deviation = abs(
        indoor_target_temperature -
        indoor_temperature
    )

    comfort = max(
        0,
        100 -
        temperature_deviation * 10
    )


    # --------------------------------
    # 16. RETURN RESULTS
    # --------------------------------

    return {

        "outdoor_temperature":
            outdoor_temperature,

        "indoor_temperature":
            indoor_temperature,

        "heat_loss":
            heat_loss,

        "solar_gain":
            solar_gain,

        "internal_heat":
            internal_heat,

        "energy_required":
            energy_required,

        "comfort":
            comfort,

        "thermal_resistance":
            total_resistance,

        "floor_area":
            floor_area,

        "roof_area":
            roof_area,

        "wall_area":
            wall_area,

        "window_surface_area":
            window_surface_area,

        "occupants":
            occupants
    }