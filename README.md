# Pathway

Smart platform helping international students plan their study abroad journey — from choosing a country to building a standout application.

## Overview

Pathway simplifies the study abroad process by turning academic and immigration requirements into clear, student-friendly guidance. Students can explore countries, cities, and university courses, then use built‑in tools to prepare their actual application materials — all from one dashboard.

## Features

- **Google & GitHub OAuth** — secure sign-in, no password management needed
- **Career Advisor** — rule‑based guidance tailored to the student's profile
- **SOP Builder** — generates a draft Statement of Purpose from profile data
- **Resume Builder** — builds a professional resume formatted for international applications
- **Visa Checklist** — tracks required documents for the student's target country
- **Country & City Explorer** — compare destinations side by side
- **Course Discovery** — browse university courses with filtering
- **Profile-aware tools** — every tool reads the student's saved profile to personalise output

> **Note on AI:** The current public version uses smart rule‑based logic. Real AI integration (Gemini / DeepSeek) is available behind an optional `NODE_ENV` flag for development.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database & Auth:** Supabase
- **Rate Limiting:** Upstash Redis
- **Error Monitoring:** Sentry
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd pathway-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your own credentials:

```bash
cp .env.example .env.local
```

See `.env.example` for the full list of required keys (Supabase, Gemini, Google OAuth, Upstash, Sentry).

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

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

## Built By

[Krishna builds dev](https://github.com/krishna-builds-dev) — Full Stack Developer
  
Open for freelance work → [krishna builds dev](https://www.krishna011.com.np)