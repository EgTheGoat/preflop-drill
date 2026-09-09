// レンジJSONをまとめて読み込み、型付きで公開する。
// レンジを追加するときは JSON を作って下の配列に足すだけでよい。

import type { Range } from "../types/range";
import gwUtg from "./ranges/gtowiz_6max_100bb_rfi_utg.json";
import gwHj from "./ranges/gtowiz_6max_100bb_rfi_hj.json";
import gwCo from "./ranges/gtowiz_6max_100bb_rfi_co.json";
import gwBtn from "./ranges/gtowiz_6max_100bb_rfi_btn.json";
import gwSb from "./ranges/gtowiz_6max_100bb_rfi_sb.json";
import vsUtgHj from "./ranges/gtowiz_6max_vs_utg_hj.json";
import vsUtgCo from "./ranges/gtowiz_6max_vs_utg_co.json";
import vsUtgBtn from "./ranges/gtowiz_6max_vs_utg_btn.json";
import vsUtgSb from "./ranges/gtowiz_6max_vs_utg_sb.json";
import vsUtgBb from "./ranges/gtowiz_6max_vs_utg_bb.json";
import vsHjCo from "./ranges/gtowiz_6max_vs_hj_co.json";
import vsHjBtn from "./ranges/gtowiz_6max_vs_hj_btn.json";
import vsHjSb from "./ranges/gtowiz_6max_vs_hj_sb.json";
import vsHjBb from "./ranges/gtowiz_6max_vs_hj_bb.json";
import vsCoBtn from "./ranges/gtowiz_6max_vs_co_btn.json";
import vsCoSb from "./ranges/gtowiz_6max_vs_co_sb.json";
import vsCoBb from "./ranges/gtowiz_6max_vs_co_bb.json";
import vsBtnSb from "./ranges/gtowiz_6max_vs_btn_sb.json";
import vsBtnBb from "./ranges/gtowiz_6max_vs_btn_bb.json";
import vsSbBb from "./ranges/gtowiz_6max_vs_sb_bb.json";
import { YOKOSAWA_RANGES } from "./yokosawa";
import { YOKOSAWA_VS_RANGES } from "./yokosawaVs";

export const GTOWIZ_6MAX_RFI: Range[] = [gwUtg, gwHj, gwCo, gwBtn, gwSb] as Range[];
export const GTOWIZ_6MAX_VS_UTG: Range[] = [vsUtgHj, vsUtgCo, vsUtgBtn, vsUtgSb, vsUtgBb] as Range[];
export const GTOWIZ_6MAX_VS_HJ: Range[] = [vsHjCo, vsHjBtn, vsHjSb, vsHjBb] as Range[];
export const GTOWIZ_6MAX_VS_CO: Range[] = [vsCoBtn, vsCoSb, vsCoBb] as Range[];
export const GTOWIZ_6MAX_VS_BTN: Range[] = [vsBtnSb, vsBtnBb] as Range[];
export const GTOWIZ_6MAX_VS_SB: Range[] = [vsSbBb] as Range[];

export const YOKOSAWA_ALL: Range[] = [...YOKOSAWA_RANGES, ...YOKOSAWA_VS_RANGES];

export const RANGES: Range[] = [
  ...YOKOSAWA_ALL,
  ...GTOWIZ_6MAX_RFI,
  ...GTOWIZ_6MAX_VS_UTG,
  ...GTOWIZ_6MAX_VS_HJ,
  ...GTOWIZ_6MAX_VS_CO,
  ...GTOWIZ_6MAX_VS_BTN,
  ...GTOWIZ_6MAX_VS_SB,
];

export function getRangeById(id: string): Range | undefined {
  return RANGES.find((r) => r.id === id);
}

// ---- 練習モード（流派）----

export type Mode = "yokosawa" | "gtowiz_6max" | "gtowiz_6max_vs_utg" | "gtowiz_6max_vs_hj" | "gtowiz_6max_vs_co" | "gtowiz_6max_vs_btn" | "gtowiz_6max_vs_sb";

export interface ModeInfo {
  id: Mode;
  label: string;
  short: string;
  desc: string;
  ranges: Range[];
}

export const MODES: ModeInfo[] = [
  {
    id: "gtowiz_6max",
    label: "GTO Wizard（6-max）RFI",
    short: "GTOWiz RFI",
    desc: "6-max NL25 100bb キャッシュ RFI（GTO Wizard実データ）",
    ranges: GTOWIZ_6MAX_RFI,
  },
  {
    id: "gtowiz_6max_vs_utg",
    label: "GTO Wizard（6-max）vs UTG",
    short: "vs UTG",
    desc: "UTGオープンに対する各ポジションのアクション",
    ranges: GTOWIZ_6MAX_VS_UTG,
  },
  {
    id: "gtowiz_6max_vs_hj",
    label: "GTO Wizard（6-max）vs HJ",
    short: "vs HJ",
    desc: "HJオープンに対する各ポジションのアクション",
    ranges: GTOWIZ_6MAX_VS_HJ,
  },
  {
    id: "gtowiz_6max_vs_co",
    label: "GTO Wizard（6-max）vs CO",
    short: "vs CO",
    desc: "COオープンに対する各ポジションのアクション",
    ranges: GTOWIZ_6MAX_VS_CO,
  },
  {
    id: "gtowiz_6max_vs_btn",
    label: "GTO Wizard（6-max）vs BTN",
    short: "vs BTN",
    desc: "BTNオープンに対する各ポジションのアクション",
    ranges: GTOWIZ_6MAX_VS_BTN,
  },
  {
    id: "gtowiz_6max_vs_sb",
    label: "GTO Wizard（6-max）vs SB",
    short: "vs SB",
    desc: "SBオープンに対するBBのアクション",
    ranges: GTOWIZ_6MAX_VS_SB,
  },
  {
    id: "yokosawa",
    label: "ヨコサワ（トーナメント）",
    short: "ヨコサワ",
    desc: "9-max オープン / vsレイズ（コール・3bet）をランダム出題",
    ranges: YOKOSAWA_ALL,
  },
];

export function rangesForMode(mode: Mode): Range[] {
  return MODES.find((m) => m.id === mode)!.ranges;
}
