/* Embedded Stockfish WebWorker Stub / Dispatcher for Chess Vision Offline Engine Evaluation */
self.onmessage = function (e) {
  const msg = e.data;
  if (msg === 'uci') {
    self.postMessage('id name Stockfish Engine JS');
    self.postMessage('id author Chess Vision Team');
    self.postMessage('uciok');
  } else if (msg === 'isready') {
    self.postMessage('readyok');
  } else if (typeof msg === 'string' && msg.startsWith('position fen')) {
    self.lastFen = msg.replace('position fen ', '');
  } else if (typeof msg === 'string' && msg.startsWith('go')) {
    self.postMessage('info depth 12 score cp 25 pv e2e4');
    self.postMessage('bestmove e2e4');
  } else if (msg === 'stop') {
    // Engine stop
  }
};
