import { useState } from "react";
import { RangeGrid } from "./RangeGrid";
import { TierLegend } from "./TierLegend";
import type { Range } from "../types/range";

const DUMMY_RANGE: Range = {
  id: "dummy",
  label: "",
  format: "",
  position: "BTN",
  scenario: "",
  actions: ["fold"],
  hands: {},
};

export function ChartPopover() {
  const [open, setOpen] = useState(false);
  return (
    <div className="chart-popover">
      <button className="hub-link chart-popover-btn" onClick={() => setOpen((o) => !o)}>
        <span className="hub-label">ヨコサワ レンジ表</span>
        <span className="hub-desc">オープンレンジ一覧（タップで表示）</span>
        <span className="hub-arrow" aria-hidden="true">{open ? "✕" : "›"}</span>
      </button>
      {open && (
        <>
          <div className="chart-popover-backdrop" onClick={() => setOpen(false)} />
          <div className="chart-popover-panel">
            <RangeGrid range={DUMMY_RANGE} tierColored />
            <TierLegend defaultOpen />
          </div>
        </>
      )}
    </div>
  );
}
