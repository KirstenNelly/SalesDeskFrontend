let toastContainer = null;

function ensureContainer() {
  if (toastContainer) return toastContainer;

  toastContainer = document.createElement('div');
  toastContainer.id = 'toast-root';
  toastContainer.setAttribute('aria-live', 'polite');
  document.body.appendChild(toastContainer);
  return toastContainer;
}

export function showNotification(message, type = 'info') {
  const entry = document.createElement('div');
  entry.className = `toast toast-${type}`;
  entry.textContent = message;

  const target = ensureContainer();
  target.appendChild(entry);

  window.setTimeout(() => {
    entry.remove();
  }, 3200);
}
