/**
 * @file terminal.js
 * @description Optional interactive Engineering CLI Terminal that shares the unified
 * command registry from search.js.
 *
 * Never replaces conventional navigation; uses safe DOM text manipulation only.
 */

import { CONTENT, PROJECTS, SKILLS } from './data.js';
import { buildCommandRegistry, searchRegistry } from './search.js';
import { executeRegistryCommand } from './command-palette.js';

export function initTerminal() {
  const drawer = document.getElementById('terminal-drawer');
  const toggleBtn = document.getElementById('toggle-terminal-btn');
  const closeBtn = document.getElementById('terminal-close-btn');
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');

  if (!drawer || !form || !input || !output) return;

  const registry = buildCommandRegistry();

  const appendLine = (text, className = 'term-line') => {
    const div = document.createElement('div');
    div.className = className;
    div.textContent = text;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
  };

  const handleCommand = (rawInput) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    appendLine(`george@portfolio:~$ ${trimmed}`, 'term-line term-prompt-echo');
    const lower = trimmed.toLowerCase();

    if (lower === 'help') {
      appendLine('Available commands (shared with Unified Command Registry):');
      appendLine('  help                — Show this command summary');
      appendLine('  whoami              — Display verified candidate profile');
      appendLine('  projects            — List documented engineering projects');
      appendLine('  skills              — List technical skill categories');
      appendLine('  experience          — List professional & research internships');
      appendLine('  open <query>        — Open a project case study or lab (e.g., "open crack detection")');
      appendLine('  search <query>      — Search unified registry (e.g., "search Attention U-Net")');
      appendLine('  theme               — Toggle dark / light theme');
      appendLine('  export json         — Download validated JSON Resume');
      appendLine('  clear               — Clear terminal output');
      return;
    }

    if (lower === 'clear') {
      output.textContent = '';
      return;
    }

    if (lower === 'whoami') {
      appendLine(`${CONTENT.candidate.name} — ${CONTENT.candidate.title}`);
      appendLine(`Location: ${CONTENT.candidate.location} | Email: ${CONTENT.candidate.email}`);
      appendLine(CONTENT.candidate.profile);
      return;
    }

    if (lower === 'projects') {
      PROJECTS.forEach((p, idx) => {
        appendLine(`[${idx + 1}] ${p.title} (${p.subtitle}) — ${p.scaleMetric}`);
      });
      return;
    }

    if (lower === 'skills') {
      for (const group of SKILLS) {
        appendLine(`• ${group.category}: ${group.items.map(i => i.name).join(', ')}`);
      }
      return;
    }

    if (lower === 'experience') {
      for (const exp of CONTENT.experience) {
        appendLine(`• ${exp.role} @ ${exp.organization} (${exp.period})`);
      }
      return;
    }

    if (lower === 'theme' || lower === 'theme toggle') {
      window.dispatchEvent(new CustomEvent('portfolio:toggle-theme'));
      appendLine('Theme toggled.');
      return;
    }

    if (lower === 'export json') {
      window.dispatchEvent(new CustomEvent('portfolio:export-json-resume'));
      appendLine('Triggered local JSON Resume validation and download.');
      return;
    }

    // Query unified search registry
    const query = lower.startsWith('search ') ? trimmed.slice(7) : trimmed;
    const matches = searchRegistry(query, registry, 4);

    if (matches.length === 0) {
      appendLine(`No matching entry for "${trimmed}". Type "help" for available commands.`);
      return;
    }

    if (lower.startsWith('open ') && matches[0]) {
      appendLine(`Executing: ${matches[0].title} [${matches[0].category}]`);
      executeRegistryCommand(matches[0]);
      return;
    }

    appendLine(`Top ${matches.length} registry match(es) for "${query}":`);
    for (const m of matches) {
      appendLine(`  → [${m.category}] ${m.title}: ${m.description}`);
    }
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = drawer.hidden;
      drawer.hidden = !isHidden;
      toggleBtn.setAttribute('aria-expanded', String(isHidden));
      if (isHidden) {
        input.focus();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      drawer.hidden = true;
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = input.value;
    input.value = '';
    handleCommand(val);
  });
}
