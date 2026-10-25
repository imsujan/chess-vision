/* Native saves commit to disk synchronously. Keep the v1 Web storage keys for
 * migration, JSON backups and ordinary offline browser use. */
function readPersistentItem(key) {
  if (typeof ChessVisionStorage !== 'undefined') {
    const durable = ChessVisionStorage.getItem(key);
    if (durable != null) {
      try { localStorage.setItem(key, durable); } catch (_) {}
      return durable;
    }
    const legacy = localStorage.getItem(key);
    if (legacy !== null && !ChessVisionStorage.setItem(key, legacy)) throw Error('Could not migrate saved progress.');
    return legacy;
  }
  return localStorage.getItem(key);
}

function writePersistentItem(key, value) {
  if (typeof ChessVisionStorage !== 'undefined') {
    if (!ChessVisionStorage.setItem(key, value)) throw Error('Could not save progress to disk.');
    try { localStorage.setItem(key, value); } catch (_) {}
    return;
  }
  localStorage.setItem(key, value);
}
