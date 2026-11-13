/**
 * @file validation.js
 * @description Validates portfolio data integrity:
 * - Required project fields
 * - Missing links (ensuring PENDING items do not expose broken links and AVAILABLE items have valid sources)
 * - Duplicate identifiers across projects, claims, evidence, skills, and graph nodes
 * - Invalid category relationships
 * - Missing evidence references
 * - Unsupported skill-to-project connections (e.g., enforcing strict factual boundaries)
 *
 * Pure functional module — does not attempt to determine scientific truth via string matching,
 * relying on human-supplied structured declarations as the factual authority.
 */

import { CONTENT, CLAIMS, EVIDENCE, PROJECTS, SKILLS, GRAPH } from './data.js';

const VALID_PROJECT_CATEGORIES = new Set(['cv-ml', 'security-ml', 'research-alg', 'systems-infra']);
const VALID_EVIDENCE_STATUSES = new Set(['AVAILABLE', 'PENDING', 'EXTERNAL LINK']);
const VALID_GRAPH_NODE_TYPES = new Set(['skill', 'project', 'experience', 'technology']);

/**
 * Validates the supplied portfolio dataset (defaults to the central data module).
 * @param {Object} dataset
 * @returns {{ valid: boolean, errors: string[], warnings: string[], summary: Object }}
 */
export function validatePortfolioData(dataset = { CONTENT, CLAIMS, EVIDENCE, PROJECTS, SKILLS, GRAPH }) {
  const errors = [];
  const warnings = [];

  const {
    CONTENT: content = CONTENT,
    CLAIMS: claims = CLAIMS,
    EVIDENCE: evidence = EVIDENCE,
    PROJECTS: projects = PROJECTS,
    SKILLS: skills = SKILLS,
    GRAPH: graph = GRAPH
  } = dataset;

  // 1. Validate Candidate & Experience IDs
  if (!content || !content.candidate || !content.candidate.name || !content.candidate.email) {
    errors.push('Candidate profile is missing required name or email.');
  }

  const experienceIds = new Set();
  for (const exp of content?.experience || []) {
    if (!exp.id) {
      errors.push('Experience entry missing id.');
    } else if (experienceIds.has(exp.id)) {
      errors.push(`Duplicate experience id: "${exp.id}".`);
    } else {
      experienceIds.add(exp.id);
    }
  }

  // 2. Validate Evidence entries & duplicate IDs
  const evidenceIds = new Set();
  for (const item of evidence || []) {
    if (!item.id) {
      errors.push('Evidence item is missing an id.');
      continue;
    }
    if (evidenceIds.has(item.id)) {
      errors.push(`Duplicate evidence id: "${item.id}".`);
    }
    evidenceIds.add(item.id);

    if (!VALID_EVIDENCE_STATUSES.has(item.status)) {
      errors.push(`Evidence "${item.id}" has invalid status "${item.status}".`);
    }

    if ((item.status === 'AVAILABLE' || item.status === 'EXTERNAL LINK') && (!item.source || typeof item.source !== 'string' || item.source.trim() === '' || item.source === '#')) {
      errors.push(`Evidence "${item.id}" is marked ${item.status} but has a missing or placeholder source link.`);
    }

    if (item.status === 'PENDING' && item.source !== null) {
      warnings.push(`Evidence "${item.id}" is PENDING but has a non-null source.`);
    }
  }

  // 3. Validate Projects: required fields, duplicate IDs, categories, and evidence references
  const projectIds = new Set();
  const REQUIRED_PROJECT_FIELDS = ['id', 'title', 'subtitle', 'category', 'summary', 'technologies', 'bullets', 'decisions', 'evidenceIds'];

  for (const project of projects || []) {
    for (const field of REQUIRED_PROJECT_FIELDS) {
      if (project[field] === undefined || project[field] === null || project[field] === '') {
        errors.push(`Project "${project.id || 'UNKNOWN'}" is missing required field "${field}".`);
      }
    }

    if (!project.id) continue;

    if (projectIds.has(project.id)) {
      errors.push(`Duplicate project id: "${project.id}".`);
    }
    projectIds.add(project.id);

    if (!VALID_PROJECT_CATEGORIES.has(project.category)) {
      errors.push(`Project "${project.id}" has invalid category "${project.category}".`);
    }

    if (Array.isArray(project.evidenceIds)) {
      for (const evId of project.evidenceIds) {
        if (!evidenceIds.has(evId)) {
          errors.push(`Project "${project.id}" references missing evidence id "${evId}".`);
        }
      }
    }

    // Ensure TensorFlow is not linked to gait-recognition per explicit domain rule
    if (project.id === 'gait-recognition' && Array.isArray(project.technologies)) {
      const hasTF = project.technologies.some(t => t.toLowerCase().includes('tensorflow'));
      if (hasTF) {
        errors.push('Unsupported technology link: TensorFlow must not be linked to gait-recognition.');
      }
    }
  }

  // Verify every evidence item's projectId points to an existing project
  for (const item of evidence || []) {
    if (item.projectId && !projectIds.has(item.projectId)) {
      errors.push(`Evidence "${item.id}" references non-existent projectId "${item.projectId}".`);
    }
  }

  // 4. Validate Claims
  const claimIds = new Set();
  for (const claim of claims || []) {
    if (!claim.id) {
      errors.push('Claim entry missing id.');
      continue;
    }
    if (claimIds.has(claim.id)) {
      errors.push(`Duplicate claim id: "${claim.id}".`);
    }
    claimIds.add(claim.id);

    if (!projectIds.has(claim.projectId)) {
      errors.push(`Claim "${claim.id}" references unknown project "${claim.projectId}".`);
    }
  }

  // 5. Validate Skills & Skill-to-Project / Skill-to-Experience Connections
  const skillIds = new Set();
  const categoryIds = new Set();

  for (const group of skills || []) {
    if (!group.id || !group.category) {
      errors.push('Skill group missing id or category title.');
    } else if (categoryIds.has(group.id)) {
      errors.push(`Duplicate skill category id: "${group.id}".`);
    } else {
      categoryIds.add(group.id);
    }

    for (const skill of group.items || []) {
      if (!skill.id || !skill.name) {
        errors.push(`Skill in category "${group.category}" missing id or name.`);
        continue;
      }
      if (skillIds.has(skill.id)) {
        errors.push(`Duplicate skill id: "${skill.id}".`);
      }
      skillIds.add(skill.id);

      for (const relProj of skill.relatedProjects || []) {
        if (!projectIds.has(relProj)) {
          errors.push(`Skill "${skill.id}" references unknown project "${relProj}".`);
        }
        // Check explicit boundary rule: TensorFlow must not connect to gait-recognition
        if (skill.id === 'skill-tensorflow' && relProj === 'gait-recognition') {
          errors.push('Unsupported skill-to-project connection: skill-tensorflow cannot link to gait-recognition.');
        }
      }

      for (const relExp of skill.relatedExperience || []) {
        if (!experienceIds.has(relExp)) {
          errors.push(`Skill "${skill.id}" references unknown experience "${relExp}".`);
        }
      }
    }
  }

  // 6. Validate Knowledge Graph 2.0 Nodes and Edges
  const graphNodeIds = new Set();
  for (const node of graph?.nodes || []) {
    if (!node.id || !node.label || !node.type) {
      errors.push(`Graph node "${node.id || 'UNKNOWN'}" is missing id, label, or type.`);
      continue;
    }
    if (graphNodeIds.has(node.id)) {
      errors.push(`Duplicate graph node id: "${node.id}".`);
    }
    graphNodeIds.add(node.id);

    if (!VALID_GRAPH_NODE_TYPES.has(node.type)) {
      errors.push(`Graph node "${node.id}" has invalid type "${node.type}".`);
    }

    // Verify refId exists in corresponding domain collection
    if (node.type === 'project' && !projectIds.has(node.refId)) {
      errors.push(`Graph project node "${node.id}" references unknown project "${node.refId}".`);
    }
    if (node.type === 'experience' && !experienceIds.has(node.refId)) {
      errors.push(`Graph experience node "${node.id}" references unknown experience "${node.refId}".`);
    }
    if ((node.type === 'skill' || node.type === 'technology') && !skillIds.has(node.refId)) {
      errors.push(`Graph node "${node.id}" references unknown skill "${node.refId}".`);
    }
  }

  for (const edge of graph?.edges || []) {
    if (!graphNodeIds.has(edge.source)) {
      errors.push(`Graph edge source "${edge.source}" does not exist in GRAPH.nodes.`);
    }
    if (!graphNodeIds.has(edge.target)) {
      errors.push(`Graph edge target "${edge.target}" does not exist in GRAPH.nodes.`);
    }
    if (edge.source === 'tech-tf' && edge.target === 'proj-gait') {
      errors.push('Unsupported graph edge: TensorFlow (tech-tf) must not connect to Gait Recognition (proj-gait).');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary: {
      projectsCount: projectIds.size,
      claimsCount: claimIds.size,
      evidenceCount: evidenceIds.size,
      skillsCount: skillIds.size,
      graphNodesCount: graphNodeIds.size,
      graphEdgesCount: (graph?.edges || []).length
    }
  };
}

