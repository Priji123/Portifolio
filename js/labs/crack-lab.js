/**
 * @file crack-lab.js
 * @description COMPUTER VISION / IMAGE SEGMENTATION LAB
 *
 * Interactive Crack Detection Pipeline Explorer & isolated synthetic image-processing sandbox.
 * Strictly separates documented M.Tech thesis components (Attention U-Net, Frangi pseudo-mask
 * generation on 10,000+ image pairs, Tversky Loss, Dice Coefficient) from general technical
 * concepts (IoU, Bilateral, CLAHE, Morphological closing) and synthetic demonstrations.
 */

import { CAPTIONS } from '../modules/data.js';
import { processSyntheticCrackBuffer } from '../workers/image-processing.worker.js';

export const CRACK_PIPELINE_STAGES = Object.freeze([
  {
    id: 'stage-surface-image',
    step: '01',
    title: 'SURFACE IMAGE',
    classification: 'DOCUMENTED',
    description: 'Ingestion of raw building surface images spanning diverse textures (concrete, brick, rough plaster) and real-world environmental lighting conditions.',
    technologies: ['Python', 'OpenCV', '10,000+ Multi-Texture Image Pairs'],
    concept: 'Raw surface inspection images exhibit low signal-to-noise ratios: thin dark crack fissures are embedded in high-frequency aggregate grain, surface stains, and illumination gradients.',
    role: 'Provides the multi-texture input corpus (10,000+ image pairs) processed by the automated labelling and training pipeline.',
    evidenceNote: 'Documented in M.Tech Thesis CV entry (Page 1).'
  },
  {
    id: 'stage-preprocessing',
    step: '02',
    title: 'IMAGE PREPROCESSING',
    classification: 'CONCEPT',
    description: 'Edge-preserving surface texture smoothing and local contrast normalization prior to ridge detection.',
    technologies: ['OpenCV', 'scikit-image', 'Bilateral Filtering', 'CLAHE'],
    concept: 'Bilateral filtering attenuates granular surface noise using both spatial proximity and photometric similarity so crack edges are not blurred. CLAHE (Contrast Limited Adaptive Histogram Equalization) normalizes uneven shadows across tiles while clipping histogram peaks to prevent noise amplification.',
    role: 'Suppresses background surface texture clutter while preserving sharp intensity transitions along fine crack boundaries.',
    evidenceNote: 'Documented skill (Image Preprocessing, OpenCV, scikit-image); specific filter explanations presented as technical concepts.'
  },
  {
    id: 'stage-pseudo-mask',
    step: '03',
    title: 'PSEUDO-MASK GENERATION',
    classification: 'DOCUMENTED',
    description: 'Automated data labelling pipeline using Frangi filter-based pseudo-mask generation, processing 10,000+ image pairs without manual annotation.',
    technologies: ['Python', 'Frangi Filter (Hessian Eigenvalues)', 'Morphological Processing', 'scikit-image'],
    concept: 'The Frangi filter analyzes eigenvalues (|λ₁| ≪ |λ₂|) of the second-order Hessian matrix at multiple scales to isolate continuous tubular/ridge-like crack structures from isotropic surface pores. Morphological closing then bridges micro-discontinuities along the detected crack skeleton.',
    role: 'Eliminates manual pixel-by-pixel annotation bottleneck across 10,000+ image pairs by generating structured training masks automatically.',
    evidenceNote: 'Documented M.Tech Thesis innovation (CV Page 1).'
  },
  {
    id: 'stage-attention-unet',
    step: '04',
    title: 'ATTENTION U-NET',
    classification: 'DOCUMENTED',
    description: 'Deep learning encoder-decoder architecture with Attention Gates integrated along skip connections, trained in a mixed-precision TensorFlow pipeline.',
    technologies: ['Python', 'TensorFlow (Mixed-Precision)', 'Attention U-Net', 'Attention Gates'],
    concept: 'In a standard U-Net, skip connections pass raw shallow encoder feature maps directly to the decoder, transferring background texture clutter. Attention Gates compute spatial attention coefficients α ∈ [0,1] using coarse decoder gating signals, suppressing irrelevant surface textures and focusing capacity on crack topology.',
    role: 'Learns multi-scale hierarchical representations for accurate crack localization across diverse surface textures.',
    evidenceNote: 'Documented M.Tech Thesis model architecture (CV Page 1).'
  },
  {
    id: 'stage-segmentation',
    step: '05',
    title: 'SEMANTIC SEGMENTATION',
    classification: 'DOCUMENTED',
    description: 'Pixel-level dense classification producing binary crack segmentation maps at full spatial resolution.',
    technologies: ['Semantic Segmentation', 'Python', 'TensorFlow'],
    concept: 'Assigns each pixel (x, y) a foreground crack probability via a sigmoid activation layer, preserving continuous crack geometry, branching points, and width variations.',
    role: 'Produces the final pixel-level crack map from input surface imagery.',
    evidenceNote: 'Documented M.Tech Thesis objective (CV Page 1).'
  },
  {
    id: 'stage-evaluation',
    step: '06',
    title: 'EVALUATION',
    classification: 'DOCUMENTED',
    description: 'Optimization and evaluation using custom Tversky Loss and Dice Coefficient in a mixed-precision TensorFlow training pipeline.',
    technologies: ['Tversky Loss (Documented)', 'Dice Coefficient (Documented)', 'IoU (General Concept)'],
    concept: 'Tversky Loss weights false negatives (β) and false positives (α) asymmetrically to overcome extreme class imbalance where crack pixels are <3% of the image. The Dice Coefficient (2TP / (2TP + FP + FN)) quantifies spatial overlap. Intersection over Union (IoU = TP / (TP + FP + FN)) is a related general segmentation metric.',
    role: 'Ensures the trained model does not collapse into predicting all-background and accurately captures fine crack structures.',
    evidenceNote: 'Tversky Loss and Dice Coefficient are documented thesis components. IoU is presented strictly as a general segmentation concept.'
  }
]);

export const CRACK_CONCEPT_TABS = Object.freeze([
  {
    id: 'concept-bilateral',
    title: 'Bilateral Filtering',
    classification: 'CONCEPT',
    summary: 'Edge-preserving spatial and range smoothing.',
    formula: 'I_filtered(x) = (1 / W_p) Σ I(x_i) · f_r(||I(x_i) - I(x)||) · g_s(||x_i - x||)',
    details: 'Unlike Gaussian blur—which averages pixels purely by spatial distance and blurs fine crack boundaries—the Bilateral filter multiplies a spatial Gaussian kernel g_s with a photometric range Gaussian f_r. Pixels across a sharp dark crack boundary have large intensity differences and receive near-zero averaging weight, smoothing concrete grain while keeping crack edges crisp.'
  },
  {
    id: 'concept-clahe',
    title: 'CLAHE',
    classification: 'CONCEPT',
    summary: 'Contrast Limited Adaptive Histogram Equalization.',
    formula: 'Clip Limit β = (M / N) · (1 + (α / 100) · (S_max - 1))',
    details: 'Global histogram equalization amplifies noise in uniform concrete regions when illumination varies across a wall. CLAHE divides the image into contextual tiles, equalizes local contrast, and clips histogram bins at a predefined threshold before redistributing excess counts uniformly—enhancing hairline cracks inside cast shadows.'
  },
  {
    id: 'concept-frangi',
    title: 'Frangi Filtering',
    classification: 'DOCUMENTED',
    summary: 'Hessian-based tubular/ridge structure enhancement used for automated pseudo-mask generation.',
    formula: 'V(σ) = exp(-R_B² / 2β²) · (1 - exp(-S² / 2c²)), where R_B = |λ₁| / |λ₂|, S = √(λ₁² + λ₂²)',
    details: 'Documented thesis component used to process 10,000+ image pairs without manual annotation. By computing eigenvalues (λ₁, λ₂) of the local Hessian matrix H(x, y), the filter distinguishes elongated crack ridges (small curvature along the crack |λ₁| ≈ 0, high curvature across the crack |λ₂| ≫ 0) from round surface pores (|λ₁| ≈ |λ₂|).'
  },
  {
    id: 'concept-morph',
    title: 'Morphological Processing',
    classification: 'CONCEPT',
    summary: 'Structural dilation and erosion (closing) for pseudo-mask continuity.',
    formula: 'A • B = (A ⊕ B) ⊖ B  (Dilation followed by Erosion with structuring element B)',
    details: 'After ridge enhancement, surface aggregate particles can cause tiny 1–2 pixel gaps along a continuous crack trace. Morphological closing dilates foreground responses with a small disk/line structuring element and then erodes back to original thickness, connecting fragmented segments into clean pseudo-masks.'
  },
  {
    id: 'concept-att-unet',
    title: 'Attention U-Net',
    classification: 'DOCUMENTED',
    summary: 'Encoder-decoder segmentation network with spatial Attention Gates on skip connections.',
    formula: 'q_att = ψ^T(σ₁(W_x^T x^l + W_g^T g + b_g)) + b_ψ ;  α^l = σ₂(q_att)',
    details: 'Documented thesis architecture implemented in Python & TensorFlow. Standard U-Net skip connections concatenate multi-resolution encoder features (x^l) directly into the decoder, passing noisy surface texture gradients. Attention Gates use the coarser gating signal (g) to compute spatial attention weights α^l ∈ [0, 1], attenuating background texture regions prior to concatenation.'
  },
  {
    id: 'concept-loss-eval',
    title: 'Loss & Evaluation',
    classification: 'DOCUMENTED',
    summary: 'Documented Tversky Loss & Dice Coefficient + Conceptual IoU explanation.',
    formula: 'TI = TP / (TP + α·FP + β·FN)  |  Dice = 2TP / (2TP + FP + FN)  |  IoU (Concept) = TP / (TP + FP + FN)',
    details: 'Documented Thesis Components: Tversky Loss and Dice Coefficient were implemented in the mixed-precision TensorFlow training pipeline to handle severe pixel-level class imbalance. General Segmentation Concept: Intersection over Union (IoU / Jaccard Index) is related monotonically to Dice (Dice = 2·IoU / (1 + IoU)), included here for conceptual completeness without claiming IoU as a thesis metric.'
  }
]);

/**
 * Generates a deterministic synthetic grayscale surface image with a realistic branching crack.
 * Pure deterministic PRNG (Mulberry32) so tests and resets are 100% reproducible.
 * @param {number} width
 * @param {number} height
 * @param {number} seed
 * @param {number} noiseLevel
 * @returns {Uint8ClampedArray}
 */
export function generateSyntheticCrackImage(width = 240, height = 160, seed = 42, noiseLevel = 18) {
  let state = seed >>> 0;
  const rand = () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const gray = new Uint8ClampedArray(width * height);

  // 1. Base concrete illumination gradient + granular texture
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const grad = 175 + 22 * Math.sin((x / width) * Math.PI) - 18 * (y / height);
      const grain = (rand() - 0.5) * 2 * noiseLevel;
      const pore = rand() > 0.992 ? -38 : 0;
      gray[y * width + x] = Math.min(245, Math.max(25, Math.round(grad + grain + pore)));
    }
  }

  // 2. Carve main branching crack path across the surface
  let cy = height * 0.22;
  for (let x = 8; x < width - 8; x++) {
    cy += Math.sin(x * 0.085 + (seed % 7)) * 0.65 + (rand() - 0.48) * 1.1;
    cy = Math.max(16, Math.min(height - 16, cy));
    const iy = Math.round(cy);

    for (let dy = -2; dy <= 2; dy++) {
      const ny = iy + dy;
      if (ny >= 0 && ny < height) {
        const attenuation = dy === 0 ? 115 : Math.abs(dy) === 1 ? 68 : 24;
        const idx = ny * width + x;
        gray[idx] = Math.max(12, gray[idx] - attenuation);
      }
    }

    // Secondary hairline branch
    if (x > width * 0.42 && x < width * 0.82) {
      const by = Math.min(height - 8, Math.round(cy + (x - width * 0.42) * 0.48));
      for (let dy = -1; dy <= 1; dy++) {
        const ny = by + dy;
        if (ny >= 0 && ny < height) {
          const att = dy === 0 ? 88 : 42;
          gray[ny * width + x] = Math.max(18, gray[ny * width + x] - att);
        }
      }
    }
  }

  return gray;
}

/**
 * Renders a grayscale Uint8ClampedArray onto a 2D canvas context.
 */
function drawGrayscaleToCanvas(canvas, gray, width, height, highlightMode = false) {
  if (!canvas) return;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const imgData = ctx.createImageData(width, height);
  const data = imgData.data;

  for (let i = 0; i < gray.length; i++) {
    const v = gray[i];
    const p = i * 4;
    if (highlightMode) {
      // Pseudo-mask / Frangi turquoise-amber scientific map
      data[p] = Math.min(255, Math.round(v * 0.25));
      data[p + 1] = Math.min(255, Math.round(v * 0.95));
      data[p + 2] = Math.min(255, Math.round(v * 0.82));
      data[p + 3] = 255;
    } else {
      data[p] = v;
      data[p + 1] = v;
      data[p + 2] = v;
      data[p + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

/**
 * Initializes the Computer Vision / Image Segmentation Lab inside the given container.
 */
export function initCrackLab() {
  const root = document.getElementById('crack-lab-root');
  if (!root || root.dataset.initialized === 'true') return;
  root.dataset.initialized = 'true';

  // 1. Pipeline stage selection
  const stageButtons = root.querySelectorAll('[data-crack-stage]');
  const stageTitle = document.getElementById('crack-stage-title');
  const stageBadge = document.getElementById('crack-stage-badge');
  const stageDesc = document.getElementById('crack-stage-desc');
  const stageConcept = document.getElementById('crack-stage-concept');
  const stageRole = document.getElementById('crack-stage-role');
  const stageTechList = document.getElementById('crack-stage-tech');
  const stageEvidence = document.getElementById('crack-stage-evidence');

  const selectStage = (stageId) => {
    const found = CRACK_PIPELINE_STAGES.find(s => s.id === stageId) || CRACK_PIPELINE_STAGES[0];
    stageButtons.forEach(btn => {
      const isSelected = btn.getAttribute('data-crack-stage') === found.id;
      btn.classList.toggle('is-active', isSelected);
      btn.setAttribute('aria-selected', String(isSelected));
    });

    if (stageTitle) stageTitle.textContent = `${found.step}. ${found.title}`;
    if (stageBadge) {
      stageBadge.textContent = found.classification;
      stageBadge.className = `classification-badge badge-${found.classification.toLowerCase()}`;
    }
    if (stageDesc) stageDesc.textContent = found.description;
    if (stageConcept) stageConcept.textContent = found.concept;
    if (stageRole) stageRole.textContent = found.role;
    if (stageEvidence) stageEvidence.textContent = found.evidenceNote;

    if (stageTechList) {
      stageTechList.textContent = '';
      for (const tech of found.technologies) {
        const li = document.createElement('li');
        li.className = 'tech-pill';
        li.textContent = tech;
        stageTechList.appendChild(li);
      }
    }
  };

  stageButtons.forEach(btn => {
    btn.addEventListener('click', () => selectStage(btn.getAttribute('data-crack-stage')));
  });

  // 2. Interactive Concept Explorer Tabs (Bilateral, CLAHE, Frangi, Morphological, Attention U-Net, Loss/Eval)
  const conceptButtons = root.querySelectorAll('[data-crack-concept]');
  const conceptTitle = document.getElementById('crack-concept-title');
  const conceptBadge = document.getElementById('crack-concept-badge');
  const conceptFormula = document.getElementById('crack-concept-formula');
  const conceptDetails = document.getElementById('crack-concept-details');

  const selectConcept = (conceptId) => {
    const found = CRACK_CONCEPT_TABS.find(c => c.id === conceptId) || CRACK_CONCEPT_TABS[2];
    conceptButtons.forEach(btn => {
      const isSelected = btn.getAttribute('data-crack-concept') === found.id;
      btn.classList.toggle('is-active', isSelected);
      btn.setAttribute('aria-selected', String(isSelected));
    });

    if (conceptTitle) conceptTitle.textContent = found.title;
    if (conceptBadge) {
      conceptBadge.textContent = found.classification;
      conceptBadge.className = `classification-badge badge-${found.classification.toLowerCase()}`;
    }
    if (conceptFormula) conceptFormula.textContent = found.formula;
    if (conceptDetails) conceptDetails.textContent = found.details;
  };

  conceptButtons.forEach(btn => {
    btn.addEventListener('click', () => selectConcept(btn.getAttribute('data-crack-concept')));
  });

  // 3. Interactive Attention U-Net Schematic Node Inspector
  const unetNodes = root.querySelectorAll('[data-unet-part]');
  const unetDetail = document.getElementById('unet-schematic-detail');
  const UNET_DESCRIPTIONS = {
    encoder: 'Encoder (Contracting Path): Repeated 3×3 convolutions and downsampling layers capture hierarchical surface texture and multi-scale crack context.',
    bottleneck: 'Bottleneck Bridge: Highest semantic abstraction layer capturing global structural continuity across the image patch.',
    attention: 'Attention Gates (Documented Thesis Component): Weight skip-connection features spatially using coarse decoder gating signals to suppress background concrete/brick texture clutter.',
    skip: 'Gated Skip Connections: Concatenate attention-filtered fine spatial details from the encoder with upsampled decoder features.',
    decoder: 'Decoder (Expanding Path): Upsamples feature maps and outputs pixel-level semantic crack segmentation probabilities.'
  };

  unetNodes.forEach(node => {
    node.addEventListener('click', () => {
      const part = node.getAttribute('data-unet-part');
      unetNodes.forEach(n => n.classList.toggle('is-active', n === node));
      if (unetDetail && UNET_DESCRIPTIONS[part]) {
        unetDetail.textContent = UNET_DESCRIPTIONS[part];
      }
    });
  });

  // 4. Isolated Synthetic Image-Processing Sandbox (Canvas + Web Worker with fallback)
  const canvasBefore = document.getElementById('crack-canvas-before');
  const canvasAfter = document.getElementById('crack-canvas-after');
  const modeSelect = document.getElementById('crack-filter-mode');
  const noiseInput = document.getElementById('crack-param-noise');
  const sigmaInput = document.getElementById('crack-param-sigma');
  const sensitivityInput = document.getElementById('crack-param-sensitivity');
  const resetBtn = document.getElementById('crack-sandbox-reset');
  const timingBadge = document.getElementById('crack-processing-time');
  const captionEl = document.getElementById('crack-demo-caption');

  if (captionEl) {
    captionEl.textContent = CAPTIONS.SYNTHETIC_DEMO;
  }

  const WIDTH = 240;
  const HEIGHT = 160;
  let worker = null;
  let requestCounter = 0;

  try {
    if (typeof Worker !== 'undefined') {
      worker = new Worker(new URL('../workers/image-processing.worker.js', import.meta.url), { type: 'module' });
    }
  } catch {
    worker = null;
  }

  const runSandboxProcessing = () => {
    if (!canvasBefore || !canvasAfter) return;
    const mode = modeSelect ? modeSelect.value : 'frangi';
    const noiseLevel = noiseInput ? Number(noiseInput.value) : 18;
    const sigmaSpatial = sigmaInput ? Number(sigmaInput.value) : 2.0;
    const sensitivity = sensitivityInput ? Number(sensitivityInput.value) : 1.2;

    const rawGray = generateSyntheticCrackImage(WIDTH, HEIGHT, 42, noiseLevel);
    drawGrayscaleToCanvas(canvasBefore, rawGray, WIDTH, HEIGHT, false);

    const isMaskHighlight = mode === 'frangi' || mode === 'morphology';

    if (worker) {
      const reqId = ++requestCounter;
      worker.onmessage = (e) => {
        if (e.data.id !== reqId) return;
        drawGrayscaleToCanvas(canvasAfter, new Uint8ClampedArray(e.data.processed), WIDTH, HEIGHT, isMaskHighlight);
        if (timingBadge && typeof e.data.elapsedMs === 'number') {
          timingBadge.textContent = `Measured execution: ${e.data.elapsedMs} ms (Web Worker)`;
        }
      };
      worker.postMessage({
        id: reqId,
        gray: rawGray,
        width: WIDTH,
        height: HEIGHT,
        mode,
        params: { sigmaSpatial, sensitivity, clipLimit: 2.4, morphRadius: 1 }
      });
    } else {
      const t0 = performance.now();
      const processed = processSyntheticCrackBuffer(rawGray, WIDTH, HEIGHT, mode, {
        sigmaSpatial,
        sensitivity,
        clipLimit: 2.4,
        morphRadius: 1
      });
      const elapsedMs = +(performance.now() - t0).toFixed(2);
      drawGrayscaleToCanvas(canvasAfter, processed, WIDTH, HEIGHT, isMaskHighlight);
      if (timingBadge) {
        timingBadge.textContent = `Measured execution: ${elapsedMs} ms (Local Thread)`;
      }
    }
  };

  [modeSelect, noiseInput, sigmaInput, sensitivityInput].forEach(ctrl => {
    if (ctrl) ctrl.addEventListener('input', runSandboxProcessing);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (modeSelect) modeSelect.value = 'frangi';
      if (noiseInput) noiseInput.value = '18';
      if (sigmaInput) sigmaInput.value = '2.0';
      if (sensitivityInput) sensitivityInput.value = '1.2';
      runSandboxProcessing();
    });
  }

  selectStage('stage-pseudo-mask');
  selectConcept('concept-frangi');
  runSandboxProcessing();
}

