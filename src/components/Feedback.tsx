// 回答後の結果表示。判定（◯/✕）+ 各アクションの GTO 頻度 + 積み上げバー。

import { ACTION_BUTTON_LABELS, ACTION_COLORS, type Range } from "../types/range";
import { getStrategy, type ScoreResult } from "../lib/scoring";

interface Props {
  range: Range;
  hand: string;
  result: ScoreResult;
}

export function Feedback({ range, hand, result }: Props) {
  const strat = getStrategy(range, hand);
  // 表示順: fold 以外を先（左）、fold を最後（右/グレー）に。
  const ordered = [...range.actions].sort((a, b) =>
    a === "fold" ? 1 : b === "fold" ? -1 : 0,
  );
  const parts = ordered.map((a) => ({ a, f: strat[a] ?? 0 }));

  return (
    <div className={`result ${result.correct ? "ok" : "ng"}`}>
      <div className="result-row">
        <span className="freqs-label">GTO頻度</span>
        <span className="freqs">
          {parts.map((p) => (
            <span
              key={p.a}
              className="freq"
              style={{ color: p.a === "fold" ? "var(--muted)" : ACTION_COLORS[p.a] }}
            >
              {ACTION_BUTTON_LABELS[p.a].split(" ")[0]} {Math.round(p.f * 100)}%
            </span>
          ))}
        </span>
      </div>

      <div className="result-bar">
        {parts.map(
          (p) =>
            p.f > 0 && (
              <span
                key={p.a}
                style={{ width: `${p.f * 100}%`, background: ACTION_COLORS[p.a] }}
              />
            ),
        )}
      </div>
    </div>
  );
}
