const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

$$('[data-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const setScrollProgress = () => {
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
  doc.style.setProperty('--scroll-progress', `${Math.round(ratio * 100)}%`);
};

window.addEventListener('scroll', setScrollProgress, { passive: true });
window.addEventListener('resize', setScrollProgress);
setScrollProgress();

const ambient = document.querySelector('.ambient');
if (ambient && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener(
    'pointermove',
    (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 20;
      const y = (event.clientY / window.innerHeight - 0.5) * 20;
      ambient.style.setProperty('--ambient-x', `${x}px`);
      ambient.style.setProperty('--ambient-y', `${y}px`);
    },
    { passive: true }
  );
}

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.getElementById('site-nav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const next = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(next));
    siteNav.classList.toggle('open', next);
  });

  $$('.site-nav .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('open');
    });
  });
}

const revealTargets = $$('.reveal');
if (revealTargets.length > 0) {
  revealTargets.forEach((target, index) => {
    target.style.setProperty('--reveal-delay', `${Math.min((index % 7) * 55, 280)}ms`);
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
}

const simulator = document.getElementById('federation-simulator');
if (simulator) {
  const rangeInputs = $$('input[type="range"]', simulator);
  const federateScoreEl = document.getElementById('federate-score');
  const independentScoreEl = document.getElementById('independent-score');
  const federateBarEl = document.getElementById('federate-bar');
  const insightEl = document.getElementById('sim-insight');

  const clamp = (value) => Math.max(0, Math.min(100, Math.round(value)));

  const calculateScores = () => {
    const values = {};
    rangeInputs.forEach((input) => {
      const value = Number(input.value);
      values[input.name] = value;
      const output = simulator.querySelector(`[data-output="${input.name}"]`);
      if (output) output.textContent = String(value);
    });

    const federate = clamp(
      values.network * 2.6 +
        values.capital * 2.4 +
        values.resilience * 2.2 +
        values.credibility * 1.8 +
        (10 - values.autonomy) * 0.9
    );

    const independent = clamp(
      values.autonomy * 2.7 +
        values.network * 1.1 +
        values.capital * 1.1 +
        values.resilience * 0.8 +
        values.credibility * 0.7
    );

    if (federateScoreEl) federateScoreEl.textContent = String(federate);
    if (independentScoreEl) independentScoreEl.textContent = String(independent);
    if (federateBarEl) federateBarEl.style.width = `${federate}%`;

    if (insightEl) {
      if (federate - independent >= 12) {
        insightEl.textContent =
          'Federation wins decisively when network tools, capital multipliers, and resilience buffers are strong.';
      } else if (independent - federate >= 12) {
        insightEl.textContent =
          'Independence dominates if autonomy is high but federation services are weak. Improve shared infrastructure first.';
      } else {
        insightEl.textContent =
          'Close score. Keep pod autonomy clear while upgrading shared legal, financial, and operational support.';
      }
    }
  };

  rangeInputs.forEach((input) => input.addEventListener('input', calculateScores));
  calculateScores();
}

$$('.accordion-trigger').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.accordion-item');
    if (!item) return;

    const willOpen = !item.classList.contains('open');
    const container = item.closest('.accordion');
    if (container) {
      $$('.accordion-item', container).forEach((entry) => {
        entry.classList.remove('open');
        const trigger = entry.querySelector('.accordion-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }

    item.classList.toggle('open', willOpen);
    button.setAttribute('aria-expanded', String(willOpen));
  });
});

$$('[data-tab-group]').forEach((group) => {
  const buttons = $$('[data-tab]', group);
  const panels = $$('.tab-panel', group);

  const activate = (id) => {
    buttons.forEach((button) => {
      const active = button.dataset.tab === id;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });

    panels.forEach((panel) => {
      panel.classList.toggle('active', panel.dataset.panel === id);
    });
  };

  buttons.forEach((button) => {
    button.addEventListener('click', () => activate(button.dataset.tab));
  });

  const initial = buttons.find((button) => button.classList.contains('active'));
  if (initial) activate(initial.dataset.tab);
});

const joinForm = document.getElementById('join-form');
const joinEmail = document.getElementById('join-email');
const joinStatus = document.getElementById('join-status');

if (joinForm && joinEmail && joinStatus) {
  joinForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!joinEmail.validity.valid) {
      joinStatus.textContent = 'Enter a valid email to join the signal list.';
      joinStatus.style.color = '#b42318';
      return;
    }

    joinStatus.textContent = 'You are in. We will send build updates and pilot invitations.';
    joinStatus.style.color = '#0f766e';
    joinForm.reset();
  });
}

const applyForm = document.getElementById('apply-form');
const applyStatus = document.getElementById('apply-status');
if (applyForm && applyStatus) {
  applyForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const required = ['full_name', 'email', 'track'];
    const missing = required.some((name) => {
      const element = applyForm.elements.namedItem(name);
      return !element || !element.value || !String(element.value).trim();
    });

    if (missing) {
      applyStatus.textContent = 'Please complete name, email, and pathway.';
      applyStatus.style.color = '#b42318';
      return;
    }

    applyStatus.textContent =
      'Application draft captured. A human operator or AI concierge can route your next step.';
    applyStatus.style.color = '#0f766e';
    applyForm.reset();
  });
}

const botRoot = document.getElementById('navigator-bot');
if (botRoot) {
  const botLog = document.getElementById('bot-log');
  const botForm = document.getElementById('bot-form');
  const botInput = document.getElementById('bot-input');

  const appendMessage = (role, text) => {
    if (!botLog) return;
    const message = document.createElement('p');
    message.className = `bot-message ${role}`;
    message.textContent = text;
    botLog.appendChild(message);
    botLog.scrollTop = botLog.scrollHeight;
  };

  const generateReply = (text) => {
    const prompt = text.toLowerCase();

    if (prompt.includes('governance')) {
      return 'Start with pod-level authority on operations, then delegate only shared standards and dispute protocols to federation councils.';
    }
    if (prompt.includes('fund') || prompt.includes('capital')) {
      return 'Use a contribution ledger + matching pool. Pods that ship assets get preferred financing for second and third projects.';
    }
    if (prompt.includes('training')) {
      return 'Training centers should combine skill tracks, leadership drills, and rotating apprenticeships tied to real cooperative projects.';
    }
    if (prompt.includes('autonomy') || prompt.includes('exit')) {
      return 'Keep explicit exit rights, local ownership clarity, and reversible federation contracts to preserve voluntary participation.';
    }

    return 'Route this through the model layers: local pod incentives, federation multiplier services, and transparent accountability metrics.';
  };

  appendMessage(
    'bot',
    'Navigator online. Ask how governance, finance, and culture can coordinate without centralizing control.'
  );

  if (botForm && botInput) {
    botForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const text = botInput.value.trim();
      if (!text) return;

      appendMessage('user', text);
      botInput.value = '';

      window.setTimeout(() => {
        appendMessage('bot', generateReply(text));
      }, 280);
    });
  }

  $$('[data-bot-prompt]', botRoot).forEach((button) => {
    button.addEventListener('click', () => {
      const prompt = button.dataset.botPrompt;
      if (!prompt) return;

      appendMessage('user', prompt);
      window.setTimeout(() => {
        appendMessage('bot', generateReply(prompt));
      }, 260);
    });
  });
}
