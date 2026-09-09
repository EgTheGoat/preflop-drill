// 練習セッションの状態管理（Zustand）。出題・採点・統計を保持する。
// 練習対象は「モード（ヨコサワ / GTO）」で選ぶ。席（ポジション）は出題ごとにランダム。

import { create } from "zustand";
import type { Action, Range } from "../types/range";
import type { Card } from "../lib/cards";
import { rangesForMode, type Mode } from "../data/ranges";
import type { Position } from "../types/range";
import { generateQuestion, type Question } from "../lib/trainer";
import { scoreAnswer, type ScoreResult } from "../lib/scoring";

export interface HistoryItem {
  hand: string;
  range: Range;
  correct: boolean;
  action: Action;
  cards: [Card, Card];
}

interface HandStat {
  count: number;
  totalScore: number;
}

interface Stats {
  count: number;
  totalScore: number;
  correctCount: number;
  /** ハンド表記 → 集計（苦手ハンド抽出用）。キーは "rangeId|hand"。 */
  byHand: Record<string, HandStat>;
  history: HistoryItem[];
}

const emptyStats = (): Stats => ({ count: 0, totalScore: 0, correctCount: 0, byHand: {}, history: [] });

const DEFAULT_MODE: Mode = "gtowiz_6max";

interface SessionState {
  mode: Mode;
  /** null = 全ポジション。セットされた場合はそのポジションのみ出題。 */
  selectedPositions: Position[] | null;
  question: Question | null;
  lastAnswer: Action | null;
  lastResult: ScoreResult | null;
  stats: Stats;

  setMode: (mode: Mode) => void;
  setPositions: (positions: Position[] | null) => void;
  nextQuestion: () => void;
  answer: (action: Action) => void;
  reset: () => void;
}

function activeRanges(mode: Mode, positions: Position[] | null) {
  const all = rangesForMode(mode);
  if (!positions || positions.length === 0) return all;
  return all.filter((r) => positions.includes(r.position));
}

export const useSession = create<SessionState>((set, get) => ({
  mode: DEFAULT_MODE,
  selectedPositions: null,
  question: null,
  lastAnswer: null,
  lastResult: null,
  stats: emptyStats(),

  setMode: (mode) => {
    set({ mode, selectedPositions: null, stats: emptyStats(), lastAnswer: null, lastResult: null });
    set({ question: generateQuestion(activeRanges(mode, null)) });
  },

  setPositions: (positions) => {
    const { mode } = get();
    const pos = positions && positions.length > 0 ? positions : null;
    set({ selectedPositions: pos, stats: emptyStats(), lastAnswer: null, lastResult: null });
    set({ question: generateQuestion(activeRanges(mode, pos)) });
  },

  nextQuestion: () => {
    const { mode, selectedPositions } = get();
    set({
      question: generateQuestion(activeRanges(mode, selectedPositions)),
      lastAnswer: null,
      lastResult: null,
    });
  },

  answer: (action) => {
    const { question, lastResult, stats } = get();
    if (!question || lastResult) return; // 未出題 or 既に回答済みなら無視

    const result = scoreAnswer(question.range, question.hand, action);
    const key = `${question.range.id}|${question.hand}`;
    const prev = stats.byHand[key] ?? { count: 0, totalScore: 0 };

    set({
      lastAnswer: action,
      lastResult: result,
      stats: {
        count: stats.count + 1,
        totalScore: stats.totalScore + result.score,
        correctCount: stats.correctCount + (result.correct ? 1 : 0),
        byHand: {
          ...stats.byHand,
          [key]: { count: prev.count + 1, totalScore: prev.totalScore + result.score },
        },
        history: [{ hand: question.hand, range: question.range, correct: result.correct, action, cards: question.cards }, ...stats.history].slice(0, 50),
      },
    });
  },

  reset: () => {
    const { mode, selectedPositions } = get();
    set({ stats: emptyStats(), lastAnswer: null, lastResult: null });
    set({ question: generateQuestion(activeRanges(mode, selectedPositions)) });
  },
}));
