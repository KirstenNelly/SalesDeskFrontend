function getSiteBasePath() {
  const segments = window.location.pathname.split('/').filter(Boolean);
  if (!segments.length) return '';

  const knownAppDirs = new Set(['admin', 'auth', 'cashier', 'shared', 'docs', 'assets']);
  const firstSegment = segments[0];

  if (knownAppDirs.has(firstSegment)) {
    return '';
  }

  return `/${firstSegment}`;
}

export function resolveAppUrl(targetPath) {
  const normalizedTarget = targetPath.replace(/^\/+/, '');
  const siteBase = getSiteBasePath();
  const targetSegments = `${siteBase}/${normalizedTarget}`.split('/').filter(Boolean);
  const currentPath = window.location.pathname.replace(/\/+$/, '');
  const currentFile = currentPath.split('/').filter(Boolean).pop() || '';
  const currentDirSegments = currentPath
    .split('/')
    .filter(Boolean)
    .slice(0, currentFile.includes('.') ? -1 : undefined)
    .filter(Boolean);

  let sharedLength = 0;
  while (
    sharedLength < currentDirSegments.length &&
    sharedLength < targetSegments.length &&
    currentDirSegments[sharedLength] === targetSegments[sharedLength]
  ) {
    sharedLength += 1;
  }

  const relativeSegments = [
    ...Array.from({ length: Math.max(0, currentDirSegments.length - sharedLength) }, () => '..'),
    ...targetSegments.slice(sharedLength)
  ];

  const relativePath = relativeSegments.join('/');
  return relativePath ? (relativePath.startsWith('.') ? relativePath : `./${relativePath}`) : './';
}
