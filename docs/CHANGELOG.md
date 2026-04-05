# Changelog

## 2026-04-05
- Updated README with complete setup, scripts, API contract, and deployment instructions.
- Removed redundant root-level media files now duplicated in `public/`.
- Added CORS origin allowlist support for production API hardening.
- Added `/api/health` endpoint for monitoring and deployment checks.
- Upgraded dependencies to resolve all reported npm audit vulnerabilities.
- Removed obsolete Bun lock files and standardized package management on npm.

## 2026-04-04
- Added backend chat API at /api/chat.
- Configured chat provider as Google Gemini (gemini-2.0-flash-001 by default).
- Added deterministic local fallback responses when Gemini is unavailable or quota-limited.
- Added per-IP rate limiting for chat endpoint (20 requests per hour).
- Wired ChatWidget frontend to call backend API with conversation history.
- Wired resume download button to /public/resume.pdf.
- Added clipboard copy with fallback and toast feedback in contact section.
- Replaced About section photo placeholder with real headshot image.
- Reordered page sections to show About earlier in the scrolling flow.
- Wired Download Resume to serve the real file from public/resume.pdf.
- Fixed initial page-load scroll behavior by forcing top-of-page on first render.
- Switched About headshot to public asset path for reliable production visibility.
- Prevented chat widget from auto-scrolling the page on initial load.
- Added layered API abuse protection with burst limits and chat payload bounds.
- Added environment template (.env.example) for backend/frontend API configuration.
- Added Vercel configuration for API routing and SPA serving.
