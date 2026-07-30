export function setupBarcodeHandler(onProductFound) {
  let buffer = '';
  const handleKeydown = (event) => {
    if (event.key === 'Enter') {
      if (buffer) {
        onProductFound(buffer);
      }
      buffer = '';
      return;
    }

    if (/^[a-zA-Z0-9\-\.\/ ]$/.test(event.key)) {
      buffer += event.key;
    }
  };

  document.addEventListener('keydown', handleKeydown);
  return () => document.removeEventListener('keydown', handleKeydown);
}
