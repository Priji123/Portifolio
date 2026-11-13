/**
 * @file recruiter-brief.js
 * @description Dynamic Engineering Brief generator and JSON Resume Exporter.
 *
 * Domains selectable by visitors:
 * - software: Software Engineering
 * - ai-cv: AI and Computer Vision
 * - security: Security
 * - systems: Systems and Infrastructure
 * - research: Research and Algorithms
 *
 * Also builds and validates a JSON Resume-compatible export strictly using verified CONTENT data.
 */

import { CONTENT, PROJECTS, SKILLS } from './data.js';

export const BRIEF_DOMAINS = Object.freeze([
  { id: 'software', label: 'Software Engineering', defaultChecked: true },
  { id: 'ai-cv', label: 'AI and Computer Vision', defaultChecked: true },
  { id: 'security', label: 'Security', defaultChecked: true },
  { id: 'systems', label: 'Systems and Infrastructure', defaultChecked: true },
  { id: 'research', label: 'Research and Algorithms', defaultChecked: true }
]);

/**
 * Pure function that generates a structured engineering brief for the selected domain IDs.
 * @param {string[]} selectedDomains
 * @returns {Object}
 */
export function generateEngineeringBriefData(selectedDomains = ['software', 'ai-cv', 'security', 'systems', 'research']) {
  const activeSet = new Set(
    Array.isArray(selectedDomains) && selectedDomains.length > 0
      ? selectedDomains
      : BRIEF_DOMAINS.map(d => d.id)
  );

  const filteredProjects = PROJECTS.filter(project =>
    project.domains.some(domain => activeSet.has(domain))
  );

  const filteredExperience = CONTENT.experience.filter(exp =>
    exp.domains.some(domain => activeSet.has(domain))
  );

  const filteredSkillGroups = [];
  for (const group of SKILLS) {
    const matchingItems = group.items.filter(item =>
      item.domains.some(domain => activeSet.has(domain))
    );
    if (matchingItems.length > 0) {
      filteredSkillGroups.push({
        category: group.category,
        skills: matchingItems.map(s => s.name)
      });
    }
  }

  return {
    candidate: CONTENT.candidate,
    selectedDomains: Array.from(activeSet),
    projects: filteredProjects,
    experience: filteredExperience,
    skillGroups: filteredSkillGroups,
    education: CONTENT.education,
    certifications: CONTENT.certifications
  };
}

/**
 * Pure function that builds a JSON Resume-compatible object using only verified portfolio data.
 * Does not invent missing fields.
 * @returns {Object}
 */
export function generateJsonResumeObject() {
  const c = CONTENT.candidate;

  return {
    $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: c.name,
      label: c.title,
      email: c.email,
      phone: c.phone,
      url: c.github,
      summary: c.profile,
      location: {
        region: c.location,
        countryCode: 'IN'
      },
      profiles: [
        {
          network: 'LinkedIn',
          username: 'george-priji-promod-1428a2244',
          url: c.linkedin
        },
        {
          network: 'GitHub',
          username: 'Priji123',
          url: c.github
        }
      ]
    },
    work: CONTENT.experience.map(exp => ({
      name: exp.organization,
      position: exp.role,
      location: exp.location,
      period: exp.period,
      highlights: [...exp.highlights],
      keywords: [...exp.technologies]
    })),
    education: CONTENT.education.map(edu => ({
      institution: edu.institution,
      area: edu.degree,
      score: edu.metric,
      period: edu.period,
      location: edu.location
    })),
    projects: PROJECTS.map(proj => ({
      name: proj.title,
      description: `${proj.subtitle} — ${proj.summary}`,
      highlights: [...proj.bullets],
      keywords: [...proj.technologies],
      entity: proj.institution,
      period: proj.period
    })),
    skills: SKILLS.map(group => ({
      name: group.category,
      keywords: group.items.map(item => item.name)
    })),
    certificates: CONTENT.certifications.map(cert => ({
      name: cert.title,
      issuer: cert.issuer,
      date: cert.date
    }))
  };
}

/**
 * Validates the generated JSON Resume object prior to local download.
 * @param {Object} resumeObj
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateJsonResume(resumeObj) {
  const errors = [];
  if (!resumeObj || typeof resumeObj !== 'object') {
    errors.push('Resume export is not an object.');
    return { valid: false, errors };
  }

  const b = resumeObj.basics;
  if (!b || b.name !== CONTENT.candidate.name) {
    errors.push('Basics name does not match verified candidate name.');
  }
  if (!b || b.email !== CONTENT.candidate.email) {
    errors.push('Basics email does not match verified candidate email.');
  }
  if (!b || b.phone !== CONTENT.candidate.phone) {
    errors.push('Basics phone does not match verified candidate phone.');
  }
  if (!Array.isArray(resumeObj.work) || resumeObj.work.length !== CONTENT.experience.length) {
    errors.push('Work history count does not match verified experience entries.');
  }
  if (!Array.isArray(resumeObj.projects) || resumeObj.projects.length !== PROJECTS.length) {
    errors.push('Projects count does not match verified projects.');
  }
  if (!Array.isArray(resumeObj.education) || resumeObj.education.length !== CONTENT.education.length) {
    errors.push('Education count does not match verified education entries.');
  }
  if (!Array.isArray(resumeObj.skills) || resumeObj.skills.length !== SKILLS.length) {
    errors.push('Skills categories count does not match verified skills.');
  }

  // Verify JSON serializability
  try {
    const serialized = JSON.stringify(resumeObj);
    if (!serialized || serialized.length < 100) {
      errors.push('Serialized JSON Resume is unexpectedly short.');
    }
  } catch (err) {
    errors.push(`JSON serialization failed: ${err.message}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Initializes the DOM UI for the Dynamic Engineering Brief and JSON Resume export.
 */
export function initRecruiterBrief() {
  const container = document.getElementById('brief-builder-root');
  if (!container) return;

  const domainCheckboxesContainer = document.getElementById('brief-domain-checkboxes');
  const previewContainer = document.getElementById('brief-live-preview');
  const btnPrint = document.getElementById('btn-brief-print');
  const btnReset = document.getElementById('btn-brief-reset');
  const btnExportJson = document.getElementById('btn-export-json-resume');
  const statusBanner = document.getElementById('brief-status-message');

  const getSelectedDomains = () => {
    if (!domainCheckboxesContainer) return BRIEF_DOMAINS.map(d => d.id);
    const checked = Array.from(domainCheckboxesContainer.querySelectorAll('input[type="checkbox"]:checked'))
      .map(input => input.value);
    return checked;
  };

  const renderPreview = () => {
    if (!previewContainer) return;
    const selected = getSelectedDomains();
    previewContainer.textContent = '';

    if (selected.length === 0) {
      const emptyNote = document.createElement('p');
      emptyNote.className = 'brief-empty-notice';
      emptyNote.textContent = 'Select at least one engineering focus area above to generate a tailored summary, or click Reset.';
      previewContainer.appendChild(emptyNote);
      return;
    }

    const brief = generateEngineeringBriefData(selected);

    // Header
    const header = document.createElement('div');
    header.className = 'brief-preview-header';

    const titleEl = document.createElement('h3');
    titleEl.className = 'brief-candidate-name';
    titleEl.textContent = brief.candidate.name;

    const subtitleEl = document.createElement('p');
    subtitleEl.className = 'brief-candidate-role';
    subtitleEl.textContent = `${brief.candidate.title} · ${brief.candidate.location}`;

    const contactLine = document.createElement('p');
    contactLine.className = 'brief-contact-line';
    contactLine.textContent = `${brief.candidate.email} | ${brief.candidate.phone} | ${brief.candidate.linkedinDisplay}`;

    const introP = document.createElement('p');
    introP.className = 'brief-profile-summary';
    introP.textContent = brief.candidate.profile;

    header.append(titleEl, subtitleEl, contactLine, introP);
    previewContainer.appendChild(header);

    // Grid body
    const grid = document.createElement('div');
    grid.className = 'brief-preview-grid';

    // Column 1: Experience & Projects
    const mainCol = document.createElement('div');
    mainCol.className = 'brief-col-main';

    if (brief.experience.length > 0) {
      const expTitle = document.createElement('h4');
      expTitle.className = 'brief-section-heading';
      expTitle.textContent = `Relevant Experience (${brief.experience.length})`;
      mainCol.appendChild(expTitle);

      for (const exp of brief.experience) {
        const item = document.createElement('div');
        item.className = 'brief-item';

        const itemHead = document.createElement('div');
        itemHead.className = 'brief-item-head';
        const roleStrong = document.createElement('strong');
        roleStrong.textContent = `${exp.role} — ${exp.organization}`;
        const periodSpan = document.createElement('span');
        periodSpan.className = 'brief-item-meta';
        periodSpan.textContent = exp.period;
        itemHead.append(roleStrong, periodSpan);

        const ul = document.createElement('ul');
        ul.className = 'brief-bullet-list';
        for (const h of exp.highlights.slice(0, 2)) {
          const li = document.createElement('li');
          li.textContent = h;
          ul.appendChild(li);
        }

        item.append(itemHead, ul);
        mainCol.appendChild(item);
      }
    }

    if (brief.projects.length > 0) {
      const projTitle = document.createElement('h4');
      projTitle.className = 'brief-section-heading';
      projTitle.textContent = `Selected Engineering Projects (${brief.projects.length})`;
      mainCol.appendChild(projTitle);

      for (const proj of brief.projects) {
        const item = document.createElement('div');
        item.className = 'brief-item';

        const itemHead = document.createElement('div');
        itemHead.className = 'brief-item-head';
        const projStrong = document.createElement('strong');
        projStrong.textContent = `${proj.title} (${proj.subtitle})`;
        const techSpan = document.createElement('span');
        techSpan.className = 'brief-item-meta';
        techSpan.textContent = proj.technologies.slice(0, 4).join(', ');
        itemHead.append(projStrong, techSpan);

        const descP = document.createElement('p');
        descP.className = 'brief-item-desc';
        descP.textContent = proj.summary;

        item.append(itemHead, descP);
        mainCol.appendChild(item);
      }
    }

    // Column 2: Skills & Education
    const sideCol = document.createElement('div');
    sideCol.className = 'brief-col-side';

    const skillsTitle = document.createElement('h4');
    skillsTitle.className = 'brief-section-heading';
    skillsTitle.textContent = 'Matched Technical Skills';
    sideCol.appendChild(skillsTitle);

    for (const sg of brief.skillGroups) {
      const sgBlock = document.createElement('div');
      sgBlock.className = 'brief-skill-group';
      const sgLabel = document.createElement('strong');
      sgLabel.textContent = `${sg.category}: `;
      const sgList = document.createElement('span');
      sgList.textContent = sg.skills.join(', ');
      sgBlock.append(sgLabel, sgList);
      sideCol.appendChild(sgBlock);
    }

    const eduTitle = document.createElement('h4');
    eduTitle.className = 'brief-section-heading';
    eduTitle.textContent = 'Education';
    sideCol.appendChild(eduTitle);

    for (const edu of brief.education.slice(0, 2)) {
      const eduBlock = document.createElement('div');
      eduBlock.className = 'brief-edu-item';
      const deg = document.createElement('strong');
      deg.textContent = edu.degree;
      const inst = document.createElement('p');
      inst.textContent = `${edu.institution} (${edu.period}) · ${edu.metric}`;
      eduBlock.append(deg, inst);
      sideCol.appendChild(eduBlock);
    }

    grid.append(mainCol, sideCol);
    previewContainer.appendChild(grid);
  };

  if (domainCheckboxesContainer) {
    domainCheckboxesContainer.addEventListener('change', () => {
      renderPreview();
      if (statusBanner) {
        statusBanner.textContent = 'Engineering brief updated with selected domains.';
      }
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (domainCheckboxesContainer) {
        domainCheckboxesContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => {
          cb.checked = true;
        });
      }
      renderPreview();
      if (statusBanner) {
        statusBanner.textContent = 'Engineering brief reset to include all five verified domains.';
      }
    });
  }

  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  const triggerJsonResumeDownload = () => {
    const resumeObj = generateJsonResumeObject();
    const validation = validateJsonResume(resumeObj);

    if (!validation.valid) {
      if (statusBanner) {
        statusBanner.textContent = `JSON Resume validation failed: ${validation.errors.join('; ')}`;
      }
      return;
    }

    const jsonString = JSON.stringify(resumeObj, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'George_Priji_Promod_JSON_Resume.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);

    if (statusBanner) {
      statusBanner.textContent = 'Validated JSON Resume exported locally (George_Priji_Promod_JSON_Resume.json).';
    }
  };

  if (btnExportJson) {
    btnExportJson.addEventListener('click', triggerJsonResumeDownload);
  }

  // Expose custom event hook so Command Palette & Terminal can trigger JSON export or print
  window.addEventListener('portfolio:export-json-resume', triggerJsonResumeDownload);
  window.addEventListener('portfolio:print-brief', () => window.print());

  renderPreview();
}

