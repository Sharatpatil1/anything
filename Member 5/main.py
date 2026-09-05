from optimizer import optimize


# --------------------------------
# SHELTER OPTIMIZATION
# --------------------------------

print("\n========================================")
print("        SHELTER OPTIMIZATION")
print("========================================")


# --------------------------------
# SELECT LOCATION
# --------------------------------

print("\nSelect a location:")
print("1. Ladakh")
print("2. Bangalore")
print("3. Delhi")

choice = input("\nEnter your choice (1-3): ")


if choice == "1":
    selected_location = "Ladakh"

elif choice == "2":
    selected_location = "Bangalore"

elif choice == "3":
    selected_location = "Delhi"

else:
    print("\nInvalid choice!")
    print("Please run the program again.")
    exit()

# --------------------------------
# SELECT SEASON
# --------------------------------

print("\nSelect a season:")
print("1. Winter")
print("2. Summer")
print("3. Monsoon")

season_choice = input("\nEnter your choice (1-3): ")

if season_choice == "1":
    selected_season = "Winter"

elif season_choice == "2":
    selected_season = "Summer"

elif season_choice == "3":
    selected_season = "Monsoon"

else:
    print("\nInvalid season choice!")
    print("Please run the program again.")
    exit()


# --------------------------------
# SHELTER DIMENSIONS
# --------------------------------

shelter_length = float(
    input("\nEnter shelter length (m): ")
)

shelter_width = float(
    input("Enter shelter width (m): ")
)


# --------------------------------
# VALIDATE DIMENSIONS
# --------------------------------

if shelter_length <= 0 or shelter_width <= 0:

    print("\nInvalid shelter dimensions!")
    print("Length and width must be greater than 0.")

    exit()


# --------------------------------
# NUMBER OF OCCUPANTS
# --------------------------------

occupants = int(
    input("\nEnter number of occupants: ")
)


# --------------------------------
# VALIDATE OCCUPANTS
# --------------------------------

if occupants < 0:

    print("\nInvalid number of occupants!")
    print("Number of occupants cannot be negative.")

    exit()


# --------------------------------
# RUN OPTIMIZER
# --------------------------------

print(
    "\nOptimizing shelter for",
    selected_location,
    "..."
)

results = optimize(
    shelter_length,
    shelter_width,
    occupants,
    selected_season
)


# --------------------------------
# GET SELECTED LOCATION RESULTS
# --------------------------------

location_results = [
    design
    for design in results
    if design["location"] == selected_location
]


# Get best design

best_design = location_results[0]

# --------------------------------
# TOP 3 DESIGN COMPARISON
# --------------------------------

top_designs = location_results[:3]

print("\n========================================")
print("        TOP 3 DESIGN OPTIONS")
print("========================================")

for i, design in enumerate(top_designs, start=1):

    print("\nDesign", i)
    print("----------------------------------------")

    print("Material       :", design["wall_material"])
    print("Insulation     :", design["insulation_material"])
    print("Thickness      :", design["thickness"], "m")
    print("Orientation    :", design["orientation"])
    print("Window Area    :", design["window_area"] * 100, "%")
    print("Indoor Temp    :", round(design["indoor_temperature"], 2), "°C")
    print("Heat Loss      :", round(design["heat_loss"], 2), "W")
    print("Energy         :", round(design["energy_required"], 2), "kWh/day")
    print("Comfort        :", round(design["comfort"], 2), "%")
    print("Score          :", round(design["score"], 2))


# --------------------------------
# CALCULATE SHELTER AREA
# --------------------------------

shelter_area = (
    shelter_length *
    shelter_width
)


# --------------------------------
# DISPLAY PROFESSIONAL REPORT
# --------------------------------

print("\n========================================")
print("       OPTIMIZED SHELTER REPORT")
print("========================================")

print(
    "\nLocation             :",
    selected_location
)

print(
    "Season               :",
    selected_season
)

print(
    "Shelter Length       :",
    shelter_length,
    "m"
)

print(
    "Shelter Width        :",
    shelter_width,
    "m"
)

print(
    "Shelter Area         :",
    round(shelter_area, 2),
    "m²"
)

print(
    "Occupants            :",
    occupants
)

print(
    "Recommended Material :",
    best_design["wall_material"]
)

print(
    "Insulation           :",
    best_design["insulation_material"]
)

print(
    "Wall Thickness       :",
    best_design["thickness"],
    "m"
)

print(
    "Orientation          :",
    best_design["orientation"]
)

print(
    "Window Area          :",
    best_design["window_area"] * 100,
    "%"
)


# --------------------------------
# THERMAL PERFORMANCE
# --------------------------------

print("\n----------------------------------------")
print("        THERMAL PERFORMANCE")
print("----------------------------------------")

print(
    "Indoor Temperature   :",
    round(
        best_design["indoor_temperature"],
        2
    ),
    "°C"
)

print(
    "Outdoor Temperature  :",
    best_design["outdoor_temperature"],
    "°C"
)

print(
    "Heat Loss            :",
    round(
        best_design["heat_loss"],
        2
    ),
    "W"
)

print(
    "Internal Heat           :",
    round(
        best_design["internal_heat"],
        2
    ),
    "W"
)

print(
    "Daily Energy Required:",
    round(
        best_design["energy_required"],
        2
    ),
    "kWh/day"
)

print(
    "Thermal Comfort      :",
    round(
        best_design["comfort"],
        2
    ),
    "%"
)


# --------------------------------
# COST AND SCORE
# --------------------------------

print("\n----------------------------------------")
print("        COST & OPTIMIZATION")
print("----------------------------------------")

print(
    "Material Cost        :",
    round(
        best_design["material_cost"],
        2
    )
)

print(
    "Thermal Resistance   :",
    round(
        best_design["thermal_resistance"],
        4
    )
)

print(
    "Overall Score        :",
    round(
        best_design["score"],
        2
    ),
    "/ 100"
)

# --------------------------------
# FINAL RECOMMENDATION
# --------------------------------

print("\n========================================")
print("        FINAL RECOMMENDATION")
print("========================================")

print(
    "\nFor",
    selected_location,
    "during",
    selected_season,
    "the recommended shelter design is:"
)

print(
    "\n✓ Wall Material      :",
    best_design["wall_material"]
)

print(
    "✓ Insulation         :",
    best_design["insulation_material"]
)

print(
    "✓ Wall Thickness     :",
    best_design["thickness"],
    "m"
)

print(
    "✓ Orientation        :",
    best_design["orientation"]
)

print(
    "✓ Window Area        :",
    best_design["window_area"] * 100,
    "%"
)

print(
    "\nThe design provides approximately",
    round(best_design["comfort"], 2),
    "% thermal comfort"
)

print(
    "with an estimated energy requirement of",
    round(best_design["energy_required"], 2),
    "kWh/day."
)

# --------------------------------
# COMPLETION MESSAGE
# --------------------------------

print("\n========================================")
print("      OPTIMIZATION COMPLETE")
print("========================================")