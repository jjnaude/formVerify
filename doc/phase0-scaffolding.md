# Phase 0: Project Scaffolding — Complete

## What Was Done

1. **Git repository** initialized
2. **DevContainer** configured (`.devcontainer/`):
   - Base image: `mcr.microsoft.com/devcontainers/typescript-node:22` (Node 22 LTS)
   - Python 3 included for future model training scripts
   - Port forwarding: 5173 (dev), 4173 (preview)
   - VS Code extensions: Prettier, ESLint, Lit Plugin
   - Auto-runs `npm install` on container creation
3. **Vite + TypeScript + Lit** project initialized:
   - TypeScript 5 with strict mode, ES2022 target, decorator support for Lit
   - Vite 6 with `--host` for network access (mobile testing)
   - Lit 3 web components
4. **PWA configuration** via `vite-plugin-pwa`:
   - Auto-update service worker
   - Manifest with app name, theme, icons config
   - Workbox caching for WASM files up to 10MB
5. **Tooling**: ESLint 9 (flat config), Prettier, Vitest
6. **App shell**: `<app-shell>` Lit component with header and placeholder content
7. **Documentation**: `doc/architecture.md` with full technical design

## Current Status

- `npm install` — works
- `npx tsc --noEmit` — compiles cleanly
- `npx vite build` — builds successfully (5 assets, 18.9KB precached)
- `npm run dev` — serves the app (requires running in devcontainer or locally)

## Project Files Created

```
.devcontainer/devcontainer.json
.devcontainer/Dockerfile
.gitignore
.prettierrc
eslint.config.js
index.html
package.json
tsconfig.json
vite.config.ts
vitest.config.ts
src/main.ts
src/styles.css
src/components/app-shell.ts
doc/architecture.md
```

## Next Steps (Phase 1: Camera Capture)

1. Build `<camera-capture>` Lit component with `getUserMedia()` rear camera access
2. Add viewfinder preview with form outline overlay
3. Implement capture → preview → retake/accept flow
4. Store captured images in IndexedDB (via `idb` library)
5. Test on physical Android device via HTTPS
6. Document results in `doc/phase1-camera.md`
