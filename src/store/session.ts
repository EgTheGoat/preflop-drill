// 練習セッションの状態管理（Zustand）。出題・採点・統計を保持する。
// 練習対象は「モード（ヨコサワ / GTO）」で選ぶ。席（ポジション）は出題ごとにランダム。

import { create } from "zustand";
import type { Action, Range } from "../types/range";
import type { Card } from "../lib/cards";
import { rangesForMode, type Mode } from "../data/ranges";
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

const DEFAULT_MODE: Mode = "gto_9max";

interface SessionState {
  /** 練習モード（流派）。 */
  mode: Mode;
  question: Question | null;
  lastAnswer: Action | null;
  lastResult: ScoreResult | null;
  stats: Stats;

  setMode: (mode: Mode) => void;
  nextQuestion: () => void;
  answer: (action: Action) => void;
  reset: () => void;
}

export const useSession = create<SessionState>((set, get) => ({
  mode: DEFAULT_MODE,
  question: null,
  lastAnswer: null,
  lastResult: null,
  stats: emptyStats(),

  setMode: (mode) => {
    // モードを変えたら成績をリセットして即出題。
    set({ mode, stats: emptyStats(), lastAnswer: null, lastResult: null });
    set({ question: generateQuestion(rangesForMode(mode)) });
  },

  nextQuestion: () => {
    set({
      question: generateQuestion(rangesForMode(get().mode)),
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
    set({ stats: emptyStats(), lastAnswer: null, lastResult: null });
    set({ question: generateQuestion(rangesForMode(get().mode)) });
  },
}));
