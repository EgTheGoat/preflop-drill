// ヨコサワ式「vsレイズ」レンジ。
// ルール: 相手（レイザー）のオープン下限ティアを基準に、
//   - 下限より1段強い色 → コール
//   - 下限より2段以上強い色 → 3bet
//   - それ以外 → フォールド
// ハンドのティアは元画像準拠（yokosawaChart）の色を使う。

import { POSITION_LABEL, type Position, type Range } from "../types/range";
import { YOKOSAWA_TIER_OF, type YokosawaTier } from "./yokosawaChart";
import { allHands } from "../lib/hands";

// 色の強さ順（小さいほど強い）。
export const TIER_RANK: Record<YokosawaTier, number> = {
  navy: 0,
  red: 1,
  orange: 2,
  green: 3,
  lblue: 4,
  white: 5,
  purple: 6,
  pink: 7,
  fold: 8,
};

// 各ポジションのオープン下限ティア（9-max の「後ろの人数」ロジック準拠）。
// 後ろ: UTG8 UTG1:7 UTG2:6 LJ5 HJ4 CO3 BTN2 SB1 → そのとき開ける最も弱いティア。
// オープンの下限であり、同時に「そのレイザーに対するディフェンスの基準」でもある。
export const OPEN_LOWER_BOUND: Partial<Record<Position, YokosawaTier>> = {
  UTG: "orange",
  UTG1: "green",
  UTG2: "green",
  LJ: "lblue",
  HJ: "lblue",
  CO: "white",
  BTN: "purple",
  SB: "purple",
};

// レイザー → そのレイズに対応しうる後ろの席（ディフェンダー）。
const DEFENDERS: Partial<Record<Position, Position[]>> = {
  UTG: ["UTG1", "UTG2", "LJ", "HJ", "CO", "BTN", "SB", "BB"],
  UTG1: ["UTG2", "LJ", "HJ", "CO", "BTN", "SB", "BB"],
  UTG2: ["LJ", "HJ", "CO", "BTN", "SB", "BB"],
  LJ: ["HJ", "CO", "BTN", "SB", "BB"],
  HJ: ["CO", "BTN", "SB", "BB"],
  CO: ["BTN", "SB", "BB"],
  BTN: ["SB", "BB"],
  SB: ["BB"],
};

function buildVsRange(raiser: Position, hero: Position): Range {
  const lbRank = TIER_RANK[OPEN_LOWER_BOUND[raiser]!];
  const hands: Range["hands"] = {};
  for (const h of allHands()) {
    const tier = YOKOSAWA_TIER_OF[h] ?? "fold";
    const steps = lbRank - TIER_RANK[tier]; // 正なら下限より強い
    if (steps >= 2) hands[h] = { raise: 1 };
    else if (steps === 1) hands[h] = { call: 1 };
    // それ以外は fold（収録しない）
  }
  return {
    id: `yokosawa_vs_${raiser}_${hero}`.toLowerCase(),
    label: `${POSITION_LABEL[hero]} vs ${POSITION_LABEL[raiser]} レイズ`,
    format: "ヨコサワレンジ (vsレイズ)",
    position: hero,
    scenario: `vs ${raiser} オープン`,
    actions: ["fold", "call", "raise"],
    hands,
  };
}

export const YOKOSAWA_VS_RANGES: Range[] = (
  Object.entries(DEFENDERS) as [Position, Position[]][]
).flatMap(([raiser, heroes]) => heroes.map((hero) => buildVsRange(raiser, hero)));
