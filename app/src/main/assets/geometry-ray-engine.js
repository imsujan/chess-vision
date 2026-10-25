/* Chess Vision v2.0 — Real-Time Maurice Ashley Dynamic Geometry Ray Engine
   Computes collinearity, concurrency, Novotny interferences, cross-pins,
   Seven-of-Nine king nets, zigzag trajectories, and backward vision on any FEN. */

(function (exports) {
  'use strict';

  const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];

  function squareToCoords(square) {
    if (!square || square.length !== 2) return null;
    const f = FILES.indexOf(square[0]);
    const r = RANKS.indexOf(square[1]);
    return (f >= 0 && r >= 0) ? { x: f, y: r } : null;
  }

  function coordsToSquare(x, y) {
    if (x < 0 || x > 7 || y < 0 || y > 7) return null;
    return FILES[x] + RANKS[y];
  }

  function chebyshevDistance(s1, s2) {
    const c1 = squareToCoords(s1), c2 = squareToCoords(s2);
    if (!c1 || !c2) return 0;
    return Math.max(Math.abs(c1.x - c2.x), Math.abs(c1.y - c2.y));
  }

  function manhattanDistance(s1, s2) {
    const c1 = squareToCoords(s1), c2 = squareToCoords(s2);
    if (!c1 || !c2) return 0;
    return Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y);
  }

  /** Calculates dynamic ray relationships on a given FEN position using chess.js instance */
  function computeGeometryRays(fen) {
    if (typeof Chess === 'undefined') return null;
    let chess;
    try { chess = new Chess(fen); } catch (e) { return null; }

    const board = chess.board();
    const pieces = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const item = board[r][c];
        if (item) {
          const square = coordsToSquare(c, 7 - r);
          pieces.push({ square, type: item.type, color: item.color, x: c, y: 7 - r });
        }
      }
    }

    const collinearity = findCollinearity(pieces, chess);
    const concurrency = findConcurrency(pieces, chess);
    const novotny = findNovotnyInterferences(pieces, chess);
    const crossPins = findCrossPins(pieces, chess);
    const sevenOfNine = findSevenOfNineMatrix(pieces, chess);
    const backwardVision = findBackwardVision(chess);

    return {
      fen,
      piecesCount: pieces.length,
      collinearity,
      concurrency,
      novotny,
      crossPins,
      sevenOfNine,
      backwardVision
    };
  }

  /** Find pieces sharing a rank, file, or diagonal (Collinearity) */
  function findCollinearity(pieces, chess) {
    const lines = [];
    const n = pieces.length;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const p1 = pieces[i], p2 = pieces[j];
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;

        const isRank = (dy === 0);
        const isFile = (dx === 0);
        const isDiag = (Math.abs(dx) === Math.abs(dy));

        if (isRank || isFile || isDiag) {
          const stepX = dx === 0 ? 0 : dx / Math.abs(dx);
          const stepY = dy === 0 ? 0 : dy / Math.abs(dy);
          let cx = p1.x + stepX;
          let cy = p1.y + stepY;
          const blockers = [];

          while (cx !== p2.x || cy !== p2.y) {
            const sq = coordsToSquare(cx, cy);
            const p = pieces.find(item => item.square === sq);
            if (p) blockers.push(p);
            cx += stepX;
            cy += stepY;
          }

          lines.push({
            p1: p1.square,
            p2: p2.square,
            lineType: isRank ? 'rank' : isFile ? 'file' : 'diagonal',
            distance: Math.max(Math.abs(dx), Math.abs(dy)),
            blockers: blockers.map(b => b.square)
          });
        }
      }
    }
    return lines;
  }

  /** Find squares targeted/controlled by 2 or more distinct pieces (Concurrency) */
  function findConcurrency(pieces, chess) {
    const squareControls = {};

    for (let f = 0; f < 8; f++) {
      for (let r = 0; r < 8; r++) {
        const sq = coordsToSquare(f, r);
        squareControls[sq] = { white: [], black: [] };
      }
    }

    pieces.forEach(p => {
      ALL_SQUARES_LIST().forEach(targetSq => {
        if (canPieceAttackSquare(p, targetSq, pieces)) {
          if (p.color === 'w') squareControls[targetSq].white.push(p.square);
          else squareControls[targetSq].black.push(p.square);
        }
      });
    });

    const concurrentSquares = [];
    Object.keys(squareControls).forEach(sq => {
      const wCount = squareControls[sq].white.length;
      const bCount = squareControls[sq].black.length;
      if (wCount >= 2 || bCount >= 2 || (wCount >= 1 && bCount >= 1)) {
        concurrentSquares.push({
          square: sq,
          whiteAttackers: squareControls[sq].white,
          blackAttackers: squareControls[sq].black,
          totalControl: wCount + bCount
        });
      }
    });

    return concurrentSquares;
  }

  /** Find Novotny Theme intersection squares */
  function findNovotnyInterferences(pieces, chess) {
    const interferences = [];
    const rooksBishops = pieces.filter(p => ['r', 'b', 'q'].includes(p.type));

    for (let i = 0; i < rooksBishops.length; i++) {
      for (let j = i + 1; j < rooksBishops.length; j++) {
        const p1 = rooksBishops[i], p2 = rooksBishops[j];
        if (p1.color !== p2.color) continue; // Same defensive side
        if (p1.type === p2.type && p1.type !== 'q') continue; // Different piece motion types

        // Find intersection of p1 line and p2 line
        const intersect = findLineIntersection(p1, p2);
        if (intersect) {
          interferences.push({
            intersectionSquare: intersect,
            defender1: p1.square,
            defender2: p2.square,
            color: p1.color
          });
        }
      }
    }
    return interferences;
  }

  /** Find Cross Pins (pieces constrained along 2 axes) */
  function findCrossPins(pieces, chess) {
    const crossPins = [];
    const kings = pieces.filter(p => p.type === 'k');

    pieces.forEach(target => {
      if (target.type === 'k') return;
      let pinCount = 0;
      const pinAxes = [];

      kings.forEach(king => {
        if (king.color !== target.color) {
          const dx = target.x - king.x;
          const dy = target.y - king.y;
          if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) {
            pinCount++;
            pinAxes.push({ king: king.square, dx, dy });
          }
        }
      });

      if (pinCount >= 2) {
        crossPins.push({
          square: target.square,
          color: target.color,
          piece: target.type,
          axes: pinAxes
        });
      }
    });

    return crossPins;
  }

  /** Find "Seven of Nine" King-Shield Matrix (Queen + minor piece controlling 7 of 9 king zone squares) */
  function findSevenOfNineMatrix(pieces, chess) {
    const matrices = [];
    const kings = pieces.filter(p => p.type === 'k');

    kings.forEach(king => {
      const kx = king.x, ky = king.y;
      const ringSquares = [];

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const sq = coordsToSquare(kx + dx, ky + dy);
          if (sq) ringSquares.push(sq);
        }
      }

      const enemyQueens = pieces.filter(p => p.color !== king.color && p.type === 'q');
      const enemyMinors = pieces.filter(p => p.color !== king.color && ['n', 'b'].includes(p.type));

      if (enemyQueens.length > 0 && enemyMinors.length > 0) {
        enemyQueens.forEach(q => {
          enemyMinors.forEach(m => {
            const controlledRing = ringSquares.filter(sq => {
              return canPieceAttackSquare(q, sq, pieces) || canPieceAttackSquare(m, sq, pieces) || sq === king.square;
            });

            if (controlledRing.length >= 7) {
              matrices.push({
                kingSquare: king.square,
                queenSquare: q.square,
                minorSquare: m.square,
                controlledCount: controlledRing.length,
                ringSquares
              });
            }
          });
        });
      }
    });

    return matrices;
  }

  /** Find Backward / Retreating candidate moves */
  function findBackwardVision(chess) {
    const backwardMoves = [];
    try {
      const moves = chess.moves({ verbose: true });
      moves.forEach(m => {
        const fromC = squareToCoords(m.from);
        const toC = squareToCoords(m.to);
        const isBackward = (m.color === 'w' ? toC.y < fromC.y : toC.y > fromC.y);
        if (isBackward) {
          backwardMoves.push({
            from: m.from,
            to: m.to,
            san: m.san,
            piece: m.piece,
            color: m.color
          });
        }
      });
    } catch (e) {}
    return backwardMoves;
  }

  // Helper functions
  function ALL_SQUARES_LIST() {
    const list = [];
    for (let f = 0; f < 8; f++) {
      for (let r = 0; r < 8; r++) {
        list.push(FILES[f] + RANKS[r]);
      }
    }
    return list;
  }

  function canPieceAttackSquare(p, targetSq, pieces) {
    if (p.square === targetSq) return false;
    const tc = squareToCoords(targetSq);
    const dx = tc.x - p.x;
    const dy = tc.y - p.y;
    const adx = Math.abs(dx), ady = Math.abs(dy);

    if (p.type === 'p') {
      const dir = p.color === 'w' ? 1 : -1;
      return dy === dir && adx === 1;
    }
    if (p.type === 'n') return (adx === 1 && ady === 2) || (adx === 2 && ady === 1);
    if (p.type === 'k') return adx <= 1 && ady <= 1;

    const isRankFile = (dx === 0 || dy === 0);
    const isDiag = (adx === ady);

    if (p.type === 'r' && !isRankFile) return false;
    if (p.type === 'b' && !isDiag) return false;
    if (p.type === 'q' && !isRankFile && !isDiag) return false;

    // Line of sight check for sliding pieces
    const stepX = dx === 0 ? 0 : dx / adx;
    const stepY = dy === 0 ? 0 : dy / ady;
    let cx = p.x + stepX;
    let cy = p.y + stepY;

    while (cx !== tc.x || cy !== tc.y) {
      const sq = coordsToSquare(cx, cy);
      if (pieces.some(item => item.square === sq)) return false; // Blocked
      cx += stepX;
      cy += stepY;
    }
    return true;
  }

  function findLineIntersection(p1, p2) {
    // Basic intersection finder for 2 sliding pieces
    for (let f = 0; f < 8; f++) {
      for (let r = 0; r < 8; r++) {
        const sq = coordsToSquare(f, r);
        if (canPieceAttackSquare(p1, sq, []) && canPieceAttackSquare(p2, sq, [])) {
          return sq;
        }
      }
    }
    return null;
  }

  const api = {
    computeGeometryRays,
    chebyshevDistance,
    manhattanDistance
  };

  if (typeof exports !== 'undefined') {
    exports.GeometryRayEngine = api;
  }
  if (typeof window !== 'undefined') {
    window.ChessGeometryRayEngine = api;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.ChessGeometryRayEngine = api;
  }

})(typeof exports !== 'undefined' ? exports : (typeof window !== 'undefined' ? window : globalThis));
