/**
 * @file global.js
 * @description Application bootstrap for George Priji Promod's Evidence-Driven Engineering Portfolio.
 *
 * Responsibilities:
 * - Validates central portfolio data integrity on startup
 * - Initializes core UI modules independently with isolated try/catch boundaries
 * - Lazy-loads interactive project laboratories via dynamic ES module import()
 *   so invisible demonstrations are not initialized prematurely and any single
 *   lab failure never breaks the remaining portfolio.
 * - Handles accessible contact form fallback (local mailto preparation with validation).
 */

import { validatePortfolioData } from './modules/validation.js';
import { initTheme } from './modules/theme.js';
import { initNavigation } from './modules/navigation.js';
import { initProjects } from './modules/projects.js';
import { initKnowledgeGraph } from './modules/knowledge-graph.js';
import { initRecruiterBrief } from './modules/recruiter-brief.js';
import { initCommandPalette } from './modules/command-palette.js';
import { initTerminal } from './modules/terminal.js';

const LAB_LOADERS = Object.freeze({
  'lab-crack': async () => {
    const mod = await import('./labs/crack-lab.js');
    mod.initCrackLab();
  },
  'lab-gait': async () => {
    const mod = await import('./labs/gait-lab.js');
    mod.initGaitLab();
  },
  'lab-vulnerability': async () => {
    const mod = await import('./labs/vulnerability-lab.js');
    mod.initVulnerabilityLab();
  },
  'lab-community': async () => {
    const mod = await import('./labs/community-lab.js');
    mod.initCommunityLab();
  }
});

const loadedLabs = new Set();

async function ensureLabLoaded(labId) {
  if (!LAB_LOADERS[labId] || loadedLabs.has(labId)) return;
  try {
    await LAB_LOADERS[labId]();
    loadedLabs.add(labId);
  } catch (err) {
    console.error(`[Portfolio Lab Isolation] Failed to initialize ${labId}:`, err);
    const panel = document.getElementById(labId);
    if (panel) {
      const fallback = panel.querySelector('.lab-fallback-notice');
      if (fallback) fallback.hidden = false;
    }
  }
}

function initLaboratoriesSwitcher() {
  const labTabs = document.querySelectorAll('[data-lab-tab]');
  const labPanels = document.querySelectorAll('[data-lab-panel]');
  const labsSection = document.getElementById('labs');

  const activateLabTab = async (labId, scroll = false) => {
    if (!LAB_LOADERS[labId]) return;

    labTabs.forEach(tab => {
      const isSelected = tab.getAttribute('data-lab-tab') === labId;
      tab.classList.toggle('is-active', isSelected);
      tab.setAttribute('aria-selected', String(isSelected));
    });

    labPanels.forEach(panel => {
      const isMatch = panel.id === labId;
      panel.hidden = !isMatch;
    });

    if (scroll && labsSection) {
      labsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    await ensureLabLoaded(labId);
  };

  labTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      activateLabTab(tab.getAttribute('data-lab-tab'), false);
    });
  });

  window.addEventListener('portfolio:open-lab', (e) => {
    if (e.detail && e.detail.labId) {
      activateLabTab(e.detail.labId, true);
    }
  });

  // Lazy-load the default visible lab ("lab-crack") when the #labs section enters or approaches viewport
  if (labsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          ensureLabLoaded('lab-crack');
          obs.disconnect();
          break;
        }
      }
    }, { rootMargin: '250px 0px' });
    observer.observe(labsSection);
  } else {
    ensureLabLoaded('lab-crack');
  }
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('contact-form-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');

    const senderName = (nameInput?.value || '').trim();
    const senderEmail = (emailInput?.value || '').trim();
    const subject = (subjectInput?.value || 'Portfolio Inquiry').trim();
    const message = (messageInput?.value || '').trim();

    if (!senderName || !senderEmail || !message) {
      if (statusEl) {
        statusEl.textContent = 'Please complete your name, email address, and message before preparing the email.';
      }
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail)) {
      if (statusEl) {
        statusEl.textContent = 'Please provide a valid email address.';
      }
      return;
    }

    const mailtoSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} — from ${senderName}`);
    const mailtoBody = encodeURIComponent(`Name: ${senderName}\nEmail: ${senderEmail}\n\n${message}`);
    const mailtoUrl = `mailto:georgepriji@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    if (statusEl) {
      statusEl.textContent = 'Verified input — opening your mail client addressed to georgepriji@gmail.com.';
    }
    window.location.href = mailtoUrl;
  });
}

function bootstrapPortfolio() {
  const modules = [
    {
      name: 'Data Integrity Validator',
      fn: () => {
        const res = validatePortfolioData();
        const badge = document.getElementById('data-integrity-badge');
        if (badge) {
          badge.textContent = res.valid
            ? `Data Validated (${res.summary.projectsCount} Projects · ${res.summary.skillsCount} Skills · ${res.summary.graphEdgesCount} Graph Links)`
            : 'Data Validation Warning';
        }
      }
    },
    { name: 'Theme Controller', fn: initTheme },
    { name: 'Navigation & Smart Discovery', fn: initNavigation },
    { name: 'Projects & Evidence Viewer', fn: initProjects },
    { name: 'Knowledge Graph 2.0', fn: initKnowledgeGraph },
    { name: 'Dynamic Engineering Brief & JSON Export', fn: initRecruiterBrief },
    { name: 'Unified Command Palette', fn: initCommandPalette },
    { name: 'Interactive CLI Terminal', fn: initTerminal },
    { name: 'Lazy-Loaded Laboratories Switcher', fn: initLaboratoriesSwitcher },
    { name: 'Contact Form Fallback', fn: initContactForm }
  ];

  for (const mod of modules) {
    try {
      mod.fn();
    } catch (err) {
      console.error(`[Portfolio Bootstrap] Module "${mod.name}" encountered an error:`, err);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapPortfolio);
} else {
  bootstrapPortfolio();
}

