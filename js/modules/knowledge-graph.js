/**
 * @file knowledge-graph.js
 * @description ENGINEERING KNOWLEDGE GRAPH 2.0
 *
 * Interactive SVG-based knowledge graph connecting four entity types:
 * 1. Skills
 * 2. Projects
 * 3. Experience
 * 4. Technologies
 *
 * Every relationship comes strictly from the explicit GRAPH structure in data.js.
 * Features:
 * - Node selection highlights connected nodes and fades unrelated nodes
 * - Detail panel with direct navigation to the corresponding Project Case Study or Experience
 * - Zoom in / Zoom out / Reset view controls
 * - Keyboard-accessible node selection
 * - Accessible text-based relationship list & mobile-friendly alternative layout
 */

import { GRAPH } from './data.js';

const TYPE_COLORS = Object.freeze({
  skill: '#38bdf8',
  technology: '#2dd4bf',
  project: '#f59e0b',
  experience: '#a855f7'
});

const TYPE_LABELS = Object.freeze({
  skill: 'Core Skill',
  technology: 'Technology / Tool',
  project: 'Engineering Project',
  experience: 'Professional Experience'
});

export function initKnowledgeGraph() {
  const svgEl = document.getElementById('knowledge-graph-svg');
  const detailPanel = document.getElementById('kg-detail-panel');
  const textAltContainer = document.getElementById('kg-accessible-list');
  const filterBtns = document.querySelectorAll('[data-kg-filter]');
  const btnZoomIn = document.getElementById('kg-zoom-in');
  const btnZoomOut = document.getElementById('kg-zoom-out');
  const btnReset = document.getElementById('kg-reset-view');

  if (!svgEl) return;

  let selectedNodeId = 'skill-node-python';
  let activeTypeFilter = 'all';
  let zoomLevel = 1.0;

  // Build adjacency map from explicit GRAPH.edges
  const adjacency = new Map();
  for (const node of GRAPH.nodes) {
    adjacency.set(node.id, []);
  }
  for (const edge of GRAPH.edges) {
    if (adjacency.has(edge.source) && adjacency.has(edge.target)) {
      adjacency.get(edge.source).push({ neighborId: edge.target, relationship: edge.relationship });
      adjacency.get(edge.target).push({ neighborId: edge.source, relationship: edge.relationship });
    }
  }

  const applyZoomTransform = () => {
    const viewport = svgEl.querySelector('#kg-viewport-group');
    if (!viewport) return;
    const cx = 460;
    const cy = 280;
    viewport.setAttribute(
      'transform',
      `translate(${cx * (1 - zoomLevel)}, ${cy * (1 - zoomLevel)}) scale(${zoomLevel})`
    );
  };

  const renderDetailPanel = (nodeId) => {
    if (!detailPanel) return;
    detailPanel.textContent = '';

    const node = GRAPH.nodes.find(n => n.id === nodeId);
    if (!node) {
      const p = document.createElement('p');
      p.textContent = 'Select any node in the graph or relationship list to inspect verified connections.';
      detailPanel.appendChild(p);
      return;
    }

    const badge = document.createElement('span');
    badge.className = `kg-type-badge kg-badge-${node.type}`;
    badge.textContent = TYPE_LABELS[node.type] || node.type;

    const title = document.createElement('h3');
    title.className = 'kg-detail-title';
    title.textContent = node.label;

    const summary = document.createElement('p');
    summary.className = 'kg-detail-summary';
    summary.textContent = node.summary;

    const connTitle = document.createElement('h4');
    connTitle.className = 'kg-conn-heading';
    const neighbors = adjacency.get(node.id) || [];
    connTitle.textContent = `Verified Relationships (${neighbors.length})`;

    const connList = document.createElement('ul');
    connList.className = 'kg-conn-list';

    for (const conn of neighbors) {
      const nbNode = GRAPH.nodes.find(n => n.id === conn.neighborId);
      if (!nbNode) continue;

      const li = document.createElement('li');
      li.className = 'kg-conn-item';

      const nbBtn = document.createElement('button');
      nbBtn.type = 'button';
      nbBtn.className = 'kg-neighbor-link';
      nbBtn.textContent = `${nbNode.label} (${TYPE_LABELS[nbNode.type]})`;
      nbBtn.addEventListener('click', () => {
        selectedNodeId = nbNode.id;
        renderGraph();
      });

      const relSpan = document.createElement('span');
      relSpan.className = 'kg-rel-desc';
      relSpan.textContent = ` — ${conn.relationship}`;

      li.append(nbBtn, relSpan);
      connList.appendChild(li);
    }

    detailPanel.append(badge, title, summary, connTitle, connList);

    // Action button to jump directly to Project Case Study or Experience section
    if (node.type === 'project') {
      const actionBtn = document.createElement('button');
      actionBtn.type = 'button';
      actionBtn.className = 'btn btn-primary btn-sm kg-action-btn';
      actionBtn.textContent = 'Open Project Case Study & Decisions';
      actionBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('portfolio:open-project', { detail: { projectId: node.refId } }));
      });
      detailPanel.appendChild(actionBtn);
    } else if (node.type === 'experience') {
      const link = document.createElement('a');
      link.href = `#${node.refId}`;
      link.className = 'btn btn-outline btn-sm kg-action-btn';
      link.textContent = 'Jump to Experience Entry';
      detailPanel.appendChild(link);
    }
  };

  const renderGraph = () => {
    svgEl.textContent = '';

    const descEl = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
    descEl.textContent = 'Interactive Engineering Knowledge Graph connecting George Priji Promod’s verified skills, technologies, projects, and internships.';
    svgEl.appendChild(descEl);

    const viewport = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    viewport.setAttribute('id', 'kg-viewport-group');

    const connectedSet = new Set();
    if (selectedNodeId) {
      connectedSet.add(selectedNodeId);
      for (const c of adjacency.get(selectedNodeId) || []) {
        connectedSet.add(c.neighborId);
      }
    }

    // 1. Render Edges
    const edgesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    for (const edge of GRAPH.edges) {
      const u = GRAPH.nodes.find(n => n.id === edge.source);
      const v = GRAPH.nodes.find(n => n.id === edge.target);
      if (!u || !v) continue;

      const isHighlighted = !selectedNodeId || (edge.source === selectedNodeId || edge.target === selectedNodeId);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', String(u.x));
      line.setAttribute('y1', String(u.y));
      line.setAttribute('x2', String(v.x));
      line.setAttribute('y2', String(v.y));
      line.setAttribute('stroke', isHighlighted ? '#38bdf8' : '#334155');
      line.setAttribute('stroke-width', isHighlighted ? '2.4' : '1.2');
      line.setAttribute('stroke-opacity', isHighlighted ? '0.92' : '0.22');
      edgesGroup.appendChild(line);
    }
    viewport.appendChild(edgesGroup);

    // 2. Render Nodes
    const nodesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    for (const node of GRAPH.nodes) {
      const isSelected = node.id === selectedNodeId;
      const isConnected = !selectedNodeId || connectedSet.has(node.id);
      const matchesFilter = activeTypeFilter === 'all' || node.type === activeTypeFilter;
      const isVisible = isConnected && matchesFilter;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', `kg-node-group ${isSelected ? 'is-selected' : ''}`);
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', `${node.label} (${TYPE_LABELS[node.type]})`);
      g.setAttribute('opacity', isVisible ? '1' : '0.22');

      const color = TYPE_COLORS[node.type] || '#38bdf8';

      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', String(node.x));
      circle.setAttribute('cy', String(node.y));
      circle.setAttribute('r', node.type === 'project' ? '18' : node.type === 'experience' ? '16' : '13');
      circle.setAttribute('fill', color);
      circle.setAttribute('stroke', isSelected ? '#ffffff' : '#0f172a');
      circle.setAttribute('stroke-width', isSelected ? '3.5' : '2');

      const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      const labelWidth = Math.max(88, node.label.length * 6.5 + 14);
      labelBg.setAttribute('x', String(node.x - labelWidth / 2));
      labelBg.setAttribute('y', String(node.y + 21));
      labelBg.setAttribute('width', String(labelWidth));
      labelBg.setAttribute('height', '20');
      labelBg.setAttribute('rx', '4');
      labelBg.setAttribute('fill', '#0f172a');
      labelBg.setAttribute('fill-opacity', '0.88');
      labelBg.setAttribute('stroke', isSelected ? color : '#334155');
      labelBg.setAttribute('stroke-width', '1');

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String(node.x));
      text.setAttribute('y', String(node.y + 34));
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#f8fafc');
      text.setAttribute('font-size', '11');
      text.setAttribute('font-weight', isSelected ? '700' : '500');
      text.textContent = node.label;

      g.append(circle, labelBg, text);

      const selectThisNode = () => {
        selectedNodeId = node.id;
        renderGraph();
      };
      g.addEventListener('click', selectThisNode);
      g.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectThisNode();
        }
      });

      nodesGroup.appendChild(g);
    }

    viewport.appendChild(nodesGroup);
    svgEl.appendChild(viewport);
    applyZoomTransform();
    renderDetailPanel(selectedNodeId);
  };

  // Accessible Text-Based Relationship List & Mobile Alternative
  const renderAccessibleRelationshipList = () => {
    if (!textAltContainer) return;
    textAltContainer.textContent = '';

    for (const node of GRAPH.nodes) {
      if (node.type !== 'project' && node.type !== 'experience') continue;
      const card = document.createElement('div');
      card.className = 'kg-text-card';

      const head = document.createElement('h4');
      head.textContent = `${node.label} [${TYPE_LABELS[node.type]}]`;

      const ul = document.createElement('ul');
      const neighbors = adjacency.get(node.id) || [];
      for (const c of neighbors) {
        const nb = GRAPH.nodes.find(n => n.id === c.neighborId);
        if (!nb) continue;
        const li = document.createElement('li');
        li.textContent = `${nb.label} (${TYPE_LABELS[nb.type]}) — ${c.relationship}`;
        ul.appendChild(li);
      }

      card.append(head, ul);
      textAltContainer.appendChild(card);
    }
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      activeTypeFilter = btn.getAttribute('data-kg-filter') || 'all';
      selectedNodeId = null;
      filterBtns.forEach(b => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      renderGraph();
    });
  });

  if (btnZoomIn) {
    btnZoomIn.addEventListener('click', () => {
      zoomLevel = Math.min(1.5, +(zoomLevel + 0.15).toFixed(2));
      applyZoomTransform();
    });
  }
  if (btnZoomOut) {
    btnZoomOut.addEventListener('click', () => {
      zoomLevel = Math.max(0.7, +(zoomLevel - 0.15).toFixed(2));
      applyZoomTransform();
    });
  }
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      zoomLevel = 1.0;
      activeTypeFilter = 'all';
      selectedNodeId = 'skill-node-python';
      filterBtns.forEach(b => {
        const isAll = b.getAttribute('data-kg-filter') === 'all';
        b.classList.toggle('is-active', isAll);
        b.setAttribute('aria-pressed', String(isAll));
      });
      renderGraph();
    });
  }

  renderAccessibleRelationshipList();
  renderGraph();
}

