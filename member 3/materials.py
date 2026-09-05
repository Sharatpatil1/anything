"""Material properties used by the shelter thermal model."""

MATERIALS = {
    "Concrete": {
        "k": 1.7,
        "density": 2400,
        "Cp": 880,
        "solar_absorptivity": 0.65,
        "emissivity": 0.90,
    },
    "Stone": {
        "k": 2.0,
        "density": 2600,
        "Cp": 790,
        "solar_absorptivity": 0.75,
        "emissivity": 0.90,
    },
    "Adobe": {
        "k": 0.6,
        "density": 1700,
        "Cp": 840,
        "solar_absorptivity": 0.60,
        "emissivity": 0.90,
    },
    "Insulated Composite": {
        "k": 0.08,
        "density": 350,
        "Cp": 1200,
        "solar_absorptivity": 0.35,
        "emissivity": 0.85,
    },
}


def get_material(material_name):
    """Return the properties for a named material."""
    if material_name not in MATERIALS:
        available = ", ".join(MATERIALS)
        raise ValueError(f"Unknown material '{material_name}'. Choose from: {available}")
    return MATERIALS[material_name]
