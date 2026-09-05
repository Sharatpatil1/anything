from simulation import simulate_shelter
from materials import materials
from climate import climate_data


def optimize(shelter_length, shelter_width, occupants,season):

    locations = [
        "Ladakh",
        "Bangalore",
        "Delhi"
    ]

    # --------------------------------
    # WALL MATERIAL OPTIONS
    # --------------------------------

    wall_materials = [
        "Stone",
        "Concrete",
        "Brick"
    ]

    # --------------------------------
    # INSULATION MATERIAL OPTIONS
    # --------------------------------

    insulation_materials = [
        "Composite"
    ]

    # --------------------------------
    # WALL THICKNESS OPTIONS
    # --------------------------------

    thicknesses = [
        0.20,
        0.25,
        0.30,
        0.35
    ]

    # --------------------------------
    # SHELTER ORIENTATIONS
    # --------------------------------

    orientations = [
        "North",
        "South",
        "East",
        "West"
    ]

    # --------------------------------
    # WINDOW AREA OPTIONS
    # --------------------------------

    window_areas = [
        0.05,
        0.08,
        0.10,
        0.15
    ]

    results = []

    # --------------------------------
    # TRY EVERY LOCATION
    # --------------------------------

    for location in locations:

        for wall_material in wall_materials:

            for insulation_material in insulation_materials:

                for thickness in thicknesses:

                    for orientation in orientations:

                        for window_area in window_areas:

                            # --------------------------------
                            # RUN SIMULATION
                            # --------------------------------

                            result = simulate_shelter(
                                wall_material,
                                insulation_material,
                                thickness,
                                orientation,
                                window_area,
                                location,
                                shelter_length,
                                shelter_width,
                                occupants,
                                season
                            )

                            # --------------------------------
                            # MATERIAL COST
                            # --------------------------------

                            wall_cost = (
                                materials[wall_material]["cost"]
                                * thickness
                            )

                            insulation_cost = (
                                materials[insulation_material]["cost"]
                                * thickness
                            )

                            material_cost = (
                                wall_cost +
                                insulation_cost
                            )

                            # --------------------------------
                            # ENERGY SCORE
                            # --------------------------------

                            energy_score = max(
                                0,
                                100 - result["energy_required"]
                            )

                            # --------------------------------
                            # COST SCORE
                            # --------------------------------

                            cost_score = max(
                                0,
                                100 - material_cost / 20
                            )

                            # --------------------------------
                            # OVERALL SCORE
                            # --------------------------------

                            score = (
                                result["comfort"] * 0.5
                                + energy_score * 0.3
                                + cost_score * 0.2
                            )

                            # --------------------------------
                            # STORE DESIGN
                            # --------------------------------

                            design = {

                                "location":
                                    location,
                                    
                                "season":
                                    season,

                                "wall_material":
                                    wall_material,

                                "insulation_material":
                                    insulation_material,

                                "thickness":
                                    thickness,

                                "orientation":
                                    orientation,

                                "window_area":
                                    window_area,

                                "shelter_length":
                                    shelter_length,

                                "shelter_width":
                                    shelter_width,

                                "occupants":
                                    occupants,

                                "outdoor_temperature":
                                    result["outdoor_temperature"],

                                "indoor_temperature":
                                    result["indoor_temperature"],

                                "heat_loss":
                                    result["heat_loss"],

                                "solar_gain":
                                    result["solar_gain"],

                                "internal_heat":
                                    result["internal_heat"],

                                "energy_required":
                                    result["energy_required"],

                                "comfort":
                                    result["comfort"],

                                "thermal_resistance":
                                    result["thermal_resistance"],

                                "floor_area":
                                    result["floor_area"],

                                "roof_area":
                                    result["roof_area"],

                                "wall_area":
                                    result["wall_area"],

                                "material_cost":
                                    material_cost,

                                "energy_score":
                                    energy_score,

                                "cost_score":
                                    cost_score,

                                "score":
                                    score
                            }

                            results.append(design)

    # --------------------------------
    # SORT BEST DESIGN FIRST
    # --------------------------------

    results.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return results