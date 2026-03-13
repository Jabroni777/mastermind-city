from __future__ import annotations

import random
from collections import Counter, defaultdict

from .models import (
    ALIGNMENT_COOPERATOR,
    ALIGNMENT_SABOTEUR,
    INTEGRITY_AUDITED,
    INTEGRITY_PROVISIONAL,
    INTEGRITY_RESTRICTED,
    INTEGRITY_TRUSTED,
    MODEL_BASELINE,
    MODEL_HYBRID,
    MODEL_SOCIocratic,
    Agent,
    Event,
    ScenarioConfig,
    SimulationResult,
)


ARCHETYPE_LIBRARY = {
    "Cooperator": {
        "compliance_tendency": 0.84,
        "conformity_bias": 0.42,
        "objection_threshold": 0.58,
        "truth_seeking_bias": 0.72,
        "repair_orientation": 0.68,
        "deception_skill": 0.15,
    },
    "TruthSeeker": {
        "compliance_tendency": 0.74,
        "conformity_bias": 0.2,
        "objection_threshold": 0.43,
        "truth_seeking_bias": 0.9,
        "repair_orientation": 0.58,
        "deception_skill": 0.1,
    },
    "Conformist": {
        "compliance_tendency": 0.71,
        "conformity_bias": 0.8,
        "objection_threshold": 0.7,
        "truth_seeking_bias": 0.45,
        "repair_orientation": 0.44,
        "deception_skill": 0.1,
    },
    "Whistleblower": {
        "compliance_tendency": 0.76,
        "conformity_bias": 0.18,
        "objection_threshold": 0.35,
        "truth_seeking_bias": 0.82,
        "repair_orientation": 0.52,
        "deception_skill": 0.08,
    },
    "Reconciler": {
        "compliance_tendency": 0.79,
        "conformity_bias": 0.45,
        "objection_threshold": 0.56,
        "truth_seeking_bias": 0.57,
        "repair_orientation": 0.88,
        "deception_skill": 0.12,
    },
    "Bureaucrat": {
        "compliance_tendency": 0.9,
        "conformity_bias": 0.52,
        "objection_threshold": 0.62,
        "truth_seeking_bias": 0.46,
        "repair_orientation": 0.39,
        "deception_skill": 0.09,
    },
    "Opportunist": {
        "compliance_tendency": 0.53,
        "conformity_bias": 0.63,
        "objection_threshold": 0.59,
        "truth_seeking_bias": 0.32,
        "repair_orientation": 0.23,
        "deception_skill": 0.42,
    },
    "Manipulator": {
        "compliance_tendency": 0.49,
        "conformity_bias": 0.34,
        "objection_threshold": 0.51,
        "truth_seeking_bias": 0.21,
        "repair_orientation": 0.16,
        "deception_skill": 0.8,
    },
    "Saboteur": {
        "compliance_tendency": 0.44,
        "conformity_bias": 0.28,
        "objection_threshold": 0.5,
        "truth_seeking_bias": 0.18,
        "repair_orientation": 0.06,
        "deception_skill": 0.78,
    },
}


COOPERATOR_ARCHETYPES = [
    "Cooperator",
    "TruthSeeker",
    "Conformist",
    "Whistleblower",
    "Reconciler",
    "Bureaucrat",
    "Opportunist",
]

SABOTEUR_ARCHETYPES = ["Saboteur", "Manipulator"]


def _clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


def _weighted_choice(rng: random.Random, values: list[str]) -> str:
    return values[rng.randrange(len(values))]


def create_agents(config: ScenarioConfig, rng: random.Random) -> list[Agent]:
    names = [f"Agent-{index + 1:02d}" for index in range(config.num_agents)]
    infiltrator_ids = set(rng.sample(range(config.num_agents), config.infiltrators))
    agents: list[Agent] = []

    for index, name in enumerate(names):
        alignment = ALIGNMENT_SABOTEUR if index in infiltrator_ids else ALIGNMENT_COOPERATOR
        archetype_name = (
            _weighted_choice(rng, SABOTEUR_ARCHETYPES)
            if alignment == ALIGNMENT_SABOTEUR
            else _weighted_choice(rng, COOPERATOR_ARCHETYPES)
        )
        template = ARCHETYPE_LIBRARY[archetype_name]
        circle_id = index % config.num_circles
        jitter = lambda base: _clamp(base + rng.uniform(-0.08, 0.08))
        agent = Agent(
            id=index,
            name=name,
            circle_id=circle_id,
            alignment=alignment,
            archetype=archetype_name,
            compliance_tendency=jitter(template["compliance_tendency"]),
            conformity_bias=jitter(template["conformity_bias"]),
            objection_threshold=jitter(template["objection_threshold"]),
            truth_seeking_bias=jitter(template["truth_seeking_bias"]),
            repair_orientation=jitter(template["repair_orientation"]),
            deception_skill=jitter(template["deception_skill"]),
        )
        for other_index in range(config.num_agents):
            if other_index != index:
                agent.suspicion[other_index] = rng.uniform(0.0, 0.18)
        agents.append(agent)
    return agents


def run_simulation(config: ScenarioConfig, run_index: int = 0) -> SimulationResult:
    rng = random.Random(config.seed + run_index)
    agents = create_agents(config, rng)
    legitimacy = config.legitimacy_start
    true_sanctions = 0
    false_sanctions = 0
    successful_appeals = 0
    sabotage_events = 0
    blocked_sabotage_events = 0
    event_log: list[Event] = []
    rounds_completed = 0
    total_participants = 0

    for round_index in range(1, config.rounds + 1):
        rounds_completed = round_index
        accusations_by_target: dict[int, list[int]] = defaultdict(list)
        active_agents = [agent for agent in agents if agent.active]
        active_saboteurs = [agent for agent in active_agents if agent.is_saboteur]

        if not active_saboteurs:
            winner = "cooperators"
            break

        sabotage_pressure = 0.0
        for saboteur in active_saboteurs:
            pressure = 0.04 + (saboteur.deception_skill * 0.08)
            sabotage_events += 1
            sabotage_pressure += pressure
            legitimacy -= pressure * config.sabotage_damage
            event_log.append(
                Event(
                    round_index=round_index,
                    phase="sabotage",
                    actor_id=saboteur.id,
                    action_type="sabotage_attempt",
                    circle_id=saboteur.circle_id,
                    details={"pressure": round(pressure, 4)},
                )
            )
            for observer in agents:
                if observer.id == saboteur.id or not observer.active:
                    continue
                local_bonus = 0.2 if observer.circle_id == saboteur.circle_id else 0.0
                reveal_chance = (
                    observer.truth_seeking_bias * 0.45
                    + observer.compliance_tendency * 0.15
                    + local_bonus
                    - saboteur.deception_skill * 0.35
                )
                if rng.random() < max(0.04, reveal_chance):
                    observer.suspicion[saboteur.id] = _clamp(observer.suspicion[saboteur.id] + rng.uniform(0.18, 0.36))

        round_participants = 0
        for agent in active_agents:
            participate_chance = _clamp(agent.compliance_tendency - rng.uniform(0, config.participation_noise))
            if rng.random() > participate_chance:
                agent.process_compliance = _clamp(agent.process_compliance - 0.03)
                continue

            round_participants += 1
            agent.participation_count += 1
            agent.process_compliance = _clamp(agent.process_compliance + 0.02)

            target_id, suspicion_value = max(agent.suspicion.items(), key=lambda item: item[1])
            should_accuse = suspicion_value >= config.accusation_threshold

            if not should_accuse and agent.archetype in {"Manipulator", "Saboteur"} and rng.random() < 0.35:
                non_self_targets = [candidate.id for candidate in active_agents if candidate.id != agent.id]
                if non_self_targets:
                    target_id = rng.choice(non_self_targets)
                    suspicion_value = max(suspicion_value, config.accusation_threshold - 0.1)
                    should_accuse = True

            if should_accuse:
                accusations_by_target[target_id].append(agent.id)
                agent.accusations_made += 1
                event_log.append(
                    Event(
                        round_index=round_index,
                        phase="deliberation",
                        actor_id=agent.id,
                        action_type="accusation",
                        target_id=target_id,
                        circle_id=agent.circle_id,
                        details={"suspicion": round(suspicion_value, 3)},
                    )
                )

        total_participants += round_participants
        sanctioned_targets = _resolve_governance_round(
            config=config,
            rng=rng,
            agents=agents,
            accusations_by_target=accusations_by_target,
            round_index=round_index,
            event_log=event_log,
        )

        for target in sanctioned_targets:
            if target.is_saboteur:
                true_sanctions += 1
                blocked_sabotage_events += 1
                legitimacy += config.true_sanction_reward
            else:
                false_sanctions += 1
                legitimacy -= config.false_sanction_damage

        if config.model == MODEL_HYBRID:
            appeals = _handle_appeals(rng, sanctioned_targets, event_log, round_index)
            successful_appeals += appeals
            false_sanctions -= appeals
            legitimacy += appeals * 0.035

        _update_reputation_state(config, agents, accusations_by_target)
        _tick_sanctions(agents)
        legitimacy = _clamp(legitimacy)

        if legitimacy <= config.legitimacy_floor:
            winner = "system_failure"
            break

        unsanctioned_saboteurs = [agent for agent in agents if agent.is_saboteur and agent.active]
        if len(unsanctioned_saboteurs) >= max(1, len(active_agents) // 3):
            legitimacy -= 0.02

    else:
        remaining_saboteurs = sum(1 for agent in agents if agent.is_saboteur and agent.active)
        winner = "cooperators" if remaining_saboteurs == 0 else "contested"

    influence_values = [agent.influence for agent in agents if agent.active]
    concentration_index = max(influence_values, default=0.0) / max(sum(influence_values), 1.0)
    participation_rate = total_participants / max(config.rounds * config.num_agents, 1)

    return SimulationResult(
        config=config,
        run_index=run_index,
        seed=config.seed + run_index,
        rounds_completed=rounds_completed,
        winner=winner,
        legitimacy=legitimacy,
        participation_rate=participation_rate,
        true_sanctions=true_sanctions,
        false_sanctions=max(false_sanctions, 0),
        successful_appeals=successful_appeals,
        sabotage_events=sabotage_events,
        blocked_sabotage_events=blocked_sabotage_events,
        concentration_index=concentration_index,
        event_log=event_log,
        agents=agents,
    )


def _resolve_governance_round(
    config: ScenarioConfig,
    rng: random.Random,
    agents: list[Agent],
    accusations_by_target: dict[int, list[int]],
    round_index: int,
    event_log: list[Event],
) -> list[Agent]:
    sanctioned_targets: list[Agent] = []
    agent_map = {agent.id: agent for agent in agents}
    active_agents = [agent for agent in agents if agent.active]

    for target_id, accusers in accusations_by_target.items():
        target = agent_map[target_id]
        if not target.active:
            continue

        if config.model == MODEL_BASELINE:
            voters = [agent for agent in active_agents if agent.id != target.id]
            yes_votes = 0
            for voter in voters:
                suspicion = voter.suspicion.get(target.id, 0.0)
                if suspicion + rng.uniform(-0.08, 0.08) >= config.accusation_threshold:
                    yes_votes += 1
            if voters and (yes_votes / len(voters)) >= 0.5:
                target.sanctioned_rounds = 2
                sanctioned_targets.append(target)
                event_log.append(Event(round_index, "governance", None, "majority_sanction", target.id))
            continue

        same_circle_accusers = [accuser_id for accuser_id in accusers if agent_map[accuser_id].circle_id == target.circle_id]
        local_circle_size = sum(1 for agent in active_agents if agent.circle_id == target.circle_id and agent.id != target.id)
        local_ratio = len(same_circle_accusers) / max(local_circle_size, 1)

        if config.model == MODEL_SOCIocratic:
            if local_ratio >= 0.5:
                target.sanctioned_rounds = 1
                sanctioned_targets.append(target)
                event_log.append(Event(round_index, "governance", None, "circle_restriction", target.id, target.circle_id))
            continue

        weighted_support = 0.0
        for accuser_id in accusers:
            accuser = agent_map[accuser_id]
            weighted_support += 0.35 + accuser.epistemic_score * 0.35 + accuser.process_compliance * 0.2
        quorum = len(accusers) / max(len(active_agents), 1)
        review_trigger = weighted_support >= 1.25 and quorum >= config.quorum_threshold * 0.5

        if local_ratio >= 0.34:
            review_trigger = True

        if review_trigger:
            target.sanctioned_rounds = 2
            target.integrity_band = INTEGRITY_AUDITED if target.is_saboteur else INTEGRITY_RESTRICTED
            sanctioned_targets.append(target)
            event_log.append(
                Event(
                    round_index=round_index,
                    phase="governance",
                    actor_id=None,
                    action_type="federation_review_sanction",
                    target_id=target.id,
                    circle_id=target.circle_id,
                    details={"weighted_support": round(weighted_support, 3), "quorum": round(quorum, 3)},
                )
            )

    return sanctioned_targets


def _handle_appeals(
    rng: random.Random,
    sanctioned_targets: list[Agent],
    event_log: list[Event],
    round_index: int,
) -> int:
    successful_appeals = 0
    for target in sanctioned_targets:
        if target.is_saboteur:
            continue
        appeal_chance = 0.2 + target.repair_orientation * 0.45 + target.truth_seeking_bias * 0.2
        if rng.random() < appeal_chance:
            target.sanctioned_rounds = 0
            target.integrity_band = INTEGRITY_TRUSTED
            successful_appeals += 1
            event_log.append(
                Event(
                    round_index=round_index,
                    phase="appeal",
                    actor_id=target.id,
                    action_type="appeal_restored",
                    target_id=target.id,
                    circle_id=target.circle_id,
                )
            )
    return successful_appeals


def _update_reputation_state(
    config: ScenarioConfig,
    agents: list[Agent],
    accusations_by_target: dict[int, list[int]],
) -> None:
    agent_map = {agent.id: agent for agent in agents}
    sanctioned_ids = {agent.id for agent in agents if agent.sanctioned_rounds > 0}

    for target_id, accuser_ids in accusations_by_target.items():
        target = agent_map[target_id]
        accusation_correct = target.is_saboteur
        for accuser_id in accuser_ids:
            accuser = agent_map[accuser_id]
            if accusation_correct:
                accuser.accurate_accusations += 1
                accuser.epistemic_score = _clamp(accuser.epistemic_score + 0.06)
                accuser.cooperation_score = _clamp(accuser.cooperation_score + 0.03)
            else:
                accuser.false_accusations += 1
                accuser.epistemic_score = _clamp(accuser.epistemic_score - 0.05)
                accuser.cooperation_score = _clamp(accuser.cooperation_score - 0.02)

    if config.model != MODEL_HYBRID:
        return

    for agent in agents:
        agent.process_compliance = _clamp(agent.process_compliance * 0.995)
        agent.epistemic_score = _clamp(agent.epistemic_score * 0.998)
        if agent.id in sanctioned_ids:
            agent.adversarial_pattern_score = _clamp(agent.adversarial_pattern_score + 0.14)
        else:
            agent.adversarial_pattern_score = _clamp(agent.adversarial_pattern_score * 0.92)

        if agent.is_saboteur and agent.active:
            agent.influence = _clamp(agent.influence + 0.04, 0.25, 1.6)
        elif agent.active:
            agent.influence = _clamp(agent.influence + 0.015, 0.25, 1.5)

        if agent.epistemic_score > 0.72 and agent.process_compliance > 0.66:
            agent.integrity_band = INTEGRITY_TRUSTED
        elif agent.adversarial_pattern_score > 0.5:
            agent.integrity_band = INTEGRITY_AUDITED
        elif agent.sanctioned_rounds > 0:
            agent.integrity_band = INTEGRITY_RESTRICTED
        else:
            agent.integrity_band = INTEGRITY_PROVISIONAL

    _apply_concentration_cap(agents)


def _apply_concentration_cap(agents: list[Agent]) -> None:
    active_agents = [agent for agent in agents if agent.active]
    total_influence = sum(agent.influence for agent in active_agents)
    if total_influence <= 0:
        return
    cap = total_influence * 0.15
    for agent in active_agents:
        if agent.influence > cap:
            agent.influence = cap


def _tick_sanctions(agents: list[Agent]) -> None:
    for agent in agents:
        if agent.sanctioned_rounds > 0:
            agent.sanctioned_rounds -= 1


def summarize_results(results: list[SimulationResult]) -> dict[str, float | int | str]:
    winner_counts = Counter(result.winner for result in results)
    count = max(len(results), 1)
    return {
        "runs": len(results),
        "dominant_outcome": winner_counts.most_common(1)[0][0] if winner_counts else "unknown",
        "avg_legitimacy": round(sum(result.legitimacy for result in results) / count, 4),
        "avg_participation_rate": round(sum(result.participation_rate for result in results) / count, 4),
        "avg_true_sanctions": round(sum(result.true_sanctions for result in results) / count, 4),
        "avg_false_sanctions": round(sum(result.false_sanctions for result in results) / count, 4),
        "avg_successful_appeals": round(sum(result.successful_appeals for result in results) / count, 4),
        "avg_sabotage_events": round(sum(result.sabotage_events for result in results) / count, 4),
        "avg_concentration_index": round(sum(result.concentration_index for result in results) / count, 4),
        "cooperator_wins": winner_counts.get("cooperators", 0),
        "system_failures": winner_counts.get("system_failure", 0),
        "contested_runs": winner_counts.get("contested", 0),
    }
