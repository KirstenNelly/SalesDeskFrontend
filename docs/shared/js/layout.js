import { getUser, getRole } from './storage.js';
import { resolveAppUrl } from './route-utils.js';
import { logout } from './auth.js';

const NAV_ITEMS = {
  ADMIN: [
    { label: 'Dashboard', href: '/admin/dashboard.html' },
    { label: 'Products', href: '/admin/products.html' },
    { label: 'Stock', href: '/admin/stock.html' },
    { label: 'Sales', href: '/admin/sales.html' },
    { label: 'Customers', href: '/admin/customers.html' },
    { label: 'Reports', href: '/admin/reports.html' },
    { label: 'Settings', href: '/admin/settings.html' }
  ],
  CASHIER: [
    { label: 'Dashboard', href: '/cashier/dashboard.html' },
    { label: 'Point of Sale', href: '/cashier/pos.html' },
    { label: 'My Sales', href: '/cashier/sales.html' },
    { label: 'Customers', href: '/cashier/customers.html' },
    { label: 'Notifications', href: '/cashier/notifications.html' }
  ]
};

export function renderLayout(title = 'SalesDesk POS') {
  const root = document.getElementById('layout-root');
  if (!root) return;

  const user = getUser();
  const role = getRole();
  const items = NAV_ITEMS[role] || NAV_ITEMS.ADMIN;
  const userName = user?.name || 'SalesDesk User';

  const currentPath = window.location.pathname;
  const resolvedItems = items.map((item) => ({ ...item, href: resolveAppUrl(item.href) }));

  root.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="sidebar__brand">
          <h2>SalesDesk</h2>
          <p>${role === 'CASHIER' ? 'Cashier Workspace' : 'Administrator Workspace'}</p>
        </div>
        <nav class="sidebar__nav">
          ${resolvedItems.map((item) => `<a href="${item.href}" class="nav-link ${currentPath === item.href ? 'active' : ''}">${item.label}</a>`).join('')}
        </nav>
      </aside>
      <div class="app-shell__main">
        <header class="topbar">
          <div>
            <p class="eyebrow">SalesDesk POS</p>
            <h1>${title}</h1>
          </div>
          <div class="topbar__actions">
            <span class="badge">${role || 'Guest'}</span>
            <span class="profile-pill">${userName}</span>
            <a href="${resolveAppUrl('/auth/login.html')}" class="btn btn-secondary" id="sign-out">Sign out</a>
          </div>
        </header>
        <div class="content-wrapper"></div>
      </div>
    </div>
  `;

  const signOut = document.getElementById('sign-out');
  signOut?.addEventListener('click', (event) => {
    event.preventDefault();
    logout();
  });
}
