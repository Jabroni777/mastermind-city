# Mastermind City Governance Lab

This folder contains the standalone governance laboratory for testing Mastermind City's reputation-governance architecture.

It is not intended to be part of the public website navigation. It uses the shared site theme, but it is an internal simulation and analysis tool.

## Purpose

The lab is for testing governance configurations before applying them to real node-level federation design.

Current model:

- individuals act as proxies for future nodes
- sociocratic and hybrid governance logic can be compared against a baseline majority model
- the focus is integrity governance, not token economics

## Entry Point

Open:

- [index.html](./index.html)

When serving the repo locally, the browser path is:

```text
/governance-lab/
```

## Current Capabilities

- single-run visual inspection
- Monte Carlo batch analysis
- baseline / sociocracy / hybrid model comparison
- 1D parameter sweeps
- 2D heatmap sweeps
- saved experiment configurations in browser storage
- JSON and CSV export

## Files

- [index.html](./index.html): standalone browser UI
- [lab.js](./lab.js): browser simulation engine and analysis logic

## Related Files In Parent Repo

- [../SIMULATION_SPEC.md](../SIMULATION_SPEC.md): design spec
- [../simulation](../simulation): Python simulation scaffold

## Separate Repository

Dedicated GitHub repository:

- [Jabroni777/-MastermindCity-governance-lab](https://github.com/Jabroni777/-MastermindCity-governance-lab)

The local folder here can be used as the source for extracting or syncing that standalone repo.
