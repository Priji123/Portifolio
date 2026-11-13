/**
 * @file demonstrations.test.mjs
 * @description Automated Node.js tests for the 4 interactive laboratories' pure deterministic
 * synthetic generators and algorithms:
 * - crack-lab.js + image-processing.worker.js
 * - gait-lab.js (Silhouette, GEI, HOG)
 * - vulnerability-lab.js (No fake probability/severity scores, explicit synthetic attribution)
 * - community-lab.js (Deterministic graph generation & LPA label propagation convergence)
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSyntheticCrackImage, CRACK_PIPELINE_STAGES, CRACK_CONCEPT_TABS } from '../js/labs/crack-lab.js';
import { processSyntheticCrackBuffer } from '../js/workers/image-processing.worker.js';
import {
  generateSyntheticSilhouetteFrame,
  computeGaitEnergyImage,
  computeHOGCells,
  GAIT_PIPELINE_STAGES
} from '../js/labs/gait-lab.js';
import { SECURITY_CODE_EXAMPLES } from '../js/labs/vulnerability-lab.js';
import {
  generateSyntheticGraph,
  stepLabelPropagation,
  COMMUNITY_ALGORITHMS
} from '../js/labs/community-lab.js';

test('Crack Lab: deterministic synthetic surface generator and image filters produce consistent buffers', () => {
  assert.equal(CRACK_PIPELINE_STAGES.length, 6);
  assert.equal(CRACK_CONCEPT_TABS.length, 6);

  const imgA = generateSyntheticCrackImage(120, 80, 42, 18);
  const imgB = generateSyntheticCrackImage(120, 80, 42, 18);
  assert.equal(imgA.length, 120 * 80);
  assert.deepEqual(imgA, imgB, 'Synthetic crack generator must be 100% deterministic for the same seed');

  for (const mode of ['bilateral', 'clahe', 'frangi', 'morphology']) {
    const out = processSyntheticCrackBuffer(imgA, 120, 80, mode, { sigmaSpatial: 2.0, sensitivity: 1.2 });
    assert.equal(out.length, imgA.length);
  }
});

test('Gait Lab: silhouette frame generator, GEI accumulation, and HOG cell orientation calculation', () => {
  assert.equal(GAIT_PIPELINE_STAGES.length, 7);

  const frames = [];
  for (let i = 0; i < 8; i++) {
    const frame = generateSyntheticSilhouetteFrame(64, 80, i / 8);
    assert.equal(frame.length, 64 * 80);
    frames.push(frame);
  }

  const gei = computeGaitEnergyImage(frames);
  assert.equal(gei.length, 64 * 80);

  // Interior torso pixel should have high mean intensity (255)
  const torsoPixel = gei[50 * 64 + 32];
  assert.equal(torsoPixel, 255);

  const hog = computeHOGCells(gei, 64, 80, 16);
  assert.equal(hog.cellsX, 4);
  assert.equal(hog.cellsY, 5);
  assert.equal(hog.histograms.length, 20);
  assert.ok(hog.maxMagnitude > 0);
});

test('Vulnerability Lab: examples contain no fake confidence scores and explicitly label synthetic attributions', () => {
  assert.equal(SECURITY_CODE_EXAMPLES.length, 2);

  for (const ex of SECURITY_CODE_EXAMPLES) {
    assert.ok(ex.codeLines.length > 5);
    assert.ok(ex.saferAlternative.includes('_safe'));

    for (const region of Object.values(ex.regions)) {
      assert.ok(region.title);
      assert.ok(region.concern);
      assert.ok(region.principle);
      for (const item of region.syntheticContributions) {
        assert.ok(
          item.weight.includes('Synthetic Demo Attribution'),
          'Every attribution weight must be explicitly marked as a synthetic demo attribution'
        );
      }
    }
  }
});

test('Community Detection Lab: distinguishes implemented overlapping algorithms from baselines and runs deterministic LPA', () => {
  const implemented = COMMUNITY_ALGORITHMS.filter(a => a.roleGroup.includes('Candidate-Implemented'));
  const implementedNames = implemented.map(a => a.name);
  assert.deepEqual(implementedNames, ['LBLD', 'FSLD', 'Prasar']);

  const g1 = generateSyntheticGraph(101);
  const g2 = generateSyntheticGraph(101);
  assert.equal(g1.nodes.length, 17);
  assert.deepEqual(g1.edges, g2.edges);

  // Step LPA and verify community count reduces from 17 unique labels toward cluster consensus
  let nodes = g1.nodes;
  for (let iter = 0; iter < 5; iter++) {
    const res = stepLabelPropagation(nodes, g1.adjacency);
    nodes = res.updatedNodes;
  }
  const uniqueCommunitiesAfterLPA = new Set(nodes.map(n => n.currentLabel)).size;
  assert.ok(uniqueCommunitiesAfterLPA <= 5, `Expected LPA to merge labels into clusters, got ${uniqueCommunitiesAfterLPA}`);
});

