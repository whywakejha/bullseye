import { create } from 'zustand'

const useGameState = create((set, get) => ({
  score: 0,
  throws: 0,
  lastResult: null, // 'score' | 'miss' | null
  isThrowing: false,
  ballKey: 0, // increment to reset ball

  throwBall: () =>
    set((s) => ({
      throws: s.throws + 1,
      isThrowing: true,
      lastResult: null,
    })),

  scored: () =>
    set((s) => ({
      score: s.score + 1,
      lastResult: 'score',
      isThrowing: false,
    })),

  missed: () =>
    set({ lastResult: 'miss', isThrowing: false }),

  resetBall: () =>
    set((s) => ({
      ballKey: s.ballKey + 1,
      isThrowing: false,
      lastResult: null,
    })),

  reset: () =>
    set({ score: 0, throws: 0, lastResult: null, isThrowing: false, ballKey: 0 }),
}))

export default useGameState
