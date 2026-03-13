from __future__ import annotations

import json
from pathlib import Path

from .models import ScenarioConfig


SCENARIO_DIR = Path(__file__).resolve().parent / "scenarios"


def list_scenarios() -> list[str]:
    return sorted(path.stem for path in SCENARIO_DIR.glob("*.json"))


def load_scenario(name: str) -> ScenarioConfig:
    path = SCENARIO_DIR / f"{name}.json"
    if not path.exists():
        raise FileNotFoundError(f"Unknown scenario '{name}'. Available: {', '.join(list_scenarios())}")

    data = json.loads(path.read_text())
    return ScenarioConfig(**data)

