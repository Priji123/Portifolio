/**
 * @file projects.js
 * @description Responsible for:
 * - Project filtering by category
 * - Case study rendering & Technical Decisions accordion interaction
 * - Project detail dialogs with Previous / Next project navigation
 * - Evidence & Project Artifact Viewer modal (AVAILABLE, PENDING, EXTERNAL LINK)
 *   preserving keyboard focus and Escape key closing
 */

import { PROJECTS, EVIDENCE, CAPTIONS } from './data.js';

let activeProjectDialogIndex = 0;
let lastFocusedElement = null;

/**
 * Opens the Evidence Viewer modal for a given evidence ID.
 */
export function openEvidenceViewer(evidenceId) {
  const item = EVIDENCE.find(e => e.id === evidenceId);
  const modal = document.getElementById('evidence-viewer-modal');
  if (!item || !modal) return;

  lastFocusedElement = document.activeElement;

  const titleEl = document.getElementById('evidence-modal-title');
  const statusEl = document.getElementById('evidence-modal-status');
  const descEl = document.getElementById('evidence-modal-desc');
  const bodyEl = document.getElementById('evidence-modal-body');
  const closeBtn = document.getElementById('evidence-modal-close');

  if (titleEl) titleEl.textContent = item.title;
  if (statusEl) {
    statusEl.textContent = item.status === 'PENDING' ? 'EVIDENCE PENDING' : item.status;
    statusEl.className = `classification-badge badge-${item.status.toLowerCase().replace(/\s+/g, '-')}`;
  }
  if (descEl) descEl.textContent = item.description;

  if (bodyEl) {
    bodyEl.textContent = '';

    if (item.status === 'PENDING') {
      const pendingBox = document.createElement('div');
      pendingBox.className = 'evidence-pending-box';
      const p1 = document.createElement('p');
      p1.textContent = 'EVIDENCE PENDING — This artifact (source repository, quantitative manuscript table, or project log) must be supplied by the portfolio owner.';
      const p2 = document.createElement('p');
      p2.className = 'evidence-honesty-note';
      p2.textContent = 'In accordance with Evidence-Driven Engineering guidelines, no placeholder download or synthetic metric table is fabricated.';
      pendingBox.append(p1, p2);
      bodyEl.appendChild(pendingBox);
    } else if (item.status === 'EXTERNAL LINK') {
      const extBox = document.createElement('div');
      extBox.className = 'evidence-available-box';
      const note = document.createElement('p');
      note.textContent = `External resource verified: ${item.source}`;
      const link = document.createElement('a');
      link.href = item.source;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.className = 'btn btn-primary';
      link.textContent = 'Open External Link in New Tab ↗';
      extBox.append(note, link);
      bodyEl.appendChild(extBox);
    } else if (item.status === 'AVAILABLE') {
      const availBox = document.createElement('div');
      availBox.className = 'evidence-available-box';

      if (item.source === 'assets/resume.pdf') {
        const caption = document.createElement('p');
        caption.className = 'diagram-caption';
        caption.textContent = 'Official Curriculum Vitae PDF attached in local portfolio assets.';
        const openLink = document.createElement('a');
        openLink.href = 'assets/resume.pdf';
        openLink.target = '_blank';
        openLink.rel = 'noopener noreferrer';
        openLink.className = 'btn btn-primary';
        openLink.textContent = 'View / Download Verified CV (PDF)';
        availBox.append(caption, openLink);
      } else {
        const caption = document.createElement('p');
        caption.className = 'diagram-caption';
        caption.textContent = CAPTIONS.STATIC_DIAGRAM;
        const schematicBox = document.createElement('div');
        schematicBox.className = 'evidence-schematic-preview';
        schematicBox.textContent = `${item.title} — Interactive workflow and architecture stages are available in the project's Technical Decisions panel and corresponding Interactive Engineering Laboratory.`;
        availBox.append(caption, schematicBox);
      }
      bodyEl.appendChild(availBox);
    }
  }

  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  if (closeBtn) closeBtn.focus();
}

export function closeEvidenceViewer() {
  const modal = document.getElementById('evidence-viewer-modal');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

/**
 * Opens the detailed Case Study Dialog for a specific project ID, supporting Previous / Next navigation.
 */
export function openProjectDialog(projectId) {
  const idx = PROJECTS.findIndex(p => p.id === projectId);
  if (idx === -1) return;
  activeProjectDialogIndex = idx;
  const project = PROJECTS[idx];

  const modal = document.getElementById('project-detail-modal');
  if (!modal) return;
  if (modal.hidden) {
    lastFocusedElement = document.activeElement;
  }

  const titleEl = document.getElementById('project-modal-title');
  const subtitleEl = document.getElementById('project-modal-subtitle');
  const bodyEl = document.getElementById('project-modal-body');
  const closeBtn = document.getElementById('project-modal-close');

  if (titleEl) titleEl.textContent = project.title;
  if (subtitleEl) subtitleEl.textContent = `${project.subtitle} · ${project.institution} (${project.period})`;

  if (bodyEl) {
    bodyEl.textContent = '';

    // 1. Problem & Approach
    const grid = document.createElement('div');
    grid.className = 'decision-modal-grid';

    const probCard = document.createElement('div');
    probCard.className = 'decision-card';
    const probH = document.createElement('h4');
    probH.textContent = '1. Problem Statement [DOCUMENTED]';
    const probP = document.createElement('p');
    probP.textContent = project.decisions.problem.text;
    probCard.append(probH, probP);

    const appCard = document.createElement('div');
    appCard.className = 'decision-card';
    const appH = document.createElement('h4');
    appH.textContent = '2. Engineering Approach [DOCUMENTED]';
    const appP = document.createElement('p');
    appP.textContent = project.decisions.approach.text;
    appCard.append(appH, appP);

    grid.append(probCard, appCard);
    bodyEl.appendChild(grid);

    // 3. Technologies
    const techSec = document.createElement('div');
    techSec.className = 'decision-block';
    const techH = document.createElement('h4');
    techH.textContent = '3. Verified Technologies';
    const techRow = document.createElement('div');
    techRow.className = 'tech-pill-row';
    for (const t of project.decisions.technologies) {
      const span = document.createElement('span');
      span.className = 'tech-pill';
      span.textContent = t;
      techRow.appendChild(span);
    }
    techSec.append(techH, techRow);
    bodyEl.appendChild(techSec);

    // 4. Implementation Workflow
    const wfSec = document.createElement('div');
    wfSec.className = 'decision-block';
    const wfH = document.createElement('h4');
    wfH.textContent = '4. Implementation Workflow';
    const wfCaption = document.createElement('p');
    wfCaption.className = 'diagram-caption';
    wfCaption.textContent = CAPTIONS.STATIC_DIAGRAM;
    const wfList = document.createElement('ol');
    wfList.className = 'workflow-step-list';
    for (const step of project.decisions.workflow) {
      const li = document.createElement('li');
      const strong = document.createElement('strong');
      strong.textContent = `${step.stage} [${step.classification}]: `;
      const span = document.createElement('span');
      span.textContent = step.detail;
      li.append(strong, span);
      wfList.appendChild(li);
    }
    wfSec.append(wfH, wfCaption, wfList);
    bodyEl.appendChild(wfSec);

    // 5. Expandable Technical Concepts
    const conceptsSec = document.createElement('div');
    conceptsSec.className = 'decision-block';
    const conceptsH = document.createElement('h4');
    conceptsH.textContent = '5. Technical Concepts & Method Explanations';
    conceptsSec.appendChild(conceptsH);

    for (const c of project.decisions.concepts) {
      const details = document.createElement('details');
      details.className = 'concept-accordion';
      const summary = document.createElement('summary');
      summary.textContent = `${c.title} (${c.classification})`;
      const p = document.createElement('p');
      p.textContent = c.explanation;
      details.append(summary, p);
      conceptsSec.appendChild(details);
    }
    bodyEl.appendChild(conceptsSec);

    // 6. Challenges & 7. Evaluation
    const evalGrid = document.createElement('div');
    evalGrid.className = 'decision-modal-grid';

    const chalCard = document.createElement('div');
    chalCard.className = 'decision-card';
    const chalH = document.createElement('h4');
    chalH.textContent = `6. Challenges [${project.decisions.challenges.classification}]`;
    const chalP = document.createElement('p');
    chalP.textContent = project.decisions.challenges.text;
    chalCard.append(chalH, chalP);

    const evalCard = document.createElement('div');
    evalCard.className = 'decision-card';
    const evalH = document.createElement('h4');
    evalH.textContent = `7. Evaluation [${project.decisions.evaluation.classification}]`;
    const evalP = document.createElement('p');
    evalP.textContent = project.decisions.evaluation.text;
    evalCard.append(evalH, evalP);

    evalGrid.append(chalCard, evalCard);
    bodyEl.appendChild(evalGrid);

    // 8. Evidence items
    const evSec = document.createElement('div');
    evSec.className = 'decision-block';
    const evH = document.createElement('h4');
    evH.textContent = '8. Evidence & Project Artifacts';
    const evList = document.createElement('div');
    evList.className = 'evidence-button-row';

    for (const evId of project.evidenceIds) {
      const evObj = EVIDENCE.find(e => e.id === evId);
      if (!evObj) continue;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `btn btn-sm ${evObj.status === 'PENDING' ? 'btn-pending' : 'btn-outline'}`;
      btn.textContent = `${evObj.title} [${evObj.status === 'PENDING' ? 'EVIDENCE PENDING' : evObj.status}]`;
      btn.addEventListener('click', () => openEvidenceViewer(evObj.id));
      evList.appendChild(btn);
    }

    evSec.append(evH, evList);
    bodyEl.appendChild(evSec);
  }

  modal.hidden = false;
  modal.setAttribute('aria-hidden', 'false');
  if (closeBtn) closeBtn.focus();
}

export function closeProjectDialog() {
  const modal = document.getElementById('project-detail-modal');
  if (!modal || modal.hidden) return;
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

export function initProjects() {
  // 1. Project category filter buttons
  const filterBtns = document.querySelectorAll('[data-project-filter]');
  const projectCards = document.querySelectorAll('[data-project-card]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-project-filter');
      filterBtns.forEach(b => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });

      projectCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        const show = cat === 'all' || cardCat === cat;
        card.hidden = !show;
      });
    });
  });

  // 2. Delegate clicks on "[data-open-project]" and "[data-open-evidence]" and "[data-open-lab]"
  document.addEventListener('click', (e) => {
    const projBtn = e.target.closest('[data-open-project]');
    if (projBtn) {
      openProjectDialog(projBtn.getAttribute('data-open-project'));
      return;
    }

    const evBtn = e.target.closest('[data-open-evidence]');
    if (evBtn) {
      openEvidenceViewer(evBtn.getAttribute('data-open-evidence'));
      return;
    }

    const labTrigger = e.target.closest('[data-open-lab]');
    if (labTrigger) {
      const labId = labTrigger.getAttribute('data-open-lab');
      window.dispatchEvent(new CustomEvent('portfolio:open-lab', { detail: { labId } }));
    }
  });

  // 3. Project Modal Controls (Previous, Next, Close)
  const btnPrev = document.getElementById('project-modal-prev');
  const btnNext = document.getElementById('project-modal-next');
  const btnClose = document.getElementById('project-modal-close');
  const projModal = document.getElementById('project-detail-modal');

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      const nextIdx = (activeProjectDialogIndex - 1 + PROJECTS.length) % PROJECTS.length;
      openProjectDialog(PROJECTS[nextIdx].id);
    });
  }
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      const nextIdx = (activeProjectDialogIndex + 1) % PROJECTS.length;
      openProjectDialog(PROJECTS[nextIdx].id);
    });
  }
  if (btnClose) {
    btnClose.addEventListener('click', closeProjectDialog);
  }
  if (projModal) {
    projModal.addEventListener('click', (e) => {
      if (e.target === projModal) closeProjectDialog();
    });
  }

  // 4. Evidence Viewer Close
  const evClose = document.getElementById('evidence-modal-close');
  const evModal = document.getElementById('evidence-viewer-modal');
  if (evClose) {
    evClose.addEventListener('click', closeEvidenceViewer);
  }
  if (evModal) {
    evModal.addEventListener('click', (e) => {
      if (e.target === evModal) closeEvidenceViewer();
    });
  }

  // Escape key closes active modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (evModal && !evModal.hidden) {
        closeEvidenceViewer();
      } else if (projModal && !projModal.hidden) {
        closeProjectDialog();
      }
    }
  });

  // Listen to custom events from Discovery / Knowledge Graph / Command Palette
  window.addEventListener('portfolio:open-project', (e) => {
    if (e.detail && e.detail.projectId) {
      const card = document.getElementById(`project-card-${e.detail.projectId}`);
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      openProjectDialog(e.detail.projectId);
    }
  });
}

