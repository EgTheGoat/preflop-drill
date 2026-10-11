import { useState } from "react";
import { RangeGrid } from "./RangeGrid";
import { TierLegend } from "./TierLegend";
import { MODES, type Mode } from "../data/ranges";
import type { Range } from "../types/range";

const YOKOSAWA_DUMMY: Range = {
  id: "dummy",
  label: "",
  format: "",
  position: "BTN",
  scenario: "",
  actions: ["fold"],
  hands: {},
};

const GTO_MODES = MODES.filter((m) => !m.id.startsWith("yokosawa"));

export function ChartView() {
  const [tab, setTab] = useState<"yokosawa" | "gto">("gto");
  const [gtoModeId, setGtoModeId] = useState<Mode>(GTO_MODES[0].id);
  const [selectedRangeId, setSelectedRangeId] = useState<string>(GTO_MODES[0].ranges[0].id);

  const gtoMode = GTO_MODES.find((m) => m.id === gtoModeId)!;
  const selectedRange = gtoMode.ranges.find((r) => r.id === selectedRangeId) ?? gtoMode.ranges[0];

  function switchGtoMode(id: Mode) {
    const mode = GTO_MODES.find((m) => m.id === id)!;
    setGtoModeId(id);
    setSelectedRangeId(mode.ranges[0].id);
  }

  return (
    <div className="chart-view">
      <div className="chart-tab-toggle">
        <button className={tab === "gto" ? "on" : ""} onClick={() => setTab("gto")}>
          GTO
        </button>
        <button className={tab === "yokosawa" ? "on" : ""} onClick={() => setTab("yokosawa")}>
          ヨコサワ
        </button>
      </div>

      {tab === "yokosawa" ? (
        <>
          <h2 className="chart-title">ヨコサワ オープンレンジ表</h2>
          <RangeGrid range={YOKOSAWA_DUMMY} tierColored />
          <TierLegend />
        </>
      ) : (
        <>
          <div className="chart-mode-btns">
            {GTO_MODES.map((m) => (
              <button
                key={m.id}
                className={gtoModeId === m.id ? "on" : ""}
                onClick={() => switchGtoMode(m.id)}
              >
                {m.short}
              </button>
            ))}
          </div>
          <div className="chart-range-btns">
            {gtoMode.ranges.map((r) => (
              <button
                key={r.id}
                className={selectedRange.id === r.id ? "on" : ""}
                onClick={() => setSelectedRangeId(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>
          <RangeGrid range={selectedRange} />
        </>
      )}
    </div>
  );
}
