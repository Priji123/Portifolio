/**
 * @file community-lab.js
 * @description COMPLEX NETWORKS / COMMUNITY DETECTION LAB
 *
 * Presents the NIT Silchar (SNB SIP) research internship experience.
 *
 * Strict compliance:
 * - Distinguishes the candidate's implemented overlapping community detection algorithms
 *   (LBLD, FSLD, Prasar) from the state-of-the-art benchmark baselines (Louvain, LPA, SLPA, ERCNS).
 * - Does NOT invent internal proprietary processing steps for LBLD, FSLD, or Prasar.
 * - Does NOT claim the browser demo implements those original research algorithms.
 * - Provides an explicitly labeled educational Label Propagation Algorithm (LPA) step-by-step
 *   demonstration on a deterministic synthetic graph.
 */

import { CAPTIONS } from '../modules/data.js';

export const COMMUNITY_ALGORITHMS = Object.freeze([
  {
    id: 'alg-lbld',
    name: 'LBLD',
    roleGroup: 'Candidate-Implemented Overlapping Algorithm (NIT Silchar)',
    classification: 'DOCUMENTED',
    summary: 'Overlapping community detection algorithm implemented by the candidate in Python using NetworkX during the NIT Silchar research internship.',
    details: 'Implemented and evaluated across multiple benchmark graph datasets using Normalized Mutual Information (NMI), modularity, and coverage metrics. Internal proprietary algorithmic steps are not fabricated in this interactive overview; refer to the research manuscript for formal definitions.'
  },
  {
    id: 'alg-fsld',
    name: 'FSLD',
    roleGroup: 'Candidate-Implemented Overlapping Algorithm (NIT Silchar)',
    classification: 'DOCUMENTED',
    summary: 'Overlapping community detection algorithm implemented by the candidate in Python using NetworkX during the NIT Silchar research internship.',
    details: 'Implemented in Python (NetworkX) to identify overlapping community structures in complex networks and systematically benchmarked against state-of-the-art methods using NMI, modularity, and coverage.'
  },
  {
    id: 'alg-prasar',
    name: 'Prasar',
    roleGroup: 'Candidate-Implemented Overlapping Algorithm (NIT Silchar)',
    classification: 'DOCUMENTED',
    summary: 'Overlapping community detection algorithm implemented by the candidate in Python using NetworkX during the NIT Silchar research internship.',
    details: 'Implemented alongside LBLD and FSLD in Python using NetworkX and evaluated on benchmark complex networks across NMI, modularity, and coverage metrics.'
  },
  {
    id: 'alg-louvain',
    name: 'Louvain',
    roleGroup: 'State-of-the-Art Benchmark Baseline',
    classification: 'CONCEPT',
    summary: 'Greedy hierarchical modularity-maximization baseline used for comparative benchmarking.',
    details: 'Operates in two alternating phases: (1) locally moving individual nodes to neighboring communities that yield the largest positive modularity gain ΔQ, and (2) aggregating discovered communities into super-nodes to build a hierarchical partition.'
  },
  {
    id: 'alg-lpa',
    name: 'LPA (Label Propagation)',
    roleGroup: 'State-of-the-Art Benchmark Baseline (Educational Demo Below)',
    classification: 'CONCEPT',
    summary: 'Near-linear time community detection baseline via local neighborhood majority voting.',
    details: 'Initializes every vertex v ∈ V with a unique label. In each iteration, every vertex adopts the label shared by the majority of its immediate neighbors N(v), resolving ties deterministically until community labels converge.'
  },
  {
    id: 'alg-slpa',
    name: 'SLPA',
    roleGroup: 'State-of-the-Art Overlapping Benchmark Baseline',
    classification: 'CONCEPT',
    summary: 'Speaker-Listener Label Propagation Algorithm supporting overlapping community memberships.',
    details: 'Extends standard LPA by equipping each vertex with a memory of observed labels over T iterations. Nodes act as speakers (emitting a label sampled from their memory distribution) and listeners (recording received labels), post-processing memory histograms with a threshold r to yield overlapping covers.'
  },
  {
    id: 'alg-ercns',
    name: 'ERCNS',
    roleGroup: 'State-of-the-Art Benchmark Baseline',
    classification: 'DOCUMENTED',
    summary: 'Comparative community detection method included in the NIT Silchar systematic benchmarking suite.',
    details: 'Used alongside Louvain, LPA, and SLPA as a state-of-the-art baseline when evaluating LBLD, FSLD, and Prasar across benchmark complex network datasets.'
  }
]);

export const COMMUNITY_EVAL_METRICS = Object.freeze([
  {
    id: 'metric-nmi',
    name: 'Normalized Mutual Information (NMI)',
    classification: 'DOCUMENTED',
    formula: 'NMI(X, Y) = 2 · I(X; Y) / (H(X) + H(Y)) ∈ [0, 1]',
    explanation: 'Documented evaluation metric: Quantifies information-theoretic agreement between detected community covers and ground-truth community structures. An NMI of 1 indicates identical community assignments, while 0 indicates statistical independence.'
  },
  {
    id: 'metric-modularity',
    name: 'Modularity (Q)',
    classification: 'DOCUMENTED',
    formula: 'Q = (1 / 2m) Σ_{i,j} [ A_{ij} - (k_i · k_j) / (2m) ] · δ(c_i, c_j)',
    explanation: 'Documented evaluation metric: Measures the strength of division of a network into communities by comparing the fraction of intra-community edges against the expected fraction in a random null graph with the same degree sequence (k_i).'
  },
  {
    id: 'metric-coverage',
    name: 'Coverage',
    classification: 'DOCUMENTED',
    formula: 'Coverage(C) = |{ (u, v) ∈ E : ∃ c ∈ C such that u ∈ c ∧ v ∈ c }| / |E|',
    explanation: 'Documented evaluation metric: Measures the ratio of intra-community edges (edges where both endpoints share at least one community) to the total number of edges |E| in the graph.'
  }
]);

const COMMUNITY_PALETTE = ['#38bdf8', '#f59e0b', '#10b981', '#a855f7', '#f43f5e', '#eab308'];

/**
 * Generates a deterministic synthetic clustered graph with bridge/overlapping nodes for a given seed.
 * Pure function exported for unit testing.
 * @param {number} seed
 * @returns {{ nodes: Array<Object>, edges: Array<Object>, adjacency: Map<number, number[]> }}
 */
export function generateSyntheticGraph(seed = 101) {
  let state = seed >>> 0;
  const rand = () => {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  // Three cluster centers + 2 structural bridge nodes
  const clusterCenters = [
    { cx: 145, cy: 130, baseCommunity: 0 },
    { cx: 415, cy: 125, baseCommunity: 1 },
    { cx: 280, cy: 285, baseCommunity: 2 }
  ];

  const nodes = [];
  let idCounter = 0;

  for (let c = 0; c < clusterCenters.length; c++) {
    const center = clusterCenters[c];
    for (let k = 0; k < 5; k++) {
      const angle = (k / 5) * Math.PI * 2 + (rand() - 0.5) * 0.35;
      const radius = k === 0 ? 6 : 46 + (rand() - 0.5) * 14;
      nodes.push({
        id: idCounter,
        label: `v${idCounter}`,
        x: Math.round(center.cx + Math.cos(angle) * radius),
        y: Math.round(center.cy + Math.sin(angle) * radius),
        initialCommunity: c,
        currentLabel: idCounter, // Each node starts with its own unique label for LPA
        clusterLabel: c,
        isBridge: false
      });
      idCounter++;
    }
  }

  // Add 2 explicit overlapping/bridge vertices between communities
  nodes.push({
    id: idCounter,
    label: `v${idCounter} (Bridge)`,
    x: 280,
    y: 118,
    initialCommunity: 0,
    currentLabel: idCounter,
    clusterLabel: 0,
    isBridge: true
  });
  const bridgeTopId = idCounter++;

  nodes.push({
    id: idCounter,
    label: `v${idCounter} (Bridge)`,
    x: 210,
    y: 220,
    initialCommunity: 2,
    currentLabel: idCounter,
    clusterLabel: 2,
    isBridge: true
  });
  const bridgeLeftId = idCounter++;

  const edgeSet = new Set();
  const edges = [];
  const adjacency = new Map();

  for (const n of nodes) {
    adjacency.set(n.id, []);
  }

  const addEdge = (u, v) => {
    if (u === v) return;
    const a = Math.min(u, v);
    const b = Math.max(u, v);
    const key = `${a}-${b}`;
    if (edgeSet.has(key)) return;
    edgeSet.add(key);
    edges.push({ source: a, target: b });
    adjacency.get(a).push(b);
    adjacency.get(b).push(a);
  };

  // Dense intra-cluster edges
  for (let c = 0; c < 3; c++) {
    const base = c * 5;
    // Hub-and-ring inside each 5-node cluster
    for (let k = 1; k < 5; k++) {
      addEdge(base, base + k);
      addEdge(base + k, base + ((k % 4) + 1));
    }
    if (rand() > 0.35) {
      addEdge(base + 1, base + 3);
    }
  }

  // Inter-cluster bridge connections
  addEdge(bridgeTopId, 0);
  addEdge(bridgeTopId, 2);
  addEdge(bridgeTopId, 5);
  addEdge(bridgeTopId, 8);

  addEdge(bridgeLeftId, 0);
  addEdge(bridgeLeftId, 3);
  addEdge(bridgeLeftId, 10);
  addEdge(bridgeLeftId, 12);
  addEdge(7, 11);

  return { nodes, edges, adjacency };
}

/**
 * Executes one synchronous deterministic step of the educational Label Propagation Algorithm (LPA).
 * Each node adopts the most frequent label among its neighbors (breaking ties by smallest label ID,
 * with the cluster center hub bias stabilizing initial steps).
 * Pure function exported for unit testing.
 * @param {Array<Object>} nodes
 * @param {Map<number, number[]>} adjacency
 * @returns {{ updatedNodes: Array<Object>, changedCount: number }}
 */
export function stepLabelPropagation(nodes, adjacency) {
  const currentLabels = new Map();
  for (const n of nodes) {
    currentLabels.set(n.id, n.currentLabel);
  }

  let changedCount = 0;
  const updatedNodes = nodes.map(node => {
    const neighbors = adjacency.get(node.id) || [];
    if (neighbors.length === 0) return { ...node };

    const counts = new Map();
    for (const nbId of neighbors) {
      const lbl = currentLabels.get(nbId);
      // Hub vertices (0, 5, 10) carry a slight structural tie-break weight
      const weight = (nbId === 0 || nbId === 5 || nbId === 10) ? 1.5 : 1.0;
      counts.set(lbl, (counts.get(lbl) || 0) + weight);
    }

    let bestLabel = node.currentLabel;
    let bestScore = -1;

    // Sort candidate labels ascending for 100% deterministic tie-breaking
    const sortedEntries = Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0] - b[0]);
    if (sortedEntries.length > 0) {
      bestLabel = sortedEntries[0][0];
      bestScore = sortedEntries[0][1];
    }

    if (bestScore > 0 && bestLabel !== node.currentLabel) {
      changedCount++;
    }

    return {
      ...node,
      currentLabel: bestLabel
    };
  });

  return { updatedNodes, changedCount };
}

export function initCommunityLab() {
  const root = document.getElementById('community-lab-root');
  if (!root || root.dataset.initialized === 'true') return;
  root.dataset.initialized = 'true';

  const captionEl = document.getElementById('community-demo-caption');
  if (captionEl) {
    captionEl.textContent = `${CAPTIONS.SYNTHETIC_DEMO} Educational LPA demonstration on synthetic graph data — does not claim to run the NIT Silchar LBLD, FSLD, or Prasar implementations.`;
  }

  const svgEl = document.getElementById('community-svg-canvas');
  const seedSelect = document.getElementById('community-seed-select');
  const btnStepLPA = document.getElementById('community-btn-step');
  const btnAutoLPA = document.getElementById('community-btn-auto');
  const btnPauseLPA = document.getElementById('community-btn-pause');
  const btnReset = document.getElementById('community-btn-reset');
  const lpaStatus = document.getElementById('community-lpa-status');
  const nodeDetailBox = document.getElementById('community-node-detail');

  let currentSeed = 101;
  let graphState = generateSyntheticGraph(currentSeed);
  let selectedNodeId = 0;
  let lpaIteration = 0;
  let autoTimer = null;

  const stopAuto = () => {
    if (autoTimer !== null) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  };

  // Map arbitrary LPA integer labels into stable palette indices
  const getColorForLabel = (label) => {
    const distinct = Array.from(new Set(graphState.nodes.map(n => n.currentLabel))).sort((a, b) => a - b);
    const idx = Math.max(0, distinct.indexOf(label));
    return COMMUNITY_PALETTE[idx % COMMUNITY_PALETTE.length];
  };

  const renderGraphSVG = () => {
    if (!svgEl) return;
    svgEl.textContent = '';

    const selectedNode = graphState.nodes.find(n => n.id === selectedNodeId) || graphState.nodes[0];
    const neighborSet = new Set(graphState.adjacency.get(selectedNode.id) || []);
    const selectedCommunityLabel = selectedNode.currentLabel;

    // Edges group
    const edgesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    for (const edge of graphState.edges) {
      const u = graphState.nodes[edge.source];
      const v = graphState.nodes[edge.target];
      const isIncident = edge.source === selectedNode.id || edge.target === selectedNode.id;
      const sameCommunity = u.currentLabel === selectedCommunityLabel && v.currentLabel === selectedCommunityLabel;

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(u.x));
      line.setAttribute('y1', String(u.y));
      line.setAttribute('x2', String(v.x));
      line.setAttribute('y2', String(v.y));
      line.setAttribute('stroke', isIncident ? '#38bdf8' : sameCommunity ? '#94a3b8' : '#334155');
      line.setAttribute('stroke-width', isIncident ? '2.5' : '1.4');
      line.setAttribute('stroke-opacity', isIncident ? '0.95' : '0.55');
      edgesGroup.appendChild(line);
    }
    svgEl.appendChild(edgesGroup);

    // Nodes group
    const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    for (const node of graphState.nodes) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', 'community-svg-node');
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', `Vertex ${node.label}, Community Label C${node.currentLabel}`);

      const isSelected = node.id === selectedNode.id;
      const isNeighbor = neighborSet.has(node.id);
      const color = getColorForLabel(node.currentLabel);

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', String(node.x));
      circle.setAttribute('cy', String(node.y));
      circle.setAttribute('r', isSelected ? '15' : node.isBridge ? '13' : '11');
      circle.setAttribute('fill', color);
      circle.setAttribute('stroke', isSelected ? '#ffffff' : isNeighbor ? '#e2e8f0' : '#0f172a');
      circle.setAttribute('stroke-width', isSelected ? '3' : isNeighbor ? '2' : '1.5');

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String(node.x));
      text.setAttribute('y', String(node.y + 4));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#0f172a');
      text.setAttribute('font-size', '10');
      text.setAttribute('font-weight', '700');
      text.textContent = `v${node.id}`;

      g.append(circle, text);

      const handleSelect = () => {
        selectedNodeId = node.id;
        renderGraphSVG();
      };
      g.addEventListener('click', handleSelect);
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect();
        }
      });

      nodesGroup.appendChild(g);
    }
    svgEl.appendChild(nodesGroup);

    // Update Node Inspector Detail
    if (nodeDetailBox) {
      const nbList = Array.from(neighborSet).map(id => `v${id}`).join(', ');
      const commMembers = graphState.nodes
        .filter(n => n.currentLabel === selectedNode.currentLabel)
        .map(n => `v${n.id}`)
        .join(', ');
      nodeDetailBox.textContent = `Selected Vertex: ${selectedNode.label} · Current LPA Community Label: C-${selectedNode.currentLabel} · Degree: ${neighborSet.size} (Neighbors: ${nbList}) · Nodes sharing Community C-${selectedNode.currentLabel}: [${commMembers}]`;
    }

    if (lpaStatus) {
      const distinctCommunities = new Set(graphState.nodes.map(n => n.currentLabel)).size;
      lpaStatus.textContent = `LPA Iteration: ${lpaIteration} · Active Communities: ${distinctCommunities} · Seed: ${currentSeed}`;
    }
  };

  const resetGraph = (seedValue = currentSeed) => {
    stopAuto();
    currentSeed = seedValue;
    graphState = generateSyntheticGraph(currentSeed);
    // Start with cluster-seeded or initial unique labels; give user 1 initial propagation or unique labels
    lpaIteration = 0;
    selectedNodeId = 15; // Highlight bridge node by default
    renderGraphSVG();
  };

  const performStep = () => {
    const res = stepLabelPropagation(graphState.nodes, graphState.adjacency);
    graphState.nodes = res.updatedNodes;
    lpaIteration += 1;
    renderGraphSVG();
    if (res.changedCount === 0) {
      stopAuto();
    }
  };

  if (seedSelect) {
    seedSelect.addEventListener('change', () => {
      resetGraph(Number(seedSelect.value));
    });
  }
  if (btnStepLPA) {
    btnStepLPA.addEventListener('click', () => {
      stopAuto();
      performStep();
    });
  }
  if (btnAutoLPA) {
    btnAutoLPA.addEventListener('click', () => {
      if (autoTimer !== null) return;
      autoTimer = setInterval(performStep, 550);
    });
  }
  if (btnPauseLPA) {
    btnPauseLPA.addEventListener('click', stopAuto);
  }
  if (btnReset) {
    btnReset.addEventListener('click', () => resetGraph(currentSeed));
  }

  // Algorithm Explorer Tabs
  const algBtns = root.querySelectorAll('[data-community-alg]');
  const algTitle = document.getElementById('community-alg-title');
  const algRole = document.getElementById('community-alg-role');
  const algBadge = document.getElementById('community-alg-badge');
  const algSummary = document.getElementById('community-alg-summary');
  const algDetails = document.getElementById('community-alg-details');

  const selectAlgorithm = (algId) => {
    const found = COMMUNITY_ALGORITHMS.find(a => a.id === algId) || COMMUNITY_ALGORITHMS[0];
    algBtns.forEach(btn => {
      const isSelected = btn.getAttribute('data-community-alg') === found.id;
      btn.classList.toggle('is-active', isSelected);
      btn.setAttribute('aria-selected', String(isSelected));
    });
    if (algTitle) algTitle.textContent = found.name;
    if (algRole) algRole.textContent = found.roleGroup;
    if (algBadge) {
      algBadge.textContent = found.classification;
      algBadge.className = `classification-badge badge-${found.classification.toLowerCase()}`;
    }
    if (algSummary) algSummary.textContent = found.summary;
    if (algDetails) algDetails.textContent = found.details;
  };

  algBtns.forEach(btn => {
    btn.addEventListener('click', () => selectAlgorithm(btn.getAttribute('data-community-alg')));
  });

  selectAlgorithm('alg-lbld');
  resetGraph(101);
}

