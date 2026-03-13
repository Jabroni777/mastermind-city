from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


ALIGNMENT_COOPERATOR = "cooperator"
ALIGNMENT_SABOTEUR = "saboteur"

MODEL_BASELINE = "baseline_majority"
MODEL_SOCIocratic = "sociocratic_circles"
MODEL_HYBRID = "hybrid_integrity"

INTEGRITY_PROVISIONAL = "provisional"
INTEGRITY_TRUSTED = "trusted"
INTEGRITY_AUDITED = "audited"
INTEGRITY_RESTRICTED = "restricted"


@dataclass
class Agent:
    id: int
    name: str
    circle_id: int
    alignment: str
    archetype: str
    compliance_tendency: float
    conformity_bias: float
    objection_threshold: float
    truth_seeking_bias: float
    repair_orientation: float
    deception_skill: float
    integrity_band: str = INTEGRITY_PROVISIONAL
    influence: float = 1.0
    process_compliance: float = 0.5
    epistemic_score: float = 0.5
    cooperation_score: float = 0.5
    adversarial_pattern_score: float = 0.0
    sanctioned_rounds: int = 0
    participation_count: int = 0
    accusations_made: int = 0
    accurate_accusations: int = 0
    false_accusations: int = 0
    received_votes: int = 0
    suspicion: dict[int, float] = field(default_factory=dict)

    @property
    def active(self) -> bool:
        return self.sanctioned_rounds <= 0

    @property
    def is_saboteur(self) -> bool:
        return self.alignment == ALIGNMENT_SABOTEUR


@dataclass
class Event:
    round_index: int
    phase: str
    actor_id: int | None
    action_type: str
    target_id: int | None = None
    circle_id: int | None = None
    details: dict[str, Any] = field(default_factory=dict)


@dataclass
class ScenarioConfig:
    name: str
    description: str
    model: str
    rounds: int
    num_agents: int
    num_circles: int
    infiltrators: int
    seed: int
    accusation_threshold: float
    quorum_threshold: float
    legitimacy_start: float
    legitimacy_floor: float
    sabotage_damage: float
    false_sanction_damage: float
    true_sanction_reward: float
    participation_noise: float
    scenario_tags: list[str] = field(default_factory=list)


@dataclass
class SimulationResult:
    config: ScenarioConfig
    run_index: int
    seed: int
    rounds_completed: int
    winner: str
    legitimacy: float
    participation_rate: float
    true_sanctions: int
    false_sanctions: int
    successful_appeals: int
    sabotage_events: int
    blocked_sabotage_events: int
    concentration_index: float
    event_log: list[Event] = field(default_factory=list)
    agents: list[Agent] = field(default_factory=list)

