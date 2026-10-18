# OVIRA Tinting Cost Calculator — Old (web)

React + Vite web build, deployed on Vercel. Data is served from `public/data/*.json`.

## Scripts
- `npm install` · `npm run dev` · `npm run lint` · `npm run build` (-> `dist/`) · `npm run preview`

## Vercel settings
Framework Preset **Vite** · Install `npm install` · Build `npm run build` · Output `dist` · Root Directory = this folder · Node 20+ (also set in `vercel.json`).

## "Switch to New" button
Set the live URL of the New (ColorExpert 3) app via env var `VITE_SWITCH_TO_NEW_URL`
(Vercel > Settings > Environment Variables, then redeploy) **or** in `src/config/appLinks.js` (`FALLBACK_SWITCH_TO_NEW_URL`).
Until a valid http(s) URL is set the button shows greyed out.
