# Mastermind City Integrity DAO Simulation Spec

## Purpose

This simulation is intended to test whether a sociocratic, federation-style governance system can preserve cooperation under adversarial conditions without collapsing into either capture or over-enforcement.

The simulation should not begin as a treasury or token game. It should begin as an integrity and coordination game.

Core question:

Can a federated sociocratic DAO detect sabotage, contain manipulation, preserve legitimacy, and recover from mistakes while respecting node autonomy?

## Design Premise

Use Mafia/Werewolf as the stress-test substrate, but reinterpret it as governance rather than party play.

- Hidden bad-faith actors represent infiltration, sabotage, or coordinated manipulation.
- Villager-style actors represent good-faith but imperfect participants.
- The DAO is not a ruler. It is a regulatory layer.
- Local circles retain sovereignty over local decisions.
- The federation governs only shared protocols, disputes, node admission, rule amendments, and integrity review.

This aligns with the federation whitepaper's boundaries:

- sovereignty of nodes
- governance of the commons only
- anti-capture constraints
- decaying influence rather than permanent status
- unconditional exit rights

## Simulation Goal

Compare governance models under repeated stress and measure which designs best balance:

- cooperation
- truth-finding
- legitimacy
- anti-capture resilience
- recovery after false positives
- tolerance for autonomy

The target is not perfect detection. The target is institutional viability.

## Core Models To Compare

Build the simulation so governance models can be swapped.

### Model A: Baseline Majority

- One agent, one vote
- No integrity layer
- No sociocratic structure
- No rotating privileges

Purpose:

Establish the failure baseline.

### Model B: Sociocratic Circles Only

- Agents grouped into local circles
- Consent-based decisions inside circles
- Elected roles by consent
- Escalation only for shared issues

Purpose:

Measure what sociocracy alone improves before adding DAO feedback.

### Model C: Reputation-Weighted Governance

- Same as Model B plus integrity state
- Governance permissions depend on recent process behavior
- No tokenization

Purpose:

Test whether procedural trust improves outcomes.

### Model D: Hybrid Cybernetic Federation

- Sociocratic circles
- Federation review layer
- Decaying trust bands
- Rotating audit roles
- Appeals and restorative recovery
- Anti-capture triggers

Purpose:

This is the intended target model.

## MVP Scope

Start with a minimal but meaningful simulation.

### Size

- 12 to 20 agents
- 3 local circles
- 1 federation layer
- 1 to 3 hidden bad-faith actors

### Run Structure

Each run lasts 10 to 20 rounds unless a termination condition is reached.

Termination conditions:

- saboteurs capture governance
- cooperators successfully isolate saboteurs
- legitimacy collapses below threshold
- quorum failure persists for N rounds

### No Early Blockchain

The first implementation should use off-chain state only.

Use a pure reputation / governance-state model first. This matches the whitepaper's practical pilot logic and keeps the simulation focused on institutional behavior rather than contracts.

## Agent Model

Each agent should have hidden state, public state, and behavioral tendencies.

### Hidden State

- `alignment`: cooperator, saboteur, manipulator, opportunist
- `deception_skill`
- `risk_tolerance`
- `private_beliefs`: confidence map about other agents
- `memory`: recent events and accusations

### Public State

- `circle_id`
- `role`: member, facilitator, delegate, auditor, mediator
- `integrity_band`: provisional, trusted, audited, restricted, suspended
- `participation_score`
- `epistemic_score`
- `cooperation_score`
- `appeal_history`

### Temperament Axes

- `compliance_tendency`
- `conformity_bias`
- `objection_threshold`
- `coalition_loyalty`
- `truth_seeking_bias`
- `repair_orientation`

### Suggested Agent Archetypes

- `Cooperator`
- `TruthSeeker`
- `Conformist`
- `Opportunist`
- `Manipulator`
- `Saboteur`
- `Whistleblower`
- `Reconciler`
- `Bureaucrat`

These archetypes should shape policy, not hard-code outcomes.

## Governance Topology

The simulation should enforce two levels of governance.

### Level 1: Circle Governance

Each circle handles local operational decisions.

Circle mechanics:

- deliberation round
- proposal creation
- objection / reason-giving
- consent check
- role assignment by consent
- local retrospective

Circle authority:

- local coordination
- role assignment
- local norm enforcement
- local repair processes

Circle limits:

- cannot override federation protocol
- cannot directly punish outside their domain

### Level 2: Federation Governance

The federation only handles shared matters.

Federation authority:

- admission of new circles or nodes
- shared protocol amendments
- inter-circle disputes
- sanctions affecting federation permissions
- integrity review of repeated protocol violations
- appeals of major restrictions

Federation constraints:

- quorum required
- constitutional changes need supermajority
- concentration cap on influence
- exit rights always available

## Round Loop

Each simulation round should follow a consistent pipeline.

### Phase 1: Local Deliberation

Agents within each circle:

- share observations
- make accusations or defenses
- propose actions
- raise objections

Generated outputs:

- speech acts
- support / objection graph
- confidence statements
- proposed local actions

### Phase 2: Local Decision

Circle decides through consent or fallback vote depending on the rule set.

Possible decisions:

- assign facilitator
- flag suspicious member
- request federation review
- allocate local responsibilities
- issue local caution

### Phase 3: Federation Review

Triggered only when:

- cross-circle conflict appears
- sanctions exceed circle authority
- suspicious coalition patterns emerge
- repeated objections block operations
- appeal is filed

### Phase 4: Governance Update

Integrity engine updates:

- trust bands
- audit risk
- role eligibility
- speaking priority
- sanction timers
- restoration eligibility

### Phase 5: Outcome Resolution

Resolve:

- sabotage success or failure
- misinformation spread
- false accusation cost
- repair actions
- legitimacy impact

### Phase 6: Retrospective

Record whether governance made the system more or less stable.

## Integrity Engine

The integrity engine is the central cybernetic module.

It should not score morality. It should score legible, accountable participation.

### Dimensions To Track

- `process_compliance`
- `cooperative_contribution`
- `epistemic_reliability`
- `consistency_over_time`
- `reciprocity`
- `adversarial_pattern_score`
- `capture_risk_exposure`
- `repair_behavior`

### Example Signals

- attends or misses deliberation
- provides reasons for objections
- makes accusations without evidence
- contradicts previous claims opportunistically
- repeatedly aligns with a suspicious bloc
- changes position after new evidence
- responds constructively to challenge
- appeals sanctions through process instead of evasion

### Core Rule

Reward actions that make the system more knowable.

Do not reward popularity or raw correctness alone.

## Intervention System

The DAO should respond proportionally, not absolutely.

### Soft Interventions

- request stronger justification next round
- require corroboration for a claim
- trigger peer review
- lower proposal priority
- assign a mediator

### Medium Interventions

- temporary loss of audit eligibility
- temporary loss of nomination rights
- mandatory review before sanctions can be proposed
- federation observation flag

### Hard Interventions

- suspension from federation decisions
- governance weight reduced to zero temporarily
- exclusion from special roles
- forced appeal pathway before restoration

Every hard intervention should have:

- explicit reason
- duration
- review condition
- appeal route
- restoration path

## Anti-Capture Mechanisms

These are mandatory. Without them the model will drift toward oligarchy or clique control.

- no agent or circle may dominate the governance layer indefinitely
- privileges rotate
- trust decays
- review roles are time-bounded
- minority reports are preserved
- appeals use separate reviewers
- observation, adjudication, and sanction are separated where possible
- mutual-defense clusters increase audit probability

## Metrics

Success metrics must measure governance quality, not just team victory.

### Stability Metrics

- cooperation rate
- quorum success rate
- round completion rate
- legitimacy score

### Detection Metrics

- time to detect saboteurs
- false negative rate
- true positive rate
- coalition capture rate

### Justice Metrics

- false accusation rate
- false sanction rate
- appeal success rate
- recovery rate after mistaken punishment

### Anti-Capture Metrics

- power concentration index
- repeated-role concentration
- trust hoarding rate
- clique amplification score

### System Health Metrics

- participation quality
- norm compliance rate
- procedural delay cost
- rate of gaming the integrity system
- exit frequency

## Data Model

An initial implementation can use the following entities.

### `Agent`

- `id`
- `name`
- `alignment`
- `archetype`
- `circle_id`
- `role`
- `integrity_band`
- `traits`
- `beliefs`
- `memory`
- `status_effects`

### `Circle`

- `id`
- `members`
- `facilitator_id`
- `delegate_id`
- `local_legitimacy`
- `decision_log`
- `objection_log`

### `Federation`

- `circles`
- `protocol_rules`
- `constitutional_rules`
- `review_queue`
- `shared_legitimacy`
- `quorum_threshold`
- `supermajority_threshold`
- `influence_cap`

### `Event`

- `round`
- `phase`
- `actor_id`
- `action_type`
- `targets`
- `reason`
- `confidence`
- `outcome`

### `IntegrityState`

- `agent_id`
- `process_compliance`
- `epistemic_reliability`
- `cooperation_score`
- `adversarial_pattern_score`
- `recent_decay_factor`
- `current_permissions`

## AI / Decision Policies

Do not start with LLM agents. Start with explicit policies.

Use rule-based or weighted utility selection for the MVP.

Each agent policy can optimize a combination of:

- self-preservation
- faction success
- procedural compliance
- truth-seeking
- popularity
- sabotage opportunity

Later, if needed, add language-based agents only after the state model is stable.

## Implementation Stack

The fastest path is:

- `Python` for the simulation core
- `Pydantic` or `dataclasses` for state models
- `NetworkX` for coalition / graph analysis
- `NumPy` and `Pandas` for batch runs and metrics
- simple `FastAPI` or static JSON export for inspection later
- optional frontend later in the site

Suggested structure:

```text
mastermind-city/
  simulation/
    core/
      agents.py
      circles.py
      federation.py
      events.py
      engine.py
      metrics.py
    scenarios/
      baseline.yaml
      infiltration.yaml
      clique-capture.yaml
    notebooks/
    outputs/
```

## Build Phases

### Phase 1: Deterministic Core

Build:

- state models
- round loop
- simple rule-based agent policies
- baseline majority model
- CSV / JSON outputs

Deliverable:

Can run 100 to 1000 simulations and produce metrics.

### Phase 2: Sociocratic Layer

Add:

- circle consent process
- objection handling
- role election by consent
- double-link structure
- federation escalation rules

Deliverable:

Can compare majority vs sociocratic governance.

### Phase 3: Cybernetic Integrity Layer

Add:

- trust bands
- decaying permissions
- audit triggers
- appeals
- restorative recovery
- anti-capture rules

Deliverable:

Can compare sociocracy alone vs sociocracy plus integrity DAO.

### Phase 4: Scenario Library

Add stress cases:

- infiltrator
- clique capture
- false accusation spiral
- low participation
- overactive enforcement
- strategic compliance / Goodhart gaming

Deliverable:

Comparable scenario benchmarks.

### Phase 5: Visualization

Add a simple interface for:

- round playback
- trust graph
- circle state
- sanctions and appeals timeline
- legitimacy over time

## Recommended First Scenario Set

Start with these four.

### Scenario 1: Clean Cooperation

Mostly good-faith agents, low deception pressure.

Use:

Establish expected healthy behavior.

### Scenario 2: Single Infiltrator

One manipulative or saboteur agent inside one circle.

Use:

Test early detection and overreaction risk.

### Scenario 3: Coordinated Clique

Three agents mutually defend one another and distort process.

Use:

Test anti-capture and review triggers.

### Scenario 4: Autoimmune Failure

Governance rules are too aggressive and begin punishing sincere but noisy actors.

Use:

Test legitimacy collapse and restorative design.

## Design Risks To Test Explicitly

Do not leave these implicit.

- Goodhart behavior: agents perform integrity rather than embodying it
- reputation laundering through coalition support
- procedural paralysis due to too many objections
- charismatic capture via soft power
- false consensus from conformity
- audit role corruption
- long-term entrenchment of high-trust actors
- over-centralization at the federation layer

## Recommendation

For the first real build, implement:

- Model A
- Model B
- Model D

Skip tokenization entirely.

Use decaying, non-transferable governance state.

Keep the federation narrow in scope.

Preserve unconditional exit.

This gives you the cleanest test of whether sociocratic cybernetic governance actually outperforms simpler systems.

## Next Deliverable

The next useful step is an implementation-ready technical blueprint with:

- concrete class definitions
- round pseudocode
- scoring formulas
- scenario config format
- a first batch-run script
