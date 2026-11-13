/**
 * @file data-validation.test.mjs
 * @description Automated Node.js tests for data.js, validation.js, and recruiter-brief.js.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { CONTENT, CLAIMS, EVIDENCE, PROJECTS, SKILLS, GRAPH, CAPTIONS } from '../js/modules/data.js';
import { validatePortfolioData } from '../js/modules/validation.js';
import {
  generateEngineeringBriefData,
  generateJsonResumeObject,
  validateJsonResume
} from '../js/modules/recruiter-brief.js';

test('Central portfolio data passes all integrity validations with zero errors', () => {
  const result = validatePortfolioData();
  assert.equal(result.valid, true, `Validation errors: ${result.errors.join(', ')}`);
  assert.equal(result.errors.length, 0);
  assert.equal(result.summary.projectsCount, 4);
  assert.ok(result.summary.skillsCount >= 30);
  assert.ok(result.summary.graphNodesCount >= 18);
  assert.ok(result.summary.graphEdgesCount >= 18);
});

test('Validator detects duplicate project IDs, missing evidence references, and unsupported TensorFlow-Gait links', () => {
  const brokenProjects = [
    ...PROJECTS,
    {
      ...PROJECTS[0],
      id: 'crack-detection' // Duplicate ID
    },
    {
      ...PROJECTS[2],
      id: 'gait-recognition',
      technologies: [...PROJECTS[2].technologies, 'TensorFlow'], // Unsupported link
      evidenceIds: ['non-existent-evidence-id']
    }
  ];

  const res = validatePortfolioData({
    CONTENT,
    CLAIMS,
    EVIDENCE,
    PROJECTS: brokenProjects,
    SKILLS,
    GRAPH
  });

  assert.equal(res.valid, false);
  assert.ok(res.errors.some(e => e.includes('Duplicate project id')));
  assert.ok(res.errors.some(e => e.includes('missing evidence id')));
  assert.ok(res.errors.some(e => e.includes('TensorFlow must not be linked to gait-recognition')));
});

test('Mandatory demonstration and architectural captions match specification', () => {
  assert.equal(
    CAPTIONS.SYNTHETIC_DEMO,
    'Educational demonstration using synthetic data. Not the original project implementation or experimental results.'
  );
  assert.equal(
    CAPTIONS.STATIC_DIAGRAM,
    'Illustrative architecture diagram. Represents the conceptual workflow.'
  );
  assert.equal(
    CAPTIONS.SECURITY_DEMO,
    'Educational secure-coding demonstration. The original Devign-based project model is not running in this interface.'
  );
});

test('Dynamic Engineering Brief filters projects and experience by selected domains', () => {
  const systemsOnly = generateEngineeringBriefData(['systems']);
  assert.equal(systemsOnly.experience.length, 1);
  assert.equal(systemsOnly.experience[0].id, 'exp-atticube');

  const researchOnly = generateEngineeringBriefData(['research']);
  assert.ok(researchOnly.projects.some(p => p.id === 'crack-detection'));
  assert.ok(researchOnly.projects.some(p => p.id === 'community-detection-research'));
});

test('JSON Resume export generates a valid schema-compatible structure matching verified CV', () => {
  const resume = generateJsonResumeObject();
  const validation = validateJsonResume(resume);
  assert.equal(validation.valid, true, `JSON Resume errors: ${validation.errors.join(', ')}`);
  assert.equal(resume.basics.name, 'George Priji Promod');
  assert.equal(resume.basics.email, 'georgepriji@gmail.com');
  assert.equal(resume.certificates.length, 9);
});

