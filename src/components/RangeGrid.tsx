// 13x13 ハンドグリッド。
// 通常(GTO)はアクション混合頻度のヒートマップ。tierColored 時はヨコサワ表のティア配色。

import { allHandCells } from "../lib/hands";
import { getStrategy } from "../lib/scoring";
import { ACTION_COLORS, type Range } from "../types/range";
import { yokosawaColor } from "../data/yokosawaChart";

interface Props {
  range: Range;
  highlightHand?: string | null;
  /** ヨコサワ表のティア配色で塗る（元画像準拠）。 */
  tierColored?: boolean;
}

/** 親レンジから残ったが fold するハンドの色（vs 3bet/4bet スポット用）。 */
const FOLD_IN_RANGE_COLOR = "#3D7DB8";

/** 戦略を「左から行動、右に fold」の横グラデーション background にする。 */
function cellBackground(range: Range, hand: string): string {
  const inRange = hand in range.hands;
  // range.hands に存在しないハンド（親レンジ外）→ 黒一色
  const foldColor = inRange ? FOLD_IN_RANGE_COLOR : ACTION_COLORS.fold;

  const strat = getStrategy(range, hand);
  const stops: string[] = [];
  let acc = 0;
  const ordered = [...range.actions].sort((a, b) => (a === "fold" ? 1 : b === "fold" ? -1 : 0));
  for (const action of ordered) {
    const freq = strat[action] ?? 0;
    if (freq <= 0) continue;
    const from = acc * 100;
    acc += freq;
    const to = acc * 100;
    const color = action === "fold" ? foldColor : ACTION_COLORS[action];
    stops.push(`${color} ${from}%, ${color} ${to}%`);
  }
  if (stops.length === 0) stops.push(`${foldColor} 0%, ${foldColor} 100%`);
  return `linear-gradient(to right, ${stops.join(", ")})`;
}

/** 背景の明るさに応じて読みやすい文字色を返す。 */
function textColorFor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  return lum > 150 ? "#15181d" : "#f4f7fb";
}

export function RangeGrid({ range, highlightHand, tierColored }: Props) {
  const cells = allHandCells();
  return (
    <div className={`range-grid${tierColored ? " tier" : ""}`}>
      {cells.map((c) => {
        const isHi = highlightHand === c.hand;
        const style: React.CSSProperties = tierColored
          ? (() => {
              const bg = yokosawaColor(c.hand);
              return { background: bg, color: textColorFor(bg) };
            })()
          : { background: cellBackground(range, c.hand) };
        return (
          <div key={c.hand} className={`grid-cell${isHi ? " hi" : ""}`} style={style} title={c.hand}>
            <span>{c.hand}</span>
          </div>
        );
      })}
    </div>
  );
}
