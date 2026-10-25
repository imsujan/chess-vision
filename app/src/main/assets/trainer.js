// =========================================================================
    // 1. STAUNTON SVG PIECE SET (100% Inline, Zero External Asset Dependencies)
    // =========================================================================
    const PIECE_SVGS = {
      wP: `<svg viewBox="0 0 45 45" class="piece-svg"><path d="M 22.5,9 C 19.5,9 17,11.5 17,14.5 C 17,16.8 18.4,18.7 20.4,19.5 C 17.5,21 15.5,24 15.5,28.5 L 29.5,28.5 C 29.5,24 27.5,21 24.6,19.5 C 26.6,18.7 28,16.8 28,14.5 C 28,11.5 25.5,9 22.5,9 z M 12.5,32 L 32.5,32 C 33.5,32 34,33.5 34,35.5 L 11,35.5 C 11,33.5 11.5,32 12.5,32 z" fill="#f8fafc" stroke="#0f172a" stroke-width="2" stroke-linecap="round"/></svg>`,
      wN: `<svg viewBox="0 0 45 45" class="piece-svg"><path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/><path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/><circle cx="15.5" cy="14.5" r="1.5" fill="#0f172a"/></svg>`,
      wB: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="#f8fafc" stroke="#0f172a" stroke-width="2" stroke-linecap="round"><path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 z"/><path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"/><circle cx="22.5" cy="8" r="2.2"/></g></svg>`,
      wR: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="#f8fafc" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z"/><path d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z"/><path d="M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z"/><path d="M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z"/><path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14"/><path d="M 12,32 L 14,29.5 L 31,29.5 L 33,32 L 12,32 z"/></g></svg>`,
      wQ: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="#f8fafc" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z"/><path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z"/><circle cx="6" cy="12" r="1.8"/><circle cx="14" cy="9" r="1.8"/><circle cx="22.5" cy="8" r="1.8"/><circle cx="31" cy="9" r="1.8"/><circle cx="39" cy="12" r="1.8"/></g></svg>`,
      wK: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="#f8fafc" stroke="#0f172a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M 22.5,11.63 L 22.5,6"/><path d="M 20,8 L 25,8"/><path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25"/><path d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 19,16 9.5,13 6.5,19.5 C 3.5,25.5 11.5,29.5 11.5,29.5 L 11.5,37 z"/></g></svg>`,
      bP: `<svg viewBox="0 0 45 45" class="piece-svg"><path d="M 22.5,9 C 19.5,9 17,11.5 17,14.5 C 17,16.8 18.4,18.7 20.4,19.5 C 17.5,21 15.5,24 15.5,28.5 L 29.5,28.5 C 29.5,24 27.5,21 24.6,19.5 C 26.6,18.7 28,16.8 28,14.5 C 28,11.5 25.5,9 22.5,9 z M 12.5,32 L 32.5,32 C 33.5,32 34,33.5 34,35.5 L 11,35.5 C 11,33.5 11.5,32 12.5,32 z" fill="#1e293b" stroke="#f8fafc" stroke-width="1.8" stroke-linecap="round"/></svg>`,
      bN: `<svg viewBox="0 0 45 45" class="piece-svg"><path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" fill="#1e293b" stroke="#f8fafc" stroke-width="1.8"/><path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" fill="#1e293b" stroke="#f8fafc" stroke-width="1.8"/><circle cx="15.5" cy="14.5" r="1.5" fill="#f8fafc"/></svg>`,
      bB: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="#1e293b" stroke="#f8fafc" stroke-width="1.8" stroke-linecap="round"><path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 z"/><path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"/><circle cx="22.5" cy="8" r="2.2"/></g></svg>`,
      bR: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="#1e293b" stroke="#f8fafc" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z"/><path d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z"/><path d="M 14,29.5 L 14,16.5 L 31,16.5 L 31,29.5 L 14,29.5 z"/><path d="M 14,16.5 L 11,14 L 34,14 L 31,16.5 L 14,16.5 z"/><path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14"/><path d="M 12,32 L 14,29.5 L 31,29.5 L 33,32 L 12,32 z"/></g></svg>`,
      bQ: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="#1e293b" stroke="#f8fafc" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z"/><path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z"/><circle cx="6" cy="12" r="1.8"/><circle cx="14" cy="9" r="1.8"/><circle cx="22.5" cy="8" r="1.8"/><circle cx="31" cy="9" r="1.8"/><circle cx="39" cy="12" r="1.8"/></g></svg>`,
      bK: `<svg viewBox="0 0 45 45" class="piece-svg"><g fill="#1e293b" stroke="#f8fafc" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M 22.5,11.63 L 22.5,6"/><path d="M 20,8 L 25,8"/><path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25"/><path d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 19,16 9.5,13 6.5,19.5 C 3.5,25.5 11.5,29.5 11.5,29.5 L 11.5,37 z"/></g></svg>`
    };

    // =========================================================================
    // 2. WEB AUDIO SYNTHESIZER (Zero sound files, gesture-safe, mute toggle)
    // =========================================================================
    let audioCtx = null;
    let soundMuted = false;

    function playTone(kind) {
      if (soundMuted) return;
      try {
        if (!audioCtx) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return;
          audioCtx = new AC();
        }
        if (audioCtx.state === "suspended") {
          audioCtx.resume();
        }
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (kind === "tap") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(520, now);
          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
          osc.start(now);
          osc.stop(now + 0.055);
        } else if (kind === "correct") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(587.33, now);
          osc.frequency.setValueAtTime(880, now + 0.07);
          gain.gain.setValueAtTime(0.11, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (kind === "wrong") {
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.setValueAtTime(175, now + 0.09);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (kind === "mask") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(340, now);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.start(now);
          osc.stop(now + 0.065);
        }
      } catch (e) {
        // Ignore audio errors on restricted devices
      }
    }

    // =========================================================================
    // 3. EMBEDDED CHESS.JS + GEOMETRY & PATTERN ENGINE
    // =========================================================================
    const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const RANKS = ["1", "2", "3", "4", "5", "6", "7", "8"];
    const ALL_SQUARES = [];
    for (let r = 7; r >= 0; r--) {
      for (let f = 0; f < 8; f++) {
        ALL_SQUARES.push(FILES[f] + RANKS[r]);
      }
    }

    const PIECE_VALUES = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
    const PIECE_NAMES = { p: "Pawn", n: "Knight", b: "Bishop", r: "Rook", q: "Queen", k: "King" };
    const CATEGORY_LABELS = {
      attack_convergence: "Attack Convergence",
      hanging_piece: "Undefended Pieces",
      protected_illusion: "Protected Target Illusions",
      knight_fork: "Knight Forks",
      fake_fork: "Fake Fork Traps",
      pin: "Absolute & Relative Pins",
      false_pin: "False Pin Alignments",
      blocked_line: "Blocked Lines & X-Rays",
      before_after: "Before / After Transitions"
    };

    function sqToCoords(sq) {
      return { file: sq.charCodeAt(0) - 97, rank: parseInt(sq[1], 10) - 1 };
    }
    function coordsToSq(f, r) {
      if (f < 0 || f > 7 || r < 0 || r > 7) return null;
      return FILES[f] + RANKS[r];
    }

    // Full legal move handling is bundled locally from chess.js (BSD-2-Clause).
    // The existing geometry API expects empty squares to return null.
    class Chess extends ChessRules {
      get(square) { return super.get(square) || null; }
    }

    // Geometry & Ray Tracing Functions
    function buildBoardAttackMap(fen) {
      const game = new Chess(fen);
      const map = {};
      for (const sq of ALL_SQUARES) {
        const occupant = game.get(sq);
        const whiteAttackers = game.attackers(sq, "w");
        const blackAttackers = game.attackers(sq, "b");
        const attackersOfOccupant = occupant ? (occupant.color === "w" ? blackAttackers : whiteAttackers) : [];
        const defendersOfOccupant = occupant ? (occupant.color === "w" ? whiteAttackers : blackAttackers) : [];
        map[sq] = {
          square: sq,
          occupant,
          whiteAttackers,
          blackAttackers,
          attackersOfOccupant,
          defendersOfOccupant,
          isHanging: occupant !== null && occupant.type !== "k" && attackersOfOccupant.length > 0 && defendersOfOccupant.length === 0,
          isUnderdefended: occupant !== null && occupant.type !== "k" && attackersOfOccupant.length > defendersOfOccupant.length
        };
      }
      return map;
    }

    function traceRay(game, origin, df, dr) {
      const { file: sf, rank: sr } = sqToCoords(origin);
      const emptySquaresBeforeFirst = [];
      const squaresBetweenFirstAndSecond = [];
      let firstBlocker = null;
      let secondBlocker = null;
      let thirdBlocker = null;
      let dist = 1;
      while (true) {
        const sq = coordsToSq(sf + df * dist, sr + dr * dist);
        if (!sq) break;
        const occ = game.get(sq);
        if (occ) {
          const b = { square: sq, piece: { square: sq, type: occ.type, color: occ.color }, distance: dist };
          if (!firstBlocker) firstBlocker = b;
          else if (!secondBlocker) secondBlocker = b;
          else if (!thirdBlocker) {
            thirdBlocker = b;
            break;
          }
        } else {
          if (!firstBlocker) emptySquaresBeforeFirst.push(sq);
          else if (!secondBlocker) squaresBetweenFirstAndSecond.push(sq);
        }
        dist++;
      }
      return { origin, emptySquaresBeforeFirst, firstBlocker, squaresBetweenFirstAndSecond, secondBlocker, thirdBlocker };
    }

    function getSliderDirs(type) {
      if (type === "b") return [[1,1],[1,-1],[-1,1],[-1,-1]];
      if (type === "r") return [[1,0],[-1,0],[0,1],[0,-1]];
      if (type === "q") return [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
      return [];
    }

    function detectPins(fen) {
      const game = new Chess(fen);
      const results = [];
      for (const sq of ALL_SQUARES) {
        const p = game.get(sq);
        if (!p || !["b", "r", "q"].includes(p.type)) continue;
        const slider = { square: sq, type: p.type, color: p.color };
        for (const [df, dr] of getSliderDirs(p.type)) {
          const ray = traceRay(game, sq, df, dr);
          if (!ray.firstBlocker || !ray.secondBlocker) continue;
          const first = ray.firstBlocker.piece;
          const second = ray.secondBlocker.piece;
          const third = ray.thirdBlocker?.piece;

          if (first.color !== slider.color && second.color !== slider.color && first.type !== "k") {
            if (second.type === "k") {
              results.push({ slider, pinnedPiece: first, shieldedPiece: second, pinType: "absolute", isTruePin: true });
            } else if (PIECE_VALUES[second.type] > PIECE_VALUES[first.type]) {
              results.push({ slider, pinnedPiece: first, shieldedPiece: second, pinType: "relative", isTruePin: true });
            }
          }
          if (third && third.color !== slider.color && (third.type === "k" || third.type === "q") && first.color !== slider.color) {
            results.push({
              slider,
              pinnedPiece: first,
              shieldedPiece: third,
              thirdPiece: second,
              pinType: "false_pin_double_blocker",
              isTruePin: false
            });
          }
        }
      }
      return results;
    }

    function detectSliderRaysAndBlockers(fen) {
      const game = new Chess(fen);
      const results = [];
      for (const sq of ALL_SQUARES) {
        const p = game.get(sq);
        if (!p || !["b", "r", "q"].includes(p.type)) continue;
        const slider = { square: sq, type: p.type, color: p.color };
        for (const [df, dr] of getSliderDirs(p.type)) {
          const ray = traceRay(game, sq, df, dr);
          if (!ray.firstBlocker || !ray.secondBlocker) continue;
          const blocker = ray.firstBlocker.piece;
          const targetBehind = ray.secondBlocker.piece;
          if (targetBehind.color !== slider.color && (blocker.color === slider.color || blocker.type === "p")) {
            results.push({ slider, blocker, targetBehind, kind: "blocked_attack", isTrueImmediateAttack: false });
          }
        }
      }
      return results;
    }

    function detectKnightForks(fen) {
      const game = new Chess(fen);
      const results = [];
      for (const sq of ALL_SQUARES) {
        const p = game.get(sq);
        if (!p || p.type !== "n") continue;
        const knightColor = p.color;
        const enemyColor = knightColor === "w" ? "b" : "w";

        const parts = game.fen().split(" ");
        parts[1] = knightColor;
        parts[3] = "-";
        const turnGame = new Chess(parts.join(" "));
        const legalDest = new Set(turnGame.moves({ square: sq, verbose: true }).map((m) => m.to));

        const { file: nf, rank: nr } = sqToCoords(sq);
        for (const [df, dr] of [[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]]) {
          const candSq = coordsToSq(nf + df, nr + dr);
          if (!candSq) continue;
          const occCand = game.get(candSq);
          if (occCand && occCand.color === knightColor) continue;

          const { file: cf, rank: cr } = sqToCoords(candSq);
          const forkedTargets = [];
          for (const [jdf, jdr] of [[1,2],[2,1],[2,-1],[1,-2],[-1,-2],[-2,-1],[-2,1],[-1,2]]) {
            const tSq = coordsToSq(cf + jdf, cr + jdr);
            if (!tSq || tSq === sq) continue;
            const occT = game.get(tSq);
            if (occT && occT.color === enemyColor) {
              if (PIECE_VALUES[occT.type] >= 5 || occT.type === "k" || game.attackers(tSq, enemyColor).length === 0) {
                forkedTargets.push({ square: tSq, type: occT.type, color: occT.color });
              }
            }
          }
          if (forkedTargets.length < 2) continue;

          if (!legalDest.has(candSq)) {
            results.push({ knightSquare: sq, forkSquare: candSq, forkedTargets, defenderSquaresOfForkSquare: [], isTrueFork: false, illusionReason: "knight_is_pinned" });
            continue;
          }

          const sim = new Chess(parts.join(" "));
          sim.move({ from: sq, to: candSq });
          const enemyAttackersAfter = sim.attackers(candSq, enemyColor);
          const isTrueFork = enemyAttackersAfter.length === 0;
          results.push({
            knightSquare: sq,
            forkSquare: candSq,
            forkedTargets,
            defenderSquaresOfForkSquare: enemyAttackersAfter,
            isTrueFork,
            illusionReason: !isTrueFork ? "fork_square_defended" : undefined
          });
        }
      }
      return results;
    }

    function getRaySegmentSquares(from, to) {
      const s = sqToCoords(from);
      const e = sqToCoords(to);
      const df = e.file - s.file;
      const dr = e.rank - s.rank;
      const steps = Math.max(Math.abs(df), Math.abs(dr));
      if (steps === 0) return [from];
      if (df !== 0 && dr !== 0 && Math.abs(df) !== Math.abs(dr)) return [from, to];
      const sf = Math.sign(df);
      const sr = Math.sign(dr);
      const out = [];
      for (let i = 0; i <= steps; i++) {
        const sq = coordsToSq(s.file + sf * i, s.rank + sr * i);
        if (sq) out.push(sq);
      }
      return out;
    }

    // =========================================================================
    // 4. CURATED STARTER POSITIONS (14 Verified True & False-Positive Drills)
    // =========================================================================
    const STARTER_SEEDS = [
      {
        id: "starter-01-f7-convergence",
        title: "Fried Liver Prelude — Convergence on f7",
        fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p1N1/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq - 5 5",
        orientation: "w",
        mode: "geometry_xray",
        category: "attack_convergence",
        difficulty: 1,
        targetSquare: "f7",
        isTruePattern: true
      },
      {
        id: "starter-02-hanging-bishop-c5",
        title: "Exposed Bishop on c5 — Zero Defenders",
        fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/3PP3/5N2/PPP2PPP/RNBQKB1R w KQkq - 1 4",
        orientation: "w",
        mode: "geometry_xray",
        category: "hanging_piece",
        difficulty: 1,
        targetSquare: "c5",
        isTruePattern: true
      },
      {
        id: "starter-03-illusion-protected-g4",
        title: "Long-Diagonal Defense Illusion on g4",
        fen: "r3kbnr/pppq1ppp/2np4/4p3/Q5b1/2N2N2/PPPP1PPP/R1B1KB1R w KQkq - 2 6",
        orientation: "w",
        mode: "pattern_or_illusion",
        category: "protected_illusion",
        difficulty: 2,
        targetSquare: "g4",
        isTruePattern: false
      },
      {
        id: "starter-04-ruy-lopez-false-pin",
        title: "Ruy Lopez c6 Knight — Double Blocker False Pin",
        fen: "r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        orientation: "w",
        mode: "pattern_or_illusion",
        category: "false_pin",
        difficulty: 2,
        targetSquare: "c6",
        isTruePattern: false
      },
      {
        id: "starter-05-steinitz-true-pin",
        title: "Absolute Pin Along the a4–e8 Diagonal",
        fen: "r1bqkbnr/ppp2ppp/2np4/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 4",
        orientation: "w",
        mode: "geometry_xray",
        category: "pin",
        difficulty: 1,
        targetSquare: "c6",
        isTruePattern: true
      },
      {
        id: "starter-06-true-knight-fork-c7",
        title: "Royal & Rook Knight Fork on c7",
        fen: "r1b1kbnr/pppp1ppp/8/3Np3/4P3/8/PPPP1PPP/R1BQKBNR w KQkq - 0 4",
        orientation: "w",
        mode: "geometry_xray",
        category: "knight_fork",
        difficulty: 1,
        targetSquare: "c7",
        isTruePattern: true
      },
      {
        id: "starter-07-fake-knight-fork-c7",
        title: "Guarded c7 Fork Square — Queen on a5 Watches",
        fen: "r1b1kbnr/pppp1ppp/8/q2Np3/4P3/8/PPPP1PPP/R1BQKBNR w KQkq - 1 4",
        orientation: "w",
        mode: "pattern_or_illusion",
        category: "fake_fork",
        difficulty: 2,
        targetSquare: "c7",
        isTruePattern: false
      },
      {
        id: "starter-08-blocked-long-diagonal",
        title: "Blocked Fianchetto X-Ray Toward g7",
        fen: "r1bqk2r/ppppnpbp/2n3p1/4p3/2B1P3/1P3N2/PBPN1PPP/R2QK2R w KQkq - 2 6",
        orientation: "w",
        mode: "pattern_or_illusion",
        category: "blocked_line",
        difficulty: 2,
        targetSquare: "e5",
        isTruePattern: false
      },
      {
        id: "starter-09-flash-f7-battery",
        title: "Flash Vision — Bishop & Queen Convergence on f7",
        fen: "r3kbnr/ppp2ppp/2np4/4p3/2B1P1b1/2N2N2/PPPPQPPP/R1B1K2R w KQkq - 4 6",
        orientation: "w",
        mode: "flash_vision",
        category: "attack_convergence",
        difficulty: 2,
        targetSquare: "f7",
        isTruePattern: true,
        flashDurationMs: 2400
      },
      {
        id: "starter-10-flash-undefended-knight",
        title: "Flash Vision — Loose Knight on g4",
        fen: "r1bqkb1r/pppp1ppp/2n5/4p3/4P1n1/5N2/PPPP1PPP/RNBQKB1R w KQkq - 3 4",
        orientation: "w",
        mode: "flash_vision",
        category: "hanging_piece",
        difficulty: 1,
        targetSquare: "g4",
        isTruePattern: true,
        flashDurationMs: 2200
      },
      {
        id: "starter-11-before-after-discovered-attack",
        title: "Before / After — Knight Clears the e-File",
        fen: "rnbqk2r/pppp1ppp/8/2b1n3/2B1N3/8/PPPP1PPP/RNBQR1K1 w kq - 4 6",
        afterMoveSan: "Nxc5",
        orientation: "w",
        mode: "before_after",
        category: "before_after",
        difficulty: 2,
        targetSquare: "e5",
        isTruePattern: true
      },
      {
        id: "starter-12-before-after-defensive-retreat",
        title: "Before / After — Defending the Loose Bishop",
        fen: "r1bqk1nr/pppp1ppp/2n5/2b1p3/3PP3/5N2/PPP2PPP/RNBQKB1R b KQkq - 1 4",
        afterMoveSan: "Bb6",
        orientation: "b",
        mode: "before_after",
        category: "before_after",
        difficulty: 2,
        targetSquare: "b6",
        isTruePattern: false
      },
      {
        id: "starter-13-relative-pin-bg5",
        title: "Relative Pin on f6 Knight Shielding Queen on d8",
        fen: "r1bqkb1r/ppp2ppp/2n1pn2/3p2B1/3P4/2N2N2/PPP1PPPP/R2QKB1R w KQkq - 0 5",
        orientation: "w",
        mode: "geometry_xray",
        category: "pin",
        difficulty: 1,
        targetSquare: "f6",
        isTruePattern: true
      },
      {
        id: "starter-14-convergence-d5-outpost",
        title: "Triple Convergence on Central d5 Square",
        fen: "r1bqk2r/pp2ppbp/2np1np1/2p5/2P1P3/2NP1NP1/PP3PBP/R1BQ1RK1 w kq - 0 7",
        orientation: "w",
        mode: "geometry_xray",
        category: "attack_convergence",
        difficulty: 3,
        targetSquare: "d5",
        isTruePattern: true
      }
    ];

    function formatPieceLabel(type, color, sq) {
      const cName = color === "w" ? "White " : "Black ";
      return `${cName}${PIECE_NAMES[type]} on ${sq}`;
    }

    function buildExerciseFromSeed(seed) {
      const game = new Chess(seed.fen);
      const boardMap = buildBoardAttackMap(seed.fen);
      const targetInfo = boardMap[seed.targetSquare];

      if (seed.mode === "before_after" && seed.afterMoveSan) {
        const sim = new Chess(seed.fen);
        const moverColor = sim.turn();
        const moveObj = sim.move(seed.afterMoveSan);
        const afterFen = sim.fen();
        const afterMap = buildBoardAttackMap(afterFen);
        const afterTarget = afterMap[seed.targetSquare];

        const arrows = [{ from: moveObj.from, to: moveObj.to, kind: "move" }];
        const badges = [{ square: seed.targetSquare, role: seed.isTruePattern ? "target" : "defender", label: seed.targetSquare }];
        for (const atkSq of afterTarget.attackersOfOccupant) {
          arrows.push({ from: atkSq, to: seed.targetSquare, kind: "attack" });
          badges.push({ square: atkSq, role: "attacker", label: "Attacker" });
        }
        for (const defSq of afterTarget.defendersOfOccupant) {
          arrows.push({ from: defSq, to: seed.targetSquare, kind: "defense" });
        }

        const explanation = seed.isTruePattern
          ? `After ${moveObj.san} (${moveObj.from}→${moveObj.to}), vacating ${moveObj.from} uncovers a direct attack on ${seed.targetSquare} (${afterTarget.attackersOfOccupant.length} attacker vs ${afterTarget.defendersOfOccupant.length} defenders).`
          : `After ${moveObj.san} (${moveObj.from}→${moveObj.to}), the threatened Bishop retreats safely to ${seed.targetSquare}.`;

        return {
          id: seed.id,
          title: seed.title,
          mode: "before_after",
          category: seed.category,
          fen: seed.fen,
          afterFen,
          moveSan: moveObj.san,
          orientation: seed.orientation,
          prompt: seed.isTruePattern
            ? `Visualize ${moverColor === "w" ? "White" : "Black"} playing ${moveObj.san}. Tap the square that becomes newly attacked or hanging.`
            : `Visualize ${moverColor === "w" ? "White" : "Black"} playing ${moveObj.san}. Tap the square where the retreating piece lands safely.`,
          subPrompt: `Compare attack and defense lines before and after ${moveObj.san}.`,
          responseType: "select_square",
          correctSquares: [seed.targetSquare],
          isTruePattern: seed.isTruePattern,
          hint: `Track both the landing square ${moveObj.to} and the open file/diagonal vacated from ${moveObj.from}.`,
          explanation,
          overlay: { arrows, badges, raySquares: [moveObj.from, moveObj.to, seed.targetSquare] }
        };
      }

      if (seed.category === "pin" || seed.category === "false_pin") {
        const pins = detectPins(seed.fen);
        const pin = pins.find((p) => p.pinnedPiece.square === seed.targetSquare) || pins[0];
        const arrows = [];
        const badges = [];
        let raySquares = [seed.targetSquare];
        if (pin) {
          arrows.push({ from: pin.slider.square, to: pin.shieldedPiece.square, kind: pin.isTruePin ? "pin" : "blocked" });
          badges.push(
            { square: pin.slider.square, role: "attacker", label: "Slider" },
            { square: pin.pinnedPiece.square, role: pin.isTruePin ? "target" : "illusion", label: pin.isTruePin ? "Pinned" : "Not Pinned" },
            { square: pin.shieldedPiece.square, role: "target", label: "Shielded" }
          );
          if (pin.thirdPiece) {
            badges.push({ square: pin.thirdPiece.square, role: "blocker", label: "2nd Blocker" });
          }
          raySquares = getRaySegmentSquares(pin.slider.square, pin.shieldedPiece.square);
        }
        const explanation = pin
          ? pin.isTruePin
            ? `${formatPieceLabel(pin.slider.type, pin.slider.color, pin.slider.square)} creates a ${pin.pinType} pin on ${formatPieceLabel(pin.pinnedPiece.type, pin.pinnedPiece.color, pin.pinnedPiece.square)} against the ${PIECE_NAMES[pin.shieldedPiece.type]} on ${pin.shieldedPiece.square}.`
            : `False pin illusion! ${formatPieceLabel(pin.pinnedPiece.type, pin.pinnedPiece.color, pin.pinnedPiece.square)} is NOT pinned because ${formatPieceLabel(pin.thirdPiece.type, pin.thirdPiece.color, pin.thirdPiece.square)} also sits on the ray in front of ${pin.shieldedPiece.square}.`
          : `Check the alignment along ${seed.targetSquare}.`;

        return {
          id: seed.id,
          title: seed.title,
          mode: seed.mode,
          category: seed.category,
          fen: seed.fen,
          orientation: seed.orientation,
          prompt: seed.mode === "pattern_or_illusion"
            ? `Is the piece on ${seed.targetSquare} truly pinned, or is it an illusion? Choose your verdict above, then tap ${seed.targetSquare} (or the second blocker).`
            : `Tap the piece that is pinned along a rank, file, or diagonal.`,
          subPrompt: "Count how many pieces sit between the enemy slider and the King or Queen.",
          responseType: seed.mode === "pattern_or_illusion" ? "verdict_and_square" : "select_square",
          correctSquares: pin && pin.thirdPiece ? [seed.targetSquare, pin.thirdPiece.square] : [seed.targetSquare],
          isTruePattern: seed.isTruePattern,
          correctOption: seed.isTruePattern ? "real" : "illusion",
          hint: "Trace the ray from the Bishop/Rook/Queen to the royal piece and count blockers.",
          explanation,
          overlay: { arrows, badges, raySquares }
        };
      }

      if (seed.category === "blocked_line") {
        const rays = detectSliderRaysAndBlockers(seed.fen);
        const ray = rays.find((r) => r.blocker.square === seed.targetSquare) || rays[0];
        const arrows = ray
          ? [
              { from: ray.slider.square, to: ray.blocker.square, kind: "blocked" },
              { from: ray.blocker.square, to: ray.targetBehind.square, kind: "pin" }
            ]
          : [];
        const badges = ray
          ? [
              { square: ray.slider.square, role: "attacker", label: "Slider" },
              { square: ray.blocker.square, role: "blocker", label: "Blocker" },
              { square: ray.targetBehind.square, role: "target", label: "Shadowed" }
            ]
          : [{ square: seed.targetSquare, role: "blocker", label: "Blocker" }];

        return {
          id: seed.id,
          title: seed.title,
          mode: seed.mode,
          category: seed.category,
          fen: seed.fen,
          orientation: seed.orientation,
          prompt: `Does the b2 Bishop have an open diagonal to g7, or is it blocked? Choose your verdict above and tap the blocker square.`,
          subPrompt: "Trace the long diagonal square-by-square.",
          responseType: seed.mode === "pattern_or_illusion" ? "verdict_and_square" : "select_square",
          correctSquares: [seed.targetSquare],
          isTruePattern: false,
          correctOption: "illusion",
          hint: "Look at the central squares on the a1–h8 long diagonal.",
          explanation: ray
            ? `${formatPieceLabel(ray.slider.type, ray.slider.color, ray.slider.square)} aims toward ${formatPieceLabel(ray.targetBehind.type, ray.targetBehind.color, ray.targetBehind.square)}, but ${formatPieceLabel(ray.blocker.type, ray.blocker.color, ray.blocker.square)} blocks the diagonal.`
            : `The piece on ${seed.targetSquare} blocks the diagonal.`,
          overlay: {
            arrows,
            badges,
            raySquares: ray ? getRaySegmentSquares(ray.slider.square, ray.targetBehind.square) : [seed.targetSquare]
          }
        };
      }

      if (seed.category === "knight_fork" || seed.category === "fake_fork") {
        const forks = detectKnightForks(seed.fen);
        const fork = forks.find((f) => f.forkSquare === seed.targetSquare) || forks[0];
        const arrows = [];
        const badges = [{ square: seed.targetSquare, role: seed.isTruePattern ? "target" : "illusion", label: seed.isTruePattern ? "Fork!" : "Guarded" }];
        if (fork) {
          arrows.push({ from: fork.knightSquare, to: fork.forkSquare, kind: "move" });
          for (const t of fork.forkedTargets) {
            arrows.push({ from: fork.forkSquare, to: t.square, kind: "attack" });
            badges.push({ square: t.square, role: "target", label: "Forked" });
          }
          for (const d of fork.defenderSquaresOfForkSquare) {
            arrows.push({ from: d, to: fork.forkSquare, kind: "defense" });
            badges.push({ square: d, role: "defender", label: "Guards" });
          }
        }

        const explanation = fork
          ? fork.isTrueFork
            ? `Knight on ${fork.knightSquare} jumps to ${fork.forkSquare}, forking ${fork.forkedTargets.map((t) => `${PIECE_NAMES[t.type]} on ${t.square}`).join(" and ")} with zero defenders guarding ${fork.forkSquare}.`
            : `Fake fork illusion! Jumping to ${fork.forkSquare} attacks ${fork.forkedTargets.map((t) => `${PIECE_NAMES[t.type]} on ${t.square}`).join(" and ")}, but ${fork.defenderSquaresOfForkSquare.join(", ")} guards ${fork.forkSquare}!`
          : `Inspect the knight jump geometry around ${seed.targetSquare}.`;

        return {
          id: seed.id,
          title: seed.title,
          mode: seed.mode,
          category: seed.category,
          fen: seed.fen,
          orientation: seed.orientation,
          prompt: seed.mode === "pattern_or_illusion"
            ? `Evaluate the knight jump to ${seed.targetSquare}: is it a clean royal fork or a guarded trap? Select your verdict and tap ${seed.targetSquare} (or the guarding piece).`
            : `Tap the square where the White Knight executes a clean royal & rook fork.`,
          subPrompt: "Check both the knight's L-jump targets AND whether any enemy piece guards the fork square.",
          responseType: seed.mode === "pattern_or_illusion" ? "verdict_and_square" : "select_square",
          correctSquares: fork && !fork.isTrueFork && fork.defenderSquaresOfForkSquare.length > 0
            ? [seed.targetSquare, ...fork.defenderSquaresOfForkSquare]
            : [seed.targetSquare],
          isTruePattern: seed.isTruePattern,
          correctOption: seed.isTruePattern ? "real" : "illusion",
          hint: "Scan the a5–e1 diagonal and 7th rank for long-range defenders of c7.",
          explanation,
          overlay: { arrows, badges, raySquares: [seed.targetSquare] }
        };
      }

      // Default: Convergence, Hanging Piece, or Protected Illusion
      const occ = game.get(seed.targetSquare);
      const atkColor = occ ? (occ.color === "w" ? "b" : "w") : seed.orientation;
      const atkSquares = atkColor === "w" ? targetInfo.whiteAttackers : targetInfo.blackAttackers;
      const defSquares = atkColor === "w" ? targetInfo.blackAttackers : targetInfo.whiteAttackers;

      const arrows = [
        ...atkSquares.map((from) => ({ from, to: seed.targetSquare, kind: "attack" })),
        ...defSquares.map((from) => ({ from, to: seed.targetSquare, kind: "defense" }))
      ];
      const badges = [
        { square: seed.targetSquare, role: seed.isTruePattern ? "target" : "illusion", label: `${atkSquares.length}v${defSquares.length}` },
        ...atkSquares.map((sq) => ({ square: sq, role: "attacker", label: "Atk" })),
        ...defSquares.map((sq) => ({ square: sq, role: "defender", label: "Def" }))
      ];

      const pieceDesc = occ ? formatPieceLabel(occ.type, occ.color, seed.targetSquare) : `Square ${seed.targetSquare}`;
      const explanation = defSquares.length === 0
        ? `${pieceDesc} is completely undefended! Attacked by ${atkSquares.join(", ")} (${atkSquares.length} attacker(s), 0 defenders).`
        : atkSquares.length > defSquares.length
        ? `${pieceDesc} is overloaded: ${atkSquares.length} attackers (${atkSquares.join(", ")}) converge against only ${defSquares.length} defender (${defSquares.join(", ")}).`
        : `Protected illusion! ${pieceDesc} is attacked across the rank by ${atkSquares.join(", ")}, but defended along the diagonal by ${defSquares.join(", ")}.`;

      let prompt = `Tap the square where White's pieces converge with more attackers than defenders.`;
      if (seed.mode === "flash_vision") {
        prompt = `Flash Recall: Memorize the board, then tap the undefended or overloaded target square.`;
      } else if (seed.mode === "pattern_or_illusion") {
        prompt = `Look at ${pieceDesc}: is it truly hanging, or is it defended from afar? Choose your verdict and tap ${seed.targetSquare} (or its defender).`;
      } else if (seed.category === "hanging_piece") {
        prompt = `Tap the undefended (hanging) enemy piece that is currently under attack.`;
      }

      return {
        id: seed.id,
        title: seed.title,
        mode: seed.mode,
        category: seed.category,
        fen: seed.fen,
        orientation: seed.orientation,
        prompt,
        subPrompt: "Count every geometric attacker and defender of the target square.",
        responseType: seed.mode === "pattern_or_illusion" ? "verdict_and_square" : "select_square",
        correctSquares: !seed.isTruePattern && defSquares.length > 0 ? [seed.targetSquare, ...defSquares] : [seed.targetSquare],
        isTruePattern: seed.isTruePattern,
        correctOption: seed.isTruePattern ? "real" : "illusion",
        hint: `Scan long diagonals, files, and knight jumps aimed at ${seed.targetSquare}.`,
        explanation,
        overlay: { arrows, badges, raySquares: [seed.targetSquare] },
        flashDurationMs: seed.flashDurationMs || (seed.mode === "flash_vision" ? 2300 : 0)
      };
    }

    function generateExerciseFromArbitraryFen(fen, idPrefix) {
      const map = buildBoardAttackMap(fen);
      for (const sq of ALL_SQUARES) {
        if (map[sq].isHanging && map[sq].occupant) {
          return buildExerciseFromSeed({
            id: `${idPrefix}-hang-${sq}`,
            title: `Hanging ${PIECE_NAMES[map[sq].occupant.type]} on ${sq}`,
            fen,
            orientation: map[sq].occupant.color === "w" ? "b" : "w",
            mode: "geometry_xray",
            category: "hanging_piece",
            difficulty: 1,
            targetSquare: sq,
            isTruePattern: true
          });
        }
      }
      const pins = detectPins(fen);
      if (pins.length > 0) {
        const p = pins[0];
        return buildExerciseFromSeed({
          id: `${idPrefix}-pin-${p.pinnedPiece.square}`,
          title: `${p.isTruePin ? "Pin" : "False Pin"} on ${p.pinnedPiece.square}`,
          fen,
          orientation: p.slider.color,
          mode: p.isTruePin ? "geometry_xray" : "pattern_or_illusion",
          category: p.isTruePin ? "pin" : "false_pin",
          difficulty: 2,
          targetSquare: p.pinnedPiece.square,
          isTruePattern: p.isTruePin
        });
      }
      for (const sq of ALL_SQUARES) {
        if (map[sq].isUnderdefended && map[sq].occupant) {
          return buildExerciseFromSeed({
            id: `${idPrefix}-conv-${sq}`,
            title: `Attack Convergence on ${sq}`,
            fen,
            orientation: map[sq].occupant.color === "w" ? "b" : "w",
            mode: "geometry_xray",
            category: "attack_convergence",
            difficulty: 2,
            targetSquare: sq,
            isTruePattern: true
          });
        }
      }
      return null;
    }

    // =========================================================================
    // 5. LOCAL STORAGE PERSISTENCE (Sandbox-Safe with In-Memory Fallback)
    // =========================================================================
    const STORAGE_KEY = "chess_vision_local_state_v1";
    let appData = {
      attempts: [],
      gamesCount: 0,
      untimedMode: false,
      learning: { version:1, lessonsViewed:{}, notes:[] }
    };

    function loadLocalState() {
      try {
        const raw = readPersistentItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (isValidBackup({ ...parsed, app: 'chess-vision' })) {
            appData = {
              attempts: parsed.attempts,
              gamesCount: parsed.gamesCount || 0,
              untimedMode: Boolean(parsed.untimedMode),
              learning: normalizedLearning(parsed.learning)
            };
          } else { document.getElementById('storageWarning')?.classList.remove('hidden'); }
        }
      } catch (e) {
        document.getElementById('storageWarning')?.classList.remove('hidden');
      }
    }

    function saveLocalState() {
      try {
        writePersistentItem(STORAGE_KEY, JSON.stringify(appData));
        document.getElementById('storageWarning')?.classList.add('hidden');
      } catch (e) {
        document.getElementById('storageWarning')?.classList.remove('hidden');
      }
    }

    // =========================================================================
    // 6. UI STATE & INTERACTIVE CONTROLLERS
    // =========================================================================
    let activeTab = "today";
    let sessionQueue = [];
    let currentDrillIndex = 0;
    let currentExercise = null;
    let currentOrientation = "w";
    let selectedSquare = null;
    let selectedVerdict = null;
    let isRevealed = false;
    let viewingAfterFen = false;
    let sessionResults = [];

    // Flash Timer State
    let flashPhase = "idle"; // idle | exposed | masked | answered | invalidated
    let flashStartTime = 0;
    let flashTimeoutId = null;
    let flashIntervalId = null;

    function clearFlashTimers() {
      if (flashTimeoutId) {
        clearTimeout(flashTimeoutId);
        flashTimeoutId = null;
      }
      if (flashIntervalId) {
        clearInterval(flashIntervalId);
        flashIntervalId = null;
      }
    }

    function computeWeaknessRankings() {
      const statsByCat = {};
      for (const cat of Object.keys(CATEGORY_LABELS)) {
        statsByCat[cat] = { attempts: 0, correct: 0, traps: 0, totalMs: 0, correctTimes:[] };
      }
      for (const att of appData.attempts) {
        if (!isRecognitionAttempt(att)) continue;
        const st = statsByCat[att.category];
        if (!st) continue;
        st.attempts++;
        if (att.correct) { st.correct++; st.correctTimes.push(recognitionLatency(att)); }
        if (att.responseType === 'verdict_and_square' && !att.isTruePattern && att.selectedVerdict === 'real') st.traps++;
        st.totalMs += att.responseTimeMs || 1500;
      }
      return Object.keys(CATEGORY_LABELS).map((cat) => {
        const st = statsByCat[cat];
        const acc = st.attempts > 0 ? Math.round((st.correct / st.attempts) * 100) : 0;
        const avgMs = median(st.correctTimes) || 0;
        const priority = st.attempts === 0 ? 85 : Math.round((100 - acc) * 0.7 + st.traps * 10);
        return {
          category: cat,
          label: CATEGORY_LABELS[cat],
          attempts: st.attempts,
          accuracyPercent: acc,
          traps: st.traps,
          avgMs,
          priority
        };
      }).sort((a, b) => b.priority - a.priority);
    }

    function buildAdaptiveQueue(modeFilter, count = 8) {
      return intermediateQueue(modeFilter,count);
    }

    function switchTab(tab) {
      if (activeTab === 'train' && tab !== 'train') invalidateFlash();
      activeTab = tab;
      document.body.dataset.tab = tab;
      document.getElementById('headerSubLabel').textContent = { today: 'See the connections.', learn: 'A path to clearer thinking', train: 'The geometry lab', games: 'Your games, new insight', progress: 'Every connection counts' }[tab];
      const views = {
        today: document.getElementById("viewToday"),
        learn: document.getElementById("viewLearn"),
        train: document.getElementById("viewTrain"),
        games: document.getElementById("viewGames"),
        progress: document.getElementById("viewProgress")
      };
      const navBtns = {
        today: document.getElementById("navBtnToday"),
        learn: document.getElementById("navBtnLearn"),
        train: document.getElementById("navBtnTrain"),
        games: document.getElementById("navBtnGames"),
        progress: document.getElementById("navBtnProgress")
      };

      for (const k of Object.keys(views)) {
        navBtns[k].setAttribute('aria-current', k === tab ? 'page' : 'false');
        if (k === tab) {
          views[k].classList.remove("hidden");
          views[k].classList.add("flex");
          navBtns[k].classList.remove("text-slate-400");
          navBtns[k].classList.add("text-sky-400", "font-bold");
        } else {
          views[k].classList.add("hidden");
          views[k].classList.remove("flex");
          navBtns[k].classList.remove("text-sky-400", "font-bold");
          navBtns[k].classList.add("text-slate-400");
        }
      }

      if (tab !== "train") {
        clearFlashTimers();
      }
      renderStatsUI();
      window.scrollTo(0, 0);
      if (tab !== 'today') views[tab].querySelector('h1, h2')?.focus({ preventScroll: true });
    }

    function renderStatsUI() {
      const measured = appData.attempts.filter(isRecognitionAttempt);
      const total = measured.length;
      const correctCount = measured.filter((a) => a.correct).length;
      const acc = total > 0 ? Math.round((correctCount / total) * 100) : 0;
      const avgMs = median(measured.filter(a => a.correct).map(recognitionLatency)) || 0;
      const traps = measured.filter(a => a.responseType === "verdict_and_square" && !a.isTruePattern && a.selectedVerdict === "real").length;

      document.getElementById("todayStatAttempts").textContent = String(total);
      document.getElementById("todayStatAccuracy").textContent = total > 0 ? `${acc}%` : "—";
      document.getElementById("todayStatSpeed").textContent = total > 0 ? `${(avgMs / 1000).toFixed(1)}s` : "—";

      document.getElementById("progTotalAttempts").textContent = String(total);
      document.getElementById("progAccuracy").textContent = total > 0 ? `${acc}%` : "—";
      document.getElementById("progTraps").textContent = String(traps);
      document.getElementById("gamesCountTag").textContent = `PERSONAL GAMES · ${appData.gamesCount} ANALYZED ON DEVICE`;

      const rankings = computeWeaknessRankings();
      const listEl = document.getElementById("weaknessListContainer");
      listEl.innerHTML = rankings.map(renderSkillCard).join('');
      renderExperienceStats(rankings);
      renderLearningProgress();

    }

    function startSprintSession(exercises, kind = 'mixed') {
      learningSessionKind = kind;
      assessmentActive = kind === 'assessment';
      if (!exercises.length) {
        announce('No drills available. Import a position or try another mode.');
        return;
      }
      sessionQueue = exercises.map(attachLesson).map(exercise => ({ ...exercise,
        flashDurationMs: exercise.mode === 'flash_vision' ? (kind === 'assessment' ? ASSESSMENT_EXPOSURE_MS : exposureForLesson(exercise.lessonId)) : exercise.flashDurationMs
      }));
      currentDrillIndex = 0;
      sessionResults = [];
      document.getElementById("sprintSummaryCard").classList.add("hidden");
      document.getElementById("sprintSummaryCard").classList.remove("flex");
      document.getElementById("drillActiveContainer").classList.remove("hidden");
      switchTab("train");
      loadCurrentDrill();
    }

    function loadCurrentDrill() {
      clearFlashTimers();
      currentExercise = attachLesson(sessionQueue[currentDrillIndex]);
      resetVisualFlow();
      currentOrientation = currentExercise.orientation || "w";
      selectedSquare = null;
      selectedVerdict = null;
      isRevealed = false;
      viewingAfterFen = false;
      flashStartTime = Date.now();

      document.getElementById("drillCategoryPill").textContent = CATEGORY_LABELS[currentExercise.category] || currentExercise.category;
      const movePill = document.getElementById("drillMovePill");
      if (currentExercise.moveSan) {
        movePill.textContent = `Move: ${currentExercise.moveSan}`;
        movePill.classList.remove("hidden");
      } else {
        movePill.classList.add("hidden");
      }

      document.getElementById("drillStepCounter").textContent = `${currentDrillIndex + 1} / ${sessionQueue.length}`;
      document.getElementById("drillTitle").textContent = currentExercise.title || "Vision Drill";
      document.getElementById("drillPrompt").textContent = currentExercise.prompt;
      document.getElementById("drillSubPrompt").textContent = currentExercise.subPrompt;

      const verdictGroup = document.getElementById("verdictGroup");
      if (currentExercise.responseType === "verdict_and_square") {
        verdictGroup.classList.remove("hidden");
        verdictGroup.classList.add("grid");
        updateVerdictButtonsUI();
        document.getElementById("selectionHintLabel").textContent = "1. Pick Verdict → 2. Tap Square";
      } else {
        verdictGroup.classList.add("hidden");
        verdictGroup.classList.remove("grid");
        document.getElementById("selectionHintLabel").textContent = "Tap the target square on the board";
      }

      document.getElementById("hintBox").classList.add("hidden");
      document.getElementById("hintBox").textContent = currentExercise.hint;
      document.getElementById("btnToggleHint").textContent = "Show geometry hint";
      document.getElementById("preAnswerBar").classList.remove("hidden");
      document.getElementById("feedbackPanel").classList.add("hidden");
      document.getElementById("feedbackPanel").classList.remove("flex");
      document.getElementById("flashInvalidBanner").classList.add("hidden");
      document.getElementById("flashInvalidBanner").classList.remove("flex");

      // Flash Vision setup
      const flashWrap = document.getElementById("flashTimerWrap");
      if (currentExercise.mode === "flash_vision" && (!appData.untimedMode || learningSessionKind === "assessment")) {
        flashWrap.classList.remove("hidden");
        flashWrap.classList.add("flex");
        flashPhase = "ready";
        document.getElementById("flashStatusText").textContent = "Read the goal first. Start the exposure when ready.";
      } else {
        flashPhase = "exposed";
        flashWrap.classList.add("hidden");
        flashWrap.classList.remove("flex");
      }

      resetLearningRound();
      resetRecognitionRound();
      renderBoardAndOverlay();
      renderLessonState();
      document.getElementById("taskGoal").focus({preventScroll:true}); window.scrollTo(0,0); maybeShowDemo(); announce(currentExercise.presentation.goal);
    }

    function startFlashExposure(durationMs) {
      clearFlashTimers();
      flashPhase = "exposed";
      document.getElementById("btnStartExposure").classList.add("hidden");
      flashStartTime = Date.now();
      const bar = document.getElementById("flashProgressBar");
      const statusText = document.getElementById("flashStatusText");
      bar.style.width = "100%";
      statusText.textContent = `Memorize board (${(durationMs / 1000).toFixed(1)}s)...`;
      document.getElementById("flashInvalidBanner").classList.add("hidden");
      document.getElementById("flashInvalidBanner").classList.remove("flex");
      renderBoardAndOverlay();
      renderLessonState();

      flashIntervalId = setInterval(() => {
        const elapsed = Date.now() - flashStartTime;
        const pct = Math.max(0, 100 - (elapsed / durationMs) * 100);
        bar.style.width = `${pct}%`;
      }, 60);

      flashTimeoutId = setTimeout(() => {
        clearFlashTimers();
        if (!isRevealed && flashPhase === "exposed") {
          flashPhase = "masked";
          bar.style.width = "0%";
          statusText.textContent = "Board masked — tap target square from memory!";
          playTone("mask");
          renderBoardAndOverlay();
          renderLessonState();
          announce("Pieces hidden. Recall the target square.");
        }
      }, durationMs);
    }

    function updateVerdictButtonsUI() {
      renderBoardCaption();
      const btnReal = document.getElementById("btnVerdictReal");
      const btnIllusion = document.getElementById("btnVerdictIllusion");
      if (selectedVerdict === "real") {
        btnReal.className = "py-2 px-3 rounded-xl border-2 border-sky-400 bg-sky-500/25 text-xs font-extrabold text-white transition";
        btnIllusion.className = "py-2 px-3 rounded-xl border border-slate-600 bg-slate-900/70 text-xs font-bold text-slate-300 transition";
      } else if (selectedVerdict === "illusion") {
        btnIllusion.className = "py-2 px-3 rounded-xl border-2 border-purple-400 bg-purple-500/25 text-xs font-extrabold text-white transition";
        btnReal.className = "py-2 px-3 rounded-xl border border-slate-600 bg-slate-900/70 text-xs font-bold text-slate-300 transition";
      } else {
        btnReal.className = "py-2 px-3 rounded-xl border border-slate-600 bg-slate-900/70 text-xs font-bold text-slate-200 transition";
        btnIllusion.className = "py-2 px-3 rounded-xl border border-slate-600 bg-slate-900/70 text-xs font-bold text-slate-200 transition";
      }
    }

    function renderBoardAndOverlay() {
      if (!currentExercise) return;
      const gridEl = document.getElementById("chessboardGrid");
      const activeFen = isRevealed && viewingAfterFen && currentExercise.afterFen
        ? currentExercise.afterFen
        : currentExercise.fen;
      const game = new Chess(activeFen);
      const isMasked = currentExercise.mode === "flash_vision" && (!appData.untimedMode || learningSessionKind === "assessment") && (flashPhase === "masked" || flashPhase === "ready") && !isRevealed;

      const maskBanner = document.getElementById("flashMaskBanner");
      maskBanner.textContent = flashPhase === "ready" ? "Board hidden. Read your goal, then press Ready above." : "Pieces hidden. Tap the target square from memory.";
      if (isMasked) {
        maskBanner.classList.remove("hidden");
      } else {
        maskBanner.classList.add("hidden");
      }

      const focusedSquare = document.activeElement?.dataset.square;
      gridEl.innerHTML = '';
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const fileIdx = currentOrientation === "w" ? col : 7 - col;
          const rankIdx = currentOrientation === "w" ? 7 - row : row;
          const sq = coordsToSq(fileIdx, rankIdx);
          const isLight = (fileIdx + rankIdx) % 2 === 1;
          const piece = game.get(sq);

          const btn = document.createElement("button");
          btn.type = "button";
          btn.dataset.square = sq;
          btn.setAttribute('aria-label', isMasked ? 'Square ' + sq : sq + (piece ? ', ' + (piece.color === 'w' ? 'White ' : 'Black ') + PIECE_NAMES[piece.type] : ', empty'));
          btn.disabled = !isRevealed && isFlashLocked();
          btn.tabIndex = focusedSquare ? (sq === focusedSquare ? 0 : -1) : (row === 0 && col === 0 ? 0 : -1);
          btn.addEventListener('keydown', handleBoardKey);
          if (isRevealed && currentExercise.correctSquares.includes(sq)) btn.setAttribute('aria-label', btn.getAttribute('aria-label') + ', correct target');
          let cls = `board-sq ${isLight ? "sq-light" : "sq-dark"}`;

          btn.setAttribute('aria-pressed',String(currentExercise.traceSteps ? traceSelections.includes(sq) : currentExercise.responseType==='select_set' ? setSelections.has(sq) : selectedSquare===sq));
          if(learningSessionKind==='worked-example' && !isRevealed && currentExercise.correctSquares.includes(sq))btn.classList.add('demo-focus');
          if (!isRevealed && (selectedSquare === sq || setSelections.has(sq))) {
            cls += " sq-selected";
          }
          if (isRevealed) {
            if ((!currentExercise.afterFen || viewingAfterFen) && currentExercise.overlay.raySquares.includes(sq)) {
              cls += " sq-ray";
            }
            if (currentExercise.correctSquares.includes(sq)) {
              cls += " sq-correct";
            } else if (selectedSquare === sq || setSelections.has(sq)) {
              cls += " sq-wrong";
            }
          }
          if(learningSessionKind==='worked-example' && !isRevealed && currentExercise.correctSquares.includes(sq))cls+=' demo-focus';
          btn.className = cls;

          if (col === 0) {
            const rSpan = document.createElement("span");
            rSpan.className = "coord-rank";
            rSpan.textContent = RANKS[rankIdx];
            btn.appendChild(rSpan);
          }
          if (row === 7) {
            const fSpan = document.createElement("span");
            fSpan.className = "coord-file";
            fSpan.textContent = FILES[fileIdx];
            btn.appendChild(fSpan);
          }

          if (piece && !isMasked) {
            const key = `${piece.color}${piece.type.toUpperCase()}`;
            const wrap = document.createElement("div");
            wrap.className = "w-full h-full flex items-center justify-center pointer-events-none";
            wrap.innerHTML = PIECE_SVGS[key] || "";
            btn.appendChild(wrap);
          }

          btn.addEventListener("click", () => handleSquareTap(sq));
          gridEl.appendChild(btn);
        }
      }

      renderGeometryOverlaySvg();
      if (focusedSquare) gridEl.querySelector('[data-square="' + focusedSquare + '"]')?.focus({ preventScroll: true });
      renderBoardCaption();
    }

    function squareCenterCoords(sq) {
      const { file, rank } = sqToCoords(sq);
      const col = currentOrientation === "w" ? file : 7 - file;
      const row = currentOrientation === "w" ? 7 - rank : rank;
      return { x: col * 12.5 + 6.25, y: row * 12.5 + 6.25 };
    }

    function renderGeometryOverlaySvg() {
      renderTeachingOverlay();
    }

    function handleSquareTap(sq) { handleDraftSquare(sq); }

function handleVerdictClick(verdict) {
      if(isRevealed || isFlashLocked() || demoState)return;
      selectedVerdict=verdict;changeDraft();
    }

function evaluateAndReveal(sq, verdict) {
      if (isRevealed || isFlashLocked()) return;
      clearFlashTimers();
      isRevealed = true;
      const elapsedMs = Math.max(150, (draftChangedAt || Date.now()) - flashStartTime);
      const squareMatched = currentExercise.responseType === 'select_set'
        ? setSelections.size === currentExercise.correctSquares.length && currentExercise.correctSquares.every(square => setSelections.has(square))
        : currentExercise.correctSquares.includes(sq) && (!currentExercise.traceSteps || currentExercise.traceSteps.every((step,i) => step.squares.includes(traceSelections[i])));
      const verdictMatched = currentExercise.responseType === "verdict_and_square"
        ? verdict === currentExercise.correctOption
        : true;
      const correct = squareMatched && verdictMatched;

      playTone(correct ? "correct" : "wrong");

      let feedbackTitle = correct ? "✓ Spot on — exact geometry!" : `✕ Missed connection (Target: ${currentExercise.correctSquares.join(" or ")})`;
      if (!correct && currentExercise.responseType === "verdict_and_square") {
        if (!verdictMatched && squareMatched) {
          feedbackTitle = currentExercise.isTruePattern
            ? "✕ False negative — that pattern is real!"
            : "✕ Caught by the illusion — check the blocker/defender!";
        } else if (verdictMatched && !squareMatched) {
          feedbackTitle = `✕ Right verdict, but tap ${currentExercise.correctSquares.join(" or ")}`;
        }
      }

      sessionResults.push({ correct, responseTimeMs: elapsedMs, decisionTimeMs:decisionLatency(elapsedMs), assisted:currentHintUsed || currentReflashUsed || learningSessionKind === "guided" });
      if (flashPhase !== "invalidated") {
        appData.attempts.push({
          exerciseId: currentExercise.id,
          mode: currentExercise.mode,
          category: currentExercise.category,
          isTruePattern: currentExercise.isTruePattern === true,
          correct,
          selectedSquare: sq,
          selectedVerdict: verdict,
          responseTimeMs: elapsedMs,
          timestamp: Date.now()
        });
        annotateLearningAttempt(diagnoseError(currentExercise, squareMatched, verdictMatched));
        saveLocalState();
      }

      document.getElementById("preAnswerBar").classList.add("hidden");
      document.getElementById('btnSubmitSet').classList.add('hidden');
      document.getElementById("hintBox").classList.add("hidden");

      const fp = document.getElementById("feedbackPanel");
      fp.classList.remove("hidden");
      fp.classList.add("flex");
      fp.className = `flex flex-col gap-2.5 p-3 rounded-xl border ${correct ? "bg-emerald-500/15 border-emerald-400/50" : "bg-red-500/15 border-red-400/50"}`;

      document.getElementById("feedbackTitle").textContent = feedbackTitle;
      document.getElementById("feedbackTitle").className = `text-sm font-extrabold ${correct ? "text-emerald-300" : "text-red-300"}`;
      document.getElementById("feedbackExplanation").textContent = currentExercise.explanation;

      const btnBA = document.getElementById("btnToggleBeforeAfter");
      if (currentExercise.afterFen) {
        viewingAfterFen = true;
        btnBA.classList.remove("hidden");
        btnBA.textContent = "⇄ Show Before Move";
      } else {
        btnBA.classList.add("hidden");
      }

      renderBoardAndOverlay();
      renderLessonState();
      renderUnderstanding();
      renderStatsUI();
      announce(correct?'Correct. See the connection.':'See the connection on the board.');
      document.getElementById('feedbackTitle').focus({ preventScroll: true });
    }

    // =========================================================================
    // 7. PGN / FEN / ONLINE IMPORTERS
    // =========================================================================
    const SAMPLE_TACTICAL_PGN = `[Event "Club Rapid Vision Drill"]
[White "VisionPlayer"]
[Black "Opponent"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 4. Ng5 Bc5 5. d4 exd4 6. e5 Nxe5 7. Qe2 d6 1-0`;

    function showGamesStatus(msg, isError = false) {
      const el = document.getElementById("gamesStatusBanner");
      el.classList.remove("hidden");
      el.className = `p-3 rounded-xl border text-xs font-medium ${isError ? "bg-red-500/15 border-red-400/40 text-red-200" : "bg-sky-500/15 border-sky-400/40 text-sky-200"}`;
      el.textContent = msg;
    }

    function parsePgnAndBuildDrills(rawPgn) {
      const trimmed = rawPgn.trim();
      if (trimmed.length > 1000000) {
        showGamesStatus('This PGN is too large. Import a file under 1 MB.', true);
        return;
      }
      if (!trimmed) {
        showGamesStatus("Please paste a PGN or load the sample PGN first.", true);
        return;
      }
      const chunks = trimmed.split(/(?=^\[Event\s+)/m).map((c) => c.trim()).filter(Boolean);
      const drills = [];
      let validGames = 0;

      for (const chunk of chunks) {
        try {
          const replay = new Chess();
          replay.loadPgn(chunk, { strict:false });
          const history = replay.history({ verbose:true });
          if (!history.length) continue;
          validGames++;
          for (let ply = 6; ply <= Math.min(history.length, 1000) && drills.length < 8; ply++) {
            const exercise = makeImportedExercise(history[ply - 1].after, 'pgn-' + validGames + '-ply' + ply, false);
            if (exercise && !drills.some(d => d.fen === exercise.fen)) drills.push(exercise);
          }
        } catch (error) { /* Keep scanning other complete games; never score partial invalid PGNs. */ }
      }

      if (validGames === 0 || drills.length === 0) {
        showGamesStatus("Could not extract valid tactical snapshots from that PGN. Check move notation and try again.", true);
        return;
      }

      appData.gamesCount += validGames;
      saveLocalState();
      showGamesStatus(`Imported ${validGames} game(s) and extracted ${drills.length} custom geometry drill(s)! Launching session...`);
      startSprintSession(drills);
    }

    // =========================================================================
    // 8. WIRE ALL EVENT LISTENERS ON LOAD
    // =========================================================================
    window.addEventListener("DOMContentLoaded", () => {
      loadLocalState();
      initExperience();
      initLearning();
      initRecognition();
      initIntermediateTraining();
      initGeometryCourse();
      document.getElementById("textareaPgn").value = SAMPLE_TACTICAL_PGN;
      document.getElementById("chkUntimedMode").checked = appData.untimedMode;
      renderStatsUI();

      // Sound Toggle
      document.getElementById("btnSoundToggle").addEventListener("click", () => {
        soundMuted = !soundMuted;
        updateSoundButton();
        if (!soundMuted) playTone("tap");
      });

      // Bottom Navigation
      document.getElementById("navBtnToday").addEventListener("click", () => switchTab("today"));
      document.getElementById("navBtnTrain").addEventListener("click", () => {
        if (sessionQueue.length === 0) {
          startSprintSession(buildAdaptiveQueue(null, 8));
        } else {
          switchTab("train");
        }
      });
      document.getElementById("navBtnGames").addEventListener("click", () => switchTab("games"));
      document.getElementById("navBtnProgress").addEventListener("click", () => switchTab("progress"));

      // Today View Controls
      document.getElementById("chkUntimedMode").addEventListener("change", (e) => {
        appData.untimedMode = e.target.checked;
        updateUntimedSession();
        saveLocalState();
      });

      document.getElementById("btnStartDailySprint").addEventListener("click", () => {
        playTone("tap");
        startSprintSession(buildAdaptiveQueue(null, 8));
      });
      document.getElementById("btnModeXray").addEventListener("click", () => {
        playTone("tap");
        startSprintSession(buildAdaptiveQueue("geometry_xray", 6));
      });
      document.getElementById("btnModeFlash").addEventListener("click", () => {
        playTone("tap");
        startSprintSession(buildAdaptiveQueue("flash_vision", 4));
      });
      document.getElementById("btnModeIllusion").addEventListener("click", () => {
        playTone("tap");
        startSprintSession(buildAdaptiveQueue("pattern_or_illusion", 5));
      });
      document.getElementById("btnModeBeforeAfter").addEventListener("click", () => {
        playTone("tap");
        startSprintSession(buildAdaptiveQueue("before_after", 4));
      });

      // Train View Controls
      document.getElementById("btnFlipBoard").addEventListener("click", () => {
        currentOrientation = currentOrientation === "w" ? "b" : "w";
        renderBoardAndOverlay();
      });

      document.getElementById("btnVerdictReal").addEventListener("click", () => handleVerdictClick("real"));
      document.getElementById("btnVerdictIllusion").addEventListener("click", () => handleVerdictClick("illusion"));

      document.getElementById("btnToggleHint").addEventListener("click", () => {
        if (learningSessionKind === 'assessment') return;
        const hb = document.getElementById("hintBox");
        const isHidden = hb.classList.contains("hidden");
        if (isHidden) {
          currentHintUsed = true;
          hb.classList.remove("hidden");
          document.getElementById("btnToggleHint").textContent = "Hide hint";
        } else {
          hb.classList.add("hidden");
          document.getElementById("btnToggleHint").textContent = "Show geometry hint";
        }
      });

      document.getElementById("btnReflash").addEventListener("click", () => {
        if (learningSessionKind === 'assessment') return;
        if (!isRevealed && currentExercise) {
          currentReflashUsed = true;
          startFlashExposure(2000);
        }
      });

      document.getElementById("btnRestartInvalidFlash").addEventListener("click", () => {
        if (!isRevealed && currentExercise) {
          startFlashExposure(currentExercise.flashDurationMs || 2300);
        }
      });

      document.getElementById("btnToggleBeforeAfter").addEventListener("click", () => {
        viewingAfterFen = !viewingAfterFen;
        document.getElementById("btnToggleBeforeAfter").textContent = viewingAfterFen
          ? "⇄ Show Before Move"
          : `⇄ Show After ${currentExercise.moveSan}`;
        renderBoardAndOverlay();
        renderLessonState();
      });

      document.getElementById("btnNextExercise").addEventListener("click", () => {
        if (document.getElementById('btnNextExercise').disabled) return;
        if (learningSessionKind === 'worked-example') { sessionQueue = []; openLesson(currentExercise.lessonId); return; }
        playTone("tap");
        if (currentDrillIndex + 1 < sessionQueue.length) {
          currentDrillIndex++;
          loadCurrentDrill();
        } else {
          // Show Sprint Summary
          document.getElementById("drillActiveContainer").classList.add("hidden");
          const sumCard = document.getElementById("sprintSummaryCard");
          sumCard.classList.remove("hidden");
          sumCard.classList.add("flex");
          const corr = sessionResults.filter((r) => r.correct).length;
          const acc = Math.round((corr / sessionQueue.length) * 100);
          const avgMs = Math.round(sessionResults.reduce((s, r) => s + r.responseTimeMs, 0) / sessionResults.length);
          document.getElementById("summaryAccuracy").textContent = `${corr} / ${sessionQueue.length} (${acc}%)`;
          document.getElementById("summarySpeed").textContent = `${(avgMs / 1000).toFixed(1)}s`;
          renderStatsUI();
          renderSummary();
          sessionQueue = [];
          document.getElementById('summaryHeading').focus();
        }
      });

      document.getElementById("btnSprintAgain").addEventListener("click", () => {
        playTone("tap");
        startSprintSession(buildAdaptiveQueue(null, 8));
      });
      document.getElementById("btnBackToToday").addEventListener("click", () => switchTab("today"));

      // Visibility Change Listener (Pauses/Invalidates Flash Vision when app goes to background)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') invalidateFlash();
      });

      // Games View Controls
      document.getElementById("btnLoadSamplePgn").addEventListener("click", () => {
        document.getElementById("textareaPgn").value = SAMPLE_TACTICAL_PGN;
        showGamesStatus("Sample game ready. Tap Create vision drills to start.");
      });

      document.getElementById("inputPgnFile").addEventListener("change", async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (file.size > 1000000) return showGamesStatus('Choose a PGN file under 1 MB.', true);
        try {
          const text = await readLocalFile(file);
          document.getElementById('textareaPgn').value = text;
          showGamesStatus('Loaded ' + file.name + '. Ready to create drills.');
        } catch (error) { showGamesStatus('Could not read this file. Try pasting the PGN instead.', true); }
      });

      document.getElementById("btnAnalyzePgn").addEventListener("click", () => {
        parsePgnAndBuildDrills(document.getElementById("textareaPgn").value);
      });

      document.getElementById("btnDrillFen").addEventListener("click", () => {
        const fen = document.getElementById("inputSingleFen").value.trim();
        if (!fen) {
          showGamesStatus("Paste a FEN string first.", true);
          return;
        }
        try {
          new Chess(fen);
          const ex = makeImportedExercise(fen, "custom-fen", true);
          if (!ex) {
            showGamesStatus("Valid FEN, but no immediate hanging piece, pin, or convergence motif was detected in that position.", true);
            return;
          }
          startSprintSession([ex]);
        } catch (err) {
          showGamesStatus("Invalid FEN string. Check rank counts and piece letters.", true);
        }
      });

      document.getElementById("btnImportLichess").addEventListener("click", async () => {
        const user = document.getElementById("inputLichessUser").value.trim();
        if (!user) {
          showGamesStatus("Enter a Lichess username first.", true);
          return;
        }
        setImportBusy("btnImportLichess", true);
        showGamesStatus(`Fetching public games for ${user} from Lichess...`);
        try {
          const res = await fetchWithTimeout(`https://lichess.org/api/games/user/${encodeURIComponent(user)}?max=5&clocks=false&evals=false`, {
            headers: { Accept: "application/x-chess-pgn, text/plain" }
          });
          if (!res.ok) {
            showGamesStatus(`Lichess returned status ${res.status}. Paste a PGN above to continue offline.`, true);
            return;
          }
          const pgn = await res.text();
          document.getElementById("textareaPgn").value = pgn;
          parsePgnAndBuildDrills(pgn);
        } catch (err) {
          showGamesStatus("Could not download these games. Check your connection or paste a PGN above.", true);
        } finally { setImportBusy("btnImportLichess", false); }
      });

      document.getElementById("btnImportChessCom").addEventListener("click", async () => {
        const user = document.getElementById("inputChessComUser").value.trim().toLowerCase();
        if (!user) {
          showGamesStatus("Enter a Chess.com username first.", true);
          return;
        }
        setImportBusy("btnImportChessCom", true);
        showGamesStatus(`Checking Chess.com public archives for ${user}...`);
        try {
          const arcRes = await fetchWithTimeout(`https://api.chess.com/pub/player/${encodeURIComponent(user)}/games/archives`);
          if (!arcRes.ok) {
            showGamesStatus(`Chess.com returned status ${arcRes.status}. Paste a PGN above to continue offline.`, true);
            return;
          }
          const data = await arcRes.json();
          const latest = data.archives && data.archives[data.archives.length - 1];
          if (!latest) {
            showGamesStatus("No public archives found for this username.", true);
            return;
          }
          const pgnRes = await fetchWithTimeout(`https://${latest.replace(/^https?:\/\//, '')}/pgn`);
          if (!pgnRes.ok) throw new Error("Game archive unavailable");
          const pgn = await pgnRes.text();
          document.getElementById("textareaPgn").value = pgn;
          parsePgnAndBuildDrills(pgn);
        } catch (err) {
          showGamesStatus("Could not download these games. Check your connection or paste a PGN above.", true);
        } finally { setImportBusy("btnImportChessCom", false); }
      });

      // Progress & Backup Controls
      function showBackupNotice(msg, isError = false) {
        const b = document.getElementById("backupStatusBanner");
        b.classList.remove("hidden");
        b.className = `p-2.5 rounded-xl border text-xs font-medium ${isError ? "bg-red-500/15 border-red-400/40 text-red-200" : "bg-emerald-500/15 border-emerald-400/40 text-emerald-200"}`;
        b.textContent = msg;
      }

      function getBackupPayloadString() {
        return JSON.stringify({
          schemaVersion: 1,
          app: "chess-vision",
          exportedAt: new Date().toISOString(),
          attempts: appData.attempts,
          gamesCount: appData.gamesCount,
          untimedMode: appData.untimedMode,
          learning: appData.learning
        }, null, 2);
      }

      document.getElementById("btnExportBackup").addEventListener("click", () => {
        const json = getBackupPayloadString();
        document.getElementById("textareaBackupJson").value = json;
        document.getElementById("backupJsonDrawer").classList.remove("hidden");
        document.getElementById("backupJsonDrawer").classList.add("flex");
        try {
          const blob = new Blob([json], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `chess-vision-backup-${new Date().toISOString().slice(0, 10)}.json`;
          a.click();
          URL.revokeObjectURL(url);
        } catch (e) {
          // If download is blocked in iframe, user still sees the JSON drawer
        }
        showBackupNotice("Backup ready below. If no download appeared, copy the JSON and save it as a .json file.");
      });

      document.getElementById("btnTogglePasteBackup").addEventListener("click", () => {
        const dr = document.getElementById("backupJsonDrawer");
        const isHidden = dr.classList.contains("hidden");
        if (isHidden) {
          document.getElementById("textareaBackupJson").value = getBackupPayloadString();
          dr.classList.remove("hidden");
          dr.classList.add("flex");
        } else {
          dr.classList.add("hidden");
          dr.classList.remove("flex");
        }
      });

      document.getElementById("btnCopyBackupJson").addEventListener("click", () => {
        const ta = document.getElementById("textareaBackupJson");
        ta.select();
        try {
          const copied = document.execCommand("copy");
          showBackupNotice(copied ? "Copied backup JSON to clipboard." : "Select and copy the JSON text manually.");
        } catch (e) {
          showBackupNotice("Select and copy the JSON text manually.");
        }
      });

      function restoreFromRawJson(raw) {
        try {
          const parsed = JSON.parse(raw);
          if (!isValidBackup(parsed)) {
            showBackupNotice("Invalid backup format: expected Chess Vision v1 JSON.", true);
            return;
          }
          appData.attempts = parsed.attempts;
          appData.gamesCount = parsed.gamesCount || 0;
          appData.untimedMode = Boolean(parsed.untimedMode);
          appData.learning = normalizedLearning(parsed.learning);
          saveLocalState();
          document.getElementById('chkUntimedMode').checked = appData.untimedMode;
          updateUntimedSession();
          renderStatsUI();
          showBackupNotice(`Restored ${appData.attempts.length} drill attempt(s) successfully!`);
        } catch (e) {
          showBackupNotice("Could not parse JSON backup.", true);
        }
      }

      document.getElementById("btnApplyPastedBackup").addEventListener("click", () => {
        restoreFromRawJson(document.getElementById("textareaBackupJson").value);
      });

      document.getElementById("inputRestoreFile").addEventListener("change", async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (file.size > 5000000) return showBackupNotice('Choose a backup under 5 MB.', true);
        try { restoreFromRawJson(await readLocalFile(file)); }
        catch (error) { showBackupNotice('Could not read the backup file. Try pasting its JSON instead.', true); }
      });

      document.getElementById("btnResetProgress").addEventListener("click", () => {
        if (!window.confirm('Reset all training history on this device? Export a backup first if you want to keep it.')) return;
        appData.attempts = [];
        appData.gamesCount = 0;
        appData.learning = normalizedLearning(null);
        saveLocalState();
        renderStatsUI();
        showBackupNotice("Local training stats reset to zero.");
      });
    });

