/**
 * @file search.test.mjs
 * @description Automated Node.js tests for the Unified Search & Command Registry (search.js).
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCommandRegistry, searchRegistry, SUGGESTED_SEARCHES } from '../js/modules/search.js';

test('Unified command registry contains sections, projects, skills, experiences, concepts, and labs', () => {
  const registry = buildCommandRegistry();
  assert.ok(registry.length >= 45);

  const types = new Set(registry.map(r => r.type));
  assert.ok(types.has('section'));
  assert.ok(types.has('project'));
  assert.ok(types.has('skill'));
  assert.ok(types.has('experience'));
  assert.ok(types.has('concept'));
  assert.ok(types.has('lab'));
  assert.ok(types.has('action'));
});

test('All required example searches return relevant verified entries', () => {
  const registry = buildCommandRegistry();

  for (const query of SUGGESTED_SEARCHES) {
    const results = searchRegistry(query, registry, 5);
    assert.ok(results.length > 0, `Expected results for query "${query}"`);
  }

  const attUnetResults = searchRegistry('Attention U-Net', registry, 5);
  assert.ok(
    attUnetResults.some(r => r.title.includes('Attention U-Net') || r.projectId === 'crack-detection')
  );

  const adResults = searchRegistry('Active Directory', registry, 5);
  assert.ok(
    adResults.some(r => r.title.includes('Active Directory') || r.experienceId === 'exp-atticube')
  );

  const hogResults = searchRegistry('HOG', registry, 5);
  assert.ok(
    hogResults.some(r => r.title.includes('HOG') || r.projectId === 'gait-recognition')
  );

  const burpResults = searchRegistry('Burp Suite', registry, 5);
  assert.ok(
    burpResults.some(r => r.title.includes('Burp Suite') || r.experienceId === 'exp-canza')
  );

  const commResults = searchRegistry('Community Detection', registry, 5);
  assert.ok(
    commResults.some(r => r.title.includes('Community Detection') || r.projectId === 'community-detection-research')
  );

  const openCrackResults = searchRegistry('Open Crack Detection', registry, 5);
  assert.equal(openCrackResults[0].projectId, 'crack-detection');
});

