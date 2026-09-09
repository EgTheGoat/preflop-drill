import { useSession } from "../store/session";
import { MODES } from "../data/ranges";
import { POSITION_LABEL, type Position } from "../types/range";

export function PositionFilter() {
  const mode = useSession((s) => s.mode);
  const selectedPositions = useSession((s) => s.selectedPositions);
  const setPositions = useSession((s) => s.setPositions);

  const modeInfo = MODES.find((m) => m.id === mode);
  if (!modeInfo) return null;

  const allPositions: Position[] = Array.from(
    new Set(modeInfo.ranges.map((r) => r.position))
  );

  // ポジションが1種類しかないモードはフィルタ不要
  if (allPositions.length <= 1) return null;

  function toggle(pos: Position) {
    const current = selectedPositions ?? allPositions;
    const next = current.includes(pos)
      ? current.filter((p) => p !== pos)
      : [...current, pos];
    // 全選択 = null（デフォルト）と同義
    setPositions(next.length === allPositions.length ? null : next.length > 0 ? next : null);
  }

  const active = selectedPositions ?? allPositions;

  return (
    <div className="pos-filter">
      {allPositions.map((pos) => (
        <button
          key={pos}
          className={`pos-chip${active.includes(pos) ? " on" : ""}`}
          onClick={() => toggle(pos)}
        >
          {POSITION_LABEL[pos]}
        </button>
      ))}
    </div>
  );
}
