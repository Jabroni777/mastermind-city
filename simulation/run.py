from __future__ import annotations

import argparse
import json

from .engine import run_simulation, summarize_results
from .scenario_loader import list_scenarios, load_scenario


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Run the Mastermind City integrity governance simulation.")
    parser.add_argument("--scenario", default="hybrid_infiltration", help="Scenario name from simulation/scenarios.")
    parser.add_argument("--runs", type=int, default=1, help="Number of repeated runs.")
    parser.add_argument("--show-events", type=int, default=0, help="Print the first N events from the first run.")
    parser.add_argument("--json", action="store_true", help="Emit JSON summary.")
    parser.add_argument("--list-scenarios", action="store_true", help="List available scenarios and exit.")
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    if args.list_scenarios:
        for scenario_name in list_scenarios():
            print(scenario_name)
        return

    config = load_scenario(args.scenario)
    results = [run_simulation(config, run_index=index) for index in range(args.runs)]
    summary = summarize_results(results)

    if args.json:
        print(json.dumps({"scenario": config.name, "model": config.model, "summary": summary}, indent=2))
    else:
        print(f"Scenario: {config.name}")
        print(f"Model: {config.model}")
        print(f"Description: {config.description}")
        for key, value in summary.items():
            print(f"{key}: {value}")

    if args.show_events:
        print("\nFirst run sample events:")
        for event in results[0].event_log[: args.show_events]:
            print(
                f"round={event.round_index} phase={event.phase} action={event.action_type} "
                f"actor={event.actor_id} target={event.target_id} details={event.details}"
            )


if __name__ == "__main__":
    main()
