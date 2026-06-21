import { describe, it, expect } from "vitest";
import { scoreAnswer, getStrategy, topAction } from "./scoring";
import type { Range } from "../types/range";

const range: Range = {
  id: "test",
  label: "test",
  format: "6-max 100bb",
  position: "BTN",
  scenario: "RFI",
  actions: ["fold", "raise"],
  hands: {
    AA: { raise: 1 },
    "76s": { raise: 0.5, fold: 0.5 },
  },
};

describe("scoring", () => {
  it("未収録ハンドは fold 100% 扱い", () => {
    expect(getStrategy(range, "72o")).toEqual({ fold: 1 });
  });

  it("topAction は最頻アクション", () => {
    expect(topAction(range, getStrategy(range, "AA"))).toBe("raise");
    expect(topAction(range, getStrategy(range, "72o"))).toBe("fold");
  });

  it("pure ハンドで正解アクションは満点・不正解は0点", () => {
    const ok = scoreAnswer(range, "AA", "raise");
    expect(ok.score).toBe(100);
    expect(ok.correct).toBe(true);

    const ng = scoreAnswer(range, "AA", "fold");
    expect(ng.score).toBe(0);
    expect(ng.correct).toBe(false);
  });

  it("fold 100% ハンドは fold が正解", () => {
    const r = scoreAnswer(range, "72o", "fold");
    expect(r.score).toBe(100);
    expect(r.correct).toBe(true);
    expect(scoreAnswer(range, "72o", "raise").correct).toBe(false);
  });

  it("混合ハンドは頻度が得点になり、どちらも正解扱い", () => {
    const r = scoreAnswer(range, "76s", "raise");
    expect(r.score).toBe(50);
    expect(r.mixed).toBe(true);
    expect(r.correct).toBe(true);
    expect(scoreAnswer(range, "76s", "fold").correct).toBe(true);
  });
});
