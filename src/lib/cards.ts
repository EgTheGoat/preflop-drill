// 具体的な2枚のカードを配り、169ハンド表記に変換する。
// 出題時に「A♠ K♦」のように実カードを見せることで臨場感を出す。

import { makeHand, RANKS } from "./hands";

/** スート（表示用記号付き）。 */
export const SUITS = ["s", "h", "d", "c"] as const;
export type Suit = (typeof SUITS)[number];

export const SUIT_SYMBOL: Record<Suit, string> = {
  s: "♠",
  h: "♥",
  d: "♦",
  c: "♣",
};

export const SUIT_COLOR: Record<Suit, string> = {
  s: "#e8eef5", // 黒スートは明色背景の上で白系に
  c: "#e8eef5",
  h: "#ff6b6b",
  d: "#ff6b6b",
};

export interface Card {
  rank: string; // "A".."2"
  suit: Suit;
}

/** ランダムな2枚（重複なし）を配る。 */
export function dealTwoCards(): [Card, Card] {
  const r1 = RANKS[Math.floor(Math.random() * RANKS.length)];
  const s1 = SUITS[Math.floor(Math.random() * SUITS.length)];
  let r2: string;
  let s2: Suit;
  do {
    r2 = RANKS[Math.floor(Math.random() * RANKS.length)];
    s2 = SUITS[Math.floor(Math.random() * SUITS.length)];
  } while (r1 === r2 && s1 === s2);
  return [
    { rank: r1, suit: s1 },
    { rank: r2, suit: s2 },
  ];
}

/** 2枚のカードを169ハンド表記に変換する。 */
export function cardsToHand(a: Card, b: Card): string {
  const suited = a.suit === b.suit;
  return makeHand(a.rank, b.rank, suited);
}

/** 指定の169ハンド表記に一致する具体的な2枚を生成する（出題でハンドを指定したいとき用）。 */
export function dealCardsForHand(hand: string): [Card, Card] {
  const r1 = hand[0];
  const r2 = hand[1];
  const type = hand.length === 2 ? "pair" : hand.endsWith("s") ? "suited" : "offsuit";

  if (type === "pair") {
    // 異なる2スートを選ぶ
    const shuffled = [...SUITS].sort(() => Math.random() - 0.5);
    return [
      { rank: r1, suit: shuffled[0] },
      { rank: r2, suit: shuffled[1] },
    ];
  }
  if (type === "suited") {
    const s = SUITS[Math.floor(Math.random() * SUITS.length)];
    return [
      { rank: r1, suit: s },
      { rank: r2, suit: s },
    ];
  }
  // offsuit: 異なる2スート
  const shuffled = [...SUITS].sort(() => Math.random() - 0.5);
  return [
    { rank: r1, suit: shuffled[0] },
    { rank: r2, suit: shuffled[1] },
  ];
}
