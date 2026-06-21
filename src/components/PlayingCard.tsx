// 1枚のトランプ表示。白いカードに 4色デッキ（♠黒 / ♥赤 / ♦青 / ♣緑）で描く。

import { SUIT_SYMBOL, type Card } from "../lib/cards";

export function PlayingCard({ card }: { card: Card }) {
  return (
    <div className={`card suit-${card.suit}`}>
      <span className="card-rank">{card.rank}</span>
      <span className="card-suit">{SUIT_SYMBOL[card.suit]}</span>
    </div>
  );
}
