import { getRole, getToken } from './storage.js';
import { resolveAppUrl } from './route-utils.js';

export function requireRole(role) {
  const token = getToken();
  const currentRole = getRole();

  if (!token) {
    window.location.assign(resolveAppUrl('/auth/login.html'));
    return false;
  }

  if (currentRole !== role) {
    if (currentRole === 'ADMIN') {
      window.location.assign(resolveAppUrl('/admin/dashboard.html'));
    } else if (currentRole === 'CASHIER') {
      window.location.assign(resolveAppUrl('/cashier/dashboard.html'));
    } else {
      window.location.assign(resolveAppUrl('/auth/login.html'));
    }
    return false;
  }

  return true;
}

export function redirectIfAuthenticated() {
  const token = getToken();
  const role = getRole();

  if (!token) {
    return false;
  }

  if (role === 'ADMIN') {
    window.location.assign(resolveAppUrl('/admin/dashboard.html'));
  } else if (role === 'CASHIER') {
    window.location.assign(resolveAppUrl('/cashier/dashboard.html'));
  }

  return true;
}
