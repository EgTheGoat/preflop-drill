// 世界のヨコサワ考案「トーナメント用」プリフロップ・ハンドレンジ表（© 世界のヨコサワ）。
//
// 表は各ハンドを「後ろの人数」に応じた色（ティア）で分類している。
// ここでは 1ハンド=1ティアのマップとして保持し、ポジション（=後ろの人数）の
// しきい値で各ポジションのオープンレンジを導出する。
//
// 出典: 世界のヨコサワ（YouTube）「初心者向けプリフロップハンドレンジ表」。
// レンジ内容はクレジット表記のうえで参照。商用利用は元考案者の権利に配慮すること。

import { POSITION_LABEL, type Position, type Range } from "../types/range";

export type YTier = "navy" | "red" | "orange" | "green" | "lblue" | "white" | "p2" | "pink";

/** 各ティアに属するハンド（表の色分けを書き起こしたもの）。pink は BB の vs BTN コール専用。 */
export const YOKOSAWA_TIERS: Record<YTier, string[]> = {
  navy: ["AA", "KK", "QQ", "AKs", "AKo"],
  red: ["JJ", "TT", "99", "AQs", "KQs", "ATs", "AQo"],
  orange: ["88", "77", "AJs", "KJs", "QJs", "AJo", "KQo", "KJo", "KTo"],
  green: ["66", "55", "A9s", "A5s", "A4s", "A3s", "A2s", "KTs", "QTs", "JTs", "T9s", "98s", "ATo", "QJo"],
  lblue: ["44", "33", "22", "Q9s", "J9s", "T8s", "A9o"],
  white: [
    "A8s", "A7s", "A6s",
    "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s",
    "Q8s", "Q7s", "Q6s",
    "J8s", "J7s",
    "97s", "87s", "76s", "65s",
    "A8o", "A7o", "K9o", "QTo", "Q9o", "JTo", "J9o", "T9o", "T8o", "97o", "87o",
  ],
  p2: ["Q5s", "Q4s", "Q3s", "Q2s", "J6s", "T7s", "96s", "86s", "75s", "64s", "54s", "A6o", "98o"],
  pink: [
    "J5s", "J4s", "J3s", "J2s",
    "T6s", "T5s", "T4s", "T3s", "T2s",
    "95s", "85s", "74s", "63s", "53s", "43s",
    "K8o", "K7o", "K6o", "K5o", "Q8o", "Q7o", "J8o", "J7o", "T7o",
    "A5o", "A4o", "A3o", "A2o",
  ],
};

/** ティア → そのハンドをオープンしてよい「後ろの人数」の上限。pink はオープン対象外。 */
const TIER_MAX_BEHIND: Record<YTier, number> = {
  navy: 8,
  red: 8,
  orange: 8,
  green: 7,
  lblue: 5,
  white: 3,
  p2: 2,
  pink: -1, // オープンには含めない（BB の vs BTN コール専用）
};

// 9-max での各ポジションの「後ろの人数」。
// 元の表は後ろ最大8人（=9-max の UTG）まで対応するティア設計になっている。
const PLAYERS_BEHIND: Partial<Record<Position, number>> = {
  UTG: 8,
  UTG1: 7,
  UTG2: 6,
  LJ: 5,
  HJ: 4,
  CO: 3,
  BTN: 2,
  SB: 1,
  BB: 0,
};

/** ハンド → ティアの逆引き。 */
const HAND_TIER: Record<string, YTier> = (() => {
  const m: Record<string, YTier> = {};
  for (const tier of Object.keys(YOKOSAWA_TIERS) as YTier[]) {
    for (const hand of YOKOSAWA_TIERS[tier]) m[hand] = tier;
  }
  return m;
})();

/** 指定ポジションでオープン（参加）するハンド一覧を導出する。 */
function openHands(position: Position): string[] {
  const behind = PLAYERS_BEHIND[position]!;
  return Object.entries(HAND_TIER)
    .filter(([, tier]) => TIER_MAX_BEHIND[tier] >= behind)
    .map(([hand]) => hand);
}

function buildRange(position: Position): Range {
  const hands: Record<string, { raise: number }> = {};
  for (const h of openHands(position)) hands[h] = { raise: 1 };
  return {
    id: `yokosawa_tourney_open_${position.toLowerCase()}`,
    label: `ヨコサワ ${POSITION_LABEL[position]} オープン`,
    format: "ヨコサワレンジ (9-max トーナメント)",
    position,
    scenario: "オープン",
    actions: ["fold", "raise"],
    hands,
  };
}

/** 9-max 各席（BB を除く）のヨコサワ・オープンレンジ。 */
export const YOKOSAWA_RANGES: Range[] = (
  ["UTG", "UTG1", "UTG2", "LJ", "HJ", "CO", "BTN", "SB"] as Position[]
).map(buildRange);
