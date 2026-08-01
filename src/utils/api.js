const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

export const API_BASE = (() => {
  const envBase = import.meta.env.VITE_API_URL?.trim();
  if (envBase) return trimTrailingSlash(envBase);

  if (typeof window === 'undefined') return '';

  const { port, origin } = window.location;

  // In Vite dev, keep requests same-origin so the dev proxy can forward them.
  if (port === '5173' || port === '4173') {
    return '';
  }

  // For production deployment, use the deployed backend URL
  if (origin.includes('vercel.app') || origin.includes('bulk-buy-modified')) {
    return 'https://bulkbuy-modified.onrender.com';
  }

  return trimTrailingSlash(origin);
})();

export const apiUrl = (path) => (path.startsWith('http') ? path : `${API_BASE}${path}`);

export default async function apiFetch(path, opts = {}) {
  const url = apiUrl(path);
  const token = localStorage.getItem('token');
  const headers = opts.headers ? { ...opts.headers } : {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!headers['Content-Type'] && opts.body && typeof opts.body === 'object') headers['Content-Type'] = 'application/json';
  const res = await fetch(url, { ...opts, headers, body: opts.body && typeof opts.body === 'object' ? JSON.stringify(opts.body) : opts.body });
  // try to parse json, otherwise return raw response
  const txt = await res.text();
  try { return JSON.parse(txt); } catch { return txt; }
}
