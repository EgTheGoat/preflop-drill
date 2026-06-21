import { describe, it, expect } from "vitest";
import { allHands, allHandCells, handToCoord, makeHand, handType } from "./hands";

describe("hands", () => {
  it("169 ハンドを過不足なく生成する", () => {
    const hands = allHands();
    expect(hands.length).toBe(169);
    expect(new Set(hands).size).toBe(169); // 重複なし
  });

  it("内訳はペア13・スーテッド78・オフ78", () => {
    const cells = allHandCells();
    const pairs = cells.filter((c) => c.type === "pair");
    const suited = cells.filter((c) => c.type === "suited");
    const offsuit = cells.filter((c) => c.type === "offsuit");
    expect(pairs.length).toBe(13);
    expect(suited.length).toBe(78);
    expect(offsuit.length).toBe(78);
  });

  it("makeHand は強い方を先に置き s/o を付ける", () => {
    expect(makeHand("A", "A", false)).toBe("AA");
    expect(makeHand("K", "A", true)).toBe("AKs");
    expect(makeHand("A", "K", false)).toBe("AKo");
    expect(makeHand("2", "7", true)).toBe("72s");
  });

  it("handType 判定", () => {
    expect(handType("AA")).toBe("pair");
    expect(handType("AKs")).toBe("suited");
    expect(handType("AKo")).toBe("offsuit");
  });

  it("handToCoord はグリッド規約（suited=右上, offsuit=左下, pair=対角）に従う", () => {
    expect(handToCoord("AA")).toEqual([0, 0]);
    expect(handToCoord("22")).toEqual([12, 12]);
    // AKs: A=0,K=1 → row<col
    expect(handToCoord("AKs")).toEqual([0, 1]);
    // AKo: 左下 → row>col
    expect(handToCoord("AKo")).toEqual([1, 0]);
  });

  it("各セルの hand と座標が往復一致する", () => {
    for (const c of allHandCells()) {
      expect(handToCoord(c.hand)).toEqual([c.row, c.col]);
    }
  });
});
