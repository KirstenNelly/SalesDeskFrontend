const STORAGE_KEYS = {
  token: 'salesdesk.jwt',
  user: 'salesdesk.user',
  role: 'salesdesk.role'
};

export function getToken() {
  return localStorage.getItem(STORAGE_KEYS.token) || '';
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.token, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.token);
  }
}

export function getUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  return raw ? JSON.parse(raw) : null;
}

export function setUser(user) {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.user);
  }
}

export function getRole() {
  return localStorage.getItem(STORAGE_KEYS.role) || '';
}

export function setRole(role) {
  if (role) {
    localStorage.setItem(STORAGE_KEYS.role, role);
  } else {
    localStorage.removeItem(STORAGE_KEYS.role);
  }
}

export function clearAuth() {
  setToken('');
  setUser(null);
  setRole('');
}
