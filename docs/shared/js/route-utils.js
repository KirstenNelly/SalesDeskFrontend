function getSiteBasePath() {
  const segments = window.location.pathname.split('/').filter(Boolean);
  if (!segments.length) return '';

  const docsIndex = segments.indexOf('docs');
  if (docsIndex >= 0) {
    return `/${segments.slice(0, docsIndex + 1).join('/')}`;
  }

  const knownAppDirs = new Set(['admin', 'auth', 'cashier', 'shared', 'assets']);
  if (knownAppDirs.has(segments[0])) {
    return '';
  }

  return `/${segments[0]}`;
}

export function resolveAppUrl(targetPath) {
  const normalizedTarget = targetPath.replace(/^\/+/, '');
  const siteBase = getSiteBasePath();
  if (!siteBase) {
    return `/${normalizedTarget}`;
  }
  return `${siteBase}/${normalizedTarget}`.replace(/\/+/g, '/');
}
