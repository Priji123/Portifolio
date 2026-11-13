/**
 * @file image-processing.worker.js
 * @description Web Worker for offloading pixel-level synthetic crack preprocessing
 * (Bilateral edge-preserving smoothing, CLAHE local contrast enhancement,
 * Frangi Hessian ridge enhancement, and Morphological closing).
 */

/**
 * Applies a simplified spatial + range bilateral filter on a grayscale array.
 */
function applyBilateral(gray, width, height, sigmaSpatial = 2.0, sigmaRange = 28.0) {
  const out = new Uint8ClampedArray(gray.length);
  const radius = Math.max(1, Math.min(4, Math.round(sigmaSpatial)));
  const twoSpatialSq = 2 * sigmaSpatial * sigmaSpatial;
  const twoRangeSq = 2 * sigmaRange * sigmaRange;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const centerIdx = y * width + x;
      const centerVal = gray[centerIdx];
      let weightSum = 0;
      let valSum = 0;

      for (let dy = -radius; dy <= radius; dy++) {
        const ny = Math.min(height - 1, Math.max(0, y + dy));
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = Math.min(width - 1, Math.max(0, x + dx));
          const nVal = gray[ny * width + nx];
          const spatialDistSq = dx * dx + dy * dy;
          const rangeDist = nVal - centerVal;
          const w = Math.exp(-spatialDistSq / twoSpatialSq - (rangeDist * rangeDist) / twoRangeSq);
          weightSum += w;
          valSum += w * nVal;
        }
      }
      out[centerIdx] = Math.round(valSum / (weightSum || 1));
    }
  }
  return out;
}

/**
 * Applies Tile-Based Contrast Limited Adaptive Histogram Equalization (CLAHE).
 */
function applyCLAHE(gray, width, height, clipLimit = 2.5) {
  const out = new Uint8ClampedArray(gray.length);
  const tileSize = 32;
  const clipThreshold = Math.max(4, Math.floor(((tileSize * tileSize) / 256) * clipLimit * 4));

  for (let ty = 0; ty < height; ty += tileSize) {
    for (let tx = 0; tx < width; tx += tileSize) {
      const hist = new Int32Array(256);
      const maxH = Math.min(height, ty + tileSize);
      const maxW = Math.min(width, tx + tileSize);
      const count = (maxH - ty) * (maxW - tx);

      for (let y = ty; y < maxH; y++) {
        for (let x = tx; x < maxW; x++) {
          hist[gray[y * width + x]]++;
        }
      }

      // Clip histogram and redistribute excess
      let excess = 0;
      for (let i = 0; i < 256; i++) {
        if (hist[i] > clipThreshold) {
          excess += hist[i] - clipThreshold;
          hist[i] = clipThreshold;
        }
      }
      const redistrib = Math.floor(excess / 256);
      for (let i = 0; i < 256; i++) {
        hist[i] += redistrib;
      }

      // Compute CDF
      const cdf = new Uint8ClampedArray(256);
      let cum = 0;
      for (let i = 0; i < 256; i++) {
        cum += hist[i];
        cdf[i] = Math.min(255, Math.round((cum / Math.max(1, count)) * 255));
      }

      for (let y = ty; y < maxH; y++) {
        for (let x = tx; x < maxW; x++) {
          const idx = y * width + x;
          out[idx] = cdf[gray[idx]];
        }
      }
    }
  }
  return out;
}

/**
 * Computes Hessian eigenvalues (lambda1, lambda2) to enhance dark tubular/ridge structures (Frangi concept).
 */
function applyFrangiEnhancement(gray, width, height, sensitivity = 1.0) {
  const out = new Uint8ClampedArray(gray.length);
  const beta = 0.5;
  const c = Math.max(12, 35 / Math.max(0.3, sensitivity));

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const center = gray[idx];

      // Second-order finite differences (Hessian components Ixx, Iyy, Ixy)
      const ixx = gray[y * width + (x + 1)] - 2 * center + gray[y * width + (x - 1)];
      const iyy = gray[(y + 1) * width + x] - 2 * center + gray[(y - 1) * width + x];
      const ixy = 0.25 * (
        gray[(y + 1) * width + (x + 1)] -
        gray[(y + 1) * width + (x - 1)] -
        gray[(y - 1) * width + (x + 1)] +
        gray[(y - 1) * width + (x - 1)]
      );

      const trace = ixx + iyy;
      const disc = Math.sqrt((ixx - iyy) * (ixx - iyy) + 4 * ixy * ixy);
      let l1 = 0.5 * (trace + disc);
      let l2 = 0.5 * (trace - disc);

      if (Math.abs(l1) > Math.abs(l2)) {
        const tmp = l1;
        l1 = l2;
        l2 = tmp;
      }

      // Dark crack ridges have positive dominant second derivative (l2 > 0)
      if (l2 <= 0) {
        out[idx] = 0;
      } else {
        const rb = Math.abs(l1) / (Math.abs(l2) + 1e-5);
        const sSq = l1 * l1 + l2 * l2;
        const vesselness = Math.exp(-(rb * rb) / (2 * beta * beta)) * (1 - Math.exp(-sSq / (2 * c * c)));
        out[idx] = Math.min(255, Math.round(vesselness * 255 * Math.min(2.0, sensitivity)));
      }
    }
  }
  return out;
}

/**
 * Applies morphological closing (dilation followed by erosion) on pseudo-mask intensities.
 */
function applyMorphologicalClosing(mask, width, height, radius = 1) {
  const r = Math.max(1, Math.min(3, Math.round(radius)));
  const dilated = new Uint8ClampedArray(mask.length);
  const closed = new Uint8ClampedArray(mask.length);

  // Dilation
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let maxV = 0;
      for (let dy = -r; dy <= r; dy++) {
        const ny = Math.min(height - 1, Math.max(0, y + dy));
        for (let dx = -r; dx <= r; dx++) {
          const nx = Math.min(width - 1, Math.max(0, x + dx));
          const v = mask[ny * width + nx];
          if (v > maxV) maxV = v;
        }
      }
      dilated[y * width + x] = maxV;
    }
  }

  // Erosion
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let minV = 255;
      for (let dy = -r; dy <= r; dy++) {
        const ny = Math.min(height - 1, Math.max(0, y + dy));
        for (let dx = -r; dx <= r; dx++) {
          const nx = Math.min(width - 1, Math.max(0, x + dx));
          const v = dilated[ny * width + nx];
          if (v < minV) minV = v;
        }
      }
      closed[y * width + x] = minV > 75 ? 255 : minV;
    }
  }
  return closed;
}

export function processSyntheticCrackBuffer(grayBuffer, width, height, mode, params = {}) {
  const gray = new Uint8ClampedArray(grayBuffer);
  if (mode === 'bilateral') {
    return applyBilateral(gray, width, height, params.sigmaSpatial || 2.0, params.sigmaRange || 28.0);
  }
  if (mode === 'clahe') {
    const smoothed = applyBilateral(gray, width, height, 1.5, 22.0);
    return applyCLAHE(smoothed, width, height, params.clipLimit || 2.5);
  }
  if (mode === 'frangi') {
    const smoothed = applyBilateral(gray, width, height, params.sigmaSpatial || 2.0, 24.0);
    return applyFrangiEnhancement(smoothed, width, height, params.sensitivity || 1.2);
  }
  if (mode === 'morphology') {
    const smoothed = applyBilateral(gray, width, height, params.sigmaSpatial || 2.0, 24.0);
    const frangi = applyFrangiEnhancement(smoothed, width, height, params.sensitivity || 1.2);
    return applyMorphologicalClosing(frangi, width, height, params.morphRadius || 1);
  }
  return gray;
}

if (typeof self !== 'undefined' && typeof self.onmessage !== 'undefined') {
  self.onmessage = function (event) {
    const { id, gray, width, height, mode, params } = event.data;
    const t0 = performance.now();
    const processed = processSyntheticCrackBuffer(gray, width, height, mode, params);
    const elapsedMs = +(performance.now() - t0).toFixed(2);
    self.postMessage(
      { id, processed, width, height, mode, elapsedMs },
      [processed.buffer]
    );
  };
}

