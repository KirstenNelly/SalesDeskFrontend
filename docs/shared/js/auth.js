import { api } from './api.js';
import { clearAuth, findRegisteredAccount, getRole, getToken, getUser, setRole, setToken, setUser } from './storage.js';
import { resolveAppUrl } from './route-utils.js';
import { showNotification } from './notifications.js';

const DEMO_CREDENTIALS = [
  {
    username: 'admin@salesdesk.test',
    password: 'password',
    role: 'ADMIN',
    token: 'demo-token-admin',
    user: { name: 'Admin User', email: 'admin@salesdesk.test', role: 'ADMIN' }
  },
  {
    username: 'cashier@salesdesk.test',
    password: 'password',
    role: 'CASHIER',
    token: 'demo-token-cashier',
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

function getRegisteredPayload(credentials) {
  const account = findRegisteredAccount(credentials.username || credentials.email || '');
  if (!account || account.password !== credentials.password) {
    return null;
  }

  return {
    token: 'demo-token',
    user: {
      name: account.fullName,
      email: account.email,
      username: account.username,
      role: account.role
    },
    role: account.role
  };
}

function isNetworkError(error) {
  return error.name === 'TypeError' || /failed to fetch/i.test(error.message || '');
}

function isBackendUnavailable(error) {
  return (
    isNetworkError(error) ||
    error?.status === 404 ||
    error?.status === 401 ||
    error?.status >= 500
  );
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) {
    return false;
  }

  if (isTokenExpired(token)) {
    sessionStorage.setItem('salesdesk.authMessage', 'Session expired. Please sign in again.');
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

    const normalizedRole = String(payload.role || payload.user?.role || '').toUpperCase();
    const normalizedUser = { ...(payload.user || {}), role: normalizedRole };

    setToken(payload.token);
    setUser(normalizedUser);
    setRole(normalizedRole);
    return { ...payload, role: normalizedRole, user: normalizedUser };
  } catch (error) {
    const demoPayload = getDemoPayload(credentials);
    const registeredPayload = getRegisteredPayload(credentials);
    const fallbackPayload = registeredPayload || demoPayload;

    if (fallbackPayload && isBackendUnavailable(error)) {
      const normalizedRole = String(fallbackPayload.role || fallbackPayload.user?.role || '').toUpperCase();
      const normalizedUser = { ...(fallbackPayload.user || {}), role: normalizedRole };
      const token = fallbackPayload.token || 'demo-token';

      setToken(token);
      setUser(normalizedUser);
      setRole(normalizedRole);
      return { ...fallbackPayload, token, role: normalizedRole, user: normalizedUser };
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
      window.location.assign(resolveAppUrl('/admin/dashboard/index.html'));
    } else if (currentRole === 'CASHIER') {
      window.location.assign(resolveAppUrl('/cashier/dashboard/index.html'));
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
    window.location.assign(resolveAppUrl('/admin/dashboard/index.html'));
    return true;
  }

  if (role === 'CASHIER') {
    window.location.assign(resolveAppUrl('/cashier/dashboard/index.html'));
    return true;
  }

  return false;
}

export function getUserInfo() {
  return getUser();
}

export { getRole };
