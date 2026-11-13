# George Priji Promod — Evidence-Driven Interactive Engineering Portfolio (v5.2)

An evidence-driven, modular interactive engineering portfolio built with **Vanilla HTML5, CSS3, and modern JavaScript ES Modules** — requiring zero external frameworks or build toolchains.

## 1. Design Philosophy: Evidence-Driven Engineering

Every technical claim, architecture diagram, and interactive demonstration is explicitly classified to maintain strict epistemic honesty:

| Classification | Meaning |
|---|---|
| `DOCUMENTED` | Directly supported by the supplied Curriculum Vitae and verified project records (e.g., Attention U-Net, Frangi filter pseudo-mask generation on 10,000+ image pairs, Tversky Loss, Dice Coefficient, Devign 27,000+ C functions, LBLD/FSLD/Prasar). |
| `CONCEPT` | General technical explanation providing engineering context (e.g., Bilateral filtering, CLAHE, Intersection over Union, Gait Energy Image averaging, Louvain/LPA mechanics). |
| `DEMONSTRATION` | A locally executable educational sandbox running in the browser using deterministic synthetic data. Never presented as original research data or trained thesis model weights. |
| `EVIDENCE PENDING` | Information, repository links, or quantitative manuscript tables that must be supplied by the portfolio owner rather than fabricated. |

---

## 2. Modular Software Architecture

```text
Portifolio/
│
├── index.html
├── README.md
│
├── css/
│   └── global.css
│
├── js/
│   ├── global.js
│   │
│   ├── modules/
│   │   ├── data.js
│   │   ├── validation.js
│   │   ├── navigation.js
│   │   ├── projects.js
│   │   ├── search.js
│   │   ├── knowledge-graph.js
│   │   ├── recruiter-brief.js
│   │   ├── command-palette.js
│   │   ├── terminal.js
│   │   └── theme.js
│   │
│   ├── labs/
│   │   ├── crack-lab.js
│   │   ├── gait-lab.js
│   │   ├── vulnerability-lab.js
│   │   └── community-lab.js
│   │
│   └── workers/
│       └── image-processing.worker.js
│
├── tests/
│   ├── data-validation.test.mjs
│   ├── search.test.mjs
│   └── demonstrations.test.mjs
│
└── assets/
    ├── images/
    ├── projects/
    ├── icons/
    │   └── favicon.svg
    └── resume.pdf
```

### Key Architectural Responsibilities

- **`js/modules/data.js`**: Single source of truth organized into `CONTENT`, `CLAIMS`, `EVIDENCE`, `PROJECTS`, `SKILLS`, and `GRAPH`.
- **`js/modules/validation.js`**: Validates required project fields, duplicate identifiers, category relationships, evidence references, and explicit skill-to-project boundaries (e.g., ensuring TensorFlow is never linked to the Gait Recognition project).
- **`js/labs/*`**: Four independent, lazy-loaded interactive laboratories:
  1. **Computer Vision / Image Segmentation Lab** (`crack-lab.js` + `image-processing.worker.js`): 6-stage pipeline explorer, Attention U-Net schematic, and deterministic synthetic crack filtering sandbox.
  2. **Computer Vision / Gait Recognition Lab** (`gait-lab.js`): 7-stage CCTV pipeline explorer, synthetic binary silhouette generator, Gait Energy Image (GEI) accumulator, local HOG cell orientation calculator, and PCA/LDA + SVM/CNN comparison.
  3. **Software Security / Code Analysis Lab** (`vulnerability-lab.js`): Split-screen C code inspector with selectable regions, safer bounded C alternatives, and synthetic SHAP/LIME feature attribution explanations.
  4. **Complex Networks / Community Detection Lab** (`community-lab.js`): Distinguishes candidate-implemented overlapping algorithms (`LBLD`, `FSLD`, `Prasar`) from benchmark baselines (`Louvain`, `LPA`, `SLPA`, `ERCNS`), paired with a step-by-step educational LPA graph demonstration.
- **`js/modules/knowledge-graph.js`**: Interactive SVG relationship graph connecting Skills, Technologies, Projects, and Internships with zoom/reset controls and an accessible text relationship directory.
- **`js/modules/recruiter-brief.js`**: Generates live domain-filtered engineering briefs with print-friendly PDF styles and a schema-validated **JSON Resume** exporter.
- **`js/modules/search.js`, `command-palette.js`, `terminal.js`**: Shared command registry powering `Ctrl/Cmd + K` search and the optional CLI terminal.

---

## 3. Running Locally & Static Hosting Deployment

Because the portfolio uses native ES modules (`<script type="module">`) and dynamic `import()`, serve the directory over a local HTTP server rather than `file://`:

### Option A: Python 3 Built-In HTTP Server

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

### Option B: GitHub Pages / Netlify / Cloudflare Pages

1. Push the repository to GitHub (`main` branch).
2. In **Settings → Pages**, set **Source** to deploy from the `main` branch (`/ (root)`).
3. No build step or bundler is required; all assets, ES modules, and `assets/resume.pdf` resolve via relative paths.

---

## 4. Running Automated Tests

The `tests/` directory contains Node.js ES module test suites (`node:test`) covering data integrity, search ranking, and deterministic lab functions:

```bash
node --test tests/data-validation.test.mjs tests/search.test.mjs tests/demonstrations.test.mjs
```
