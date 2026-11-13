/**
 * @file command-palette.js
 * @description Unified Command Palette (Ctrl/Cmd + K) powered by search.js.
 * Supports:
 * - Ctrl/Command + K & Escape
 * - ArrowUp / ArrowDown / Enter keyboard navigation
 * - Search suggestions
 * - Recent commands history
 * - Direct execution of navigation, project case studies, labs, and theme toggling
 */

import { buildCommandRegistry, searchRegistry, SUGGESTED_SEARCHES } from './search.js';

const RECENT_STORAGE_KEY = 'george_portfolio_recent_cmds';

function getRecentIds() {
  try {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 4) : [];
  } catch {
    return [];
  }
}

function recordRecentId(id) {
  try {
    const current = getRecentIds().filter(x => x !== id);
    current.unshift(id);
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(current.slice(0, 4)));
  } catch {
    // Ignore storage errors
  }
}

export function executeRegistryCommand(cmdItem) {
  if (!cmdItem) return;
  recordRecentId(cmdItem.id);

  if (cmdItem.type === 'action') {
    if (cmdItem.action === 'toggle-theme') {
      window.dispatchEvent(new CustomEvent('portfolio:toggle-theme'));
    } else if (cmdItem.action === 'export-json-resume') {
      window.dispatchEvent(new CustomEvent('portfolio:export-json-resume'));
    } else if (cmdItem.action === 'print-brief') {
      window.dispatchEvent(new CustomEvent('portfolio:print-brief'));
    }
  }

  if (cmdItem.targetSection) {
    const sec = document.getElementById(cmdItem.targetSection);
    if (sec) {
      sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  if (cmdItem.type === 'project' && cmdItem.projectId) {
    window.dispatchEvent(new CustomEvent('portfolio:open-project', { detail: { projectId: cmdItem.projectId } }));
  } else if (cmdItem.type === 'concept' && cmdItem.projectId) {
    window.dispatchEvent(new CustomEvent('portfolio:open-project', { detail: { projectId: cmdItem.projectId } }));
  } else if (cmdItem.type === 'lab' && cmdItem.labId) {
    window.dispatchEvent(new CustomEvent('portfolio:open-lab', { detail: { labId: cmdItem.labId } }));
  }
}

export function initCommandPalette() {
  const modal = document.getElementById('command-palette-modal');
  const openBtn = document.getElementById('open-command-palette-btn');
  const closeBtn = document.getElementById('command-palette-close');
  const input = document.getElementById('command-palette-input');
  const resultsList = document.getElementById('command-palette-results');
  const suggestionsContainer = document.getElementById('command-palette-suggestions');

  if (!modal || !input || !resultsList) return;

  const registry = buildCommandRegistry();
  let currentMatches = [];
  let activeIndex = 0;
  let lastFocused = null;

  const renderSuggestions = () => {
    if (!suggestionsContainer) return;
    suggestionsContainer.textContent = '';

    for (const term of SUGGESTED_SEARCHES) {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'palette-suggestion-chip';
      chip.textContent = term;
      chip.addEventListener('click', () => {
        input.value = term;
        updateResults();
        input.focus();
      });
      suggestionsContainer.appendChild(chip);
    }
  };

  const renderResults = () => {
    resultsList.textContent = '';

    if (currentMatches.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'palette-empty-item';
      empty.textContent = 'No matching projects, skills, sections, or technical concepts found.';
      resultsList.appendChild(empty);
      return;
    }

    const recentSet = new Set(getRecentIds());

    currentMatches.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = `palette-result-item ${index === activeIndex ? 'is-active' : ''}`;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(index === activeIndex));

      const topRow = document.createElement('div');
      topRow.className = 'palette-item-top';

      const titleSpan = document.createElement('span');
      titleSpan.className = 'palette-item-title';
      titleSpan.textContent = item.title;

      const metaRight = document.createElement('div');
      metaRight.className = 'palette-item-badges';

      if (recentSet.has(item.id) && !input.value.trim()) {
        const recentBadge = document.createElement('span');
        recentBadge.className = 'palette-badge-recent';
        recentBadge.textContent = 'RECENT';
        metaRight.appendChild(recentBadge);
      }

      const catBadge = document.createElement('span');
      catBadge.className = 'palette-badge-cat';
      catBadge.textContent = item.category;
      metaRight.appendChild(catBadge);

      topRow.append(titleSpan, metaRight);

      const descP = document.createElement('p');
      descP.className = 'palette-item-desc';
      descP.textContent = item.description;

      li.append(topRow, descP);

      li.addEventListener('click', () => {
        closePalette();
        executeRegistryCommand(item);
      });

      resultsList.appendChild(li);
    });
  };

  const updateResults = () => {
    const q = input.value.trim();
    if (!q) {
      const recentIds = getRecentIds();
      const recentItems = recentIds
        .map(id => registry.find(r => r.id === id))
        .filter(Boolean);
      const remaining = registry.filter(r => !recentIds.includes(r.id)).slice(0, 10 - recentItems.length);
      currentMatches = [...recentItems, ...remaining];
    } else {
      currentMatches = searchRegistry(q, registry, 10);
    }
    activeIndex = 0;
    renderResults();
  };

  const openPalette = () => {
    lastFocused = document.activeElement;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    input.value = '';
    updateResults();
    input.focus();
  };

  const closePalette = () => {
    if (modal.hidden) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  };

  if (openBtn) {
    openBtn.addEventListener('click', openPalette);
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', closePalette);
  }
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePalette();
  });

  input.addEventListener('input', updateResults);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentMatches.length > 0) {
        activeIndex = (activeIndex + 1) % currentMatches.length;
        renderResults();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentMatches.length > 0) {
        activeIndex = (activeIndex - 1 + currentMatches.length) % currentMatches.length;
        renderResults();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentMatches[activeIndex]) {
        const chosen = currentMatches[activeIndex];
        closePalette();
        executeRegistryCommand(chosen);
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal.hidden) openPalette();
      else closePalette();
    } else if (e.key === 'Escape' && !modal.hidden) {
      closePalette();
    }
  });

  renderSuggestions();
}

