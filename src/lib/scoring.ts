// 頻度ベースの採点ロジック。
//
// 方針: ユーザーが選んだアクションの GTO 頻度をそのまま得点(0〜100)にする。
//   例) raise 80% / fold 20% のハンドで raise を選べば 80 点、fold なら 20 点。
// あわせて「最頻アクションかどうか」を簡易の◯×として返し、混合域（拮抗）は許容表示する。

import type { Action, HandStrategy, Range } from "../types/range";

/** レンジから特定ハンドの混合戦略を取得する。未収録ハンドは fold 100% とみなす。 */
export function getStrategy(range: Range, hand: string): HandStrategy {
  const s = range.hands[hand];
  if (s) return s;
  // 未収録 = レンジ外 = fold 100%
  return { fold: 1 };
}

/** 戦略中で最も頻度の高いアクション（同率なら range.actions の順で先勝ち）。 */
export function topAction(range: Range, strategy: HandStrategy): Action {
  let best: Action = range.actions[0];
  let bestFreq = -1;
  for (const action of range.actions) {
    const f = strategy[action] ?? 0;
    if (f > bestFreq) {
      bestFreq = f;
      best = action;
    }
  }
  return best;
}

export interface ScoreResult {
  /** 0〜100。選んだアクションの頻度 ×100。 */
  score: number;
  /** 選んだアクションの頻度（0〜1）。 */
  chosenFreq: number;
  /** このハンドの正解（最頻）アクション。 */
  best: Action;
  /** 簡易◯×。最頻アクション、または混合域で十分な頻度なら正解扱い。 */
  correct: boolean;
  /** 混合域（複数アクションが MIXED_THRESHOLD 以上）かどうか。 */
  mixed: boolean;
}

/** これ以上の頻度を持つアクションが2つ以上あれば「混合域」とみなす閾値。 */
export const MIXED_THRESHOLD = 0.2;

/** 混合域で「正解」と認めるための最低頻度。 */
export const MIXED_ACCEPT_FREQ = 0.2;

/** 1問の採点。 */
export function scoreAnswer(range: Range, hand: string, chosen: Action): ScoreResult {
  const strategy = getStrategy(range, hand);
  const chosenFreq = strategy[chosen] ?? 0;
  const best = topAction(range, strategy);

  const significant = range.actions.filter((a) => (strategy[a] ?? 0) >= MIXED_THRESHOLD);
  const mixed = significant.length >= 2;

  // 最頻アクションを選べば正解。混合域なら一定頻度以上のアクションも正解とみなす。
  const correct = chosen === best || (mixed && chosenFreq >= MIXED_ACCEPT_FREQ);

  return {
    score: Math.round(chosenFreq * 100),
    chosenFreq,
    best,
    correct,
    mixed,
  };
}
