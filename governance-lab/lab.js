const MODEL_LABELS = {
  baseline: 'Baseline Majority',
  sociocracy: 'Sociocratic Circles',
  hybrid: 'Hybrid Integrity Federation'
};

const PRESETS = {
  hybrid_infiltration: {
    label: 'Hybrid Infiltration',
    model: 'hybrid',
    agents: 18,
    circles: 3,
    infiltrators: 2,
    seed: 303,
    roundLimit: 18,
    threshold: 0.5,
    legitimacy: 0.88,
    sabotageDamage: 0.5,
    falseSanctionDamage: 0.1,
    trueSanctionReward: 0.09,
    participationNoise: 0.14,
    reviewSupport: 1.25,
    reviewQuorum: 0.15,
    legitimacyFloor: 0.24,
    capturePenalty: 0.02
  },
  baseline_capture: {
    label: 'Baseline Capture',
    model: 'baseline',
    agents: 12,
    circles: 3,
    infiltrators: 2,
    seed: 101,
    roundLimit: 12,
    threshold: 0.58,
    legitimacy: 0.82,
    sabotageDamage: 0.65,
    falseSanctionDamage: 0.12,
    trueSanctionReward: 0.06,
    participationNoise: 0.2,
    reviewSupport: 1.25,
    reviewQuorum: 0.15,
    legitimacyFloor: 0.22,
    capturePenalty: 0.02
  },
  sociocratic_pilot: {
    label: 'Sociocratic Pilot',
    model: 'sociocracy',
    agents: 15,
    circles: 3,
    infiltrators: 2,
    seed: 202,
    roundLimit: 14,
    threshold: 0.55,
    legitimacy: 0.84,
    sabotageDamage: 0.62,
    falseSanctionDamage: 0.11,
    trueSanctionReward: 0.07,
    participationNoise: 0.18,
    reviewSupport: 1.25,
    reviewQuorum: 0.15,
    legitimacyFloor: 0.22,
    capturePenalty: 0.02
  },
  autoimmune_stress: {
    label: 'Autoimmune Stress',
    model: 'hybrid',
    agents: 18,
    circles: 3,
    infiltrators: 2,
    seed: 404,
    roundLimit: 16,
    threshold: 0.46,
    legitimacy: 0.83,
    sabotageDamage: 0.55,
    falseSanctionDamage: 0.14,
    trueSanctionReward: 0.06,
    participationNoise: 0.19,
    reviewSupport: 1.0,
    reviewQuorum: 0.12,
    legitimacyFloor: 0.2,
    capturePenalty: 0.02
  }
};

const ARCHETYPES = {
  Cooperator: { compliance: 0.84, conformity: 0.42, objection: 0.58, truth: 0.72, repair: 0.68, deception: 0.15 },
  TruthSeeker: { compliance: 0.74, conformity: 0.2, objection: 0.43, truth: 0.9, repair: 0.58, deception: 0.1 },
  Conformist: { compliance: 0.71, conformity: 0.8, objection: 0.7, truth: 0.45, repair: 0.44, deception: 0.1 },
  Whistleblower: { compliance: 0.76, conformity: 0.18, objection: 0.35, truth: 0.82, repair: 0.52, deception: 0.08 },
  Reconciler: { compliance: 0.79, conformity: 0.45, objection: 0.56, truth: 0.57, repair: 0.88, deception: 0.12 },
  Bureaucrat: { compliance: 0.9, conformity: 0.52, objection: 0.62, truth: 0.46, repair: 0.39, deception: 0.09 },
  Opportunist: { compliance: 0.53, conformity: 0.63, objection: 0.59, truth: 0.32, repair: 0.23, deception: 0.42 },
  Manipulator: { compliance: 0.49, conformity: 0.34, objection: 0.51, truth: 0.21, repair: 0.16, deception: 0.8 },
  Saboteur: { compliance: 0.44, conformity: 0.28, objection: 0.5, truth: 0.18, repair: 0.06, deception: 0.78 }
};

const COOPERATOR_ARCHETYPES = ['Cooperator', 'TruthSeeker', 'Conformist', 'Whistleblower', 'Reconciler', 'Bureaucrat', 'Opportunist'];
const SABOTEUR_ARCHETYPES = ['Saboteur', 'Manipulator'];
const SWEEP_VARIABLES = {
  threshold: { label: 'Accusation Threshold', min: 0.25, max: 0.9, step: 0.05 },
  sabotageDamage: { label: 'Sabotage Damage', min: 0.2, max: 1.2, step: 0.05 },
  falseSanctionDamage: { label: 'False Sanction Cost', min: 0.02, max: 0.4, step: 0.02 },
  trueSanctionReward: { label: 'True Sanction Reward', min: 0.02, max: 0.25, step: 0.01 },
  participationNoise: { label: 'Participation Noise', min: 0.02, max: 0.35, step: 0.02 },
  reviewSupport: { label: 'Review Support Threshold', min: 0.6, max: 2.5, step: 0.1 },
  reviewQuorum: { label: 'Review Quorum Floor', min: 0.05, max: 0.6, step: 0.05 },
  legitimacy: { label: 'Starting Legitimacy', min: 0.4, max: 1, step: 0.05 },
  legitimacyFloor: { label: 'Failure Floor', min: 0.05, max: 0.5, step: 0.05 },
  capturePenalty: { label: 'Capture Penalty', min: 0, max: 0.12, step: 0.01 }
};
const STORAGE_KEY = 'mastermind-city-governance-lab-configs';

const dom = {
  preset: document.querySelector('#preset-select'),
  model: document.querySelector('#model-select'),
  agents: document.querySelector('#agents-input'),
  circles: document.querySelector('#circles-input'),
  infiltrators: document.querySelector('#infiltrators-input'),
  seed: document.querySelector('#seed-input'),
  roundLimit: document.querySelector('#round-limit-input'),
  batchRuns: document.querySelector('#batch-runs-input'),
  threshold: document.querySelector('#threshold-input'),
  thresholdOutput: document.querySelector('#threshold-output'),
  sabotageDamage: document.querySelector('#sabotage-damage-input'),
  sabotageDamageOutput: document.querySelector('#sabotage-damage-output'),
  falseSanction: document.querySelector('#false-sanction-input'),
  falseSanctionOutput: document.querySelector('#false-sanction-output'),
  trueSanction: document.querySelector('#true-sanction-input'),
  trueSanctionOutput: document.querySelector('#true-sanction-output'),
  participationNoise: document.querySelector('#participation-noise-input'),
  participationNoiseOutput: document.querySelector('#participation-noise-output'),
  reviewSupport: document.querySelector('#review-support-input'),
  reviewSupportOutput: document.querySelector('#review-support-output'),
  reviewQuorum: document.querySelector('#review-quorum-input'),
  reviewQuorumOutput: document.querySelector('#review-quorum-output'),
  startingLegitimacy: document.querySelector('#starting-legitimacy-input'),
  startingLegitimacyOutput: document.querySelector('#starting-legitimacy-output'),
  legitimacyFloor: document.querySelector('#legitimacy-floor-input'),
  legitimacyFloorOutput: document.querySelector('#legitimacy-floor-output'),
  capturePenalty: document.querySelector('#capture-pressure-input'),
  capturePenaltyOutput: document.querySelector('#capture-pressure-output'),
  experimentName: document.querySelector('#experiment-name-input'),
  savedConfigSelect: document.querySelector('#saved-config-select'),
  saveConfig: document.querySelector('#save-config-btn'),
  loadConfig: document.querySelector('#load-config-btn'),
  deleteConfig: document.querySelector('#delete-config-btn'),
  sweepVariable: document.querySelector('#sweep-variable-select'),
  sweepMin: document.querySelector('#sweep-min-input'),
  sweepMax: document.querySelector('#sweep-max-input'),
  sweepStep: document.querySelector('#sweep-step-input'),
  heatmapX: document.querySelector('#heatmap-x-select'),
  heatmapY: document.querySelector('#heatmap-y-select'),
  heatmapSteps: document.querySelector('#heatmap-steps-input'),
  heatmapModel: document.querySelector('#heatmap-model-select'),
  reveal: document.querySelector('#reveal-input'),
  initialize: document.querySelector('#initialize-btn'),
  step: document.querySelector('#step-btn'),
  autoplay: document.querySelector('#autoplay-btn'),
  reset: document.querySelector('#reset-btn'),
  analyzeCurrent: document.querySelector('#analyze-current-btn'),
  compareModels: document.querySelector('#compare-models-btn'),
  runSweep: document.querySelector('#run-sweep-btn'),
  runHeatmap: document.querySelector('#run-heatmap-btn'),
  exportJson: document.querySelector('#export-json-btn'),
  exportCsv: document.querySelector('#export-csv-btn'),
  labStatus: document.querySelector('#lab-status'),
  federationMode: document.querySelector('#federation-mode'),
  resultBanner: document.querySelector('#result-banner'),
  metricRound: document.querySelector('#metric-round'),
  metricPhase: document.querySelector('#metric-phase'),
  metricLegitimacy: document.querySelector('#metric-legitimacy'),
  metricSaboteurs: document.querySelector('#metric-saboteurs'),
  metricSanctions: document.querySelector('#metric-sanctions'),
  metricParticipation: document.querySelector('#metric-participation'),
  timelineChart: document.querySelector('#timeline-chart'),
  circleGrid: document.querySelector('#circle-grid'),
  agentGrid: document.querySelector('#agent-grid'),
  eventLog: document.querySelector('#event-log'),
  analysisRuns: document.querySelector('#analysis-runs'),
  analysisSuccessRate: document.querySelector('#analysis-success-rate'),
  analysisLegitimacy: document.querySelector('#analysis-legitimacy'),
  analysisBestModel: document.querySelector('#analysis-best-model'),
  barCooperators: document.querySelector('#bar-cooperators'),
  barCooperatorsValue: document.querySelector('#bar-cooperators-value'),
  barContested: document.querySelector('#bar-contested'),
  barContestedValue: document.querySelector('#bar-contested-value'),
  barFailure: document.querySelector('#bar-failure'),
  barFailureValue: document.querySelector('#bar-failure-value'),
  compareBody: document.querySelector('#compare-body'),
  sweepBestValue: document.querySelector('#sweep-best-value'),
  sweepBestSuccess: document.querySelector('#sweep-best-success'),
  sweepBestScore: document.querySelector('#sweep-best-score'),
  sweepChart: document.querySelector('#sweep-chart'),
  sweepBody: document.querySelector('#sweep-body'),
  heatmapBestX: document.querySelector('#heatmap-best-x'),
  heatmapBestY: document.querySelector('#heatmap-best-y'),
  heatmapBestScore: document.querySelector('#heatmap-best-score'),
  heatmapGrid: document.querySelector('#heatmap-grid')
};

let sim = null;
let autoplayTimer = null;
let latestOutputs = {
  currentAnalysis: null,
  comparison: null,
  sweep: null,
  heatmap: null
};

function mulberry32(seed) {
  let state = seed >>> 0;
  return function random() {
    state += 0x6D2B79F5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, value));
}

function pick(random, values) {
  return values[Math.floor(random() * values.length)];
}

function activeAgents(state) {
  return state.agents.filter(agent => agent.sanctions <= 0);
}

function activeSaboteurs(state) {
  return activeAgents(state).filter(agent => agent.alignment === 'saboteur');
}

function createAgent(random, index, config, infiltratorIds) {
  const alignment = infiltratorIds.has(index) ? 'saboteur' : 'cooperator';
  const archetypeName = alignment === 'saboteur'
    ? pick(random, SABOTEUR_ARCHETYPES)
    : pick(random, COOPERATOR_ARCHETYPES);
  const template = ARCHETYPES[archetypeName];
  const suspicion = {};

  for (let otherIndex = 0; otherIndex < config.agents; otherIndex += 1) {
    if (otherIndex !== index) suspicion[otherIndex] = random() * 0.18;
  }

  return {
    id: index,
    name: `Agent-${String(index + 1).padStart(2, '0')}`,
    circleId: index % config.circles,
    alignment,
    archetype: archetypeName,
    integrityBand: 'provisional',
    compliance: clamp(template.compliance + (random() - 0.5) * 0.16),
    conformity: clamp(template.conformity + (random() - 0.5) * 0.16),
    objection: clamp(template.objection + (random() - 0.5) * 0.16),
    truth: clamp(template.truth + (random() - 0.5) * 0.16),
    repair: clamp(template.repair + (random() - 0.5) * 0.16),
    deception: clamp(template.deception + (random() - 0.5) * 0.16),
    influence: 1,
    processCompliance: 0.5,
    epistemic: 0.5,
    cooperation: 0.5,
    adversarial: 0,
    sanctions: 0,
    probationRounds: 0,
    localFlags: 0,
    reviewExposure: 0,
    currentRole: 'member',
    participationCount: 0,
    accusationsMade: 0,
    accurateAccusations: 0,
    falseAccusations: 0,
    concernCount: 0,
    objectionCount: 0,
    captureFlags: 0,
    sanctionHistory: 0,
    appealCount: 0,
    suspicion
  };
}

function initializeState(config, options = {}) {
  const random = mulberry32(config.seed);
  const infiltratorIds = new Set();
  const maxInfiltrators = Math.min(config.infiltrators, Math.max(config.agents - 1, 1));

  while (infiltratorIds.size < maxInfiltrators) {
    infiltratorIds.add(Math.floor(random() * config.agents));
  }

  const state = {
    config,
    random,
    round: 0,
    legitimacy: config.legitimacy,
    totalSanctions: 0,
    trueSanctions: 0,
    falseSanctions: 0,
    successfulAppeals: 0,
    lastParticipationRate: 0,
    outcome: null,
    phaseLabel: 'initialized',
    timeline: [config.legitimacy],
    accusationLedger: {},
    governanceStats: {
      totalConcerns: 0,
      totalObjections: 0,
      totalEscalations: 0,
      totalProbations: 0,
      totalCaptureAlerts: 0,
      totalReviews: 0,
      lastRound: {
        concerns: 0,
        objections: 0,
        escalations: 0,
        probations: 0,
        captureAlerts: 0,
        reviews: 0
      }
    },
    circleStates: Array.from({ length: config.circles }, (_, index) => ({
      id: index,
      tension: 0,
      consentFailures: 0,
      escalations: 0,
      probationActions: 0
    })),
    agents: Array.from({ length: config.agents }, (_, index) => createAgent(random, index, config, infiltratorIds))
  };

  if (options.captureLog !== false) {
    state.events = [
      {
        round: 0,
        phase: 'setup',
        action: 'simulation_initialized',
        text: `${MODEL_LABELS[config.model]} initialized with ${config.agents} individuals across ${config.circles} circles.`
      }
    ];
  } else {
    state.events = [];
  }

  return state;
}

function pushEvent(state, round, phase, action, text, options = {}) {
  if (options.captureLog === false) return;
  state.events.unshift({ round, phase, action, text });
  state.events = state.events.slice(0, 48);
}

function getRoundCircleMembers(state, circleId) {
  return activeAgents(state).filter(agent => agent.circleId === circleId);
}

function assignRoundRoles(state) {
  state.agents.forEach(agent => {
    agent.currentRole = 'member';
  });

  state.circleStates.forEach(circleState => {
    const members = getRoundCircleMembers(state, circleState.id).sort((a, b) => a.id - b.id);
    if (!members.length) return;

    const facilitator = members[(state.round + circleState.id) % members.length];
    const delegate = members[(state.round + circleState.id + 1) % members.length];
    const ombuds = members[(state.round + circleState.id + 2) % members.length];
    facilitator.currentRole = 'facilitator';
    if (delegate.id !== facilitator.id) delegate.currentRole = 'delegate';
    if (![facilitator.id, delegate.id].includes(ombuds.id)) ombuds.currentRole = 'ombuds';
  });

  const reviewers = activeAgents(state)
    .slice()
    .sort((left, right) => (right.epistemic + right.processCompliance) - (left.epistemic + left.processCompliance))
    .slice(0, Math.max(3, Math.min(5, Math.floor(state.config.agents / 4))));

  reviewers.forEach(agent => {
    if (agent.currentRole === 'member') agent.currentRole = 'reviewer';
  });
}

function recordAccusationLedger(state, accuserId, targetId) {
  const key = `${accuserId}:${targetId}`;
  state.accusationLedger[key] = (state.accusationLedger[key] || 0) + 1;
  return state.accusationLedger[key];
}

function getCliqueRisk(state, signals, target) {
  const sameCircleCounts = {};
  let repeatedPressure = 0;

  signals.forEach(signal => {
    const accuser = state.agents[signal.accuserId];
    sameCircleCounts[accuser.circleId] = (sameCircleCounts[accuser.circleId] || 0) + 1;
    repeatedPressure += state.accusationLedger[`${signal.accuserId}:${target.id}`] || 0;
  });

  const sameCircleShare = Math.max(...Object.values(sameCircleCounts), 0) / Math.max(signals.length, 1);
  const repeatedAverage = repeatedPressure / Math.max(signals.length, 1);
  const distinctCircles = Object.keys(sameCircleCounts).length;
  let risk = 0;

  if (sameCircleShare > 0.75 && signals.length <= 2) risk += 0.24;
  if (sameCircleShare > 0.66 && distinctCircles === 1) risk += 0.12;
  if (repeatedAverage > 1.4) risk += 0.16;
  if (target.circleId !== undefined && distinctCircles === 1 && Number(Object.keys(sameCircleCounts)[0]) !== target.circleId) risk += 0.08;

  return {
    cliqueRisk: clamp(risk),
    repeatedAverage,
    sameCircleShare,
    distinctCircles
  };
}

function runBaselineMajority(state, target, signals, options = {}) {
  const active = activeAgents(state).filter(agent => agent.id !== target.id);
  const yesVotes = active.filter(agent => {
    const suspicion = agent.suspicion[target.id] || 0;
    return suspicion + (agent.currentRole === 'reviewer' ? 0.04 : 0) >= state.config.threshold;
  }).length;

  if (active.length && yesVotes / active.length >= 0.5) {
    target.sanctions = Math.max(target.sanctions, 2);
    target.sanctionHistory += 1;
    pushEvent(state, state.round, 'governance', 'majority_sanction', `${target.name} is restricted by simple majority vote.`, options);
    return [target];
  }

  return [];
}

function processLocalGovernance(state, signalsByTarget, options = {}) {
  const sanctioned = [];
  const escalations = [];

  Object.entries(signalsByTarget).forEach(([targetKey, signals]) => {
    const target = state.agents[Number(targetKey)];
    if (!target || target.sanctions > 0) return;

    if (state.config.model === 'baseline') {
      sanctioned.push(...runBaselineMajority(state, target, signals, options));
      return;
    }

    const circleState = state.circleStates[target.circleId];
    const localSignals = signals.filter(signal => state.agents[signal.accuserId].circleId === target.circleId);
    const concernCount = localSignals.length;
    const blockingCount = localSignals.filter(signal => signal.isBlocking).length;
    const distinctAccusers = new Set(localSignals.map(signal => signal.accuserId)).size;
    const reasonAverage = localSignals.reduce((sum, signal) => sum + signal.reasonQuality, 0) / Math.max(concernCount, 1);
    const weightedSupport = localSignals.reduce((sum, signal) => sum + signal.supportWeight, 0);
    const cliqueRisk = getCliqueRisk(state, signals, target);
    const roleParticipation = localSignals.some(signal => ['facilitator', 'ombuds', 'delegate'].includes(signal.role)) ? 0.18 : 0;
    const dueProcess = clamp(distinctAccusers / 3 * 0.32 + reasonAverage * 0.4 + roleParticipation - cliqueRisk.cliqueRisk * 0.18);

    if (concernCount > 0) {
      circleState.tension = clamp(circleState.tension + concernCount * 0.05 + blockingCount * 0.06);
      state.governanceStats.totalConcerns += concernCount;
      state.governanceStats.lastRound.concerns += concernCount;
    }

    if (blockingCount > 0) {
      state.governanceStats.totalObjections += blockingCount;
      state.governanceStats.lastRound.objections += blockingCount;
      pushEvent(
        state,
        state.round,
        'circle',
        'blocking_objection',
        `${blockingCount} blocking objection${blockingCount === 1 ? '' : 's'} form around ${target.name} in circle ${target.circleId + 1}.`,
        options
      );
    }

    const probationTrigger = weightedSupport >= state.config.threshold * 1.3 || blockingCount >= 2;
    if (probationTrigger && dueProcess >= 0.38) {
      target.probationRounds = Math.max(target.probationRounds, 1);
      target.localFlags = clamp(target.localFlags + 1, 0, 4);
      target.integrityBand = 'probation';
      circleState.probationActions += 1;
      state.governanceStats.totalProbations += 1;
      state.governanceStats.lastRound.probations += 1;
      pushEvent(
        state,
        state.round,
        'circle',
        'local_probation',
        `${target.name} is placed on local probation while the circle tests whether concerns are procedural or malicious.`,
        options
      );
    }

    if (blockingCount >= 2 && dueProcess >= 0.45) {
      circleState.consentFailures += 1;
    }

    if (state.config.model === 'sociocracy') {
      if (circleState.consentFailures > 0 && (blockingCount >= 2 || target.localFlags >= 2) && dueProcess >= 0.48) {
        target.sanctions = Math.max(target.sanctions, 1);
        target.sanctionHistory += 1;
        sanctioned.push(target);
        pushEvent(
          state,
          state.round,
          'circle',
          'circle_restriction',
          `${target.name} is locally restricted after repeated blocking objections degrade consent in circle ${target.circleId + 1}.`,
          options
        );
      }
      return;
    }

    const shouldEscalate =
      (blockingCount >= 2 && dueProcess >= 0.48 && weightedSupport >= state.config.reviewSupport * 0.72) ||
      target.localFlags >= 2 ||
      cliqueRisk.distinctCircles >= 2;

    if (shouldEscalate) {
      circleState.escalations += 1;
      state.governanceStats.totalEscalations += 1;
      state.governanceStats.lastRound.escalations += 1;
      escalations.push({
        targetId: target.id,
        signals,
        weightedSupport,
        blockingCount,
        dueProcess,
        cliqueRisk
      });
      pushEvent(
        state,
        state.round,
        'circle',
        'federation_escalation',
        `${target.name} is escalated from circle ${target.circleId + 1} to federation review after local consent can no longer safely resolve the dispute.`,
        options
      );
    }
  });

  return { sanctioned, escalations };
}

function runFederationReview(state, escalations, options = {}) {
  const sanctioned = [];
  const captureFlaggedAccusers = new Set();

  escalations.forEach(escalation => {
    const target = state.agents[escalation.targetId];
    if (!target || target.sanctions > 0) return;

    const accuserIds = escalation.signals.map(signal => signal.accuserId);
    const reviewers = activeAgents(state)
      .filter(agent => {
        const eligibleRole = ['reviewer', 'ombuds', 'delegate'].includes(agent.currentRole);
        return agent.id !== target.id && !accuserIds.includes(agent.id) && (eligibleRole || agent.integrityBand === 'trusted');
      })
      .sort((left, right) => (right.epistemic + right.processCompliance) - (left.epistemic + left.processCompliance))
      .slice(0, 3);

    const reviewerStrength = reviewers.reduce((sum, reviewer) => sum + reviewer.epistemic + reviewer.processCompliance, 0) / Math.max(reviewers.length * 2, 1);
    const supportNormalized = escalation.weightedSupport / Math.max(state.config.reviewSupport, 1);
    const reviewConfidence = clamp(
      escalation.dueProcess * 0.34 +
      supportNormalized * 0.2 +
      reviewerStrength * 0.24 +
      escalation.blockingCount * 0.08 +
      escalation.cliqueRisk.distinctCircles * 0.05 -
      escalation.cliqueRisk.cliqueRisk * 0.28 -
      target.deception * 0.14
    );

    state.governanceStats.totalReviews += 1;
    state.governanceStats.lastRound.reviews += 1;

    if (escalation.cliqueRisk.cliqueRisk >= 0.25) {
      state.governanceStats.totalCaptureAlerts += 1;
      state.governanceStats.lastRound.captureAlerts += 1;
      escalation.signals.forEach(signal => captureFlaggedAccusers.add(signal.accuserId));
      pushEvent(
        state,
        state.round,
        'review',
        'capture_alert',
        `Federation review detects clique-like accusation behavior around ${target.name}; accusers are scrutinized alongside the target.`,
        options
      );
    }

    if (reviewConfidence >= 0.69 && reviewers.length >= 2) {
      target.sanctions = Math.max(target.sanctions, 2);
      target.reviewExposure = clamp(target.reviewExposure + 0.35, 0, 2);
      target.integrityBand = 'audited';
      target.sanctionHistory += 1;
      sanctioned.push({
        target,
        dueProcess: escalation.dueProcess,
        cliqueRisk: escalation.cliqueRisk.cliqueRisk,
        reviewConfidence
      });
      pushEvent(
        state,
        state.round,
        'review',
        'federation_restriction',
        `${target.name} is restricted after cross-circle review confirms enough evidence to intervene at the federation layer.`,
        options
      );
    } else if (reviewConfidence >= 0.5) {
      target.probationRounds = Math.max(target.probationRounds, 2);
      target.reviewExposure = clamp(target.reviewExposure + 0.25, 0, 2);
      target.integrityBand = 'audited';
      state.governanceStats.totalProbations += 1;
      state.governanceStats.lastRound.probations += 1;
      pushEvent(
        state,
        state.round,
        'review',
        'federation_probation',
        `${target.name} remains active but under federation probation while evidence is insufficient for a hard restriction.`,
        options
      );
    } else {
      pushEvent(
        state,
        state.round,
        'review',
        'review_inconclusive',
        `Federation review on ${target.name} remains inconclusive; the system records the dispute without escalating into a brittle false positive.`,
        options
      );
    }
  });

  return { sanctioned, captureFlaggedAccusers };
}

function applyAppeals(state, sanctionedOutcomes, options = {}) {
  if (state.config.model !== 'hybrid') return;

  sanctionedOutcomes.forEach(outcome => {
    const target = outcome.target;
    if (target.alignment === 'saboteur') return;

    const proceduralDeficit = clamp((1 - outcome.dueProcess) + outcome.cliqueRisk * 0.6 + (0.7 - outcome.reviewConfidence) * 0.35);
    const appealChance = clamp(0.12 + target.repair * 0.34 + target.truth * 0.16 + proceduralDeficit * 0.3);

    if (state.random() < appealChance) {
      target.sanctions = 0;
      target.probationRounds = Math.max(target.probationRounds, 1);
      target.integrityBand = 'trusted';
      target.appealCount += 1;
      state.successfulAppeals += 1;
      state.legitimacy = clamp(state.legitimacy + 0.04);
      pushEvent(
        state,
        state.round,
        'appeal',
        'appeal_restored',
        `${target.name} wins an appeal after reviewers determine the sanction exceeded the available evidence.`,
        options
      );
    }
  });
}

function updateReputation(state, signalsByTarget, captureFlaggedAccusers) {
  const captureSet = captureFlaggedAccusers || new Set();

  Object.entries(signalsByTarget).forEach(([targetKey, signals]) => {
    const target = state.agents[Number(targetKey)];
    const correct = target.alignment === 'saboteur';

    signals.forEach(signal => {
      const accuser = state.agents[signal.accuserId];
      if (signal.isBlocking) accuser.objectionCount += 1;
      accuser.concernCount += 1;

      if (correct) {
        accuser.accurateAccusations += 1;
        accuser.epistemic = clamp(accuser.epistemic + (signal.isBlocking ? 0.05 : 0.03) * signal.reasonQuality + 0.01);
        accuser.cooperation = clamp(accuser.cooperation + 0.02 + signal.reasonQuality * 0.02);
      } else {
        accuser.falseAccusations += 1;
        const penalty = signal.isBlocking ? 0.05 : 0.02;
        accuser.epistemic = clamp(accuser.epistemic - penalty * (0.7 + signal.reasonQuality * 0.4));
        accuser.cooperation = clamp(accuser.cooperation - penalty * 0.5);
        if (signal.isBlocking && signal.reasonQuality < 0.45) {
          accuser.adversarial = clamp(accuser.adversarial + 0.06);
        }
      }

      if (captureSet.has(accuser.id)) {
        accuser.captureFlags += 1;
        accuser.adversarial = clamp(accuser.adversarial + 0.1);
      }
    });
  });

  state.agents.forEach(agent => {
    agent.processCompliance = clamp(agent.processCompliance * 0.994 + (agent.currentRole !== 'member' ? 0.006 : 0));
    agent.epistemic = clamp(agent.epistemic * 0.998);
    agent.localFlags = clamp(agent.localFlags - 0.18, 0, 4);
    agent.reviewExposure = clamp(agent.reviewExposure - 0.08, 0, 2);

    if (agent.sanctions > 0) {
      agent.adversarial = clamp(agent.adversarial + 0.12);
      agent.influence = clamp(agent.influence * 0.86, 0.2, 1.5);
    } else if (agent.probationRounds > 0) {
      agent.influence = clamp(agent.influence * 0.94, 0.25, 1.5);
    } else if (agent.alignment === 'saboteur') {
      agent.influence = clamp(agent.influence + 0.03, 0.25, 1.6);
      agent.adversarial = clamp(agent.adversarial * 0.97 + 0.02);
    } else {
      agent.influence = clamp(agent.influence + 0.015, 0.25, 1.5);
      agent.adversarial = clamp(agent.adversarial * 0.9);
    }

    if (agent.sanctions > 0) {
      agent.integrityBand = 'restricted';
    } else if (agent.probationRounds > 0) {
      agent.integrityBand = 'probation';
    } else if (agent.reviewExposure > 0.35 || agent.adversarial > 0.55) {
      agent.integrityBand = 'audited';
    } else if (agent.epistemic > 0.72 && agent.processCompliance > 0.66 && agent.captureFlags < 2) {
      agent.integrityBand = 'trusted';
    } else {
      agent.integrityBand = 'provisional';
    }
  });

  const active = activeAgents(state);
  const totalInfluence = active.reduce((sum, agent) => sum + agent.influence, 0);
  const cap = totalInfluence * 0.15;
  active.forEach(agent => {
    if (agent.influence > cap) agent.influence = cap;
  });
}

function tickGovernanceState(state) {
  state.agents.forEach(agent => {
    if (agent.sanctions > 0) agent.sanctions -= 1;
    if (agent.probationRounds > 0) agent.probationRounds -= 1;
  });

  state.circleStates.forEach(circleState => {
    circleState.tension = clamp(circleState.tension * 0.92);
  });
}

function determineOutcome(state, options = {}) {
  if (activeSaboteurs(state).length === 0) {
    state.outcome = 'cooperators';
    pushEvent(state, state.round, 'result', 'cooperators_win', 'All active saboteurs have been neutralized. Cooperative governance stabilizes the system.', options);
    return;
  }

  if (state.legitimacy <= state.config.legitimacyFloor) {
    state.outcome = 'system_failure';
    pushEvent(state, state.round, 'result', 'system_failure', 'Legitimacy collapses. The governance layer loses authority faster than it can coordinate trust.', options);
    return;
  }

  if (state.round >= state.config.roundLimit) {
    state.outcome = 'contested';
    pushEvent(state, state.round, 'result', 'contested_end', 'The round limit is reached before the system fully stabilizes or collapses.', options);
  }
}

function stepState(state, options = {}) {
  if (state.outcome) return state;

  state.round += 1;
  state.phaseLabel = 'sabotage -> circle sensemaking -> review';
  state.governanceStats.lastRound = {
    concerns: 0,
    objections: 0,
    escalations: 0,
    probations: 0,
    captureAlerts: 0,
    reviews: 0
  };
  assignRoundRoles(state);

  if (!activeSaboteurs(state).length) {
    determineOutcome(state, options);
    return state;
  }

  const signalsByTarget = {};
  let roundParticipants = 0;

  activeSaboteurs(state).forEach(saboteur => {
    const pressure = 0.04 + saboteur.deception * 0.08;
    state.legitimacy = clamp(state.legitimacy - pressure * state.config.sabotageDamage);
    pushEvent(state, state.round, 'sabotage', 'sabotage_attempt', `${saboteur.name} injects noise into circle ${saboteur.circleId + 1}.`, options);

    state.agents.forEach(observer => {
      if (observer.id === saboteur.id || observer.sanctions > 0) return;
      const localBonus = observer.circleId === saboteur.circleId ? 0.2 : 0;
      const revealChance = observer.truth * 0.45 + observer.compliance * 0.15 + localBonus - saboteur.deception * 0.35;
      if (state.random() < Math.max(0.04, revealChance)) {
        observer.suspicion[saboteur.id] = clamp((observer.suspicion[saboteur.id] || 0) + 0.18 + state.random() * 0.18);
      }
    });

    state.circleStates[saboteur.circleId].tension = clamp(state.circleStates[saboteur.circleId].tension + 0.05);
  });

  activeAgents(state).forEach(agent => {
    const roleBonus = ['facilitator', 'delegate', 'ombuds', 'reviewer'].includes(agent.currentRole) ? 0.08 : 0;
    const participateChance = clamp(agent.compliance + roleBonus - state.random() * state.config.participationNoise);
    if (state.random() > participateChance) {
      agent.processCompliance = clamp(agent.processCompliance - 0.03);
      return;
    }

    roundParticipants += 1;
    agent.participationCount += 1;
    agent.processCompliance = clamp(agent.processCompliance + 0.02);

    const topSuspicionEntry = Object.entries(agent.suspicion).sort((a, b) => b[1] - a[1])[0];
    if (!topSuspicionEntry) return;

    let targetId = Number(topSuspicionEntry[0]);
    let suspicionValue = topSuspicionEntry[1];
    const roleWeight = agent.currentRole === 'facilitator' ? 0.14 : agent.currentRole === 'ombuds' ? 0.12 : agent.currentRole === 'delegate' ? 0.08 : agent.currentRole === 'reviewer' ? 0.06 : 0;
    let reasonQuality = clamp(
      agent.truth * 0.36 +
      agent.processCompliance * 0.2 +
      suspicionValue * 0.22 +
      (1 - agent.conformity) * 0.1 +
      roleWeight -
      (agent.alignment === 'saboteur' ? agent.deception * 0.1 : 0)
    );
    let shouldRaiseConcern = suspicionValue >= state.config.threshold - 0.12 && reasonQuality >= 0.3;
    let isBlocking = suspicionValue >= state.config.threshold && reasonQuality >= Math.max(0.34, agent.objection * 0.72);

    if (!shouldRaiseConcern && ['Manipulator', 'Saboteur'].includes(agent.archetype) && state.random() < 0.35) {
      const targets = activeAgents(state).filter(candidate => candidate.id !== agent.id);
      if (targets.length) {
        targetId = pick(state.random, targets).id;
        suspicionValue = Math.max(suspicionValue, state.config.threshold - 0.1);
        reasonQuality = clamp(reasonQuality - 0.16 + state.random() * 0.08);
        shouldRaiseConcern = true;
        isBlocking = suspicionValue >= state.config.threshold && reasonQuality >= 0.28;
      }
    }

    if (shouldRaiseConcern) {
      if (!signalsByTarget[targetId]) signalsByTarget[targetId] = [];
      const supportWeight = clamp(reasonQuality * (0.6 + agent.epistemic * 0.25 + agent.processCompliance * 0.15));
      const signal = {
        accuserId: agent.id,
        targetId,
        reasonQuality,
        supportWeight,
        isBlocking,
        role: agent.currentRole
      };
      signalsByTarget[targetId].push(signal);
      recordAccusationLedger(state, agent.id, targetId);
      agent.accusationsMade += 1;
      pushEvent(
        state,
        state.round,
        'deliberation',
        isBlocking ? 'blocking_objection' : 'concern',
        `${agent.name} raises ${isBlocking ? 'a blocking objection' : 'a concern'} about ${state.agents[targetId].name} with signal strength ${reasonQuality.toFixed(2)}.`,
        options
      );
    }
  });

  state.lastParticipationRate = roundParticipants / Math.max(activeAgents(state).length, 1);
  const localOutcome = processLocalGovernance(state, signalsByTarget, options);
  const reviewOutcome = state.config.model === 'hybrid'
    ? runFederationReview(state, localOutcome.escalations, options)
    : { sanctioned: [], captureFlaggedAccusers: new Set() };
  const sanctionedTargets = [
    ...localOutcome.sanctioned.map(target => ({ target, dueProcess: 0.5, cliqueRisk: 0, reviewConfidence: 0.5 })),
    ...reviewOutcome.sanctioned
  ];

  sanctionedTargets.forEach(outcome => {
    const target = outcome.target;
    state.totalSanctions += 1;
    if (target.alignment === 'saboteur') {
      state.trueSanctions += 1;
      state.legitimacy = clamp(state.legitimacy + state.config.trueSanctionReward);
    } else {
      state.falseSanctions += 1;
      state.legitimacy = clamp(state.legitimacy - state.config.falseSanctionDamage);
    }
  });

  applyAppeals(state, sanctionedTargets, options);
  updateReputation(state, signalsByTarget, reviewOutcome.captureFlaggedAccusers);
  tickGovernanceState(state);

  if (activeSaboteurs(state).length >= Math.max(1, Math.floor(activeAgents(state).length / 3))) {
    state.legitimacy = clamp(state.legitimacy - state.config.capturePenalty);
  }

  determineOutcome(state, options);
  state.timeline.push(state.legitimacy);
  return state;
}

function runSimulation(config, options = {}) {
  const state = initializeState(config, options);
  while (!state.outcome && state.round < config.roundLimit) {
    stepState(state, options);
  }
  if (!state.outcome) determineOutcome(state, options);
  return state;
}

function summarizeState(state) {
  return {
    outcome: state.outcome,
    legitimacy: state.legitimacy,
    rounds: state.round,
    trueSanctions: state.trueSanctions,
    falseSanctions: state.falseSanctions,
    successfulAppeals: state.successfulAppeals,
    activeSaboteurs: activeSaboteurs(state).length,
    participation: state.lastParticipationRate,
    objections: state.governanceStats.totalObjections,
    escalations: state.governanceStats.totalEscalations,
    captureAlerts: state.governanceStats.totalCaptureAlerts,
    probations: state.governanceStats.totalProbations
  };
}

function summarizeBatch(states) {
  const count = Math.max(states.length, 1);
  const totals = {
    cooperators: 0,
    contested: 0,
    systemFailure: 0,
    legitimacy: 0,
    rounds: 0,
    falseSanctions: 0,
    trueSanctions: 0,
    appeals: 0,
    objections: 0,
    escalations: 0,
    captureAlerts: 0,
    probations: 0
  };

  states.forEach(state => {
    if (state.outcome === 'cooperators') totals.cooperators += 1;
    if (state.outcome === 'contested') totals.contested += 1;
    if (state.outcome === 'system_failure') totals.systemFailure += 1;
    totals.legitimacy += state.legitimacy;
    totals.rounds += state.round;
    totals.falseSanctions += state.falseSanctions;
    totals.trueSanctions += state.trueSanctions;
    totals.appeals += state.successfulAppeals;
    totals.objections += state.governanceStats.totalObjections;
    totals.escalations += state.governanceStats.totalEscalations;
    totals.captureAlerts += state.governanceStats.totalCaptureAlerts;
    totals.probations += state.governanceStats.totalProbations;
  });

  const successRate = totals.cooperators / count;
  const failureRate = totals.systemFailure / count;
  const legitimacyAvg = totals.legitimacy / count;
  const falseSanctionsAvg = totals.falseSanctions / count;
  const viabilityScore = successRate * 0.6 + legitimacyAvg * 0.35 - falseSanctionsAvg * 0.08 - failureRate * 0.25;

  return {
    runs: states.length,
    successRate,
    contestedRate: totals.contested / count,
    failureRate,
    avgLegitimacy: legitimacyAvg,
    avgRounds: totals.rounds / count,
    avgFalseSanctions: falseSanctionsAvg,
    avgTrueSanctions: totals.trueSanctions / count,
    avgAppeals: totals.appeals / count,
    avgObjections: totals.objections / count,
    avgEscalations: totals.escalations / count,
    avgCaptureAlerts: totals.captureAlerts / count,
    avgProbations: totals.probations / count,
    viabilityScore
  };
}

function buildConfigFromInputs() {
  return {
    name: dom.experimentName.value.trim() || PRESETS[dom.preset.value]?.label || 'Custom',
    model: dom.model.value,
    agents: Number(dom.agents.value),
    circles: Number(dom.circles.value),
    infiltrators: Number(dom.infiltrators.value),
    seed: Number(dom.seed.value),
    roundLimit: Number(dom.roundLimit.value),
    threshold: Number(dom.threshold.value),
    legitimacy: Number(dom.startingLegitimacy.value),
    sabotageDamage: Number(dom.sabotageDamage.value),
    falseSanctionDamage: Number(dom.falseSanction.value),
    trueSanctionReward: Number(dom.trueSanction.value),
    participationNoise: Number(dom.participationNoise.value),
    reviewSupport: Number(dom.reviewSupport.value),
    reviewQuorum: Number(dom.reviewQuorum.value),
    legitimacyFloor: Number(dom.legitimacyFloor.value),
    capturePenalty: Number(dom.capturePenalty.value)
  };
}

function collectUiConfig() {
  return {
    preset: dom.preset.value,
    experimentName: dom.experimentName.value.trim(),
    config: buildConfigFromInputs(),
    batchRuns: Number(dom.batchRuns.value),
    sweep: {
      variable: dom.sweepVariable.value,
      min: Number(dom.sweepMin.value),
      max: Number(dom.sweepMax.value),
      step: Number(dom.sweepStep.value)
    },
    heatmap: {
      x: dom.heatmapX.value,
      y: dom.heatmapY.value,
      steps: Number(dom.heatmapSteps.value),
      model: dom.heatmapModel.value
    }
  };
}

function applyUiConfig(payload) {
  if (!payload) return;
  if (payload.preset && PRESETS[payload.preset]) {
    dom.preset.value = payload.preset;
  }
  if (payload.experimentName !== undefined) {
    dom.experimentName.value = payload.experimentName;
  }
  const config = payload.config || {};
  if (config.model) dom.model.value = config.model;
  if (config.agents !== undefined) dom.agents.value = config.agents;
  if (config.circles !== undefined) dom.circles.value = config.circles;
  if (config.infiltrators !== undefined) dom.infiltrators.value = config.infiltrators;
  if (config.seed !== undefined) dom.seed.value = config.seed;
  if (config.roundLimit !== undefined) dom.roundLimit.value = config.roundLimit;
  if (config.threshold !== undefined) dom.threshold.value = config.threshold;
  if (config.sabotageDamage !== undefined) dom.sabotageDamage.value = config.sabotageDamage;
  if (config.falseSanctionDamage !== undefined) dom.falseSanction.value = config.falseSanctionDamage;
  if (config.trueSanctionReward !== undefined) dom.trueSanction.value = config.trueSanctionReward;
  if (config.participationNoise !== undefined) dom.participationNoise.value = config.participationNoise;
  if (config.reviewSupport !== undefined) dom.reviewSupport.value = config.reviewSupport;
  if (config.reviewQuorum !== undefined) dom.reviewQuorum.value = config.reviewQuorum;
  if (config.legitimacy !== undefined) dom.startingLegitimacy.value = config.legitimacy;
  if (config.legitimacyFloor !== undefined) dom.legitimacyFloor.value = config.legitimacyFloor;
  if (config.capturePenalty !== undefined) dom.capturePenalty.value = config.capturePenalty;
  if (payload.batchRuns !== undefined) dom.batchRuns.value = payload.batchRuns;
  if (payload.sweep) {
    if (payload.sweep.variable) dom.sweepVariable.value = payload.sweep.variable;
    if (payload.sweep.min !== undefined) dom.sweepMin.value = payload.sweep.min;
    if (payload.sweep.max !== undefined) dom.sweepMax.value = payload.sweep.max;
    if (payload.sweep.step !== undefined) dom.sweepStep.value = payload.sweep.step;
  }
  if (payload.heatmap) {
    if (payload.heatmap.x) dom.heatmapX.value = payload.heatmap.x;
    if (payload.heatmap.y) dom.heatmapY.value = payload.heatmap.y;
    if (payload.heatmap.steps !== undefined) dom.heatmapSteps.value = payload.heatmap.steps;
    if (payload.heatmap.model) dom.heatmapModel.value = payload.heatmap.model;
  }
  syncRangeOutputs();
}

function loadSavedConfigs() {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveSavedConfigs(items) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function refreshSavedConfigOptions() {
  const items = loadSavedConfigs();
  dom.savedConfigSelect.innerHTML = '';
  if (!items.length) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'No saved configurations';
    dom.savedConfigSelect.append(option);
    return;
  }
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.name;
    dom.savedConfigSelect.append(option);
  });
}

function saveCurrentConfiguration() {
  const items = loadSavedConfigs();
  const name = dom.experimentName.value.trim() || `Experiment ${items.length + 1}`;
  const payload = collectUiConfig();
  const entry = {
    id: `${Date.now()}`,
    name,
    savedAt: new Date().toISOString(),
    payload
  };
  items.push(entry);
  saveSavedConfigs(items);
  refreshSavedConfigOptions();
  dom.savedConfigSelect.value = entry.id;
  dom.labStatus.textContent = `Saved configuration: ${name}`;
}

function loadSelectedConfiguration() {
  const items = loadSavedConfigs();
  const selected = items.find(item => item.id === dom.savedConfigSelect.value);
  if (!selected) {
    dom.labStatus.textContent = 'No saved configuration selected';
    return;
  }
  applyUiConfig(selected.payload);
  initializeViewer();
  dom.labStatus.textContent = `Loaded configuration: ${selected.name}`;
}

function deleteSelectedConfiguration() {
  const items = loadSavedConfigs();
  const nextItems = items.filter(item => item.id !== dom.savedConfigSelect.value);
  saveSavedConfigs(nextItems);
  refreshSavedConfigOptions();
  dom.labStatus.textContent = 'Deleted saved configuration';
}

function downloadTextFile(filename, text, mimeType) {
  const blob = new Blob([text], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function toCsv(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escapeCell = value => `"${String(value ?? '').replaceAll('"', '""')}"`;
  return [
    headers.map(escapeCell).join(','),
    ...rows.map(row => headers.map(header => escapeCell(row[header])).join(','))
  ].join('\n');
}

function exportLatestJson() {
  const payload = latestOutputs.heatmap || latestOutputs.sweep || latestOutputs.comparison || latestOutputs.currentAnalysis;
  if (!payload) {
    dom.labStatus.textContent = 'No analysis output to export';
    return;
  }
  const filename = `${(buildConfigFromInputs().name || 'experiment').replace(/\s+/g, '-').toLowerCase()}-analysis.json`;
  downloadTextFile(filename, JSON.stringify(payload, null, 2), 'application/json');
  dom.labStatus.textContent = `Exported ${filename}`;
}

function exportLatestCsv() {
  let rows = [];
  let filename = 'analysis.csv';

  if (latestOutputs.heatmap) {
    rows = latestOutputs.heatmap.cells.map(cell => ({
      x_variable: latestOutputs.heatmap.xKey,
      x_value: cell.x,
      y_variable: latestOutputs.heatmap.yKey,
      y_value: cell.y,
      success_rate: cell.summary.successRate,
      failure_rate: cell.summary.failureRate,
      avg_legitimacy: cell.summary.avgLegitimacy,
      avg_false_sanctions: cell.summary.avgFalseSanctions,
      avg_objections: cell.summary.avgObjections,
      avg_escalations: cell.summary.avgEscalations,
      avg_capture_alerts: cell.summary.avgCaptureAlerts,
      avg_probations: cell.summary.avgProbations,
      viability_score: cell.summary.viabilityScore
    }));
    filename = 'heatmap-results.csv';
  } else if (latestOutputs.sweep) {
    rows = latestOutputs.sweep.results.map(result => ({
      variable: latestOutputs.sweep.variableKey,
      value: result.value,
      success_rate: result.summary.successRate,
      failure_rate: result.summary.failureRate,
      avg_legitimacy: result.summary.avgLegitimacy,
      avg_false_sanctions: result.summary.avgFalseSanctions,
      avg_objections: result.summary.avgObjections,
      avg_escalations: result.summary.avgEscalations,
      avg_capture_alerts: result.summary.avgCaptureAlerts,
      avg_probations: result.summary.avgProbations,
      viability_score: result.summary.viabilityScore
    }));
    filename = 'sweep-results.csv';
  } else if (latestOutputs.comparison) {
    rows = latestOutputs.comparison.rows.map(row => ({
      model: row.model,
      success_rate: row.summary.successRate,
      failure_rate: row.summary.failureRate,
      avg_legitimacy: row.summary.avgLegitimacy,
      avg_false_sanctions: row.summary.avgFalseSanctions,
      avg_objections: row.summary.avgObjections,
      avg_escalations: row.summary.avgEscalations,
      avg_capture_alerts: row.summary.avgCaptureAlerts,
      avg_probations: row.summary.avgProbations,
      viability_score: row.summary.viabilityScore
    }));
    filename = 'model-comparison.csv';
  } else if (latestOutputs.currentAnalysis) {
    const summary = latestOutputs.currentAnalysis.summary;
    rows = [{
      model: latestOutputs.currentAnalysis.model,
      success_rate: summary.successRate,
      failure_rate: summary.failureRate,
      avg_legitimacy: summary.avgLegitimacy,
      avg_false_sanctions: summary.avgFalseSanctions,
      avg_true_sanctions: summary.avgTrueSanctions,
      avg_objections: summary.avgObjections,
      avg_escalations: summary.avgEscalations,
      avg_capture_alerts: summary.avgCaptureAlerts,
      avg_probations: summary.avgProbations,
      viability_score: summary.viabilityScore
    }];
    filename = 'analysis-summary.csv';
  }

  if (!rows.length) {
    dom.labStatus.textContent = 'No analysis output to export';
    return;
  }

  downloadTextFile(filename, toCsv(rows), 'text/csv;charset=utf-8');
  dom.labStatus.textContent = `Exported ${filename}`;
}

function populatePresets() {
  Object.entries(PRESETS).forEach(([key, preset]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = preset.label;
    dom.preset.append(option);
  });
  dom.preset.value = 'hybrid_infiltration';
}

function populateSweepVariables() {
  Object.entries(SWEEP_VARIABLES).forEach(([key, meta]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = meta.label;
    dom.sweepVariable.append(option);
    dom.heatmapX.append(option.cloneNode(true));
    dom.heatmapY.append(option.cloneNode(true));
  });
  dom.sweepVariable.value = 'threshold';
  dom.heatmapX.value = 'threshold';
  dom.heatmapY.value = 'sabotageDamage';
}

function applySweepVariableDefaults(key) {
  const meta = SWEEP_VARIABLES[key];
  if (!meta) return;
  dom.sweepMin.value = meta.min;
  dom.sweepMax.value = meta.max;
  dom.sweepStep.value = meta.step;
}

function applyPreset(key) {
  const preset = PRESETS[key];
  if (!preset) return;
  dom.model.value = preset.model;
  dom.agents.value = preset.agents;
  dom.circles.value = preset.circles;
  dom.infiltrators.value = preset.infiltrators;
  dom.seed.value = preset.seed;
  dom.roundLimit.value = preset.roundLimit;
  dom.threshold.value = preset.threshold;
  dom.sabotageDamage.value = preset.sabotageDamage;
  dom.falseSanction.value = preset.falseSanctionDamage;
  dom.trueSanction.value = preset.trueSanctionReward;
  dom.participationNoise.value = preset.participationNoise;
  dom.reviewSupport.value = preset.reviewSupport;
  dom.reviewQuorum.value = preset.reviewQuorum;
  dom.startingLegitimacy.value = preset.legitimacy;
  dom.legitimacyFloor.value = preset.legitimacyFloor;
  dom.capturePenalty.value = preset.capturePenalty;
  syncRangeOutputs();
}

function syncRangeOutputs() {
  dom.thresholdOutput.textContent = Number(dom.threshold.value).toFixed(2);
  dom.sabotageDamageOutput.textContent = Number(dom.sabotageDamage.value).toFixed(2);
  dom.falseSanctionOutput.textContent = Number(dom.falseSanction.value).toFixed(2);
  dom.trueSanctionOutput.textContent = Number(dom.trueSanction.value).toFixed(2);
  dom.participationNoiseOutput.textContent = Number(dom.participationNoise.value).toFixed(2);
  dom.reviewSupportOutput.textContent = Number(dom.reviewSupport.value).toFixed(2);
  dom.reviewQuorumOutput.textContent = Number(dom.reviewQuorum.value).toFixed(2);
  dom.startingLegitimacyOutput.textContent = Number(dom.startingLegitimacy.value).toFixed(2);
  dom.legitimacyFloorOutput.textContent = Number(dom.legitimacyFloor.value).toFixed(2);
  dom.capturePenaltyOutput.textContent = Number(dom.capturePenalty.value).toFixed(3);
}

function initializeViewer() {
  stopAutoplay();
  const config = buildConfigFromInputs();
  sim = initializeState(config, { captureLog: true });
  dom.labStatus.textContent = 'Viewer initialized';
  dom.federationMode.textContent = MODEL_LABELS[config.model];
  dom.resultBanner.hidden = true;
  renderViewer();
}

function renderTimeline() {
  dom.timelineChart.innerHTML = '';
  if (!sim) return;
  sim.timeline.forEach((value, index) => {
    const bar = document.createElement('div');
    bar.className = 'timeline-bar';
    bar.style.height = `${Math.max(6, value * 160)}px`;
    bar.dataset.round = index;
    bar.title = `Round ${index}: legitimacy ${value.toFixed(2)}`;
    dom.timelineChart.append(bar);
  });
}

function circleStats() {
  if (!sim) return [];
  return Array.from({ length: sim.config.circles }, (_, circleIndex) => {
    const members = sim.agents.filter(agent => agent.circleId === circleIndex);
    const activeCount = members.filter(agent => agent.sanctions <= 0).length;
    const circleState = sim.circleStates[circleIndex];

    return {
      name: `Circle ${circleIndex + 1}`,
      members: members.length,
      activeCount,
      tension: circleState.tension,
      escalations: circleState.escalations
    };
  });
}

function renderCircles() {
  dom.circleGrid.innerHTML = '';
  circleStats().forEach(circle => {
    const card = document.createElement('article');
    card.className = 'circle-card';
    card.innerHTML = `
      <div class="circle-name">${circle.name}</div>
      <div class="circle-metrics">
        <div class="circle-stat">
          <div class="circle-stat-value">${circle.members}</div>
          <div class="circle-stat-label">members</div>
        </div>
        <div class="circle-stat">
          <div class="circle-stat-value">${circle.activeCount}</div>
          <div class="circle-stat-label">active</div>
        </div>
        <div class="circle-stat">
          <div class="circle-stat-value">${circle.tension.toFixed(2)}</div>
          <div class="circle-stat-label">tension</div>
        </div>
        <div class="circle-stat">
          <div class="circle-stat-value">${circle.escalations}</div>
          <div class="circle-stat-label">escalations</div>
        </div>
      </div>
    `;
    dom.circleGrid.append(card);
  });
}

function renderAgents() {
  dom.agentGrid.innerHTML = '';
  if (!sim) return;
  const reveal = dom.reveal.checked;

  sim.agents.forEach(agent => {
    const suspicionValues = Object.values(agent.suspicion);
    const topSuspicion = suspicionValues.length ? Math.max(...suspicionValues) : 0;
    const card = document.createElement('article');
    const isSaboteur = reveal && agent.alignment === 'saboteur';
    const isTrusted = agent.integrityBand === 'trusted';
    card.className = `agent-card ${isSaboteur ? 'is-saboteur' : ''} ${isTrusted ? 'is-trusted' : ''}`;
    card.innerHTML = `
      <div class="agent-top">
        <div>
          <div class="agent-name">${agent.name}</div>
          <div class="agent-tags">
            <span class="agent-tag">Circle ${agent.circleId + 1}</span>
            <span class="agent-tag">${agent.archetype}</span>
            <span class="agent-tag">${agent.currentRole}</span>
            ${reveal ? `<span class="agent-tag">${agent.alignment}</span>` : ''}
          </div>
        </div>
        <div class="agent-band">${agent.integrityBand}</div>
      </div>
      <div class="agent-stats">
        <div class="agent-stat">
          <div class="agent-stat-label">Influence</div>
          <div class="agent-stat-value">${agent.influence.toFixed(2)}</div>
        </div>
        <div class="agent-stat">
          <div class="agent-stat-label">Compliance</div>
          <div class="agent-stat-value">${agent.processCompliance.toFixed(2)}</div>
        </div>
        <div class="agent-stat">
          <div class="agent-stat-label">Epistemic</div>
          <div class="agent-stat-value">${agent.epistemic.toFixed(2)}</div>
        </div>
        <div class="agent-stat">
          <div class="agent-stat-label">Local Flags</div>
          <div class="agent-stat-value">${agent.localFlags.toFixed(1)}</div>
        </div>
        <div class="agent-stat">
          <div class="agent-stat-label">Concern / Objection</div>
          <div class="agent-stat-value">${agent.concernCount} / ${agent.objectionCount}</div>
        </div>
        <div class="agent-stat">
          <div class="agent-stat-label">Status</div>
          <div class="agent-stat-value">${
            agent.sanctions > 0
              ? `restricted ${agent.sanctions}`
              : agent.probationRounds > 0
                ? `probation ${agent.probationRounds}`
                : `active · s${topSuspicion.toFixed(2)}`
          }</div>
        </div>
      </div>
    `;
    dom.agentGrid.append(card);
  });
}

function renderEvents() {
  dom.eventLog.innerHTML = '';
  if (!sim) return;
  sim.events.forEach(event => {
    const item = document.createElement('article');
    item.className = 'log-item';
    item.innerHTML = `
      <div class="log-meta">
        <span>Round ${event.round}</span>
        <span>${event.phase}</span>
        <span>${event.action.replaceAll('_', ' ')}</span>
      </div>
      <div class="log-text">${event.text}</div>
    `;
    dom.eventLog.append(item);
  });
}

function renderViewerMetrics() {
  if (!sim) return;
  const roundStats = sim.governanceStats.lastRound;
  dom.metricRound.textContent = String(sim.round);
  dom.metricPhase.textContent = sim.outcome
    ? `ended: ${sim.outcome}`
    : `${roundStats.concerns} concerns · ${roundStats.objections} objections · ${roundStats.escalations} escalations`;
  dom.metricLegitimacy.textContent = sim.legitimacy.toFixed(2);
  dom.metricSaboteurs.textContent = String(activeSaboteurs(sim).length);
  dom.metricSanctions.textContent = String(sim.totalSanctions);
  dom.metricParticipation.textContent = `${Math.round(sim.lastParticipationRate * 100)}%`;
  dom.federationMode.textContent = MODEL_LABELS[sim.config.model];
  dom.labStatus.textContent = sim.outcome ? `Viewer ended: ${sim.outcome}` : `Viewer active: round ${sim.round}`;

  if (sim.outcome) {
    const descriptions = {
      cooperators: 'Cooperators neutralized the active saboteurs before legitimacy collapsed.',
      contested: 'The round limit was reached with unresolved adversarial pressure still active.',
      system_failure: 'Legitimacy collapsed before governance could contain sabotage.'
    };
    dom.resultBanner.hidden = false;
    dom.resultBanner.innerHTML = `<strong>${sim.outcome.replace('_', ' ')}</strong><br>${descriptions[sim.outcome]}`;
  } else {
    dom.resultBanner.hidden = true;
  }
}

function renderViewer() {
  if (!sim) return;
  renderViewerMetrics();
  renderTimeline();
  renderCircles();
  renderAgents();
  renderEvents();
}

function resetViewer() {
  stopAutoplay();
  sim = null;
  dom.labStatus.textContent = 'Lab ready';
  dom.federationMode.textContent = 'No active simulation';
  dom.metricRound.textContent = '0';
  dom.metricPhase.textContent = 'waiting to initialize';
  dom.metricLegitimacy.textContent = '0.00';
  dom.metricSaboteurs.textContent = '0';
  dom.metricSanctions.textContent = '0';
  dom.metricParticipation.textContent = '0%';
  dom.timelineChart.innerHTML = '';
  dom.circleGrid.innerHTML = '';
  dom.agentGrid.innerHTML = '';
  dom.eventLog.innerHTML = '';
  dom.resultBanner.hidden = true;
}

function stopAutoplay() {
  if (autoplayTimer) {
    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
    dom.autoplay.textContent = 'Autoplay';
  }
}

function stepViewer() {
  if (!sim) initializeViewer();
  if (!sim || sim.outcome) return;
  stepState(sim, { captureLog: true });
  renderViewer();
}

function toggleAutoplay() {
  if (!sim) initializeViewer();
  if (autoplayTimer) {
    stopAutoplay();
    return;
  }

  dom.autoplay.textContent = 'Pause';
  autoplayTimer = window.setInterval(() => {
    if (!sim || sim.outcome) {
      stopAutoplay();
      return;
    }
    stepViewer();
  }, 800);
}

function setOutcomeBars(summary) {
  const cooperators = summary.successRate * 100;
  const contested = summary.contestedRate * 100;
  const failure = summary.failureRate * 100;
  dom.barCooperators.style.width = `${cooperators}%`;
  dom.barCooperatorsValue.textContent = `${cooperators.toFixed(1)}%`;
  dom.barContested.style.width = `${contested}%`;
  dom.barContestedValue.textContent = `${contested.toFixed(1)}%`;
  dom.barFailure.style.width = `${failure}%`;
  dom.barFailureValue.textContent = `${failure.toFixed(1)}%`;
}

function renderComparisonRows(rows) {
  dom.compareBody.innerHTML = '';
  rows.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${MODEL_LABELS[row.model]}</strong></td>
      <td>${(row.summary.successRate * 100).toFixed(1)}%</td>
      <td>${row.summary.avgLegitimacy.toFixed(2)}</td>
      <td>${row.summary.avgFalseSanctions.toFixed(2)}</td>
      <td>${row.summary.avgRounds.toFixed(1)}</td>
    `;
    dom.compareBody.append(tr);
  });
}

function renderSweepResults(results) {
  dom.sweepBody.innerHTML = '';
  dom.sweepChart.innerHTML = '';

  if (!results.length) {
    dom.sweepBody.innerHTML = '<tr><td colspan="5">No sweep results.</td></tr>';
    return;
  }

  const best = results[0];
  const maxScore = Math.max(...results.map(result => result.summary.viabilityScore), 0.001);
  dom.sweepBestValue.textContent = `${best.value}`;
  dom.sweepBestSuccess.textContent = `${(best.summary.successRate * 100).toFixed(1)}%`;
  dom.sweepBestScore.textContent = best.summary.viabilityScore.toFixed(3);

  results.forEach(result => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${result.value}</strong></td>
      <td>${(result.summary.successRate * 100).toFixed(1)}%</td>
      <td>${result.summary.avgLegitimacy.toFixed(2)}</td>
      <td>${(result.summary.failureRate * 100).toFixed(1)}%</td>
      <td>${result.summary.viabilityScore.toFixed(3)}</td>
    `;
    dom.sweepBody.append(tr);

    const row = document.createElement('div');
    row.className = 'sweep-row';
    const width = Math.max(2, (result.summary.viabilityScore / maxScore) * 100);
    row.innerHTML = `
      <div class="sweep-label">${result.value}</div>
      <div class="sweep-bar-track"><div class="sweep-bar-fill" style="width:${width}%"></div></div>
      <div class="sweep-metric">${(result.summary.successRate * 100).toFixed(0)}%</div>
      <div class="sweep-metric">${result.summary.viabilityScore.toFixed(2)}</div>
    `;
    dom.sweepChart.append(row);
  });
}

function generateLinspace(min, max, steps) {
  if (steps <= 1) return [min];
  const values = [];
  const increment = (max - min) / (steps - 1);
  for (let index = 0; index < steps; index += 1) {
    values.push(min + increment * index);
  }
  return values;
}

function formatSweepValue(value) {
  const rounded = Number(value);
  if (Math.abs(rounded - Math.round(rounded)) < 1e-9) return String(Math.round(rounded));
  if (Math.abs(rounded) < 0.1) return rounded.toFixed(3).replace(/0+$/, '').replace(/\.$/, '');
  return rounded.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

function getHeatColor(score, minScore, maxScore) {
  const normalized = maxScore === minScore ? 0.5 : (score - minScore) / (maxScore - minScore);
  const hue = 8 + normalized * 122;
  const saturation = 55 + normalized * 15;
  const lightness = 28 + normalized * 18;
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

function renderHeatmap(result) {
  dom.heatmapGrid.innerHTML = '';
  if (!result || !result.cells.length) return;

  const xValues = result.xValues;
  const yValues = result.yValues;
  const scores = result.cells.map(cell => cell.summary.viabilityScore);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);

  dom.heatmapGrid.style.gridTemplateColumns = `repeat(${xValues.length + 1}, minmax(68px, auto))`;

  const corner = document.createElement('div');
  corner.className = 'heatmap-corner';
  corner.textContent = 'Y / X';
  dom.heatmapGrid.append(corner);

  xValues.forEach(value => {
    const axis = document.createElement('div');
    axis.className = 'heatmap-axis';
    axis.textContent = formatSweepValue(value);
    dom.heatmapGrid.append(axis);
  });

  yValues.forEach(yValue => {
    const yAxis = document.createElement('div');
    yAxis.className = 'heatmap-axis';
    yAxis.textContent = formatSweepValue(yValue);
    dom.heatmapGrid.append(yAxis);

    xValues.forEach(xValue => {
      const cell = result.cells.find(entry => entry.x === xValue && entry.y === yValue);
      const cellDiv = document.createElement('div');
      cellDiv.className = 'heatmap-cell';
      cellDiv.style.background = getHeatColor(cell.summary.viabilityScore, minScore, maxScore);
      cellDiv.title = `x=${formatSweepValue(xValue)}, y=${formatSweepValue(yValue)}, success=${(cell.summary.successRate * 100).toFixed(1)}%, legitimacy=${cell.summary.avgLegitimacy.toFixed(2)}, viability=${cell.summary.viabilityScore.toFixed(3)}`;
      cellDiv.innerHTML = `
        <strong>${cell.summary.viabilityScore.toFixed(2)}</strong>
        <span>${(cell.summary.successRate * 100).toFixed(0)}%</span>
      `;
      dom.heatmapGrid.append(cellDiv);
    });
  });

  const best = result.best;
  dom.heatmapBestX.textContent = formatSweepValue(best.x);
  dom.heatmapBestY.textContent = formatSweepValue(best.y);
  dom.heatmapBestScore.textContent = best.summary.viabilityScore.toFixed(3);
}

function runBatchForModel(config, model, runCount) {
  const states = [];
  for (let index = 0; index < runCount; index += 1) {
    const state = runSimulation({ ...config, model, seed: config.seed + index * 17 }, { captureLog: false });
    states.push(state);
  }
  return { model, states, summary: summarizeBatch(states) };
}

function analyzeCurrentModel() {
  const baseConfig = buildConfigFromInputs();
  const runCount = Number(dom.batchRuns.value);
  const result = runBatchForModel(baseConfig, baseConfig.model, runCount);
  const summary = result.summary;
  latestOutputs.currentAnalysis = {
    type: 'currentAnalysis',
    generatedAt: new Date().toISOString(),
    config: baseConfig,
    runs: runCount,
    model: result.model,
    summary
  };
  latestOutputs.comparison = null;
  latestOutputs.sweep = null;
  latestOutputs.heatmap = null;

  dom.analysisRuns.textContent = String(summary.runs);
  dom.analysisSuccessRate.textContent = `${(summary.successRate * 100).toFixed(1)}%`;
  dom.analysisLegitimacy.textContent = summary.avgLegitimacy.toFixed(2);
  dom.analysisBestModel.textContent = MODEL_LABELS[result.model];
  setOutcomeBars(summary);
  renderComparisonRows([result]);
  dom.labStatus.textContent = `Analysis complete: ${MODEL_LABELS[result.model]}`;
}

function compareAllModels() {
  const baseConfig = buildConfigFromInputs();
  const runCount = Number(dom.batchRuns.value);
  const models = ['baseline', 'sociocracy', 'hybrid'];
  const rows = models.map(model => runBatchForModel(baseConfig, model, runCount));
  rows.sort((a, b) => b.summary.viabilityScore - a.summary.viabilityScore);
  latestOutputs.currentAnalysis = null;
  latestOutputs.comparison = {
    type: 'comparison',
    generatedAt: new Date().toISOString(),
    config: baseConfig,
    runs: runCount,
    rows
  };
  latestOutputs.sweep = null;
  latestOutputs.heatmap = null;

  const best = rows[0];
  dom.analysisRuns.textContent = String(runCount);
  dom.analysisSuccessRate.textContent = `${(best.summary.successRate * 100).toFixed(1)}%`;
  dom.analysisLegitimacy.textContent = best.summary.avgLegitimacy.toFixed(2);
  dom.analysisBestModel.textContent = MODEL_LABELS[best.model];
  setOutcomeBars(best.summary);
  renderComparisonRows(rows);
  dom.labStatus.textContent = `Comparison complete: ${MODEL_LABELS[best.model]} leads`;
}

function generateSweepValues(min, max, step) {
  const values = [];
  const precision = Math.max(
    (String(step).split('.')[1] || '').length,
    (String(min).split('.')[1] || '').length,
    (String(max).split('.')[1] || '').length
  );
  const factor = 10 ** precision;
  let current = Math.round(min * factor);
  const final = Math.round(max * factor);
  const increment = Math.max(1, Math.round(step * factor));

  while (current <= final) {
    values.push((current / factor).toFixed(precision).replace(/\.?0+$/, ''));
    current += increment;
  }
  return values;
}

function runParameterSweep() {
  const baseConfig = buildConfigFromInputs();
  const runCount = Number(dom.batchRuns.value);
  const variableKey = dom.sweepVariable.value;
  const min = Number(dom.sweepMin.value);
  const max = Number(dom.sweepMax.value);
  const step = Number(dom.sweepStep.value);

  if (!SWEEP_VARIABLES[variableKey] || step <= 0 || max < min) {
    dom.labStatus.textContent = 'Sweep configuration invalid';
    return;
  }

  const values = generateSweepValues(min, max, step);
  const results = values.map((valueText, index) => {
    const parsedValue = Number(valueText);
    const config = { ...baseConfig, [variableKey]: parsedValue, seed: baseConfig.seed + index * 101 };
    const result = runBatchForModel(config, baseConfig.model, runCount);
    return {
      value: valueText,
      summary: result.summary
    };
  });

  results.sort((a, b) => b.summary.viabilityScore - a.summary.viabilityScore);
  latestOutputs.currentAnalysis = null;
  latestOutputs.comparison = null;
  latestOutputs.sweep = {
    type: 'sweep',
    generatedAt: new Date().toISOString(),
    config: baseConfig,
    runs: runCount,
    variableKey,
    results
  };
  latestOutputs.heatmap = null;
  renderSweepResults(results);
  dom.labStatus.textContent = `Sweep complete: ${SWEEP_VARIABLES[variableKey].label}`;
}

function runHeatmapSweep() {
  const baseConfig = buildConfigFromInputs();
  const runCount = Number(dom.batchRuns.value);
  const xKey = dom.heatmapX.value;
  const yKey = dom.heatmapY.value;
  const steps = Number(dom.heatmapSteps.value);
  const model = dom.heatmapModel.value;

  if (!SWEEP_VARIABLES[xKey] || !SWEEP_VARIABLES[yKey] || xKey === yKey || steps < 2) {
    dom.labStatus.textContent = '2D sweep configuration invalid';
    return;
  }

  const xMeta = SWEEP_VARIABLES[xKey];
  const yMeta = SWEEP_VARIABLES[yKey];
  const xValues = generateLinspace(xMeta.min, xMeta.max, steps);
  const yValues = generateLinspace(yMeta.min, yMeta.max, steps);
  const cells = [];

  yValues.forEach((yValue, yIndex) => {
    xValues.forEach((xValue, xIndex) => {
      const config = {
        ...baseConfig,
        model,
        [xKey]: xValue,
        [yKey]: yValue,
        seed: baseConfig.seed + yIndex * 1009 + xIndex * 131
      };
      const result = runBatchForModel(config, model, runCount);
      cells.push({
        x: xValue,
        y: yValue,
        summary: result.summary
      });
    });
  });

  cells.sort((a, b) => b.summary.viabilityScore - a.summary.viabilityScore);
  const payload = {
    type: 'heatmap',
    generatedAt: new Date().toISOString(),
    config: baseConfig,
    runs: runCount,
    xKey,
    yKey,
    xValues,
    yValues,
    cells,
    best: cells[0]
  };
  latestOutputs.currentAnalysis = null;
  latestOutputs.comparison = null;
  latestOutputs.sweep = null;
  latestOutputs.heatmap = payload;
  renderHeatmap(payload);
  dom.labStatus.textContent = `2D sweep complete: ${SWEEP_VARIABLES[xKey].label} vs ${SWEEP_VARIABLES[yKey].label}`;
}

function bindRangeOutputs() {
  [
    dom.threshold,
    dom.sabotageDamage,
    dom.falseSanction,
    dom.trueSanction,
    dom.participationNoise,
    dom.reviewSupport,
    dom.reviewQuorum,
    dom.startingLegitimacy,
    dom.legitimacyFloor,
    dom.capturePenalty
  ].forEach(input => input.addEventListener('input', syncRangeOutputs));
}

dom.preset.addEventListener('change', event => {
  applyPreset(event.target.value);
  initializeViewer();
});
dom.sweepVariable.addEventListener('change', event => applySweepVariableDefaults(event.target.value));
dom.initialize.addEventListener('click', initializeViewer);
dom.step.addEventListener('click', stepViewer);
dom.autoplay.addEventListener('click', toggleAutoplay);
dom.reset.addEventListener('click', resetViewer);
dom.reveal.addEventListener('change', renderViewer);
dom.analyzeCurrent.addEventListener('click', analyzeCurrentModel);
dom.compareModels.addEventListener('click', compareAllModels);
dom.runSweep.addEventListener('click', runParameterSweep);
dom.runHeatmap.addEventListener('click', runHeatmapSweep);
dom.saveConfig.addEventListener('click', saveCurrentConfiguration);
dom.loadConfig.addEventListener('click', loadSelectedConfiguration);
dom.deleteConfig.addEventListener('click', deleteSelectedConfiguration);
dom.exportJson.addEventListener('click', exportLatestJson);
dom.exportCsv.addEventListener('click', exportLatestCsv);

populatePresets();
populateSweepVariables();
bindRangeOutputs();
applyPreset('hybrid_infiltration');
applySweepVariableDefaults('threshold');
refreshSavedConfigOptions();
initializeViewer();
analyzeCurrentModel();
