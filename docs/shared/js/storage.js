const STORAGE_KEYS = {
  token: 'salesdesk.jwt',
  user: 'salesdesk.user',
  role: 'salesdesk.role',
  accounts: 'salesdesk.accounts'
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

export function getRegisteredAccounts() {
  const raw = localStorage.getItem(STORAGE_KEYS.accounts);
  return raw ? JSON.parse(raw) : [];
}

export function saveRegisteredAccounts(accounts) {
  localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(accounts));
}

export function findRegisteredAccount(identifier) {
  const normalized = identifier.trim().toLowerCase();
  return getRegisteredAccounts().find((account) => {
    return (
      account.username.toLowerCase() === normalized ||
      account.email.toLowerCase() === normalized
    );
  }) || null;
}

export function addRegisteredAccount(account) {
  const accounts = getRegisteredAccounts();
  accounts.push(account);
  saveRegisteredAccounts(accounts);
}

export function clearAuth() {
  setToken('');
  setUser(null);
  setRole('');
}
