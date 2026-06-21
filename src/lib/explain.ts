// ヨコサワ系レンジの「なぜそのアクションか」を、ティア理論に基づいて短く説明する。
//
// 共通ルール:
//   - オープン: 後ろの人数で決まる「下限ティア」以上の強さなら開ける。
//   - vsレイズ: 相手のオープン下限を基準に、1段強い=コール / 2段以上強い=3bet。

import { YOKOSAWA_TIER_OF, type YokosawaTier } from "../data/yokosawaChart";
import { OPEN_LOWER_BOUND, TIER_RANK } from "../data/yokosawaVs";
import { POSITION_LABEL, type Position, type Range } from "../types/range";

const TIER_JP: Record<YokosawaTier, string> = {
  navy: "ネイビー",
  red: "赤",
  orange: "オレンジ",
  green: "緑",
  lblue: "水色",
  white: "白",
  purple: "紫",
  pink: "ピンク",
  fold: "灰（圏外）",
};

/**
 * ヨコサワ系の出題に対する解説文を生成する。
 * raiser は vsレイズ時のレイザー席（オープン時は null）。
 */
export function explainYokosawa(
  range: Range,
  hand: string,
  raiser: Position | null,
  playersBehind: number,
): string {
  const tier = YOKOSAWA_TIER_OF[hand] ?? "fold";
  const tierJp = TIER_JP[tier];

  // オープン（自分が最初に仕掛ける）。
  if (raiser === null) {
    const bound = OPEN_LOWER_BOUND[range.position];
    if (!bound) return `${hand} は${tierJp}帯。`;
    const open = TIER_RANK[tier] <= TIER_RANK[bound];
    return (
      `${POSITION_LABEL[range.position]} は後ろ${playersBehind}人で、オープン下限は${TIER_JP[bound]}帯。` +
      `${hand} は${tierJp}帯なので${open ? "下限以上 → レイズ" : "下限より弱い → フォールド"}。`
    );
  }

  // vsレイズ（相手のオープンに直面）。
  const bound = OPEN_LOWER_BOUND[raiser];
  if (!bound) return `${hand} は${tierJp}帯。`;
  const steps = TIER_RANK[bound] - TIER_RANK[tier]; // 正なら下限より強い
  const verdict =
    steps >= 2
      ? "下限より2段以上強い → 3bet"
      : steps === 1
        ? "下限より1段強い → コール"
        : "下限と同等以下 → フォールド";
  return (
    `${POSITION_LABEL[raiser]} のオープン下限は${TIER_JP[bound]}帯。` +
    `${hand} は${tierJp}帯なので${verdict}。`
  );
}
