/* Chess Vision v2.0 — The Woodpecker Method Spaced Repetition Engine
   Implements 7-cycle time compression, speedup targets, and error category analytics. */

(function (exports) {
  'use strict';

  // Target duration multipliers for cycles 1 through 7 (relative to Cycle 1)
  const CYCLE_TARGET_MULTIPLIERS = [1.0, 0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625];

  function normalizeWoodpeckerState(state) {
    if (!state || typeof state !== 'object') {
      state = {};
    }
    return {
      version: 1,
      activeSetId: state.activeSetId || null,
      sets: Array.isArray(state.sets) ? state.sets : [],
      history: Array.isArray(state.history) ? state.history : []
    };
  }

  class WoodpeckerSession {
    constructor(setId, puzzleIds, cycle = 1, targetTimeMs = 0) {
      this.setId = setId;
      this.puzzleIds = puzzleIds;
      this.cycle = Math.max(1, Math.min(7, cycle));
      this.targetTimeMs = targetTimeMs;
      this.currentIndex = 0;
      this.startedAt = Date.now();
      this.completedAt = null;
      this.attempts = [];
    }

    currentPuzzleId() {
      return this.puzzleIds[this.currentIndex] || null;
    }

    recordAttempt(puzzleId, correct, elapsedMs, category) {
      this.attempts.push({
        puzzleId,
        correct,
        elapsedMs,
        category,
        timestamp: Date.now()
      });
      this.currentIndex++;
      if (this.currentIndex >= this.puzzleIds.length) {
        this.completedAt = Date.now();
      }
    }

    isComplete() {
      return this.currentIndex >= this.puzzleIds.length;
    }

    getStats() {
      const total = this.attempts.length;
      const correctCount = this.attempts.filter(a => a.correct).length;
      const accuracy = total > 0 ? (correctCount / total) * 100 : 0;
      const totalElapsedMs = this.attempts.reduce((acc, a) => acc + a.elapsedMs, 0);
      const avgMs = total > 0 ? totalElapsedMs / total : 0;

      return {
        cycle: this.cycle,
        totalPuzzles: this.puzzleIds.length,
        completedPuzzles: total,
        correctCount,
        accuracy: Math.round(accuracy * 10) / 10,
        totalTimeMs: totalElapsedMs,
        avgTimePerPuzzleMs: Math.round(avgMs),
        targetTimeMs: this.targetTimeMs
      };
    }
  }

  function calculateNextCycleTargetTime(cycle1TimeMs, nextCycle) {
    const mult = CYCLE_TARGET_MULTIPLIERS[nextCycle - 1] || 0.015625;
    return Math.round(cycle1TimeMs * mult);
  }

  const api = {
    CYCLE_TARGET_MULTIPLIERS,
    normalizeWoodpeckerState,
    WoodpeckerSession,
    calculateNextCycleTargetTime
  };

  if (typeof exports !== 'undefined') {
    exports.WoodpeckerEngine = api;
    exports.ChessWoodpeckerEngine = api;
  }
  if (typeof window !== 'undefined') {
    window.ChessWoodpeckerEngine = api;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.ChessWoodpeckerEngine = api;
  }

})(typeof exports !== 'undefined' ? exports : (typeof window !== 'undefined' ? window : globalThis));
