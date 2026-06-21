// レンジJSONをまとめて読み込み、型付きで公開する。
// レンジを追加するときは JSON を作って下の配列に足すだけでよい。

import type { Range } from "../types/range";
import utg from "./ranges/rfi_utg.json";
import mp from "./ranges/rfi_mp.json";
import co from "./ranges/rfi_co.json";
import btn from "./ranges/rfi_btn.json";
import sb from "./ranges/rfi_sb.json";
import utg9 from "./ranges/rfi_9max_utg.json";
import utg1_9 from "./ranges/rfi_9max_utg1.json";
import utg2_9 from "./ranges/rfi_9max_utg2.json";
import lj9 from "./ranges/rfi_9max_lj.json";
import hj9 from "./ranges/rfi_9max_hj.json";
import co9 from "./ranges/rfi_9max_co.json";
import btn9 from "./ranges/rfi_9max_btn.json";
import sb9 from "./ranges/rfi_9max_sb.json";
import { YOKOSAWA_RANGES } from "./yokosawa";
import { YOKOSAWA_VS_RANGES } from "./yokosawaVs";

export const GTO_RFI: Range[] = [utg, mp, co, btn, sb] as Range[];
export const GTO_9MAX_RFI: Range[] = [utg9, utg1_9, utg2_9, lj9, hj9, co9, btn9, sb9] as Range[];

// ヨコサワ（トーナメント）= オープン + vsレイズ(コール/3bet) を1モードにまとめる。
// BB ディフェンスは vsレイズの BB スポットがステップ理論で一貫して扱うため統合済み。
export const YOKOSAWA_ALL: Range[] = [...YOKOSAWA_RANGES, ...YOKOSAWA_VS_RANGES];

export const RANGES: Range[] = [...YOKOSAWA_ALL, ...GTO_RFI];

export function getRangeById(id: string): Range | undefined {
  return RANGES.find((r) => r.id === id);
}

// ---- 練習モード（流派）----
// ユーザーは「どの席か」ではなく「どのレンジで練習するか」を選ぶ。席は出題ごとにランダム。

export type Mode = "yokosawa" | "gto" | "gto_9max";

export interface ModeInfo {
  id: Mode;
  label: string;
  /** 練習画面ヘッダーのセグメント切替に出す短縮ラベル。 */
  short: string;
  desc: string;
  ranges: Range[];
}

export const MODES: ModeInfo[] = [
  {
    id: "gto_9max",
    label: "GTOレンジ（9-max）",
    short: "GTO 9m",
    desc: "9-max 100bb キャッシュ RFI",
    ranges: GTO_9MAX_RFI,
  },
  {
    id: "gto",
    label: "GTOレンジ（6-max）",
    short: "GTO 6m",
    desc: "6-max 100bb キャッシュ RFI",
    ranges: GTO_RFI,
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
