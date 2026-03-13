# Mastermind City

This repository contains the public-facing Mastermind City site, whitepapers, and supporting simulation work.

## Main Areas

- Public site pages live at the project root.
- Governance simulation notes live in [SIMULATION_SPEC.md](./SIMULATION_SPEC.md).
- The Python simulation scaffold lives in [`simulation/`](./simulation/).
- The standalone browser governance lab lives in [`governance-lab/`](./governance-lab/).

## Governance Lab

The governance lab is intentionally separate from the public website.

- Local entrypoint: [governance-lab/index.html](./governance-lab/index.html)
- Local documentation: [governance-lab/README.md](./governance-lab/README.md)
- Dedicated GitHub repository: [Jabroni777/-MastermindCity-governance-lab](https://github.com/Jabroni777/-MastermindCity-governance-lab)

## Python Simulation

Run the batch simulation scaffold with:

```bash
cd /Users/ab/Documents/10_Active_Projects/coding_projects/mastermind-city
python3 -m simulation.run --list-scenarios
python3 -m simulation.run --scenario hybrid_infiltration --runs 20
```

Included scenarios:

- `baseline_majority`
- `sociocratic_circles`
- `hybrid_infiltration`
- `hybrid_autoimmune`
