# Neil Barot Portfolio

Personal portfolio website for Neil Barot (Rutgers CS, Class of 2027), built with React, TypeScript, Tailwind, and a small Express API for AI chat.

## Tech Stack

- Frontend: React + TypeScript + Vite + Tailwind
- UI: shadcn/ui + Framer Motion
- Backend: Express (Node)
- AI: Google Gemini API (with deterministic local fallback)
- Hosting: Vercel

## Features

- Recruiter-focused one-page portfolio sections (Hero, About, Projects, Skills, Experience, Contact)
- AI chat widget backed by `/api/chat`
- Rate-limited backend route with abuse protections
- Clipboard copy for contact email with toast feedback
- Resume download from `/public/resume.pdf`

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env` in the project root:

```dotenv
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.0-flash-001
ALLOWED_ORIGINS=https://neilbarot.dev,https://www.neilbarot.dev,http://localhost:8080
VITE_API_URL=http://localhost:3001
```

Notes:

- `GEMINI_MODEL` is optional (default is `gemini-2.0-flash-001`).
- `ALLOWED_ORIGINS` is optional; when omitted, safe defaults are used.
- Keep secrets in `.env` only. Never commit real keys.

### 3. Run frontend and backend

Terminal 1:

```bash
npm run dev
```

Terminal 2:

```bash
npm run dev:server
```

Frontend runs on `http://localhost:8080` and API runs on `http://localhost:3001`.

## Scripts

- `npm run dev` - start Vite frontend
- `npm run dev:server` - start Express API server
- `npm run build` - build frontend and run server build step
- `npm run test` - run Vitest
- `npm run lint` - run ESLint

## API

### POST `/api/chat`

Request body:

```json
{
	"message": "string",
	"history": [{ "role": "user|assistant|bot", "content": "string" }]
}
```

Response:

```json
{
	"reply": "string"
}
```

Protections in place:

- Per-IP hourly limit
- Per-IP burst limit
- Message length + history size bounds
- Origin allowlist (CORS) for trusted frontend domains
- Graceful fallback response when provider is unavailable

### GET `/api/health`

Response:

```json
{
	"status": "ok"
}
```

## Deploying to Vercel

1. Import this repo into Vercel.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variables in Vercel:
	 - `GEMINI_API_KEY`
	 - `GEMINI_MODEL` (optional)
5. Connect custom domain (for example `neilbarot.dev`) and configure DNS records as prompted by Vercel.

## Project Notes

- Headshot is served from `/public/headshot.jpeg`.
- Resume is served from `/public/resume.pdf`.
- Change log is tracked in `docs/CHANGELOG.md`.

## Troubleshooting Deploy

- If chat fails in production, confirm `GEMINI_API_KEY` is set in Vercel Project Settings.
- If requests are blocked by CORS, ensure your production domain is included in `ALLOWED_ORIGINS`.
- If your frontend points to localhost in production, remove `VITE_API_URL` from production env and rely on same-origin `/api` routing.
- Use `/api/health` to quickly check whether the API function is alive.
