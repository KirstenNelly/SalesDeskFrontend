import { api } from './api.js';
import { clearAuth, getRole, getToken, getUser, setRole, setToken, setUser } from './storage.js';
import { resolveAppUrl } from './route-utils.js';
import { showNotification } from './notifications.js';

const DEMO_CREDENTIALS = [
  {
    username: 'admin@salesdesk.test',
    password: 'password',
    role: 'ADMIN',
    user: { name: 'Admin User', email: 'admin@salesdesk.test', role: 'ADMIN' }
  },
  {
    username: 'cashier@salesdesk.test',
    password: 'password',
    role: 'CASHIER',
    user: { name: 'Cashier User', email: 'cashier@salesdesk.test', role: 'CASHIER' }
  }
];

function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const decoded = JSON.parse(atob(padded));
    return decoded;
  } catch (error) {
    return null;
  }
}

function isTokenExpired(token) {
  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== 'number') {
    return false;
  }
  return Date.now() >= payload.exp * 1000;
}

function getDemoPayload(credentials) {
  const normalizedUsername = credentials.username?.trim().toLowerCase();
  return DEMO_CREDENTIALS.find(
    (account) => account.username === normalizedUsername && account.password === credentials.password
  ) || null;
}

function isNetworkError(error) {
  return error.name === 'TypeError' || /failed to fetch/i.test(error.message || '');
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) {
    return false;
  }

  if (isTokenExpired(token)) {
    showNotification('Session expired. Please sign in again.', 'info');
    logout();
    return false;
  }

  return true;
}

export async function login(credentials) {
  try {
    const payload = await api.post('/auth/login', credentials);

    if (!payload || !payload.token || !payload.user || !payload.role) {
      throw new Error('Invalid authentication response from server.');
    }

    setToken(payload.token);
    setUser(payload.user);
    setRole(payload.role.toUpperCase());
    return payload;
  } catch (error) {
    const demoPayload = getDemoPayload(credentials);
    if (demoPayload && isNetworkError(error)) {
      const fallback = {
        token: 'demo-token',
        user: demoPayload.user,
        role: demoPayload.role
      };
      setToken(fallback.token);
      setUser(fallback.user);
      setRole(fallback.role);
      return fallback;
    }

    throw error;
  }
}

export function logout() {
  clearAuth();
  window.location.assign(resolveAppUrl('/auth/login.html'));
}

export function requireRole(role) {
  if (!isAuthenticated()) {
    return false;
  }

  const currentRole = getRole();

  if (currentRole !== role) {
    showNotification('You are not authorized to access this page.', 'error');

    if (currentRole === 'ADMIN') {
      window.location.assign(resolveAppUrl('/admin/dashboard.html'));
    } else if (currentRole === 'CASHIER') {
      window.location.assign(resolveAppUrl('/cashier/dashboard.html'));
    } else {
      logout();
    }

    return false;
  }

  return true;
}

export function redirectIfAuthenticated() {
  if (!isAuthenticated()) {
    return false;
  }

  const role = getRole();

  if (role === 'ADMIN') {
    window.location.assign(resolveAppUrl('/admin/dashboard.html'));
    return true;
  }

  if (role === 'CASHIER') {
    window.location.assign(resolveAppUrl('/cashier/dashboard.html'));
    return true;
  }

  return false;
}

export function getUserInfo() {
  return getUser();
}

export { getRole };
