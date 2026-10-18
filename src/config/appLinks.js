// ---------------------------------------------------------------------------
// App-switch link configuration  (OLD app -> NEW / ColorExpert 3 app)
//
// Set the live URL of the NEW (ColorExpert 3) deployment in ONE of these ways:
//   1. Vercel > Project > Settings > Environment Variables:
//        VITE_SWITCH_TO_NEW_URL = https://<your-new-app-domain>
//      then redeploy (Vite bakes the value in at build time).
//   2. Or put the URL in FALLBACK_SWITCH_TO_NEW_URL below.
// The environment variable wins if both are set.
// While no valid http(s) URL is configured the button is shown but disabled.
// ---------------------------------------------------------------------------

export const FALLBACK_SWITCH_TO_NEW_URL = ''; // e.g. 'https://your-new-app.vercel.app'

function cleanUrl(value) {
  const v = (value || '').trim();
  return /^https?:\/\/\S+$/i.test(v) ? v : '';
}

export const SWITCH_TO_NEW_URL =
  cleanUrl(import.meta.env.VITE_SWITCH_TO_NEW_URL) ||
  cleanUrl(FALLBACK_SWITCH_TO_NEW_URL);
