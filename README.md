# Confidence Score

A Next.js application for AI-assisted trust analysis of news and media content.
It audits content, produces confidence metrics, and presents supporting views such as registry insights and source comparison.

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Gemini API (`@google/genai`)

## Prerequisites

- Node.js 18+ (Node.js 20+ recommended)
- npm

## Getting Started

1. Install dependencies:
   `npm install`
2. Create a local environment file:
   - Copy `.env.example` to `.env.local`
   - Fill in required values
3. Start the development server:
   `npm run dev`
4. Open `http://localhost:3000`

## Environment Variables

Use `.env.local` (not committed to git):

- `GEMINI_API_KEY` (required): Your Gemini API key
- `GEMINI_MODEL` (optional): Example `gemini-2.5-flash`
- `GEMINI_MAX_OUTPUT_TOKENS` (optional): Default `8192`
- `APP_URL` (optional/recommended): Public app URL

Reference template: `.env.example`

## Available Scripts

- `npm run dev` - Start local development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Main Routes

- `/` - Landing and intake flow
- `/compare` - Side-by-side source comparison
- `/registry` - Publisher trust registry
- `/report/[id]` - Detailed report view

## Notes

- `node_modules/`, `.next/`, and `.env*` are git-ignored by default.
- Keep API keys and secrets in `.env.local` only.
