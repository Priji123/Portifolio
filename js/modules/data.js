/**
 * @file data.js
 * @description Central source of truth for George Priji Promod's Evidence-Driven Engineering Portfolio.
 * Organized into: CONTENT, CLAIMS, EVIDENCE, PROJECTS, SKILLS, GRAPH.
 * Strictly adheres to factual accuracy: no invented metrics, accuracies, or unsupported claims.
 */

export const CLASSIFICATIONS = Object.freeze({
  DOCUMENTED: {
    id: 'DOCUMENTED',
    label: 'DOCUMENTED',
    meaning: 'Directly supported by the supplied portfolio content'
  },
  CONCEPT: {
    id: 'CONCEPT',
    label: 'CONCEPT',
    meaning: 'General technical explanation, not necessarily a documented project decision'
  },
  DEMONSTRATION: {
    id: 'DEMONSTRATION',
    label: 'DEMONSTRATION',
    meaning: 'A locally executable educational example using synthetic data'
  },
  PENDING: {
    id: 'PENDING',
    label: 'EVIDENCE PENDING',
    meaning: 'Information or evidence that the portfolio owner must supply'
  }
});

export const CAPTIONS = Object.freeze({
  SYNTHETIC_DEMO: 'Educational demonstration using synthetic data. Not the original project implementation or experimental results.',
  STATIC_DIAGRAM: 'Illustrative architecture diagram. Represents the conceptual workflow.',
  SECURITY_DEMO: 'Educational secure-coding demonstration. The original Devign-based project model is not running in this interface.'
});

export const CONTENT = Object.freeze({
  candidate: {
    name: 'George Priji Promod',
    title: 'M.Tech Computer Science & Engineering Graduate',
    subtitle: 'Software Engineering · Computer Vision & ML Pipelines · Systems & Security',
    phone: '+91-8730027483',
    email: 'georgepriji@gmail.com',
    linkedin: 'https://linkedin.com/in/george-priji-promod-1428a2244',
    linkedinDisplay: 'linkedin.com/in/george-priji-promod-1428a2244',
    github: 'https://github.com/Priji123',
    githubDisplay: 'github.com/Priji123',
    location: 'Kerala, India',
    resumeUrl: 'assets/resume.pdf',
    profile: 'An M.Tech Computer Science graduate with strong programming skills and a track record of designing and implementing software systems end-to-end. Built and evaluated ML pipelines, computer vision systems, and data processing frameworks using Python, applying core software engineering principles including modular design, algorithm implementation, and structured testing. Supplemented by practical exposure to system administration, scripting, and infrastructure automation during an internship in a professional IT environment. Eager to apply these skills in a software or system engineering role.'
  },

  perspectives: [
    {
      id: 'all',
      label: 'Full Engineering View',
      description: 'Complete portfolio with interactive laboratories, technical decision records, and relationship graph.'
    },
    {
      id: 'recruiter',
      label: 'Recruiter Perspective',
      description: 'Prioritizes verified experience, core competencies, education, and executive project summaries.'
    },
    {
      id: 'technical',
      label: 'Technical Interviewer',
      description: 'Prioritizes system architecture, modular pipelines, interactive laboratories, and engineering decisions.'
    },
    {
      id: 'research',
      label: 'Research & Algorithms',
      description: 'Prioritizes M.Tech thesis methodology, NIT Silchar graph algorithm benchmarking, and mathematical concepts.'
    }
  ],

  discoveryOptions: [
    {
      id: 'cv-segmentation',
      label: 'Computer vision and image segmentation',
      summary: 'Explore pixel-level crack segmentation using Attention U-Net and Frangi filter-based pseudo-mask generation.',
      projects: ['crack-detection'],
      experiences: [],
      labId: 'lab-crack',
      sectionId: 'projects',
      skills: ['Python', 'TensorFlow', 'Attention U-Net', 'Semantic Segmentation', 'Image Preprocessing', 'OpenCV', 'scikit-image']
    },
    {
      id: 'ai-security',
      label: 'AI-based software security',
      summary: 'Explore vulnerable C code classification on the Devign dataset with SHAP/LIME explainability, plus web/mobile security testing.',
      projects: ['code-vulnerability-detector'],
      experiences: ['exp-canza'],
      labId: 'lab-vulnerability',
      sectionId: 'projects',
      skills: ['Python', 'C', 'Explainable AI (SHAP, LIME)', 'Burp Suite', 'MobSF', 'OWASP Standards', 'Apache JMeter', 'BlazeMeter']
    },
    {
      id: 'gait-recognition',
      label: 'Human identification and gait recognition',
      summary: 'Explore multi-stage CCTV video processing, silhouette extraction, HOG features, PCA/LDA dimensionality reduction, and SVM/CNN classifiers.',
      projects: ['gait-recognition'],
      experiences: [],
      labId: 'lab-gait',
      sectionId: 'projects',
      skills: ['Python', 'OpenCV', 'HOG', 'PCA', 'LDA', 'SVM', 'CNN']
    },
    {
      id: 'graph-research',
      label: 'Graph algorithms and network research',
      summary: 'Explore overlapping community detection algorithms (LBLD, FSLD, Prasar) and systematic benchmarking at NIT Silchar.',
      projects: ['community-detection-research'],
      experiences: ['exp-nit-silchar'],
      labId: 'lab-community',
      sectionId: 'experience',
      skills: ['Python', 'NetworkX', 'Algorithm Design and Implementation', 'Data Structures']
    },
    {
      id: 'systems-infra',
      label: 'Systems and infrastructure',
      summary: 'Explore Windows Server Active Directory administration, PowerShell automation, Hyper-V virtualization, and TCP/IP diagnostics at Atticube.',
      projects: [],
      experiences: ['exp-atticube'],
      labId: null,
      sectionId: 'experience',
      skills: ['PowerShell scripting', 'Active Directory', 'Hyper-V VM configuration', 'Windows system administration', 'TCP/IP', 'BIOS/UEFI']
    }
  ],

  education: [
    {
      id: 'edu-mtech',
      institution: 'Mar Baselios College of Engineering and Technology',
      location: 'Thiruvananthapuram, Kerala',
      degree: 'Master of Technology in Computer Science and Engineering',
      metric: 'CGPA: 8.24/10',
      period: 'Sep 2024 – May 2026',
      classification: 'DOCUMENTED'
    },
    {
      id: 'edu-btech',
      institution: 'North Eastern Regional Institute of Science and Technology (NERIST)',
      location: 'Arunachal Pradesh',
      degree: 'Bachelor of Technology in Computer Science and Engineering',
      metric: 'CGPA: 8.57/10',
      period: 'Sep 2020 – Dec 2024',
      classification: 'DOCUMENTED'
    },
    {
      id: 'edu-xii',
      institution: 'Kendriya Vidyalaya-2 Itanagar',
      location: 'Arunachal Pradesh',
      degree: 'Senior Secondary (Class XII), CBSE | Science Stream (PCM)',
      metric: 'Percentage: 82.6%',
      period: '2020',
      classification: 'DOCUMENTED'
    },
    {
      id: 'edu-x',
      institution: 'Holy Cross School Nyokum Lapang',
      location: 'Arunachal Pradesh',
      degree: 'Secondary (Class X), CBSE',
      metric: 'Percentage: 78.8%',
      period: '2018',
      classification: 'DOCUMENTED'
    }
  ],

  experience: [
    {
      id: 'exp-atticube',
      role: 'Systems & Infrastructure Intern',
      organization: 'Atticube, Technopark',
      location: 'Thiruvananthapuram, Kerala',
      period: 'Jul 2026 – Oct 2026',
      domains: ['systems', 'software'],
      classification: 'DOCUMENTED',
      highlights: [
        'Used PowerShell for system administration tasks and automated Windows configurations; administered Active Directory in a Windows Server environment, creating users, organisational units (OUs), and configuring Group Policy.',
        'Configured and deployed Hyper-V virtual machines end-to-end from Windows 11 ISO — including resource allocation, checkpoint management, and integration with Microsoft Entra ID for identity management.',
        'Performed full Windows 11 system builds on physical and virtual machines, covering boot media preparation, BIOS/UEFI configuration, disk partitioning, and Windows Registry administration.',
        'Diagnosed and resolved network and system connectivity issues using ipconfig, ping, tracert, and nslookup; maintained structured technical documentation for all configurations and procedures.'
      ],
      technologies: [
        'PowerShell scripting',
        'Active Directory',
        'Windows system administration',
        'Windows Registry',
        'Hyper-V VM configuration',
        'BIOS/UEFI',
        'MBR/GPT partitioning',
        'TCP/IP',
        'ipconfig / ping / tracert / nslookup'
      ]
    },
    {
      id: 'exp-canza',
      role: 'Cybersecurity & Performance Testing Intern',
      organization: 'Canza Technology Consultants, Technopark',
      location: 'Thiruvananthapuram, Kerala',
      period: 'Jul 2025 – Aug 2025',
      domains: ['security', 'software'],
      classification: 'DOCUMENTED',
      highlights: [
        'Conducted web application security testing using Burp Suite, performing vulnerability assessments and attack simulations through TryHackMe and PortSwigger Academy labs.',
        'Designed and executed load and performance testing scenarios using Apache JMeter and BlazeMeter, analyzing system bottlenecks and throughput metrics.',
        'Performed mobile application security analysis using MobSF to identify APK vulnerabilities following OWASP security standards.'
      ],
      technologies: [
        'Burp Suite',
        'Apache JMeter',
        'BlazeMeter',
        'MobSF',
        'OWASP Standards',
        'Vulnerability Assessment'
      ]
    },
    {
      id: 'exp-nit-silchar',
      role: 'Research Intern – Algorithm Implementation & Analysis',
      organization: 'National Institute of Technology Silchar (SNB SIP)',
      location: 'Silchar, Assam',
      period: 'Jun 2023 – Jul 2023',
      domains: ['research', 'software'],
      classification: 'DOCUMENTED',
      highlights: [
        'Implemented overlapping community detection algorithms (LBLD, FSLD, Prasar) in Python using NetworkX, evaluating performance across multiple benchmark graph datasets using NMI, modularity, and coverage metrics.',
        'Conducted systematic algorithm benchmarking against state-of-the-art methods (Louvain, LPA, SLPA, ERCNS), contributing to published research on complex network analysis.'
      ],
      technologies: [
        'Python',
        'NetworkX',
        'Algorithm Design and Implementation',
        'Data Structures'
      ]
    }
  ],

  certifications: [
    { id: 'cert-1', title: 'The Joy of Computing using Python', issuer: 'NPTEL', date: 'Apr 2023', status: 'DOCUMENTED' },
    { id: 'cert-2', title: 'Ethical Hacking', issuer: 'NPTEL', date: 'Oct 2023', status: 'DOCUMENTED' },
    { id: 'cert-3', title: 'Introduction to Internet of Things', issuer: 'NPTEL', date: 'May 2024', status: 'DOCUMENTED' },
    { id: 'cert-4', title: 'Linear Programming and its Applications to Computer Science', issuer: 'NPTEL', date: 'May 2025', status: 'DOCUMENTED' },
    { id: 'cert-5', title: 'Digital Forensics Concepts', issuer: 'Coursera', date: 'May 2025', status: 'DOCUMENTED' },
    { id: 'cert-6', title: 'Introduction to Deep Learning', issuer: 'Infosys Springboard', date: 'May 2025', status: 'DOCUMENTED' },
    { id: 'cert-7', title: 'Cybersecurity (CC) Learning Experience', issuer: 'ISC2', date: 'Verified on CV', status: 'DOCUMENTED' },
    { id: 'cert-8', title: 'Master BlazeMeter Performance Testing Certification', issuer: 'BlazeMeter', date: 'Verified on CV', status: 'DOCUMENTED' },
    { id: 'cert-9', title: 'PortSwigger Burp Suite Academy – Web Security Testing', issuer: 'PortSwigger', date: 'Verified on CV', status: 'DOCUMENTED' }
  ]
});

export const CLAIMS = Object.freeze([
  {
    id: 'claim-crack-10k',
    projectId: 'crack-detection',
    statement: 'Engineered an automated data labelling pipeline using Frangi filter-based pseudo-mask generation, processing 10,000+ image pairs without manual annotation.',
    classification: 'DOCUMENTED',
    source: 'M.Tech Thesis Project — CV (Page 1)'
  },
  {
    id: 'claim-crack-arch',
    projectId: 'crack-detection',
    statement: 'Designed and implemented an Attention U-Net deep learning system in Python for pixel-level crack segmentation across diverse surface textures and real-world environmental conditions.',
    classification: 'DOCUMENTED',
    source: 'M.Tech Thesis Project — CV (Page 1)'
  },
  {
    id: 'claim-crack-loss',
    projectId: 'crack-detection',
    statement: 'Implemented custom loss functions (Tversky Loss, Dice Coefficient) and a mixed-precision TensorFlow training pipeline, demonstrating end-to-end system design from data ingestion to model evaluation.',
    classification: 'DOCUMENTED',
    source: 'M.Tech Thesis Project — CV (Page 1)'
  },
  {
    id: 'claim-vuln-devign',
    projectId: 'code-vulnerability-detector',
    statement: 'Built an end-to-end ML classification system in Python to identify vulnerable C code, trained on the Devign dataset containing 27,000+ real-world functions.',
    classification: 'DOCUMENTED',
    source: 'M.Tech Mini Project — CV (Page 2)'
  },
  {
    id: 'claim-vuln-xai',
    projectId: 'code-vulnerability-detector',
    statement: 'Designed a modular preprocessing and feature extraction pipeline for structured code analysis and integrated SHAP and LIME for interpretable model outputs.',
    classification: 'DOCUMENTED',
    source: 'M.Tech Mini Project — CV (Page 2)'
  },
  {
    id: 'claim-gait-pipeline',
    projectId: 'gait-recognition',
    statement: 'Developed a multi-stage video processing system in Python, covering frame extraction, foreground isolation, HOG feature engineering, and PCA/LDA-based dimensionality reduction.',
    classification: 'DOCUMENTED',
    source: 'B.Tech Major Project — CV (Page 2)'
  },
  {
    id: 'claim-gait-classifiers',
    projectId: 'gait-recognition',
    statement: 'Implemented and benchmarked SVM and CNN classifiers, evaluating performance robustness under real-world lighting and pose variation.',
    classification: 'DOCUMENTED',
    source: 'B.Tech Major Project — CV (Page 2)'
  },
  {
    id: 'claim-community-impl',
    projectId: 'community-detection-research',
    statement: 'Implemented overlapping community detection algorithms (LBLD, FSLD, Prasar) in Python using NetworkX, evaluating performance across multiple benchmark graph datasets using NMI, modularity, and coverage metrics.',
    classification: 'DOCUMENTED',
    source: 'NIT Silchar Research Internship — CV (Page 2)'
  },
  {
    id: 'claim-community-bench',
    projectId: 'community-detection-research',
    statement: 'Conducted systematic algorithm benchmarking against state-of-the-art methods (Louvain, LPA, SLPA, ERCNS), contributing to published research on complex network analysis.',
    classification: 'DOCUMENTED',
    source: 'NIT Silchar Research Internship — CV (Page 2)'
  }
]);

export const EVIDENCE = Object.freeze([
  {
    id: 'ev-cv-document',
    projectId: 'crack-detection',
    type: 'documentation',
    title: 'Verified Curriculum Vitae (M.Tech Thesis Entry)',
    description: 'Official CV documenting the Attention U-Net architecture, Frangi filter pseudo-mask generation on 10,000+ image pairs, Tversky Loss, Dice Coefficient, and mixed-precision TensorFlow training pipeline.',
    source: 'assets/resume.pdf',
    status: 'AVAILABLE'
  },
  {
    id: 'crack-architecture',
    projectId: 'crack-detection',
    type: 'diagram',
    title: 'Attention U-Net Architecture Diagram',
    description: 'Conceptual encoder-decoder schematic illustrating skip connections, attention gates, and multi-scale feature fusion used in pixel-level crack segmentation.',
    source: 'interactive-schematic',
    status: 'AVAILABLE'
  },
  {
    id: 'crack-source-repo',
    projectId: 'crack-detection',
    type: 'code',
    title: 'M.Tech Thesis Source Code & Weights Repository',
    description: 'Full TensorFlow training scripts, Frangi pseudo-labelling scripts, and trained model weights.',
    source: null,
    status: 'PENDING'
  },
  {
    id: 'crack-evaluation-outputs',
    projectId: 'crack-detection',
    type: 'outputs',
    title: 'Quantitative Thesis Evaluation Tables & Segmentation Outputs',
    description: 'Exact experimental Dice/Tversky tables and multi-texture test set prediction masks from the thesis manuscript.',
    source: null,
    status: 'PENDING'
  },
  {
    id: 'vuln-architecture',
    projectId: 'code-vulnerability-detector',
    type: 'diagram',
    title: 'Devign Code Analysis & Explainable AI Workflow',
    description: 'Illustrative architecture diagram showing C function ingestion (27,000+ functions), feature extraction, classification, and local SHAP/LIME attribution.',
    source: 'interactive-schematic',
    status: 'AVAILABLE'
  },
  {
    id: 'vuln-source-repo',
    projectId: 'code-vulnerability-detector',
    type: 'code',
    title: 'Vulnerability Detector Source Code & Notebooks',
    description: 'Preprocessing pipeline and SHAP/LIME integration code for the M.Tech Mini Project.',
    source: null,
    status: 'PENDING'
  },
  {
    id: 'gait-pipeline-diagram',
    projectId: 'gait-recognition',
    type: 'diagram',
    title: 'Multi-Stage CCTV Gait Recognition Pipeline',
    description: 'Illustrative workflow from frame extraction and foreground isolation to GEI/HOG feature engineering, PCA/LDA reduction, and SVM/CNN classification.',
    source: 'interactive-schematic',
    status: 'AVAILABLE'
  },
  {
    id: 'gait-report',
    projectId: 'gait-recognition',
    type: 'documentation',
    title: 'B.Tech Major Project Report & Benchmark Logs',
    description: 'NERIST B.Tech project report and quantitative SVM vs. CNN evaluation metrics under lighting and pose variation.',
    source: null,
    status: 'PENDING'
  },
  {
    id: 'community-benchmark-diagram',
    projectId: 'community-detection-research',
    type: 'diagram',
    title: 'Overlapping Community Detection & Benchmarking Workflow',
    description: 'Illustrative diagram distinguishing implemented overlapping algorithms (LBLD, FSLD, Prasar) from benchmark baselines (Louvain, LPA, SLPA, ERCNS) across NMI, Modularity, and Coverage.',
    source: 'interactive-schematic',
    status: 'AVAILABLE'
  },
  {
    id: 'community-publication',
    projectId: 'community-detection-research',
    type: 'publication',
    title: 'Complex Network Analysis Research Publication / Manuscript',
    description: 'DOI or manuscript link for the published research contributed to during the NIT Silchar (SNB SIP) research internship.',
    source: null,
    status: 'PENDING'
  },
  {
    id: 'github-profile-link',
    projectId: 'crack-detection',
    type: 'external',
    title: 'GitHub Profile (@Priji123)',
    description: 'External link to the candidate’s GitHub profile.',
    source: 'https://github.com/Priji123',
    status: 'EXTERNAL LINK'
  }
]);

export const PROJECTS = Object.freeze([
  {
    id: 'crack-detection',
    title: 'Multi-Texture Building Surface Crack Detection',
    subtitle: 'M.Tech Thesis Project',
    category: 'cv-ml',
    domains: ['ai-cv', 'software', 'research'],
    period: 'Sep 2024 – May 2026',
    institution: 'Mar Baselios College of Engineering and Technology',
    classification: 'DOCUMENTED',
    summary: 'Pixel-level crack segmentation system using Attention U-Net in Python and TensorFlow, backed by an automated Frangi filter-based pseudo-mask labelling pipeline that processed 10,000+ image pairs without manual annotation.',
    scaleMetric: '10,000+ Image Pairs Processed Without Manual Annotation',
    technologies: [
      'Python',
      'TensorFlow',
      'Attention U-Net',
      'Semantic Segmentation',
      'Image Preprocessing',
      'OpenCV',
      'scikit-image'
    ],
    labId: 'lab-crack',
    evidenceIds: ['ev-cv-document', 'crack-architecture', 'crack-source-repo', 'crack-evaluation-outputs', 'github-profile-link'],
    bullets: [
      'Designed and implemented an Attention U-Net deep learning system in Python for pixel-level crack segmentation across diverse surface textures and real-world environmental conditions.',
      'Engineered an automated data labelling pipeline using Frangi filter-based pseudo-mask generation, processing 10,000+ image pairs without manual annotation.',
      'Implemented custom loss functions (Tversky Loss, Dice Coefficient) and a mixed-precision TensorFlow training pipeline, demonstrating end-to-end system design from data ingestion to model evaluation.'
    ],
    decisions: {
      problem: {
        classification: 'DOCUMENTED',
        text: 'Surface crack inspection across diverse building textures (concrete, masonry, rough plaster) under varying real-world lighting suffers from severe foreground-background class imbalance and noisy background textures. Additionally, manually annotating pixel-accurate binary segmentation masks for over 10,000 high-resolution surface images is prohibitively slow and inconsistent.'
      },
      approach: {
        classification: 'DOCUMENTED',
        text: 'Designed a two-pillar end-to-end architecture in Python: (1) an automated data labelling pipeline leveraging Frangi vesselness filtering and image preprocessing to generate pseudo-masks across 10,000+ image pairs without manual annotation, and (2) an Attention U-Net deep learning model trained with a mixed-precision TensorFlow pipeline using Tversky Loss and Dice Coefficient evaluation.'
      },
      technologies: [
        'Python',
        'TensorFlow (Mixed-Precision Training)',
        'Attention U-Net',
        'Frangi Filter (Pseudo-Mask Generation)',
        'Tversky Loss & Dice Coefficient',
        'OpenCV & scikit-image'
      ],
      workflow: [
        { stage: '1. Surface Image Ingestion', detail: 'Ingests 10,000+ raw multi-texture building surface images across diverse environmental conditions.', classification: 'DOCUMENTED' },
        { stage: '2. Image Preprocessing', detail: 'Applies edge-preserving smoothing and local contrast normalization prior to structure enhancement.', classification: 'CONCEPT' },
        { stage: '3. Pseudo-Mask Generation', detail: 'Executes Frangi filter-based tubular/ridge enhancement and morphological refinement to produce automated pseudo-masks without manual pixel labelling.', classification: 'DOCUMENTED' },
        { stage: '4. Attention U-Net Training', detail: 'Trains an encoder-decoder network with attention gates on skip connections using mixed-precision TensorFlow and Tversky Loss.', classification: 'DOCUMENTED' },
        { stage: '5. Semantic Segmentation & Evaluation', detail: 'Generates pixel-level crack probability maps and evaluates segmentation overlap using the Dice Coefficient.', classification: 'DOCUMENTED' }
      ],
      concepts: [
        {
          id: 'concept-cls-vs-seg',
          title: 'Image Classification vs. Semantic Segmentation',
          classification: 'CONCEPT',
          explanation: 'Image classification assigns a single label (e.g., "cracked" or "intact") to an entire image or patch, losing spatial geometry. Semantic segmentation assigns a class probability to every individual pixel (H × W), enabling precise localization of crack topology, width, and orientation across complex masonry textures.'
        },
        {
          id: 'concept-pseudo-label',
          title: 'Frangi Filter-Based Pseudo-Label Generation',
          classification: 'DOCUMENTED',
          explanation: 'Documented project pipeline component: Uses second-order local intensity derivatives (the Hessian matrix eigenvalues λ₁, λ₂) via the Frangi filter to detect continuous ridge-like/tubular crack structures against granular surface noise, scaling dataset preparation to 10,000+ image pairs without manual annotation.'
        },
        {
          id: 'concept-attention-unet',
          title: 'Attention Mechanisms in U-Net Skip Connections',
          classification: 'DOCUMENTED',
          explanation: 'Documented model architecture: Standard U-Net skip connections concatenate all low-level encoder features directly to the decoder, including repetitive surface texture clutter. Attention Gates weight skip-connection features spatially using contextual gating signals from coarser decoder scales, suppressing background texture noise.'
        },
        {
          id: 'concept-tversky-dice',
          title: 'Tversky Loss & Dice Coefficient (vs. General IoU Concept)',
          classification: 'DOCUMENTED',
          explanation: 'Documented project metrics: Because crack pixels typically occupy less than 2–5% of a surface image, standard cross-entropy biases toward predicting all-background. Tversky Loss introduces asymmetric weights (α, β) on false positives and false negatives, while the Dice Coefficient measures harmonic overlap (2TP / (2TP + FP + FN)). Note: Intersection over Union (IoU = TP / (TP + FP + FN)) is explained in the interactive lab as a general segmentation concept; only Tversky Loss and Dice Coefficient are documented thesis components.'
        }
      ],
      challenges: {
        classification: 'PENDING',
        text: 'EVIDENCE PENDING — Specific historical hyperparameter tuning logs, false-positive edge cases on rough aggregate textures, and hardware training throughput benchmarks are pending thesis manuscript attachment.'
      },
      evaluation: {
        classification: 'DOCUMENTED',
        text: 'Evaluated using the Dice Coefficient and optimized via Tversky Loss within a mixed-precision TensorFlow pipeline across 10,000+ multi-texture image pairs. Exact numerical benchmark scores from the thesis manuscript are marked EVIDENCE PENDING to prevent synthetic metric fabrication.'
      }
    }
  },
  {
    id: 'code-vulnerability-detector',
    title: 'Explainable AI-Based Code Vulnerability Detector',
    subtitle: 'M.Tech Mini Project',
    category: 'security-ml',
    domains: ['security', 'ai-cv', 'software'],
    period: 'M.Tech Coursework (2024 – 2026)',
    institution: 'Mar Baselios College of Engineering and Technology',
    classification: 'DOCUMENTED',
    summary: 'End-to-end machine learning classification system in Python to identify vulnerable C code trained on the Devign dataset (27,000+ real-world functions), featuring modular code preprocessing and SHAP/LIME interpretability.',
    scaleMetric: '27,000+ Real-World C Functions (Devign Dataset)',
    technologies: [
      'Python',
      'C',
      'Explainable AI (SHAP, LIME)',
      'Feature Extraction',
      'Model Evaluation',
      'Modular System Design',
      'Pipeline Architecture'
    ],
    labId: 'lab-vulnerability',
    evidenceIds: ['vuln-architecture', 'vuln-source-repo'],
    bullets: [
      'Built an end-to-end ML classification system in Python to identify vulnerable C code, trained on the Devign dataset containing 27,000+ real-world functions.',
      'Designed a modular preprocessing and feature extraction pipeline for structured code analysis and integrated SHAP and LIME for interpretable model outputs.'
    ],
    decisions: {
      problem: {
        classification: 'DOCUMENTED',
        text: 'Manual code auditing of large C codebases for memory safety and control-flow vulnerabilities is time-consuming, while black-box machine learning classifiers fail to tell security engineers which code tokens or statements triggered a vulnerability alert.'
      },
      approach: {
        classification: 'DOCUMENTED',
        text: 'Developed an end-to-end ML classification pipeline in Python trained on the Devign dataset (27,000+ real-world C functions). Engineered a modular preprocessing and feature extraction pipeline for structured code analysis, and integrated post-hoc Explainable AI (SHAP and LIME) to attribute predictions to specific code features.'
      },
      technologies: [
        'Python',
        'C Source Code Analysis',
        'Devign Dataset (27,000+ Functions)',
        'SHAP (SHapley Additive exPlanations)',
        'LIME (Local Interpretable Model-agnostic Explanations)',
        'Modular Preprocessing & Feature Extraction Pipeline'
      ],
      workflow: [
        { stage: '1. Devign Corpus Ingestion', detail: 'Loads 27,000+ labeled real-world C functions from open-source projects.', classification: 'DOCUMENTED' },
        { stage: '2. Modular Code Preprocessing', detail: 'Normalizes source formatting, strips non-semantic comments, and prepares structured code representations.', classification: 'DOCUMENTED' },
        { stage: '3. Feature Extraction Pipeline', detail: 'Extracts structured lexical and syntactic code features for downstream supervised learning.', classification: 'DOCUMENTED' },
        { stage: '4. ML Vulnerability Classification', detail: 'Trains and evaluates a supervised classification model to distinguish vulnerable from non-vulnerable C functions.', classification: 'DOCUMENTED' },
        { stage: '5. SHAP & LIME Attribution', detail: 'Generates local and feature-level attribution scores so analysts can inspect which code constructs drove the model output.', classification: 'DOCUMENTED' }
      ],
      concepts: [
        {
          id: 'concept-static-analysis',
          title: 'Static Code Analysis vs. Dynamic Testing',
          classification: 'CONCEPT',
          explanation: 'Static analysis inspects source code structure without executing the binary, enabling early detection of unsafe memory operations (such as unbounded buffer copies or integer overflows) across all code paths before compilation.'
        },
        {
          id: 'concept-devign-learning',
          title: 'Dataset-Based Vulnerability Learning (Devign)',
          classification: 'DOCUMENTED',
          explanation: 'Documented project dataset: The system is trained on the Devign benchmark dataset containing 27,000+ real-world C functions curated from production repositories, capturing realistic vulnerability patterns beyond synthetic toy examples.'
        },
        {
          id: 'concept-shap',
          title: 'SHAP (SHapley Additive exPlanations)',
          classification: 'DOCUMENTED',
          explanation: 'Documented project component: Grounded in cooperative game theory, SHAP computes the marginal contribution of each extracted code feature across coalitions, satisfying local accuracy and consistency when explaining why a function was flagged.'
        },
        {
          id: 'concept-lime',
          title: 'LIME (Local Interpretable Model-agnostic Explanations)',
          classification: 'DOCUMENTED',
          explanation: 'Documented project component: Perturbs the input function representation locally and fits an interpretable linear surrogate model around a single prediction, highlighting specific token/feature weights responsible for that local decision.'
        }
      ],
      challenges: {
        classification: 'PENDING',
        text: 'EVIDENCE PENDING — Detailed false-positive analysis on macro-heavy C functions and specific classifier ablation metrics require project report attachment.'
      },
      evaluation: {
        classification: 'DOCUMENTED',
        text: 'Trained and evaluated on the 27,000+ function Devign dataset with integrated SHAP and LIME interpretability outputs. Specific precision/recall/F1 tables are marked EVIDENCE PENDING.'
      }
    }
  },
  {
    id: 'gait-recognition',
    title: 'Human Identification from CCTV Footage',
    subtitle: 'B.Tech Major Project',
    category: 'cv-ml',
    domains: ['ai-cv', 'software'],
    period: 'Sep 2020 – Dec 2024',
    institution: 'North Eastern Regional Institute of Science and Technology (NERIST)',
    classification: 'DOCUMENTED',
    summary: 'Multi-stage video processing system in Python covering frame extraction, foreground silhouette isolation, HOG feature engineering, PCA/LDA dimensionality reduction, and comparative benchmarking of SVM and CNN classifiers.',
    scaleMetric: 'Multi-Stage Video Pipeline · SVM & CNN Benchmarked',
    technologies: [
      'Python',
      'OpenCV',
      'HOG',
      'PCA',
      'LDA',
      'SVM',
      'CNN',
      'Feature Extraction'
    ],
    labId: 'lab-gait',
    evidenceIds: ['gait-pipeline-diagram', 'gait-report'],
    bullets: [
      'Developed a multi-stage video processing system in Python, covering frame extraction, foreground isolation, HOG feature engineering, and PCA/LDA-based dimensionality reduction.',
      'Implemented and benchmarked SVM and CNN classifiers, evaluating performance robustness under real-world lighting and pose variation.'
    ],
    decisions: {
      problem: {
        classification: 'DOCUMENTED',
        text: 'Identifying individuals from low-resolution or distant CCTV footage where facial biometrics are occluded or indistinct requires extracting spatio-temporal motion and silhouette descriptors that remain robust under lighting changes and pose variation.'
      },
      approach: {
        classification: 'DOCUMENTED',
        text: 'Engineered a modular multi-stage video processing pipeline in Python: extracting frames from CCTV sequences, isolating foreground silhouettes, computing Histogram of Oriented Gradients (HOG) descriptors, applying PCA and LDA dimensionality reduction, and benchmarking both classical (SVM) and deep (CNN) classifiers.'
      },
      technologies: [
        'Python',
        'OpenCV (Video & Frame Processing)',
        'Foreground Isolation / Silhouette Extraction',
        'HOG (Histogram of Oriented Gradients)',
        'PCA (Principal Component Analysis) & LDA (Linear Discriminant Analysis)',
        'SVM (Support Vector Machine) & CNN (Convolutional Neural Network)'
      ],
      workflow: [
        { stage: '1. CCTV Video & Frame Extraction', detail: 'Decodes surveillance video streams into sequential temporal frame buffers.', classification: 'DOCUMENTED' },
        { stage: '2. Foreground Isolation (Silhouette)', detail: 'Separates the moving human subject from the static background to produce aligned binary silhouettes.', classification: 'DOCUMENTED' },
        { stage: '3. Gait Energy Image (Conceptual Representation)', detail: 'Aggregates aligned silhouettes over a gait cycle into a compact spatio-temporal intensity representation.', classification: 'CONCEPT' },
        { stage: '4. HOG Feature Engineering', detail: 'Computes localized gradient orientation histograms across spatial cells to capture body contour and posture dynamics.', classification: 'DOCUMENTED' },
        { stage: '5. PCA / LDA Dimensionality Reduction', detail: 'Projects high-dimensional HOG vectors onto principal variance (PCA) and class-separable (LDA) subspaces.', classification: 'DOCUMENTED' },
        { stage: '6. SVM & CNN Classification Benchmark', detail: 'Evaluates subject identification robustness across lighting and pose variations using SVM and CNN models.', classification: 'DOCUMENTED' }
      ],
      concepts: [
        {
          id: 'concept-silhouette-gei',
          title: 'Silhouette-Based Recognition & Gait Energy Image (GEI)',
          classification: 'CONCEPT',
          explanation: 'Isolating binary silhouettes removes clothing color and texture bias, focusing recognition on body geometry and stride kinematics. A Gait Energy Image (GEI) averages aligned binary silhouettes over a full gait cycle: high-intensity core pixels represent static torso posture, while mid-intensity peripheral pixels capture limb swing frequency and amplitude.'
        },
        {
          id: 'concept-hog',
          title: 'Histogram of Oriented Gradients (HOG)',
          classification: 'DOCUMENTED',
          explanation: 'Documented project feature engineering: Divides the image into small spatial cells, computes horizontal and vertical pixel intensity gradients (Gx, Gy), and accumulates gradient magnitudes into orientation bins. Block normalization provides illumination invariance.'
        },
        {
          id: 'concept-pca-lda',
          title: 'PCA vs. LDA Dimensionality Reduction',
          classification: 'DOCUMENTED',
          explanation: 'Documented project pipeline: Principal Component Analysis (PCA) is unsupervised and projects features onto orthogonal axes of maximum total variance, eliminating collinearity. Linear Discriminant Analysis (LDA) is supervised and maximizes the ratio of between-class scatter to within-class scatter, improving subject separability.'
        },
        {
          id: 'concept-svm-cnn',
          title: 'SVM vs. CNN Classifiers in Biometric Identification',
          classification: 'DOCUMENTED',
          explanation: 'Documented benchmark: Support Vector Machines (SVM) find maximum-margin hyperplanes over engineered HOG/PCA/LDA feature vectors and excel on structured low-sample regimes. Convolutional Neural Networks (CNN) learn hierarchical spatial filters directly. Both were implemented and benchmarked for robustness under real-world lighting and pose variation.'
        }
      ],
      challenges: {
        classification: 'PENDING',
        text: 'EVIDENCE PENDING — Specific camera angle protocols, dataset subject counts, and shadow-removal edge cases require B.Tech report attachment.'
      },
      evaluation: {
        classification: 'DOCUMENTED',
        text: 'Benchmarked SVM and CNN classifiers under real-world lighting and pose variation. Exact comparative accuracy numbers are marked EVIDENCE PENDING and are never fabricated.'
      }
    }
  },
  {
    id: 'community-detection-research',
    title: 'Overlapping Community Detection & Graph Algorithm Benchmarking',
    subtitle: 'NIT Silchar Research Internship (SNB SIP)',
    category: 'research-alg',
    domains: ['research', 'software'],
    period: 'Jun 2023 – Jul 2023',
    institution: 'National Institute of Technology Silchar',
    classification: 'DOCUMENTED',
    summary: 'Implemented overlapping community detection algorithms (LBLD, FSLD, Prasar) in Python using NetworkX and conducted systematic benchmarking against Louvain, LPA, SLPA, and ERCNS across NMI, modularity, and coverage metrics.',
    scaleMetric: '3 Implemented Algorithms vs. 4 State-of-the-Art Baselines',
    technologies: [
      'Python',
      'NetworkX',
      'Algorithm Design and Implementation',
      'Data Structures',
      'Model Evaluation'
    ],
    labId: 'lab-community',
    evidenceIds: ['community-benchmark-diagram', 'community-publication'],
    bullets: [
      'Implemented overlapping community detection algorithms (LBLD, FSLD, Prasar) in Python using NetworkX, evaluating performance across multiple benchmark graph datasets using NMI, modularity, and coverage metrics.',
      'Conducted systematic algorithm benchmarking against state-of-the-art methods (Louvain, LPA, SLPA, ERCNS), contributing to published research on complex network analysis.'
    ],
    decisions: {
      problem: {
        classification: 'DOCUMENTED',
        text: 'In real-world complex networks (social, biological, and information graphs), vertices frequently belong to multiple communities simultaneously. Partitioning algorithms that force disjoint membership fail to capture overlapping bridge nodes and require rigorous multi-metric benchmarking.'
      },
      approach: {
        classification: 'DOCUMENTED',
        text: 'Implemented three overlapping community detection algorithms (LBLD, FSLD, Prasar) in Python using NetworkX and executed a systematic benchmarking suite comparing them against four state-of-the-art baseline algorithms (Louvain, LPA, SLPA, ERCNS) using NMI, modularity, and coverage metrics.'
      },
      technologies: [
        'Python',
        'NetworkX',
        'Implemented Overlapping Algorithms: LBLD, FSLD, Prasar',
        'Benchmarked Baselines: Louvain, LPA, SLPA, ERCNS',
        'Evaluation Metrics: NMI, Modularity, Coverage'
      ],
      workflow: [
        { stage: '1. Benchmark Graph Ingestion', detail: 'Loads complex network datasets into NetworkX graph structures G = (V, E).', classification: 'DOCUMENTED' },
        { stage: '2. Overlapping Algorithm Execution', detail: 'Runs candidate-implemented overlapping community detection algorithms: LBLD, FSLD, and Prasar.', classification: 'DOCUMENTED' },
        { stage: '3. Baseline Execution', detail: 'Executes state-of-the-art comparison methods: Louvain, LPA, SLPA, and ERCNS.', classification: 'DOCUMENTED' },
        { stage: '4. Multi-Metric Evaluation', detail: 'Computes Normalized Mutual Information (NMI), Modularity, and Coverage across detected community structures.', classification: 'DOCUMENTED' }
      ],
      concepts: [
        {
          id: 'concept-overlapping-vs-disjoint',
          title: 'Implemented Overlapping Algorithms (LBLD, FSLD, Prasar) vs. Baselines',
          classification: 'DOCUMENTED',
          explanation: 'Documented distinction: During the NIT Silchar internship, the candidate implemented LBLD, FSLD, and Prasar in Python using NetworkX for overlapping community detection, and benchmarked them against Louvain, LPA, SLPA, and ERCNS. Internal proprietary rules of LBLD, FSLD, and Prasar are not fabricated in this portfolio.'
        },
        {
          id: 'concept-lpa-louvain',
          title: 'Louvain, LPA, SLPA, and ERCNS (Benchmarking Baselines)',
          classification: 'CONCEPT',
          explanation: 'Louvain greedily maximizes modularity via hierarchical aggregation. Label Propagation Algorithm (LPA) iteratively assigns each node the majority label among its immediate neighbors. SLPA generalizes label propagation using speaker-listener memory histories to permit overlapping memberships, while ERCNS serves as a comparative network structure baseline.'
        },
        {
          id: 'concept-nmi-mod-cov',
          title: 'Evaluation Metrics: NMI, Modularity, and Coverage',
          classification: 'DOCUMENTED',
          explanation: 'Documented evaluation metrics: Normalized Mutual Information (NMI) quantifies information-theoretic agreement between detected communities and ground-truth covers. Modularity (Q) compares intra-community edge density against a null configuration model. Coverage measures the fraction of total graph edges whose endpoints share at least one common community.'
        }
      ],
      challenges: {
        classification: 'PENDING',
        text: 'EVIDENCE PENDING — Specific graph dataset sizes and runtime complexity curves from the NIT Silchar research study are pending manuscript attachment.'
      },
      evaluation: {
        classification: 'DOCUMENTED',
        text: 'Evaluated across multiple benchmark graph datasets using NMI, modularity, and coverage metrics, contributing to published research on complex network analysis.'
      }
    }
  }
]);

export const SKILLS = Object.freeze([
  {
    category: 'Programming Languages',
    id: 'cat-languages',
    items: [
      { id: 'skill-python', name: 'Python', primary: true, domains: ['software', 'ai-cv', 'security', 'research'], relatedProjects: ['crack-detection', 'code-vulnerability-detector', 'gait-recognition', 'community-detection-research'], relatedExperience: ['exp-nit-silchar'] },
      { id: 'skill-c', name: 'C', primary: false, domains: ['software', 'security'], relatedProjects: ['code-vulnerability-detector'], relatedExperience: [] },
      { id: 'skill-cpp', name: 'C++', primary: false, domains: ['software'], relatedProjects: [], relatedExperience: [] },
      { id: 'skill-sql', name: 'SQL', primary: false, domains: ['software'], relatedProjects: [], relatedExperience: [] }
    ]
  },
  {
    category: 'Software Engineering',
    id: 'cat-se',
    items: [
      { id: 'skill-alg-design', name: 'Algorithm Design and Implementation', primary: true, domains: ['software', 'research'], relatedProjects: ['community-detection-research'], relatedExperience: ['exp-nit-silchar'] },
      { id: 'skill-pipeline', name: 'Pipeline Architecture', primary: true, domains: ['software', 'ai-cv'], relatedProjects: ['crack-detection', 'code-vulnerability-detector', 'gait-recognition'], relatedExperience: [] },
      { id: 'skill-modular', name: 'Modular System Design', primary: true, domains: ['software'], relatedProjects: ['crack-detection', 'code-vulnerability-detector', 'gait-recognition'], relatedExperience: [] },
      { id: 'skill-ds', name: 'Data Structures', primary: false, domains: ['software', 'research'], relatedProjects: ['community-detection-research'], relatedExperience: ['exp-nit-silchar'] },
      { id: 'skill-oop', name: 'OOP', primary: false, domains: ['software'], relatedProjects: [], relatedExperience: [] },
      { id: 'skill-e2e', name: 'End-to-End System Development', primary: false, domains: ['software', 'ai-cv'], relatedProjects: ['crack-detection', 'code-vulnerability-detector'], relatedExperience: [] }
    ]
  },
  {
    category: 'Machine Learning & AI',
    id: 'cat-ml',
    items: [
      { id: 'skill-attention-unet', name: 'Attention U-Net', primary: true, domains: ['ai-cv', 'research'], relatedProjects: ['crack-detection'], relatedExperience: [] },
      { id: 'skill-cnn', name: 'CNN', primary: true, domains: ['ai-cv'], relatedProjects: ['gait-recognition'], relatedExperience: [] },
      { id: 'skill-svm', name: 'SVM', primary: false, domains: ['ai-cv'], relatedProjects: ['gait-recognition'], relatedExperience: [] },
      { id: 'skill-feature-extraction', name: 'Feature Extraction', primary: false, domains: ['ai-cv', 'security'], relatedProjects: ['code-vulnerability-detector', 'gait-recognition'], relatedExperience: [] },
      { id: 'skill-pca-lda', name: 'Dimensionality Reduction (PCA, LDA)', primary: false, domains: ['ai-cv'], relatedProjects: ['gait-recognition'], relatedExperience: [] },
      { id: 'skill-xai', name: 'Explainable AI (SHAP, LIME)', primary: true, domains: ['ai-cv', 'security'], relatedProjects: ['code-vulnerability-detector'], relatedExperience: [] },
      { id: 'skill-model-eval', name: 'Model Evaluation', primary: false, domains: ['ai-cv', 'research'], relatedProjects: ['crack-detection', 'code-vulnerability-detector', 'gait-recognition', 'community-detection-research'], relatedExperience: ['exp-nit-silchar'] }
    ]
  },
  {
    category: 'Computer Vision & Data Processing',
    id: 'cat-cv',
    items: [
      { id: 'skill-opencv', name: 'OpenCV', primary: true, domains: ['ai-cv'], relatedProjects: ['crack-detection', 'gait-recognition'], relatedExperience: [] },
      { id: 'skill-skimage', name: 'scikit-image', primary: false, domains: ['ai-cv'], relatedProjects: ['crack-detection'], relatedExperience: [] },
      { id: 'skill-hog', name: 'HOG', primary: true, domains: ['ai-cv'], relatedProjects: ['gait-recognition'], relatedExperience: [] },
      { id: 'skill-img-preproc', name: 'Image Preprocessing', primary: false, domains: ['ai-cv'], relatedProjects: ['crack-detection', 'gait-recognition'], relatedExperience: [] },
      { id: 'skill-sem-seg', name: 'Semantic Segmentation', primary: true, domains: ['ai-cv'], relatedProjects: ['crack-detection'], relatedExperience: [] },
      { id: 'skill-tensorflow', name: 'TensorFlow', primary: true, domains: ['ai-cv'], relatedProjects: ['crack-detection'], relatedExperience: [] },
      { id: 'skill-networkx', name: 'NetworkX', primary: true, domains: ['research', 'software'], relatedProjects: ['community-detection-research'], relatedExperience: ['exp-nit-silchar'] }
    ]
  },
  {
    category: 'Systems & Automation',
    id: 'cat-systems',
    items: [
      { id: 'skill-powershell', name: 'PowerShell scripting', primary: true, domains: ['systems'], relatedProjects: [], relatedExperience: ['exp-atticube'] },
      { id: 'skill-win-admin', name: 'Windows system administration', primary: true, domains: ['systems'], relatedProjects: [], relatedExperience: ['exp-atticube'] },
      { id: 'skill-ad', name: 'Active Directory (users, OUs, Group Policy)', primary: true, domains: ['systems'], relatedProjects: [], relatedExperience: ['exp-atticube'] },
      { id: 'skill-registry', name: 'Windows Registry', primary: false, domains: ['systems'], relatedProjects: [], relatedExperience: ['exp-atticube'] },
      { id: 'skill-hyperv', name: 'Hyper-V VM configuration', primary: true, domains: ['systems'], relatedProjects: [], relatedExperience: ['exp-atticube'] },
      { id: 'skill-bios', name: 'BIOS/UEFI', primary: false, domains: ['systems'], relatedProjects: [], relatedExperience: ['exp-atticube'] },
      { id: 'skill-mbr-gpt', name: 'MBR/GPT partitioning', primary: false, domains: ['systems'], relatedProjects: [], relatedExperience: ['exp-atticube'] }
    ]
  },
  {
    category: 'Networking & Diagnostics',
    id: 'cat-net',
    items: [
      { id: 'skill-tcpip', name: 'TCP/IP', primary: true, domains: ['systems'], relatedProjects: [], relatedExperience: ['exp-atticube'] },
      { id: 'skill-net-diag', name: 'Network configuration and troubleshooting (ipconfig, ping, tracert, nslookup)', primary: true, domains: ['systems'], relatedProjects: [], relatedExperience: ['exp-atticube'] }
    ]
  },
  {
    category: 'Security & Testing',
    id: 'cat-sec',
    items: [
      { id: 'skill-burp', name: 'Burp Suite', primary: true, domains: ['security'], relatedProjects: [], relatedExperience: ['exp-canza'] },
      { id: 'skill-nmap', name: 'Nmap', primary: false, domains: ['security'], relatedProjects: [], relatedExperience: [] },
      { id: 'skill-mobsf', name: 'MobSF', primary: true, domains: ['security'], relatedProjects: [], relatedExperience: ['exp-canza'] },
      { id: 'skill-jmeter', name: 'Apache JMeter', primary: true, domains: ['security', 'software'], relatedProjects: [], relatedExperience: ['exp-canza'] },
      { id: 'skill-blazemeter', name: 'BlazeMeter', primary: false, domains: ['security', 'software'], relatedProjects: [], relatedExperience: ['exp-canza'] },
      { id: 'skill-owasp', name: 'OWASP Standards', primary: true, domains: ['security'], relatedProjects: [], relatedExperience: ['exp-canza'] },
      { id: 'skill-vuln-assess', name: 'Vulnerability Assessment', primary: false, domains: ['security'], relatedProjects: ['code-vulnerability-detector'], relatedExperience: ['exp-canza'] }
    ]
  },
  {
    category: 'Developer Tools & Core CS',
    id: 'cat-tools',
    items: [
      { id: 'skill-git', name: 'Git', primary: true, domains: ['software'], relatedProjects: [], relatedExperience: [] },
      { id: 'skill-docker', name: 'Docker', primary: false, domains: ['software', 'systems'], relatedProjects: [], relatedExperience: [] },
      { id: 'skill-linux', name: 'Linux', primary: false, domains: ['software', 'systems'], relatedProjects: [], relatedExperience: [] },
      { id: 'skill-latex', name: 'LaTeX', primary: false, domains: ['research'], relatedProjects: [], relatedExperience: [] },
      { id: 'skill-core-cs', name: 'Operating Systems, Computer Networks, Database Management', primary: false, domains: ['software', 'systems'], relatedProjects: [], relatedExperience: [] }
    ]
  }
]);

/**
 * Explicit Knowledge Graph 2.0 Definition
 * Four entity types: skill, project, experience, technology
 * Every relationship is explicitly defined and verified against the CV.
 */
export const GRAPH = Object.freeze({
  nodes: [
    // Projects (Center column)
    { id: 'proj-crack', label: 'Crack Detection (M.Tech Thesis)', type: 'project', refId: 'crack-detection', x: 460, y: 110, summary: 'Pixel-level crack segmentation using Attention U-Net, Frangi pseudo-masks (10,000+ image pairs), and Tversky/Dice loss.' },
    { id: 'proj-vuln', label: 'Code Vulnerability Detector', type: 'project', refId: 'code-vulnerability-detector', x: 460, y: 230, summary: 'ML vulnerability classification on 27,000+ C functions (Devign) with SHAP and LIME explainability.' },
    { id: 'proj-gait', label: 'Gait Recognition (CCTV)', type: 'project', refId: 'gait-recognition', x: 460, y: 350, summary: 'Multi-stage video pipeline with silhouette isolation, HOG features, PCA/LDA reduction, and SVM/CNN benchmarking.' },
    { id: 'proj-comm', label: 'Community Detection Research', type: 'project', refId: 'community-detection-research', x: 460, y: 470, summary: 'Overlapping community detection (LBLD, FSLD, Prasar) vs. Louvain, LPA, SLPA, ERCNS in NetworkX.' },

    // Experiences (Right column)
    { id: 'exp-node-atticube', label: 'Atticube Internship', type: 'experience', refId: 'exp-atticube', x: 800, y: 150, summary: 'Systems & Infrastructure Intern: PowerShell, Active Directory (users, OUs, GPO), Hyper-V, Windows 11 builds, TCP/IP.' },
    { id: 'exp-node-canza', label: 'Canza Internship', type: 'experience', refId: 'exp-canza', x: 800, y: 310, summary: 'Cybersecurity & Performance Testing Intern: Burp Suite, Apache JMeter, BlazeMeter, MobSF, OWASP standards.' },
    { id: 'exp-node-nits', label: 'NIT Silchar Internship', type: 'experience', refId: 'exp-nit-silchar', x: 800, y: 470, summary: 'Research Intern (SNB SIP): Implemented LBLD, FSLD, Prasar in Python/NetworkX and benchmarked community detection.' },

    // Core Skills (Left column)
    { id: 'skill-node-python', label: 'Python', type: 'skill', refId: 'skill-python', x: 130, y: 260, summary: 'Primary programming language connecting all four major engineering & research projects.' },
    { id: 'skill-node-se', label: 'Pipeline & Modular Design', type: 'skill', refId: 'skill-pipeline', x: 130, y: 130, summary: 'End-to-end modular pipeline architecture across CV, ML, and code analysis systems.' },
    { id: 'skill-node-sec', label: 'Security & Vulnerability Analysis', type: 'skill', refId: 'skill-vuln-assess', x: 130, y: 390, summary: 'Static C vulnerability classification and dynamic web/mobile security assessment.' },

    // Specific Technologies (Distributed connectors)
    { id: 'tech-att-unet', label: 'Attention U-Net', type: 'technology', refId: 'skill-attention-unet', x: 280, y: 70, summary: 'Deep learning segmentation architecture used in the M.Tech Crack Detection thesis.' },
    { id: 'tech-tf', label: 'TensorFlow', type: 'technology', refId: 'skill-tensorflow', x: 280, y: 145, summary: 'Mixed-precision training framework used solely in the M.Tech Crack Detection thesis.' },
    { id: 'tech-shap-lime', label: 'SHAP & LIME', type: 'technology', refId: 'skill-xai', x: 280, y: 225, summary: 'Explainable AI attribution methods integrated into the Code Vulnerability Detector.' },
    { id: 'tech-hog', label: 'HOG & PCA/LDA', type: 'technology', refId: 'skill-hog', x: 280, y: 325, summary: 'Feature engineering and dimensionality reduction in the CCTV Gait Recognition pipeline.' },
    { id: 'tech-svm-cnn', label: 'SVM & CNN', type: 'technology', refId: 'skill-cnn', x: 280, y: 405, summary: 'Benchmarked classifiers for human identification under lighting and pose variation.' },
    { id: 'tech-networkx', label: 'NetworkX', type: 'technology', refId: 'skill-networkx', x: 280, y: 495, summary: 'Graph analysis library used to implement LBLD, FSLD, and Prasar at NIT Silchar.' },
    { id: 'tech-ad-ps', label: 'Active Directory & PowerShell', type: 'technology', refId: 'skill-ad', x: 650, y: 95, summary: 'Windows Server identity, OU/GPO management, and automation at Atticube.' },
    { id: 'tech-hyperv', label: 'Hyper-V & Entra ID', type: 'technology', refId: 'skill-hyperv', x: 650, y: 205, summary: 'Virtual machine deployment, checkpointing, and identity integration at Atticube.' },
    { id: 'tech-burp', label: 'Burp Suite & MobSF', type: 'technology', refId: 'skill-burp', x: 650, y: 285, summary: 'Web and mobile (APK) security assessment tools used at Canza Technology Consultants.' },
    { id: 'tech-jmeter', label: 'JMeter & BlazeMeter', type: 'technology', refId: 'skill-jmeter', x: 650, y: 365, summary: 'Load and performance testing tools used to analyze throughput bottlenecks at Canza.' }
  ],
  edges: [
    // Python connections (Verified)
    { source: 'skill-node-python', target: 'proj-crack', relationship: 'Primary implementation language' },
    { source: 'skill-node-python', target: 'proj-vuln', relationship: 'Primary implementation language' },
    { source: 'skill-node-python', target: 'proj-gait', relationship: 'Primary implementation language' },
    { source: 'skill-node-python', target: 'proj-comm', relationship: 'Primary implementation language' },

    // Pipeline & Modular Design
    { source: 'skill-node-se', target: 'proj-crack', relationship: 'Automated pseudo-labelling & training pipeline' },
    { source: 'skill-node-se', target: 'proj-vuln', relationship: 'Modular code preprocessing pipeline' },
    { source: 'skill-node-se', target: 'proj-gait', relationship: 'Multi-stage video processing pipeline' },

    // Crack Detection technologies
    { source: 'tech-att-unet', target: 'proj-crack', relationship: 'Pixel-level crack segmentation model' },
    { source: 'tech-tf', target: 'proj-crack', relationship: 'Mixed-precision training & Tversky/Dice loss' },

    // Vulnerability Detector technologies
    { source: 'tech-shap-lime', target: 'proj-vuln', relationship: 'Interpretable model output attribution' },
    { source: 'skill-node-sec', target: 'proj-vuln', relationship: 'Vulnerable C function identification (Devign)' },
    { source: 'skill-node-sec', target: 'exp-node-canza', relationship: 'OWASP web & mobile vulnerability assessment' },

    // Gait Recognition technologies (Note: TensorFlow is NOT linked to Gait Recognition per strict specification)
    { source: 'tech-hog', target: 'proj-gait', relationship: 'Silhouette feature extraction & subspace projection' },
    { source: 'tech-svm-cnn', target: 'proj-gait', relationship: 'Benchmarked classifiers under pose/lighting variation' },

    // Community Detection Research connections
    { source: 'tech-networkx', target: 'proj-comm', relationship: 'Graph representation & algorithm execution' },
    { source: 'tech-networkx', target: 'exp-node-nits', relationship: 'Used during NIT Silchar research internship' },
    { source: 'proj-comm', target: 'exp-node-nits', relationship: 'Research conducted at NIT Silchar (SNB SIP)' },

    // Atticube Internship connections
    { source: 'tech-ad-ps', target: 'exp-node-atticube', relationship: 'Automated Windows configs, users, OUs & Group Policy' },
    { source: 'tech-hyperv', target: 'exp-node-atticube', relationship: 'End-to-end Windows 11 VM deployment & Entra ID' },

    // Canza Internship connections
    { source: 'tech-burp', target: 'exp-node-canza', relationship: 'Web & Android APK vulnerability testing' },
    { source: 'tech-jmeter', target: 'exp-node-canza', relationship: 'Load testing & bottleneck analysis' }
  ]
});

