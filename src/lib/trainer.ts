// 出題ロジック。レンジとハンドを抽選し、1問分のデータを生成する。

import type { Card } from "./cards";
import { dealCardsForHand } from "./cards";
import { allHands } from "./hands";
import type { Range } from "../types/range";

export interface Question {
  range: Range;
  hand: string;
  cards: [Card, Card];
}

/** レンジ内で「fold 以外の頻度が1つでもある」ハンドの一覧。 */
function actionHands(range: Range): string[] {
  return Object.entries(range.hands)
    .filter(([, strat]) =>
      Object.entries(strat).some(([action, freq]) => action !== "fold" && (freq ?? 0) > 0),
    )
    .map(([hand]) => hand);
}

/** fold 100%（=レンジ外 or 明示 fold）のハンド一覧。 */
function foldHands(range: Range): string[] {
  const acting = new Set(actionHands(range));
  return allHands().filter((h) => !acting.has(h));
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 1問生成する。
 * @param ranges 出題対象のレンジ集合（複数なら毎問ランダムに1つ選ぶ）
 * @param actingRatio fold 以外のハンドを出す確率。残りは fold ハンド（降りる判断の練習）。
 */
export function generateQuestion(ranges: Range[], actingRatio = 0.65): Question {
  if (ranges.length === 0) throw new Error("レンジが空です");
  const range = pick(ranges);

  const acting = actionHands(range);
  const folds = foldHands(range);

  let hand: string;
  if (acting.length > 0 && (folds.length === 0 || Math.random() < actingRatio)) {
    hand = pick(acting);
  } else if (folds.length > 0) {
    hand = pick(folds);
  } else {
    hand = pick(allHands());
  }

  return { range, hand, cards: dealCardsForHand(hand) };
}
