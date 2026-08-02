import { clearAuth, getToken } from './storage.js';
import { showNotification } from './notifications.js';
import { demoAdminSummary, demoCashierSummary } from './demo-data.js';

const API_BASE_URL = '/api';
const DEMO_FALLBACKS = {
  '/dashboard/admin-summary': demoAdminSummary,
  '/dashboard/cashier-summary': demoCashierSummary
};

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();
  const normalizedPath = path.replace(/^\/+/, '');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${normalizedPath}`, {
      ...options,
      headers
    });

    let payload = null;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      payload = await response.json().catch(() => null);
    } else {
      payload = await response.text().catch(() => null);
    }

    if (!response.ok) {
      const message = payload?.message || payload?.error || 'The request failed.';
      const error = new Error(message);
      error.status = response.status;
      error.payload = payload;

      const isAuthEndpoint = normalizedPath.startsWith('auth/login') || normalizedPath.startsWith('auth/register');
      if (response.status === 401 && !isAuthEndpoint) {
        clearAuth();
        window.location.assign(resolveAppUrl('/auth/login.html'));
        error.message = 'Session expired. Please sign in again.';
      }

      showNotification(error.message, 'error');
      throw error;
    }

    return payload;
  } catch (error) {
    const fallback = DEMO_FALLBACKS[path];
    if (fallback) {
      showNotification('Showing demo data because the backend is unavailable.', 'info');
      return fallback;
    }

    throw error;
  }
}

export const api = {
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => request(path, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (path, body, options = {}) => request(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  del: (path, options = {}) => request(path, { ...options, method: 'DELETE' })
};
