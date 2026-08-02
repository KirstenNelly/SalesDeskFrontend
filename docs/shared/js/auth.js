import { api } from './api.js';
import { clearAuth, getRole, getToken, getUser, setRole, setToken, setUser } from './storage.js';
import { resolveAppUrl } from './route-utils.js';
import { showNotification } from './notifications.js';

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
  const payload = await api.post('/auth/login', credentials);

  if (!payload || !payload.token || !payload.user || !payload.role) {
    throw new Error('Invalid authentication response from server.');
  }

  setToken(payload.token);
  setUser(payload.user);
  setRole(payload.role.toUpperCase());
  return payload;
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
