/**
 * Same-domain API on Vercel: leave NEXT_PUBLIC_API_URL unset so requests use relative `/api/*`.
 * Set NEXT_PUBLIC_API_URL only if the UI is hosted separately from the API.
 */
export function apiUrl(path) {
  const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${suffix}` : suffix;
}
