// セッション統計。出題数・正答率・履歴（○/×・選択アクション・カード）。
// 履歴アイテムをタップするとレンジグリッドでそのハンドの位置を確認できる。

import { useState } from "react";
import { useSession, type HistoryItem } from "../store/session";
import { RangeGrid } from "./RangeGrid";
import { PlayingCard } from "./PlayingCard";
import {
  POSITION_LABEL,
  ACTION_BUTTON_LABELS,
  NINE_MAX_ORDER,
  SIX_MAX_ORDER,
  type Action,
  type Position,
} from "../types/range";

const ALL_POSITIONS: Position[] = [...new Set([...NINE_MAX_ORDER, ...SIX_MAX_ORDER])].sort(
  (a, b) => b.length - a.length,
);

function raiserPos(scenario: string, hero: Position): Position | null {
  return ALL_POSITIONS.find((p) => p !== hero && scenario.includes(p)) ?? null;
}

const ACTION_SHORT: Record<Action, string> = {
  fold: "FOLD",
  call: "CALL",
  raise: "RAISE",
  raise_small: "RAISE",
  raise_large: "RAISE",
};

const ACTION_CLASS: Record<Action, string> = {
  fold: "action-tag fold",
  call: "action-tag call",
  raise: "action-tag raise",
  raise_small: "action-tag raise",
  raise_large: "action-tag raise",
};

export function SessionStats() {
  const stats = useSession((s) => s.stats);
  const reset = useSession((s) => s.reset);
  const [selected, setSelected] = useState<HistoryItem | null>(null);

  const acc = stats.count > 0 ? Math.round((stats.correctCount / stats.count) * 100) : 0;

  return (
    <div className="stats">
      <h3>セッション成績</h3>
      <div className="stat-row">
        <div className="stat">
          <span className="stat-num">{stats.count}</span>
          <span className="stat-label">出題</span>
        </div>
        <div className="stat">
          <span className="stat-num">{stats.correctCount}</span>
          <span className="stat-label">正解</span>
        </div>
        <div className="stat">
          <span className="stat-num">{acc}%</span>
          <span className="stat-label">正答率</span>
        </div>
      </div>

      {stats.history.length > 0 && (
        <div className="weak">
          <h4 className="history-heading">履歴<span className="history-hint">タップで回答を確認</span></h4>
          <div className="history-table">
            <div className="ht-head-row">
              <span>カード</span>
              <span>位置</span>
              <span>アクション</span>
              <span>正誤</span>
            </div>
            {stats.history.map((item, i) => (
              <div key={i} className="ht-row" onClick={() => setSelected(item)}>
                <span className="ht-cards">
                  <span className="hole-cards mini">
                    <PlayingCard card={item.cards[0]} />
                    <PlayingCard card={item.cards[1]} />
                  </span>
                </span>
                <span>
                  {(() => {
                    const raiser = raiserPos(item.range.scenario, item.range.position);
                    return raiser ? (
                      <span className="pos-pair">
                        <span className="pos-hero">{POSITION_LABEL[item.range.position]}</span>
                        <span className="pos-vs">(vs <span className="pos-raiser">{POSITION_LABEL[raiser]}</span>)</span>
                      </span>
                    ) : POSITION_LABEL[item.range.position];
                  })()}
                </span>
                <span>
                  <span className={ACTION_CLASS[item.action]}>{ACTION_SHORT[item.action]}</span>
                </span>
                <span>
                  <span className={`history-mark ${item.correct ? "ok" : "ng"}`}>
                    {item.correct ? "○" : "×"}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {selected && (
        <div className="result-modal-backdrop" onClick={() => setSelected(null)}>
          <div className="result-modal" onClick={(e) => e.stopPropagation()}>
            <div className="history-modal-head">
              <span className={`history-mark lg ${selected.correct ? "ok" : "ng"}`}>
                {selected.correct ? "○" : "×"}
              </span>
              <div className="hole-cards small">
                <PlayingCard card={selected.cards[0]} />
                <PlayingCard card={selected.cards[1]} />
              </div>
              <div className="history-modal-info">
                <div className="history-modal-top">
                  <span className="history-modal-hand">{selected.hand}</span>
                  <span className={ACTION_CLASS[selected.action]}>
                    {ACTION_BUTTON_LABELS[selected.action].split(" ")[0]}
                  </span>
                </div>
                <span className="history-modal-label">{selected.range.label}</span>
              </div>
              <button className="history-modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <RangeGrid range={selected.range} highlightHand={selected.hand} />
          </div>
        </div>
      )}

      {stats.count > 0 && (
        <button className="reset-btn" onClick={reset}>
          成績をリセット
        </button>
      )}
    </div>
  );
}
