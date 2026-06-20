# Pathway AI

AI-powered SaaS platform helping international students plan their study abroad journey — from choosing a country to building a standout application.

**Live demo:** [pathway-ai-olive.vercel.app](https://pathway-ai-olive.vercel.app/)

## Overview

Pathway AI transforms raw academic and immigration data into clear, student-friendly guidance. Students can explore countries, cities, and university courses, then use built-in AI tools to prepare their actual application materials — all from one dashboard.

## Features

- **Google & GitHub OAuth** — secure sign-in, no password management needed
- **AI Advisor** — conversational guidance tailored to the student's profile
- **SOP Builder** — generates a draft Statement of Purpose from profile data
- **Resume Builder** — builds a professional resume formatted for international applications
- **Visa Checklist** — tracks required documents for the student's target country
- **Country & City Explorer** — compare destinations side by side
- **Course Discovery** — browse university courses with filtering
- **Profile-aware AI** — every AI tool reads the student's saved profile to personalize output

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database & Auth:** Supabase
- **AI:** Gemini API, DeepSeek API
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
app/            Next.js App Router pages and routes
components/     Reusable UI components, grouped by feature
hooks/          Custom React hooks
lib/            Supabase clients, utilities, AI helpers
types/          Shared TypeScript types
public/         Static assets
```

## Built By

[Krishna Shrestha](https://github.com/krishna-builds-dev) — Full Stack Developer  
Open for freelance work → [krishna011.com.np](https://www.krishna011.com.np)