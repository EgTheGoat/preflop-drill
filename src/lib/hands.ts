// 169ハンド表記（"AA","AKs","AKo"）の生成・正規化・13x13グリッド座標への対応。
//
// グリッド規約（GTOツールの定番）:
//   - 行 row = 高い方のランクのインデックス、列 col = 低い方のランクのインデックス
//   - row < col → スーテッド（右上三角）
//   - row > col → オフスート（左下三角）
//   - row === col → ペア（対角）
// ランクは強い順に A,K,Q,...,2 を 0..12 で並べる。

/** 強い順のランク文字。インデックスが小さいほど強い。 */
export const RANKS = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"] as const;
export type Rank = (typeof RANKS)[number];

/** ランク文字 → 強さインデックス（0=A が最強）。 */
export const RANK_INDEX: Record<string, number> = Object.fromEntries(
  RANKS.map((r, i) => [r, i]),
);

/** 169ハンドの表記タイプ。 */
export type HandType = "pair" | "suited" | "offsuit";

/** グリッド上の1セル。 */
export interface HandCell {
  hand: string; // "AA" | "AKs" | "AKo"
  type: HandType;
  row: number; // 0..12
  col: number; // 0..12
}

/**
 * 2つのランク文字から正規化された169ハンド表記を作る。
 * @param suited true=スーテッド, false=オフスート。ペア（同ランク）の場合は無視される。
 */
export function makeHand(r1: string, r2: string, suited: boolean): string {
  const i1 = RANK_INDEX[r1];
  const i2 = RANK_INDEX[r2];
  if (i1 === undefined || i2 === undefined) {
    throw new Error(`不正なランク: ${r1}, ${r2}`);
  }
  if (i1 === i2) return `${r1}${r2}`; // ペア
  // 強い方を先に置く
  const [hi, lo] = i1 < i2 ? [r1, r2] : [r2, r1];
  return `${hi}${lo}${suited ? "s" : "o"}`;
}

/** ハンド表記の種別を返す。 */
export function handType(hand: string): HandType {
  if (hand.length === 2) return "pair";
  return hand.endsWith("s") ? "suited" : "offsuit";
}

/** 13x13 全169セルを行優先で返す。 */
export function allHandCells(): HandCell[] {
  const cells: HandCell[] = [];
  for (let row = 0; row < RANKS.length; row++) {
    for (let col = 0; col < RANKS.length; col++) {
      const hi = RANKS[Math.min(row, col)];
      const lo = RANKS[Math.max(row, col)];
      let hand: string;
      let type: HandType;
      if (row === col) {
        hand = `${RANKS[row]}${RANKS[row]}`;
        type = "pair";
      } else if (row < col) {
        hand = `${hi}${lo}s`;
        type = "suited";
      } else {
        hand = `${hi}${lo}o`;
        type = "offsuit";
      }
      cells.push({ hand, type, row, col });
    }
  }
  return cells;
}

/** 全169ハンド表記の配列。 */
export function allHands(): string[] {
  return allHandCells().map((c) => c.hand);
}

/** ハンド表記 → グリッド座標 [row, col]。 */
export function handToCoord(hand: string): [number, number] {
  const r1 = hand[0];
  const r2 = hand[1];
  const i1 = RANK_INDEX[r1];
  const i2 = RANK_INDEX[r2];
  if (i1 === undefined || i2 === undefined) {
    throw new Error(`不正なハンド表記: ${hand}`);
  }
  if (i1 === i2) return [i1, i1]; // ペア（対角）
  const type = handType(hand);
  // 強い方が小さいインデックス。スーテッドは右上(row<col)、オフは左下(row>col)。
  const hiIdx = Math.min(i1, i2);
  const loIdx = Math.max(i1, i2);
  return type === "suited" ? [hiIdx, loIdx] : [loIdx, hiIdx];
}
