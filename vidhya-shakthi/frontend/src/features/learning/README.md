# Learning module architecture

```
features/learning/
├── index.js                 # Public API (catalog, CMS page, types)
├── catalog/                 # Grade & placement
│   ├── grade10Catalog.js
│   ├── grade10Meta.js
│   └── placement.js
├── subjects/                # One folder per Samacheer subject
│   ├── mathematics/
│   │   ├── subject.config.js
│   │   ├── index.js         # chapters[] for this subject
│   │   ├── units/           # One file per textbook unit
│   │   │   ├── unit-1.js
│   │   │   └── unit-2.js
│   │   └── concepts/        # Slow-learner concept cards per unit
│   ├── science/ …
│   ├── english/ …
│   ├── social-science/ …
│   └── tamil/
│       ├── units/ …
│       ├── concepts/ …
│       └── exam-guide/      # Tamil-only Suraa-style Q&A
├── components/              # Learn Hub UI (concepts, custom HTML)
├── pages/                 # Student Learn Hub page
├── cms/
│   ├── LearnFileUploadZone.jsx   # Drag-drop HTML/CSS (top of CMS)
│   └── LearnContentCMSPage.jsx   # Admin + Teacher upload & approval
└── api/                   # learnContentApi
```

**Flow:** Teacher/Admin uploads HTML+CSS in **CMS** → placement (subject + unit + slot) → approved → **Learn Hub** renders in `ChapterContent`.

**Legacy:** `src/data/grade10/*` remains source of truth until each unit is fully migrated into `units/unit-N.js`.
