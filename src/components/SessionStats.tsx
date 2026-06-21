// セッション統計。出題数・平均得点・正答率・苦手ハンド（平均得点の低い順）。

import { useSession } from "../store/session";

export function SessionStats() {
  const stats = useSession((s) => s.stats);
  const reset = useSession((s) => s.reset);

  const avg = stats.count > 0 ? Math.round(stats.totalScore / stats.count) : 0;
  const acc = stats.count > 0 ? Math.round((stats.correctCount / stats.count) * 100) : 0;

  const weak = Object.entries(stats.byHand)
    .map(([key, v]) => {
      const [, hand] = key.split("|");
      return { key, hand, avg: v.totalScore / v.count, count: v.count };
    })
    .filter((x) => x.count >= 1)
    .sort((a, b) => a.avg - b.avg)
    .slice(0, 8);

  return (
    <div className="stats">
      <h3>セッション成績</h3>
      <div className="stat-row">
        <div className="stat">
          <span className="stat-num">{stats.count}</span>
          <span className="stat-label">出題</span>
        </div>
        <div className="stat">
          <span className="stat-num">{avg}</span>
          <span className="stat-label">平均得点</span>
        </div>
        <div className="stat">
          <span className="stat-num">{acc}%</span>
          <span className="stat-label">正答率</span>
        </div>
      </div>

      {weak.length > 0 && (
        <div className="weak">
          <h4>苦手ハンド</h4>
          <ul>
            {weak.map((w) => (
              <li key={w.key}>
                <span className="wh">{w.hand}</span>
                <span className="ws">{Math.round(w.avg)}点</span>
                <span className="wc">×{w.count}</span>
              </li>
            ))}
          </ul>
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
