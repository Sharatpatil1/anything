# Passive Shelter Thermal Model Version 2

This folder contains a beginner-friendly Version 2, 24-hour thermal model for the passive shelter project. It uses Python, pandas, and matplotlib only. The model does not use ML, ANSYS, optimization, APIs, or CAD processing.

## Model inputs

- Shelter length: 6 m
- Shelter width: 4 m
- Shelter height: 3 m
- Wall, roof, and floor thickness: 0.2 m
- Initial indoor temperature: 20 °C
- Time step: 3600 seconds (one hour)
- Shelter orientation: 0 degrees in the default configuration

The model calculates wall, roof, floor, window, and door areas. Opaque walls and the roof use a thermal resistance network:

`R_total = 1/(h_inside*A) + L/(k*A) + 1/(h_outside*A)`

`Q = (Tin - Tout) / R_total`

Outside convection uses the documented simple wind correlation `h_outside = 5.7 + 3.8 * wind_speed`, with wind speed in m/s and h in W/(m² K). The outside surface temperature is found from the simplified surface balance:

`q_conduction + q_solar = q_convection + q_radiation`

This balance is solved by bisection. Radiation is therefore an external surface-transfer mechanism and is not added again as an independent indoor heat gain. Positive conduction, convection, and radiation values mean heat flows outward from the indoor thermal mass. Solar gain is positive inward.

Solar gain is calculated as:

`Qsolar = irradiance * exposed area * absorptivity`

Solar gain is a simplified lumped surface assumption. The roof and one orientation-weighted wall receive the supplied irradiance; no hourly sun-position model is used. Absorbed solar energy changes the external surface balance and reaches the indoor model through that balance, so it is not added a second time. Real shelters have solar storage, shading, glazing transmission, and time delays.

Long-wave radiation uses Kelvin temperatures:

`Qrad = emissivity * sigma * A * (Tsurface_K^4 - Tsurrounding_K^4)`

The floor is treated separately using the supplied `ground_temperature` and a simplified ground-side resistance. It does not use outdoor air temperature as its boundary and does not receive the wall/roof solar input.

The end-of-hour indoor temperature is updated using:

`C = mass * Cp`

`Delta T = Qnet * dt / C`

The temperature in each output row is the **end of that timestep**. The previous row's end temperature is the next timestep's starting temperature; the first timestep starts at 20 °C.

Thermal capacity includes wall mass plus configurable roof and floor masses. This is a lumped thermal-capacitance model: indoor air and represented building mass are treated as one uniform-temperature node. Internal temperature gradients inside walls, roof, and floor are not explicitly resolved. This is appropriate for a fast preliminary design model, but is less detailed than a finite-element transient thermal simulation. ANSYS can later validate selected designs with higher-fidelity spatial temperature and heat-flux results.

Optional window and door areas default to zero and use separate U-values. Ventilation, occupants, internal equipment, thermal bridges, and shading are outside this simplified model.

## Materials

`materials.py` contains properties for Concrete, Stone, Adobe, and Insulated Composite:

- Thermal conductivity `k` in W/(m K)
- Density in kg/m³
- Specific heat `Cp` in J/(kg K)
- Solar absorptivity
- Long-wave emissivity

## Units and validation

- Temperature: °C, converted to Kelvin only for radiation
- Thermal conductivity: W/(m K)
- Density: kg/m³
- Specific heat: J/(kg K)
- Area: m²
- Thickness: m
- Heat transfer power: W
- Accumulated energy: J and Wh
- Time step: seconds internally

The model validates material properties, geometry, opening areas, timestep, climate columns, numeric temperatures, non-negative irradiance and wind speed, and temperatures above absolute zero. A climate file must include `hour`, `ambient_temperature`, `ground_temperature`, and `solar_irradiance`.

## Climate data

`climate.csv` contains 24 hours of **SAMPLE DATA**. Replace these values later with actual Ladakh climate data while keeping the columns:

- `hour`
- `ambient_temperature`
- `ground_temperature`
- `solar_irradiance`

## Run

Install dependencies:

```text
pip install -r requirements.txt
```

Run the simulation from this folder:

```text
python main.py
```

The program prints hourly ambient and end-of-hour indoor temperatures, solar irradiance, separate conduction, convection, radiation, opening, solar, and net heat-transfer powers, plus energy columns in J and Wh. It also prints a comparison for all four materials, including hours between the configurable 18 °C and 27 °C comfort limits. The results file contains per-timestep and cumulative energy columns.

The program creates `results.csv` and three graph files in this folder:

- `temperature_comparison.png`
- `heat_loss_vs_solar_gain.png`
- `material_comparison.png`

The model is a simplified preliminary design-screening tool and is not experimentally validated.
