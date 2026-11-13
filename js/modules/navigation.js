/**
 * @file navigation.js
 * @description Manages responsive navigation, section active state,
 * Adaptive Portfolio Perspectives (Recruiter, Technical, Research),
 * and the deterministic "WHAT WOULD YOU LIKE TO EXPLORE?" Smart Discovery module.
 */

import { CONTENT } from './data.js';

export function initNavigation() {
  const navToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('primary-nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('is-open', !expanded);
    });

    navMenu.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('is-open');
      });
    });
  }

  // Adaptive Portfolio Perspectives (All, Recruiter, Technical, Research)
  const perspectiveBtns = document.querySelectorAll('[data-perspective-btn]');
  const perspectiveStatus = document.getElementById('perspective-active-desc');

  const applyPerspective = (perspectiveId) => {
    const found = CONTENT.perspectives.find(p => p.id === perspectiveId) || CONTENT.perspectives[0];
    document.body.setAttribute('data-perspective', found.id);

    perspectiveBtns.forEach(btn => {
      const isSelected = btn.getAttribute('data-perspective-btn') === found.id;
      btn.classList.toggle('is-active', isSelected);
      btn.setAttribute('aria-pressed', String(isSelected));
    });

    if (perspectiveStatus) {
      perspectiveStatus.textContent = `${found.label}: ${found.description}`;
    }
  };

  perspectiveBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyPerspective(btn.getAttribute('data-perspective-btn'));
    });
  });

  // Smart Discovery: "WHAT WOULD YOU LIKE TO EXPLORE?"
  const discoveryBtns = document.querySelectorAll('[data-discovery-option]');
  const discoveryResultBox = document.getElementById('discovery-result-panel');

  const renderDiscoveryRecommendation = (optionId) => {
    const option = CONTENT.discoveryOptions.find(o => o.id === optionId);
    if (!option || !discoveryResultBox) return;

    discoveryBtns.forEach(btn => {
      const active = btn.getAttribute('data-discovery-option') === option.id;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    discoveryResultBox.textContent = '';

    const title = document.createElement('h3');
    title.className = 'discovery-result-title';
    title.textContent = `Recommended Path: ${option.label}`;

    const summary = document.createElement('p');
    summary.className = 'discovery-result-summary';
    summary.textContent = option.summary;

    const skillsWrap = document.createElement('div');
    skillsWrap.className = 'discovery-skills-row';
    for (const s of option.skills) {
      const pill = document.createElement('span');
      pill.className = 'tech-pill';
      pill.textContent = s;
      skillsWrap.appendChild(pill);
    }

    const actionsRow = document.createElement('div');
    actionsRow.className = 'discovery-actions-row';

    if (option.projects.length > 0) {
      const btnProj = document.createElement('button');
      btnProj.type = 'button';
      btnProj.className = 'btn btn-primary btn-sm';
      btnProj.textContent = 'Inspect Project Case Study';
      btnProj.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('portfolio:open-project', { detail: { projectId: option.projects[0] } }));
      });
      actionsRow.appendChild(btnProj);
    }

    if (option.labId) {
      const btnLab = document.createElement('button');
      btnLab.type = 'button';
      btnLab.className = 'btn btn-secondary btn-sm';
      btnLab.textContent = 'Open Interactive Laboratory';
      btnLab.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('portfolio:open-lab', { detail: { labId: option.labId } }));
      });
      actionsRow.appendChild(btnLab);
    }

    if (option.experiences.length > 0) {
      const btnExp = document.createElement('a');
      btnExp.href = `#${option.experiences[0]}`;
      btnExp.className = 'btn btn-outline btn-sm';
      btnExp.textContent = 'View Verified Experience Entry';
      actionsRow.appendChild(btnExp);
    }

    discoveryResultBox.append(title, summary, skillsWrap, actionsRow);
  };

  discoveryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      renderDiscoveryRecommendation(btn.getAttribute('data-discovery-option'));
    });
  });

  // Initialize default selection
  if (CONTENT.discoveryOptions.length > 0) {
    renderDiscoveryRecommendation(CONTENT.discoveryOptions[0].id);
  }
}

