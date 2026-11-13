/**
 * @file gait-lab.js
 * @description COMPUTER VISION / GAIT RECOGNITION LAB
 *
 * Presents the B.Tech Major Project as a 7-stage visual processing pipeline:
 * CCTV VIDEO -> FRAME EXTRACTION -> PERSON SILHOUETTE -> GAIT ENERGY IMAGE -> HOG FEATURES -> PCA / LDA -> SVM / CNN
 *
 * Includes 3 deterministic browser demonstrations:
 * A. Silhouette Processing
 * B. Gait Energy Image (GEI) accumulator with Start, Pause, Reset, and frame inspection
 * C. Actual local gradient-orientation HOG calculation on a synthetic silhouette image
 * Plus selectable PCA/LDA and conceptual SVM vs. CNN comparison (without fabricated accuracies or TensorFlow links).
 */

import { CAPTIONS } from '../modules/data.js';

export const GAIT_PIPELINE_STAGES = Object.freeze([
  {
    id: 'gait-stage-video',
    step: '01',
    title: 'CCTV VIDEO',
    classification: 'DOCUMENTED',
    summary: 'Multi-camera surveillance footage captured under real-world lighting and pose variation.',
    details: 'Ingests raw video streams where facial resolution is insufficient for biometric identification, motivating full-body kinematic and silhouette analysis.'
  },
  {
    id: 'gait-stage-frames',
    step: '02',
    title: 'FRAME EXTRACTION',
    classification: 'DOCUMENTED',
    summary: 'Temporal decoding of video streams into sequential frame buffers using Python and OpenCV.',
    details: 'Samples consecutive frames across complete walking cycles (stance and swing phases) to capture periodic locomotion signatures.'
  },
  {
    id: 'gait-stage-silhouette',
    step: '03',
    title: 'PERSON SILHOUETTE',
    classification: 'DOCUMENTED',
    summary: 'Foreground isolation separating the walking subject from static background clutter.',
    details: 'Produces centered, scale-normalized binary masks where foreground pixels (1) represent the subject silhouette and background pixels (0) suppress clothing color and background textures.'
  },
  {
    id: 'gait-stage-gei',
    step: '04',
    title: 'GAIT ENERGY IMAGE',
    classification: 'CONCEPT',
    summary: 'Spatio-temporal accumulation of aligned binary silhouettes into a single mean-intensity image.',
    details: 'Defined as GEI(x, y) = (1/N) Σ B_t(x, y) over N frames of a gait cycle. High-intensity interior pixels capture structural body geometry (head, torso), while mid-intensity boundary pixels encode limb motion frequency and stride amplitude.'
  },
  {
    id: 'gait-stage-hog',
    step: '05',
    title: 'HOG FEATURES',
    classification: 'DOCUMENTED',
    summary: 'Histogram of Oriented Gradients feature engineering over spatial cells.',
    details: 'Computes horizontal and vertical intensity gradients (Gx, Gy), gradient magnitudes, and unsigned orientation histograms across spatial grid cells to encode localized contour geometry.'
  },
  {
    id: 'gait-stage-pca-lda',
    step: '06',
    title: 'PCA / LDA',
    classification: 'DOCUMENTED',
    summary: 'Dimensionality reduction combining Principal Component Analysis and Linear Discriminant Analysis.',
    details: 'PCA removes redundant correlated dimensions by projecting onto orthogonal axes of maximum variance. LDA then finds discriminant projections that maximize between-subject scatter relative to within-subject pose variation.'
  },
  {
    id: 'gait-stage-svm-cnn',
    step: '07',
    title: 'SVM / CNN',
    classification: 'DOCUMENTED',
    summary: 'Comparative benchmarking of Support Vector Machine and Convolutional Neural Network classifiers.',
    details: 'Evaluated classifier performance robustness under real-world lighting and pose variation. Note: Only Python, OpenCV, HOG, PCA/LDA, SVM, and CNN are documented for this B.Tech project; no fabricated accuracy percentages are shown.'
  }
]);

/**
 * Generates a deterministic binary silhouette frame (width x height) for a given gait phase in [0, 1).
 * Pure function exported for unit testing.
 * @param {number} width
 * @param {number} height
 * @param {number} phase - Normalized gait cycle phase [0, 1)
 * @returns {Uint8ClampedArray} - Values 0 or 255
 */
export function generateSyntheticSilhouetteFrame(width = 128, height = 160, phase = 0) {
  const mask = new Uint8ClampedArray(width * height);
  const cx = width * 0.5;
  const swing = Math.sin(phase * Math.PI * 2);

  const fillCircle = (x0, y0, r) => {
    const rSq = r * r;
    for (let y = Math.max(0, Math.floor(y0 - r)); y <= Math.min(height - 1, Math.ceil(y0 + r)); y++) {
      for (let x = Math.max(0, Math.floor(x0 - r)); x <= Math.min(width - 1, Math.ceil(x0 + r)); x++) {
        if ((x - x0) * (x - x0) + (y - y0) * (y - y0) <= rSq) {
          mask[y * width + x] = 255;
        }
      }
    }
  };

  const fillCapsule = (x1, y1, x2, y2, radius) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy || 1;
    const rSq = radius * radius;
    const minX = Math.max(0, Math.floor(Math.min(x1, x2) - radius));
    const maxX = Math.min(width - 1, Math.ceil(Math.max(x1, x2) + radius));
    const minY = Math.max(0, Math.floor(Math.min(y1, y2) - radius));
    const maxY = Math.min(height - 1, Math.ceil(Math.max(y1, y2) + radius));

    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        let t = ((x - x1) * dx + (y - y1) * dy) / lenSq;
        t = Math.max(0, Math.min(1, t));
        const px = x1 + t * dx;
        const py = y1 + t * dy;
        if ((x - px) * (x - px) + (y - py) * (y - py) <= rSq) {
          mask[y * width + x] = 255;
        }
      }
    }
  };

  // Head
  fillCircle(cx + swing * 1.5, 28, 11);
  // Neck & Torso
  fillCapsule(cx, 38, cx, 86, 13);

  // Arms swinging in opposition to legs
  const armOffset = swing * 18;
  fillCapsule(cx, 46, cx - armOffset, 84, 5.5);
  fillCapsule(cx, 46, cx + armOffset, 84, 5.5);

  // Legs (Hip -> Knee -> Ankle)
  const stride = swing * 24;
  // Leg 1
  const knee1X = cx + stride * 0.55;
  const knee1Y = 116;
  const foot1X = cx + stride;
  const foot1Y = 146;
  fillCapsule(cx - 3, 86, knee1X, knee1Y, 7);
  fillCapsule(knee1X, knee1Y, foot1X, foot1Y, 6);

  // Leg 2
  const knee2X = cx - stride * 0.55;
  const knee2Y = 116;
  const foot2X = cx - stride;
  const foot2Y = 146;
  fillCapsule(cx + 3, 86, knee2X, knee2Y, 7);
  fillCapsule(knee2X, knee2Y, foot2X, foot2Y, 6);

  return mask;
}

/**
 * Accumulates an array of binary silhouette frames into a mean-intensity Gait Energy Image (GEI).
 * Pure function exported for unit testing.
 * @param {Array<Uint8ClampedArray>} frames
 * @returns {Uint8ClampedArray}
 */
export function computeGaitEnergyImage(frames) {
  if (!Array.isArray(frames) || frames.length === 0) {
    return new Uint8ClampedArray(0);
  }
  const length = frames[0].length;
  const gei = new Uint8ClampedArray(length);
  const count = frames.length;

  for (let i = 0; i < length; i++) {
    let sum = 0;
    for (let f = 0; f < count; f++) {
      sum += frames[f][i];
    }
    gei[i] = Math.round(sum / count);
  }
  return gei;
}

/**
 * Computes actual local gradient magnitudes and 9-bin unsigned orientation histograms (0-180 deg)
 * across spatial cells for a grayscale/silhouette image.
 * Pure function exported for unit testing.
 * @param {Uint8ClampedArray} image
 * @param {number} width
 * @param {number} height
 * @param {number} cellSize
 * @returns {{ cellsX: number, cellsY: number, histograms: Array<Float32Array>, maxMagnitude: number }}
 */
export function computeHOGCells(image, width = 128, height = 160, cellSize = 16) {
  const cellsX = Math.floor(width / cellSize);
  const cellsY = Math.floor(height / cellSize);
  const histograms = [];
  let maxMagnitude = 0;

  for (let cy = 0; cy < cellsY; cy++) {
    for (let cx = 0; cx < cellsX; cx++) {
      const bins = new Float32Array(9);
      const startY = cy * cellSize;
      const startX = cx * cellSize;

      for (let y = startY; y < startY + cellSize; y++) {
        for (let x = startX; x < startX + cellSize; x++) {
          const left = image[y * width + Math.max(0, x - 1)];
          const right = image[y * width + Math.min(width - 1, x + 1)];
          const up = image[Math.max(0, y - 1) * width + x];
          const down = image[Math.min(height - 1, y + 1) * width + x];

          const gx = right - left;
          const gy = down - up;
          const mag = Math.sqrt(gx * gx + gy * gy);

          if (mag > 0) {
            // Unsigned orientation in [0, 180)
            let angle = (Math.atan2(gy, gx) * 180) / Math.PI;
            if (angle < 0) angle += 180;
            if (angle >= 180) angle -= 180;
            const bin = Math.min(8, Math.floor(angle / 20));
            bins[bin] += mag;
          }
        }
      }

      for (let b = 0; b < 9; b++) {
        if (bins[b] > maxMagnitude) maxMagnitude = bins[b];
      }
      histograms.push(bins);
    }
  }

  return { cellsX, cellsY, cellSize, histograms, maxMagnitude: maxMagnitude || 1 };
}

/**
 * Draws a binary or grayscale buffer onto a canvas.
 */
function renderBufferToCanvas(canvas, buffer, width, height) {
  if (!canvas) return;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const img = ctx.createImageData(width, height);
  for (let i = 0; i < buffer.length; i++) {
    const v = buffer[i];
    const p = i * 4;
    img.data[p] = v;
    img.data[p + 1] = v;
    img.data[p + 2] = v;
    img.data[p + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
}

/**
 * Draws the HOG spatial cell orientation stars over the silhouette image.
 */
function renderHOGCanvas(canvas, baseImage, width, height, cellSize = 16) {
  if (!canvas) return;
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Faint background silhouette
  const img = ctx.createImageData(width, height);
  for (let i = 0; i < baseImage.length; i++) {
    const v = Math.round(baseImage[i] * 0.22);
    const p = i * 4;
    img.data[p] = v;
    img.data[p + 1] = v + 8;
    img.data[p + 2] = v + 14;
    img.data[p + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);

  const hog = computeHOGCells(baseImage, width, height, cellSize);

  // Draw cell grid lines subtly
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.14)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= width; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Draw dominant gradient orientation vectors in each cell
  for (let cy = 0; cy < hog.cellsY; cy++) {
    for (let cx = 0; cx < hog.cellsX; cx++) {
      const bins = hog.histograms[cy * hog.cellsX + cx];
      const centerX = cx * cellSize + cellSize / 2;
      const centerY = cy * cellSize + cellSize / 2;

      for (let b = 0; b < 9; b++) {
        const strength = bins[b] / hog.maxMagnitude;
        if (strength < 0.12) continue;

        // Tangent to edge (perpendicular to gradient direction)
        const angleRad = (((b * 20 + 10) + 90) * Math.PI) / 180;
        const halfLen = (cellSize * 0.45) * Math.min(1, strength * 1.25);
        const dx = Math.cos(angleRad) * halfLen;
        const dy = Math.sin(angleRad) * halfLen;

        ctx.strokeStyle = `rgba(56, 189, 248, ${Math.min(0.95, 0.25 + strength * 0.85)})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(centerX - dx, centerY - dy);
        ctx.lineTo(centerX + dx, centerY + dy);
        ctx.stroke();
      }
    }
  }
}

export function initGaitLab() {
  const root = document.getElementById('gait-lab-root');
  if (!root || root.dataset.initialized === 'true') return;
  root.dataset.initialized = 'true';

  const captionEl = document.getElementById('gait-demo-caption');
  if (captionEl) captionEl.textContent = CAPTIONS.SYNTHETIC_DEMO;

  // 1. Pipeline Stage Selector
  const stageBtns = root.querySelectorAll('[data-gait-stage]');
  const stageTitle = document.getElementById('gait-stage-title');
  const stageBadge = document.getElementById('gait-stage-badge');
  const stageSummary = document.getElementById('gait-stage-summary');
  const stageDetails = document.getElementById('gait-stage-details');

  const selectStage = (id) => {
    const found = GAIT_PIPELINE_STAGES.find(s => s.id === id) || GAIT_PIPELINE_STAGES[3];
    stageBtns.forEach(btn => {
      const active = btn.getAttribute('data-gait-stage') === found.id;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    if (stageTitle) stageTitle.textContent = `${found.step}. ${found.title}`;
    if (stageBadge) {
      stageBadge.textContent = found.classification;
      stageBadge.className = `classification-badge badge-${found.classification.toLowerCase()}`;
    }
    if (stageSummary) stageSummary.textContent = found.summary;
    if (stageDetails) stageDetails.textContent = found.details;
  };

  stageBtns.forEach(btn => {
    btn.addEventListener('click', () => selectStage(btn.getAttribute('data-gait-stage')));
  });

  // 2. Silhouette, GEI Accumulator, and HOG Visualization
  const canvasSilhouette = document.getElementById('gait-canvas-silhouette');
  const canvasGEI = document.getElementById('gait-canvas-gei');
  const canvasHOG = document.getElementById('gait-canvas-hog');
  const btnStart = document.getElementById('gait-btn-start');
  const btnPause = document.getElementById('gait-btn-pause');
  const btnReset = document.getElementById('gait-btn-reset');
  const phaseSlider = document.getElementById('gait-phase-slider');
  const cellSizeSelect = document.getElementById('gait-hog-cell-size');
  const frameStatus = document.getElementById('gait-frame-status');

  const W = 128;
  const H = 160;
  const TOTAL_FRAMES = 16;
  let accumulatedFrames = [];
  let currentStep = 0;
  let timerId = null;

  const updateCanvases = (stepIndex) => {
    const phase = (stepIndex % TOTAL_FRAMES) / TOTAL_FRAMES;
    const currentSilhouette = generateSyntheticSilhouetteFrame(W, H, phase);
    renderBufferToCanvas(canvasSilhouette, currentSilhouette, W, H);

    if (accumulatedFrames.length === 0) {
      accumulatedFrames.push(currentSilhouette);
    }

    const geiBuffer = computeGaitEnergyImage(accumulatedFrames);
    renderBufferToCanvas(canvasGEI, geiBuffer, W, H);

    const cellSize = cellSizeSelect ? Number(cellSizeSelect.value) : 16;
    renderHOGCanvas(canvasHOG, geiBuffer, W, H, cellSize);

    if (frameStatus) {
      frameStatus.textContent = `Frame ${(stepIndex % TOTAL_FRAMES) + 1} / ${TOTAL_FRAMES} · Accumulated ${accumulatedFrames.length} silhouette frame(s) into GEI`;
    }
  };

  const stopAnimation = () => {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  const startAnimation = () => {
    if (timerId !== null) return;
    timerId = setInterval(() => {
      currentStep = (currentStep + 1) % TOTAL_FRAMES;
      if (phaseSlider) phaseSlider.value = String(currentStep);
      const phase = currentStep / TOTAL_FRAMES;
      const frame = generateSyntheticSilhouetteFrame(W, H, phase);
      if (accumulatedFrames.length < TOTAL_FRAMES) {
        accumulatedFrames.push(frame);
      }
      updateCanvases(currentStep);
    }, 180);
  };

  const resetSequence = () => {
    stopAnimation();
    currentStep = 0;
    if (phaseSlider) phaseSlider.value = '0';
    // Pre-populate a full 16-frame cycle on initial load/reset so GEI and HOG are immediately informative,
    // or accumulate from frame 1 when user steps
    accumulatedFrames = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      accumulatedFrames.push(generateSyntheticSilhouetteFrame(W, H, i / TOTAL_FRAMES));
    }
    updateCanvases(0);
  };

  if (btnStart) {
    btnStart.addEventListener('click', () => {
      accumulatedFrames = [];
      startAnimation();
    });
  }
  if (btnPause) {
    btnPause.addEventListener('click', stopAnimation);
  }
  if (btnReset) {
    btnReset.addEventListener('click', resetSequence);
  }
  if (phaseSlider) {
    phaseSlider.addEventListener('input', () => {
      stopAnimation();
      currentStep = Number(phaseSlider.value);
      accumulatedFrames = [];
      for (let i = 0; i <= currentStep; i++) {
        accumulatedFrames.push(generateSyntheticSilhouetteFrame(W, H, i / TOTAL_FRAMES));
      }
      updateCanvases(currentStep);
    });
  }
  if (cellSizeSelect) {
    cellSizeSelect.addEventListener('change', () => updateCanvases(currentStep));
  }

  // 3. PCA vs LDA Subspace Selector
  const subspaceBtns = root.querySelectorAll('[data-gait-subspace]');
  const subspaceDetail = document.getElementById('gait-subspace-detail');
  const SUBSPACE_TEXT = {
    pca: 'PCA (Principal Component Analysis — Documented Pipeline Component): Unsupervised orthogonal transformation that projects high-dimensional HOG descriptor vectors onto eigenvectors of the total covariance matrix Σ, retaining maximum spatial variance while eliminating collinear feature dimensions.',
    lda: 'LDA (Linear Discriminant Analysis — Documented Pipeline Component): Supervised projection that maximizes Fisher’s criterion J(W) = |W^T S_B W| / |W^T S_W W| (ratio of between-class subject scatter S_B to within-class pose/lighting scatter S_W), directly enhancing subject separability prior to classification.'
  };

  subspaceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-gait-subspace');
      subspaceBtns.forEach(b => b.classList.toggle('is-active', b === btn));
      if (subspaceDetail && SUBSPACE_TEXT[key]) {
        subspaceDetail.textContent = SUBSPACE_TEXT[key];
      }
    });
  });

  selectStage('gait-stage-gei');
  resetSequence();
}

