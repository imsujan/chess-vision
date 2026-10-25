/* Chess Vision v2.0 — Custom PGN & Lichess CC0 Ingestion Engine
   Parses PGN files with custom tags, commentary, variations, and FEN setup. */

(function (exports) {
  'use strict';

  function parsePgnFileContent(pgnText) {
    if (!pgnText || typeof pgnText !== 'string') return [];
    const games = [];
    const rawGames = pgnText.split(/\[Event\s+/i).filter(Boolean);

    rawGames.forEach((raw, idx) => {
      const fullPgn = '[Event ' + raw;
      const headers = {};
      const headerMatches = fullPgn.matchAll(/\[(\w+)\s+"([^"]*)"\]/g);
      for (const m of headerMatches) {
        headers[m[1]] = m[2];
      }

      // Extract move text (strip headers)
      const moveText = fullPgn.replace(/\[[^\]]+\]/g, '').replace(/\r?\n/g, ' ').trim();
      const fen = headers.FEN || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
      const category = headers.PuzzleCategory || headers.Event || 'Custom PGN';
      const targetSquare = headers.TargetSquare || null;

      if (moveText || headers.FEN) {
        games.push({
          id: 'user-pgn-' + (idx + 1),
          event: headers.Event || 'User Import',
          site: headers.Site || '',
          date: headers.Date || '',
          white: headers.White || 'White',
          black: headers.Black || 'Black',
          result: headers.Result || '*',
          fen,
          category,
          targetSquare,
          moveText,
          annotator: headers.Annotator || ''
        });
      }
    });

    return games;
  }

  function validateImportedGame(game) {
    if (typeof Chess === 'undefined') return false;
    try {
      const chess = new Chess(game.fen);
      return chess.board() !== null;
    } catch (e) {
      return false;
    }
  }

  const api = {
    parsePgnFileContent,
    validateImportedGame
  };

  if (typeof exports !== 'undefined') exports.PgnImporterEngine = api;
  if (typeof window !== 'undefined') window.ChessPgnImporterEngine = api;
  if (typeof globalThis !== 'undefined') globalThis.ChessPgnImporterEngine = api;

})(typeof exports !== 'undefined' ? exports : (typeof window !== 'undefined' ? window : globalThis));
