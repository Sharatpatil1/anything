"""Run the 24-hour passive shelter thermal model."""

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

from thermal import (
    COMFORT_MAX,
    COMFORT_MIN,
    SHELTER,
    calculate_areas,
    compare_materials,
    simulate,
    summarize_simulation,
)


BASE_DIR = Path(__file__).resolve().parent
CLIMATE_FILE = BASE_DIR / "climate.csv"
RESULTS_FILE = BASE_DIR / "results.csv"


def load_climate():
    """Load sample climate data; ground_temperature is required by Version 2."""
    return pd.read_csv(CLIMATE_FILE, comment="#")


def create_graphs(results, material_name, material_results):
    """Create and save the three requested charts."""
    hours = results["hour"]

    plt.figure(figsize=(10, 5))
    plt.plot(hours, results["ambient_temperature_C"], marker="o", label="Ambient")
    plt.plot(hours, results["indoor_temperature"], marker="o", label="Indoor")
    plt.xlabel("Hour")
    plt.ylabel("End-of-hour temperature (°C)")
    plt.title(f"Ambient vs End-of-hour Indoor Temperature ({material_name})")
    plt.grid(True, alpha=0.3)
    plt.legend()
    plt.tight_layout()
    plt.savefig(BASE_DIR / "temperature_comparison.png", dpi=150)
    plt.close()

    plt.figure(figsize=(10, 5))
    plt.plot(hours, results["total_heat_loss_W"], marker="o", label="Total heat loss")
    plt.plot(hours, results["solar_gain_W"], marker="o", label="Solar gain")
    plt.xlabel("Hour")
    plt.ylabel("Heat flow (W)")
    plt.title(f"Heat Loss vs Solar Gain ({material_name})")
    plt.grid(True, alpha=0.3)
    plt.legend()
    plt.tight_layout()
    plt.savefig(BASE_DIR / "heat_loss_vs_solar_gain.png", dpi=150)
    plt.close()

    plt.figure(figsize=(10, 5))
    for name, material_result in material_results.items():
        plt.plot(
            material_result["hour"],
            material_result["indoor_temperature"],
            marker="o",
            label=name,
        )
    plt.axhspan(COMFORT_MIN, COMFORT_MAX, color="green", alpha=0.08, label="Comfort range")
    plt.xlabel("Hour")
    plt.ylabel("Indoor temperature (°C)")
    plt.title("Indoor Temperature for Different Materials")
    plt.grid(True, alpha=0.3)
    plt.legend()
    plt.tight_layout()
    plt.savefig(BASE_DIR / "material_comparison.png", dpi=150)
    plt.close()


def main():
    material_name = "Concrete"
    climate = load_climate()
    results = simulate(material_name, climate, SHELTER)
    material_results = {
        name: simulate(name, climate, SHELTER)
        for name in ("Concrete", "Stone", "Adobe", "Insulated Composite")
    }
    areas = calculate_areas(SHELTER)
    results.to_csv(RESULTS_FILE, index=False)

    print("Shelter areas (m²):")
    print(f"  Walls: {areas['wall_area']:.2f}")
    print(f"  Roof: {areas['roof_area']:.2f}")
    print(f"  Floor: {areas['floor_area']:.2f}")
    print(f"\nHourly results for {material_name}:")
    print(results.to_string(index=False, float_format=lambda value: f"{value:.2f}"))

    print("\nSimulation summary:")
    print(
        pd.Series(summarize_simulation(results)).to_string(
            float_format=lambda value: f"{value:.2f}"
        )
    )

    print("\nMaterial comparison:")
    comparison = compare_materials(climate, SHELTER, COMFORT_MIN, COMFORT_MAX)
    print(comparison.to_string(index=False, float_format=lambda value: f"{value:.2f}"))

    create_graphs(results, material_name, material_results)
    print("\nSaved results.csv and three graph files.")


if __name__ == "__main__":
    main()
