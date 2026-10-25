/* Chess Vision v2.0 — Asynchronous UCI Engine Client
   Manages local offline engine evaluation, best moves, and play against Stockfish with live geometry overlays. */

(function (exports) {
  'use strict';

  class StockfishEngineClient {
    constructor(workerPath = 'vendor/stockfish-worker.js') {
      this.workerPath = workerPath;
      this.worker = null;
      this.isReady = false;
      this.evalCallback = null;
      this.currentFen = null;
      this.skillLevel = 10; // 0 (easiest) to 20 (max stockfish strength)
    }

    init() {
      if (typeof Worker === 'undefined') return false;
      try {
        this.worker = new Worker(this.workerPath);
        this.worker.onmessage = (e) => this._handleMessage(e.data);
        this.worker.postMessage('uci');
        this.worker.postMessage('isready');
        return true;
      } catch (err) {
        console.warn('Local Stockfish WebWorker unavailable, falling back to rule-based engine.', err);
        return false;
      }
    }

    setSkillLevel(level) {
      this.skillLevel = Math.max(0, Math.min(20, level));
      if (this.worker) {
        this.worker.postMessage(`setoption name Skill Level value ${this.skillLevel}`);
      }
    }

    evaluateFen(fen, depth = 12, callback) {
      this.currentFen = fen;
      this.evalCallback = callback;
      if (this.worker) {
        this.worker.postMessage('stop');
        this.worker.postMessage('position fen ' + fen);
        this.worker.postMessage('go depth ' + depth);
      } else {
        // Deterministic rule-based fallback when WebWorker is not supported in environment
        this._fallbackEvaluate(fen, callback);
      }
    }

    stop() {
      if (this.worker) this.worker.postMessage('stop');
    }

    _handleMessage(data) {
      if (data === 'readyok') {
        this.isReady = true;
        return;
      }

      if (typeof data === 'string' && data.startsWith('info depth')) {
        const scoreMatch = data.match(/score (cp|mate) (-?\d+)/);
        const pvMatch = data.match(/ pv ([a-h][1-8][a-h][1-8][qrbn]?)/);
        if (scoreMatch && this.evalCallback) {
          const type = scoreMatch[1];
          const val = parseInt(scoreMatch[2], 10);
          const bestMove = pvMatch ? pvMatch[1] : null;
          this.evalCallback({
            type,
            value: val,
            cp: type === 'cp' ? val : (val > 0 ? 10000 : -10000),
            bestMove,
            raw: data
          });
        }
      }

      if (typeof data === 'string' && data.startsWith('bestmove')) {
        const moveMatch = data.match(/^bestmove ([a-h][1-8][a-h][1-8][qrbn]?)/);
        if (moveMatch && this.evalCallback) {
          this.evalCallback({
            type: 'bestmove',
            bestMove: moveMatch[1]
          });
        }
      }
    }

    _fallbackEvaluate(fen, callback) {
      if (typeof Chess === 'undefined') return;
      try {
        const game = new Chess(fen);
        const moves = game.moves({ verbose: true });
        if (!moves.length) return;
        // Simple material + mobility evaluation fallback
        let evalCp = 0;
        const board = game.board();
        for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
            const p = board[r][c];
            if (p) {
              const val = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 }[p.type] || 0;
              evalCp += (p.color === 'w' ? val : -val);
            }
          }
        }
        const bestMove = moves[0].from + moves[0].to + (moves[0].promotion || '');
        if (callback) {
          callback({
            type: 'cp',
            value: evalCp,
            cp: evalCp,
            bestMove
          });
        }
      } catch (e) {}
    }
  }

  const api = { StockfishEngineClient };

  if (typeof exports !== 'undefined') {
    exports.StockfishEngineClient = StockfishEngineClient;
    exports.ChessEngineClient = api;
  }
  if (typeof window !== 'undefined') {
    window.ChessEngineClient = api;
    window.StockfishEngineClient = StockfishEngineClient;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.ChessEngineClient = api;
    globalThis.StockfishEngineClient = StockfishEngineClient;
  }

})(typeof exports !== 'undefined' ? exports : (typeof window !== 'undefined' ? window : globalThis));
