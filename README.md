# Renish.DEV — Personal Portfolio

> Modern developer portfolio built with React 19, TypeScript, and Gemini AI.

Live site: deploy via Netlify (see [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md))

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS v4 + PostCSS |
| AI | Google Gemini API (`@google/genai`) |
| Icons | react-icons |

---

## Features

- **3D Hero Section** — animated `Hero3D` component
- **Skills** — skill bars with category grouping (Backend, Frontend, Tools, Databases)
- **Experience Timeline** — company roles with logos and date ranges
- **Projects Showcase** — cards with tech stack tags and GitHub links
- **LeetCode Stats** — live stats for `renish-1111`
- **AI Chat** — Gemini-powered chat persona (Renish's AI assistant)
- **Custom Cursor** — context-aware cursor with hover variants
- **Floating Navbar** — scroll-aware island-style nav + mobile overlay menu
- **Error Boundaries** — each section wrapped for resilience
- **Responsive** — mobile-first, tested down to small screens

---

## Project Structure

```
new-portfolio/
├── App.tsx              # Root layout, nav, contact section, footer
├── constants.ts         # PROJECTS, SKILLS, EXPERIENCE data + AI system prompt
├── types.ts             # TypeScript interfaces
├── index.tsx            # React entry point
├── index.html           # HTML shell
├── index.css            # Global styles + noise texture
├── components/
│   ├── Hero3D.tsx       # Animated hero / above-fold section
│   ├── Skills.tsx       # Skills visualization
│   ├── Experience.tsx   # Work/internship timeline
│   ├── LeetCode.tsx     # LeetCode stats widget
│   ├── Projects.tsx     # Project cards grid
│   ├── AIChat.tsx       # Gemini AI chat widget
│   ├── Cursor.tsx       # Custom cursor
│   └── ErrorBoundary.tsx
└── services/
    └── geminiService.ts # Gemini API wrapper
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/app/apikey)

### Install & Run

```bash
git clone https://github.com/renish-1111/<repo>
cd new-portfolio
npm install
```

Create `.env`:

```env
VITE_GEMINI_API_KEY=your_key_here
```

```bash
npm run dev      # dev server → http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview production build
```

---

## Deployment (Netlify)

1. Build command: `npm run build`
2. Publish directory: `dist`
3. Set env var `VITE_GEMINI_API_KEY` in Netlify dashboard

See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for full steps.

---

## Data & Content

All personal data lives in `constants.ts`:

- `PROJECTS` — project list (title, description, tech, image, link)
- `SKILLS` — skill name, proficiency level (0–100), category
- `EXPERIENCE` — company, role, start/end dates, logo, link
- `SOCIAL_LINKS` — GitHub, LinkedIn, X, Instagram, LeetCode, email
- `SYSTEM_INSTRUCTION` — AI persona prompt for Gemini chat

To update content, edit only `constants.ts`.

---

## Contact

- Email: [ponkiyarenish@gmail.com](mailto:ponkiyarenish@gmail.com)
- GitHub: [renish-1111](https://github.com/renish-1111)
- LinkedIn: [gecr-comp220200107098](https://linkedin.com/in/gecr-comp220200107098)
- LeetCode: [renish-1111](https://leetcode.com/renish-1111)
