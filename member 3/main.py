"""Run the 24-hour passive shelter thermal model."""

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

from thermal import SHELTER, calculate_areas, compare_materials, simulate, summarize_simulation


BASE_DIR = Path(__file__).resolve().parent
CLIMATE_FILE = BASE_DIR / "climate.csv"


def load_climate():
    """Load the sample climate data from the module folder."""
    return pd.read_csv(CLIMATE_FILE, comment="#")


def create_graphs(results, material_name):
    """Create and save the two requested charts."""
    hours = results["hour"]

    plt.figure(figsize=(10, 5))
    plt.plot(hours, results["ambient_temperature"], marker="o", label="Ambient")
    plt.plot(hours, results["indoor_temperature"], marker="o", label="Indoor")
    plt.xlabel("Hour")
    plt.ylabel("Temperature (°C)")
    plt.title(f"Ambient vs Indoor Temperature ({material_name})")
    plt.grid(True, alpha=0.3)
    plt.legend()
    plt.tight_layout()
    plt.savefig(BASE_DIR / "temperature_comparison.png", dpi=150)
    plt.close()

    plt.figure(figsize=(10, 5))
    plt.plot(hours, results["total_heat_loss"], marker="o", label="Total heat loss")
    plt.plot(hours, results["solar_gain"], marker="o", label="Solar gain")
    plt.xlabel("Hour")
    plt.ylabel("Heat flow (W)")
    plt.title(f"Heat Loss vs Solar Gain ({material_name})")
    plt.grid(True, alpha=0.3)
    plt.legend()
    plt.tight_layout()
    plt.savefig(BASE_DIR / "heat_loss_vs_solar_gain.png", dpi=150)
    plt.close()


def main():
    material_name = "Concrete"
    climate = load_climate()
    results = simulate(material_name, climate, SHELTER)
    areas = calculate_areas(SHELTER)

    print("Shelter areas (m²):")
    print(f"  Walls: {areas['wall_area']:.2f}")
    print(f"  Roof: {areas['roof_area']:.2f}")
    print(f"  Floor: {areas['floor_area']:.2f}")
    print(f"\nHourly results for {material_name}:")
    print(results.to_string(index=False, float_format=lambda value: f"{value:.2f}"))

    print("\nSimulation summary:")
    print(pd.Series(summarize_simulation(results)).to_string(float_format=lambda value: f"{value:.2f}"))

    print("\nMaterial comparison:")
    comparison = compare_materials(climate, SHELTER)
    print(comparison.to_string(index=False, float_format=lambda value: f"{value:.2f}"))

    create_graphs(results, material_name)
    print("\nGraphs saved as temperature_comparison.png and heat_loss_vs_solar_gain.png")


if __name__ == "__main__":
    main()
