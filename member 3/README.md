# Passive Shelter Thermal Model

This folder contains a beginner-friendly 24-hour thermal model for the passive shelter project. It uses Python, pandas, and matplotlib only. The model is a simplified calculation and does not use ML or ANSYS.

## Model inputs

- Shelter length: 6 m
- Shelter width: 4 m
- Shelter height: 3 m
- Wall, roof, and floor thickness: 0.2 m
- Initial indoor temperature: 20 °C
- Time step: 3600 seconds (one hour)

The model calculates wall, roof, and floor areas. It applies the conduction equation:

`Q = k * A * (Tin - Tout) / L`

Solar gain is calculated as:

`Qsolar = irradiance * exposed area * absorptivity`

The indoor temperature is updated using:

`C = mass * Cp`

`Delta T = Qnet * dt / C`

The envelope volume is used to estimate mass. The roof area is used as the exposed solar area. This is intentionally a simple first model; ventilation, windows, occupants, internal equipment, thermal bridges, and long-wave radiation are not included.

## Materials

`materials.py` contains properties for Concrete, Stone, Adobe, and Insulated Composite:

- Thermal conductivity `k` in W/(m K)
- Density in kg/m³
- Specific heat `Cp` in J/(kg K)
- Solar absorptivity

## Climate data

`climate.csv` contains 24 hours of **SAMPLE DATA**. Replace these values later with actual Ladakh climate data while keeping the columns:

- `hour`
- `ambient_temperature`
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

The program prints hourly ambient and indoor temperatures, solar irradiance, heat losses, solar gain, and net heat. It also prints a comparison for all four materials.

Two graph files are created in this folder:

- `temperature_comparison.png`
- `heat_loss_vs_solar_gain.png`
