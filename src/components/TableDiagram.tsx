// ポーカーテーブルの図。ヒーロー(YOU)を常に最下部中央に置き、
// 他の席をアクション順に楕円上へ配置する。先に行動した席は FOLD（レイザーは RAISE）で示す。
// 席数は order の長さで決まる（6-max / 9-max いずれも対応）。

import { POSITION_LABEL, SIX_MAX_ORDER, type Position } from "../types/range";

// 楕円の中心・半径（%）。6-max の従来レイアウトを再現しつつ任意席数に一般化する。
const CX = 50;
const CY = 52;
const RX = 40;
const RY = 40;

// ヒーローからの相対オフセット offset(0=自分,1=左隣…) と総席数 n から楕円上の座席座標を求める。
// 0 を最下部中央(下=-90°)に置き、反時計回り（左→上→右）へ並べる。
function slotFor(offset: number, n: number): { left: number; top: number } {
  const deg = 270 - (offset / n) * 360;
  const rad = (deg * Math.PI) / 180;
  return {
    left: CX + RX * Math.cos(rad),
    top: CY - RY * Math.sin(rad),
  };
}

interface Props {
  active: Position; // ヒーロー席
  raiser?: Position | null;
  order?: Position[]; // 席順（BB が最後）。省略時は 6-max。
}

export function TableDiagram({ active, raiser, order = SIX_MAX_ORDER }: Props) {
  const heroIdx = order.indexOf(active);

  return (
    <div className="table-diagram" aria-label={`席: ${POSITION_LABEL[active]}`}>
      <div className="table-felt">
        <span className="pot">Pot 1.5 bb</span>
      </div>

      {order.map((pos, idx) => {
        const offset = (idx - heroIdx + order.length) % order.length;
        const slot = slotFor(offset, order.length);
        const isHero = pos === active;
        const isRaiser = pos === raiser && !isHero;
        // ヒーローより前に行動した席（レイザー以外）は降りている扱い。
        const folded = !isHero && !isRaiser && idx < heroIdx;

        const cls = [
          "seat",
          isHero && "hero",
          isRaiser && "raiser",
          folded && "folded",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div key={pos} className={cls} style={{ left: `${slot.left}%`, top: `${slot.top}%` }}>
            <span className="seat-pos">{POSITION_LABEL[pos]}</span>
            {pos === "BTN" && <span className="dealer-btn">D</span>}
            <span className="seat-sub">
              {isHero ? "YOU" : isRaiser ? "RAISE" : folded ? "FOLD" : "100bb"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
