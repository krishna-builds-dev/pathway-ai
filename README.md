# Pathway

**Pathway** is a smart, streamlined platform designed to guide international students through the complexities of studying abroad. By transforming dense academic and immigration requirements into clear, actionable steps, Pathway helps students explore destinations, discover courses, and prepare high-quality application materials—all within a single, intuitive dashboard.

---

## 🚀 What it does

- **Career Advisor** — Personalized guidance based on your profile. Not generic advice, but direction that actually fits you.
- **SOP & Resume Builders** — Automated tools that help you draft a Statement of Purpose and a resume that meets international standards.
- **Visa & Application Tracking** — Checklists for the documents you need, organized by country, so nothing slips through the cracks.
- **University & City Explorer** — Compare courses and cities side by side before you commit to anything.
- **Secure Auth** — Sign in with Google or GitHub, no friction.

---

## 🧠 How the AI works

Pathway uses a dual-engine approach — reliability first, AI when it makes sense.

- **Public version** runs on rule-based logic. It's deterministic, fast, and doesn't hit token limits or rack up API costs.
- **AI layer (Gemini)** is available for development and custom deployments. Flip it on with `NODE_ENV=development` in your environment config.

The intelligence layer is modular, so you can swap or upgrade models without touching the rest of the app. Just update your environment variables — no refactoring needed.

---

## 🛠 Tech Stack

*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Database & Auth:** Supabase
*   **Rate Limiting:** Upstash Redis
*   **Error Monitoring:** Sentry
*   **Styling:** Tailwind CSS
*   **Deployment:** Vercel

---

## ⚡ Getting started

### 1. Clone the repo
```bash
git clone <repository-url>
cd pathway-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up your environment

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

You'll need keys for Supabase, Gemini, Google OAuth, Upstash, and Sentry. The example file has the full list.

### 4. Start the dev server
```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) and you're in.

---

## 📂 Project structure

```
app/            Next.js App Router pages and API routes
components/     Reusable UI components, grouped by feature
contexts/       React context providers
database/       Database schemas and seed data
hooks/          Custom React hooks
lib/            Supabase clients, utility functions, and helpers
types/          Shared TypeScript types
public/         Static assets
```

---

## ✍️ Built by

[Krishna builds dev](https://github.com/krishna-builds-dev) — Full Stack Developer

Available for freelance work → [Krishna builds dev](https://www.krishna011.com.np)