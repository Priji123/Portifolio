/**
 * @file search.js
 * @description Unified command & search registry shared by the Command Palette (Ctrl/Cmd+K)
 * and the Interactive Terminal.
 *
 * Includes searchable entries for:
 * - Sections
 * - Projects
 * - Skills & Technologies
 * - Experience
 * - Technical concepts
 * - Theme & Utility actions
 *
 * Pure functions are exported for Node.js unit testing.
 */

import { CONTENT, PROJECTS, SKILLS } from './data.js';

/**
 * Builds the unified command and search registry from central portfolio data.
 * @returns {Array<Object>}
 */
export function buildCommandRegistry() {
  const registry = [];

  // 1. Navigation Sections
  const sections = [
    { id: 'cmd-sec-hero', title: 'Go to Overview / Hero', category: 'Section', keywords: ['home', 'top', 'profile', 'summary'], targetSection: 'hero', command: 'goto hero' },
    { id: 'cmd-sec-discovery', title: 'Go to Smart Discovery & Perspectives', category: 'Section', keywords: ['explore', 'perspective', 'recruiter', 'technical', 'research'], targetSection: 'discovery', command: 'goto discovery' },
    { id: 'cmd-sec-about', title: 'Go to About & Engineering Philosophy', category: 'Section', keywords: ['about', 'bio', 'evidence', 'philosophy'], targetSection: 'about', command: 'goto about' },
    { id: 'cmd-sec-experience', title: 'Go to Professional & Research Experience', category: 'Section', keywords: ['experience', 'intern', 'work', 'atticube', 'canza', 'nit silchar'], targetSection: 'experience', command: 'goto experience' },
    { id: 'cmd-sec-projects', title: 'Go to Featured Engineering Projects', category: 'Section', keywords: ['projects', 'case studies', 'thesis', 'portfolio'], targetSection: 'projects', command: 'goto projects' },
    { id: 'cmd-sec-labs', title: 'Go to Interactive Engineering Laboratories', category: 'Section', keywords: ['labs', 'sandbox', 'demonstrations', 'vision', 'gait', 'security', 'graph'], targetSection: 'labs', command: 'goto labs' },
    { id: 'cmd-sec-graph', title: 'Go to Engineering Knowledge Graph 2.0', category: 'Section', keywords: ['graph', 'network', 'relationships', 'svg', 'connections'], targetSection: 'knowledge-graph', command: 'goto graph' },
    { id: 'cmd-sec-skills', title: 'Go to Technical Skills & Certifications', category: 'Section', keywords: ['skills', 'certifications', 'nptel', 'coursera', 'isc2'], targetSection: 'skills', command: 'goto skills' },
    { id: 'cmd-sec-education', title: 'Go to Education', category: 'Section', keywords: ['education', 'mtech', 'btech', 'nerist', 'mar baselios', 'cgpa'], targetSection: 'education', command: 'goto education' },
    { id: 'cmd-sec-brief', title: 'Go to Dynamic Engineering Brief & JSON Resume', category: 'Section', keywords: ['brief', 'resume', 'json', 'export', 'pdf', 'print'], targetSection: 'engineering-brief', command: 'goto brief' },
    { id: 'cmd-sec-contact', title: 'Go to Contact & Verification Links', category: 'Section', keywords: ['contact', 'email', 'phone', 'linkedin', 'github'], targetSection: 'contact', command: 'goto contact' }
  ];

  for (const sec of sections) {
    registry.push({
      ...sec,
      type: 'section',
      description: `Navigate to the ${sec.title.replace('Go to ', '')} section.`
    });
  }

  // 2. Projects & Case Studies (including "Open <Project>" commands)
  for (const project of PROJECTS) {
    registry.push({
      id: `cmd-proj-${project.id}`,
      title: `Open ${project.title}`,
      category: 'Project',
      type: 'project',
      projectId: project.id,
      labId: project.labId,
      targetSection: 'projects',
      command: `open ${project.id}`,
      keywords: [
        project.title.toLowerCase(),
        project.subtitle.toLowerCase(),
        `open ${project.title.toLowerCase()}`,
        ...project.technologies.map(t => t.toLowerCase())
      ],
      description: `${project.subtitle} — ${project.summary}`
    });

    // Technical concepts inside each project
    for (const concept of project.decisions?.concepts || []) {
      registry.push({
        id: `cmd-concept-${concept.id}`,
        title: concept.title,
        category: 'Technical Concept',
        type: 'concept',
        projectId: project.id,
        targetSection: 'projects',
        command: `concept ${concept.id}`,
        keywords: [
          concept.title.toLowerCase(),
          concept.explanation.toLowerCase(),
          project.title.toLowerCase()
        ],
        description: `[${concept.classification}] ${concept.explanation.slice(0, 140)}...`
      });
    }
  }

  // 3. Experience entries
  for (const exp of CONTENT.experience) {
    registry.push({
      id: `cmd-exp-${exp.id}`,
      title: `${exp.role} — ${exp.organization}`,
      category: 'Experience',
      type: 'experience',
      experienceId: exp.id,
      targetSection: 'experience',
      command: `exp ${exp.id}`,
      keywords: [
        exp.role.toLowerCase(),
        exp.organization.toLowerCase(),
        exp.location.toLowerCase(),
        ...exp.technologies.map(t => t.toLowerCase())
      ],
      description: `${exp.period} (${exp.location}) — ${exp.highlights[0]}`
    });
  }

  // 4. Skills & Technologies
  for (const group of SKILLS) {
    for (const skill of group.items) {
      registry.push({
        id: `cmd-skill-${skill.id}`,
        title: skill.name,
        category: group.category,
        type: 'skill',
        skillId: skill.id,
        relatedProjects: skill.relatedProjects,
        relatedExperience: skill.relatedExperience,
        targetSection: 'skills',
        command: `skill ${skill.name.toLowerCase()}`,
        keywords: [
          skill.name.toLowerCase(),
          group.category.toLowerCase(),
          ...skill.relatedProjects,
          ...skill.relatedExperience
        ],
        description: `${group.category} skill${skill.relatedProjects.length ? ` · Linked to ${skill.relatedProjects.length} project(s)` : ''}${skill.relatedExperience.length ? ` · Linked to internship experience` : ''}.`
      });
    }
  }

  // 5. Interactive Laboratories direct triggers
  const labs = [
    { id: 'cmd-lab-crack', title: 'Launch Computer Vision / Image Segmentation Lab', labTab: 'lab-crack', keywords: ['crack lab', 'bilateral', 'clahe', 'frangi', 'attention u-net', 'tversky', 'dice'] },
    { id: 'cmd-lab-gait', title: 'Launch Computer Vision / Gait Recognition Lab', labTab: 'lab-gait', keywords: ['gait lab', 'silhouette', 'gei', 'gait energy image', 'hog', 'pca', 'lda', 'svm', 'cnn'] },
    { id: 'cmd-lab-vuln', title: 'Launch Software Security / Code Analysis Lab', labTab: 'lab-vulnerability', keywords: ['security lab', 'vulnerability', 'devign', 'c code', 'shap', 'lime', 'buffer'] },
    { id: 'cmd-lab-comm', title: 'Launch Complex Networks / Community Detection Lab', labTab: 'lab-community', keywords: ['community detection', 'graph lab', 'lbld', 'fsld', 'prasar', 'louvain', 'lpa', 'slpa', 'ercns', 'nmi', 'modularity'] }
  ];

  for (const l of labs) {
    registry.push({
      id: l.id,
      title: l.title,
      category: 'Interactive Lab',
      type: 'lab',
      labId: l.labTab,
      targetSection: 'labs',
      command: `lab ${l.labTab}`,
      keywords: l.keywords,
      description: 'Open interactive educational laboratory with deterministic synthetic demonstrations.'
    });
  }

  // 6. Theme & Actions
  registry.push(
    {
      id: 'cmd-theme-toggle',
      title: 'Toggle Color Theme (Dark / Light)',
      category: 'Action',
      type: 'action',
      action: 'toggle-theme',
      command: 'theme toggle',
      keywords: ['theme', 'dark mode', 'light mode', 'appearance', 'color'],
      description: 'Switch between high-contrast engineering dark theme and daylight editorial light theme.'
    },
    {
      id: 'cmd-export-json',
      title: 'Export Verified JSON Resume',
      category: 'Action',
      type: 'action',
      action: 'export-json-resume',
      targetSection: 'engineering-brief',
      command: 'export json',
      keywords: ['json resume', 'download', 'export', 'cv', 'schema'],
      description: 'Validate and download a JSON Resume representation of George Priji Promod’s portfolio.'
    },
    {
      id: 'cmd-print-brief',
      title: 'Print / Save Engineering Brief as PDF',
      category: 'Action',
      type: 'action',
      action: 'print-brief',
      targetSection: 'engineering-brief',
      command: 'print brief',
      keywords: ['print', 'pdf', 'recruiter brief', 'summary'],
      description: 'Open print-friendly engineering summary view.'
    }
  );

  return registry;
}

/**
 * Deterministic scoring function to search the unified command registry.
 * @param {string} query
 * @param {Array<Object>} [registry]
 * @param {number} [limit=12]
 * @returns {Array<Object>}
 */
export function searchRegistry(query, registry = buildCommandRegistry(), limit = 12) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    return registry.slice(0, limit);
  }

  const normalized = query.trim().toLowerCase();
  const tokens = normalized.split(/\s+/).filter(Boolean);

  const scored = [];

  for (const item of registry) {
    const titleLower = item.title.toLowerCase();
    const descLower = (item.description || '').toLowerCase();
    const catLower = (item.category || '').toLowerCase();
    const keywordJoined = (item.keywords || []).join(' ').toLowerCase();
    const haystack = `${titleLower} ${catLower} ${keywordJoined} ${descLower}`;

    let score = 0;

    if (titleLower === normalized) {
      score += 120;
    } else if (titleLower.startsWith(normalized)) {
      score += 85;
    } else if (titleLower.includes(normalized)) {
      score += 65;
    }

    if (keywordJoined.includes(normalized)) {
      score += 55;
    }

    if (descLower.includes(normalized)) {
      score += 25;
    }

    // Multi-token matching (e.g., "Open Crack Detection" or "Attention U-Net")
    let matchedTokens = 0;
    for (const token of tokens) {
      if (haystack.includes(token)) {
        matchedTokens += 1;
        if (titleLower.includes(token)) score += 18;
        else if (keywordJoined.includes(token)) score += 12;
        else score += 5;
      }
    }

    // Require all tokens to match if more than 1 token is entered, or a strong phrase match
    if (tokens.length > 1 && matchedTokens < tokens.length) {
      // Allow partial match only if at least half the tokens match and one is a strong keyword
      if (matchedTokens === 0) {
        score = 0;
      } else {
        score = Math.floor(score * 0.35);
      }
    }

    if (score > 0) {
      scored.push({ item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));
  return scored.slice(0, limit).map(entry => entry.item);
}

/**
 * Default suggested search queries per specification.
 */
export const SUGGESTED_SEARCHES = Object.freeze([
  'Attention U-Net',
  'Active Directory',
  'HOG',
  'Burp Suite',
  'Community Detection',
  'Open Crack Detection'
]);

