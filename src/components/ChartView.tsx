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

export function ChartView() {
  return (
    <div className="chart-view">
      <h2 className="chart-title">ヨコサワ オープンレンジ表</h2>
      <RangeGrid range={DUMMY_RANGE} tierColored />
      <TierLegend defaultOpen />
    </div>
  );
}
