/**
 * In development, leave REACT_APP_API_URL unset so `/api/*` requests use the CRA proxy.
 * For Vercel/Netlify, set REACT_APP_API_URL to your deployed API origin (no trailing slash).
 */
export function apiUrl(path) {
  const base = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${suffix}` : suffix;
}
