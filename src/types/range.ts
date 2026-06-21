// プリフロップレンジのデータモデル。
// レンジは「169ハンド表記 → アクション混合頻度」のマップとして表現する。

/** このアプリで扱うアクション種別。シナリオごとに使う集合は actions で指定する。 */
export type Action = "fold" | "call" | "raise" | "raise_small" | "raise_large";

/** 1ハンドの混合戦略。各アクションの頻度（0〜1）。合計は概ね1.0。省略されたアクションは0とみなす。 */
export type HandStrategy = Partial<Record<Action, number>>;

/**
 * ポジション。
 * 6-max キャッシュ（GTO）は {UTG, MP, CO, BTN, SB, BB}、
 * 9-max トーナメント（ヨコサワ系）は {UTG, UTG1, UTG2, LJ, HJ, CO, BTN, SB, BB} を使う。
 */
export type Position =
  | "UTG"
  | "UTG1"
  | "UTG2"
  | "LJ"
  | "HJ"
  | "MP"
  | "CO"
  | "BTN"
  | "SB"
  | "BB";

/** 6-max（キャッシュ）の席順。BB が最後。 */
export const SIX_MAX_ORDER: Position[] = ["UTG", "MP", "CO", "BTN", "SB", "BB"];

/** 9-max（トーナメント）の席順。BB が最後。 */
export const NINE_MAX_ORDER: Position[] = [
  "UTG",
  "UTG1",
  "UTG2",
  "LJ",
  "HJ",
  "CO",
  "BTN",
  "SB",
  "BB",
];

/** 1つの練習シナリオ＝特定ポジション・状況のレンジ。 */
export interface Range {
  /** 一意ID。例: "6max_100bb_rfi_btn" */
  id: string;
  /** 表示名。例: "BTN オープン (RFI)" */
  label: string;
  /** フォーマット。例: "6-max 100bb" */
  format: string;
  /** ポジション */
  position: Position;
  /** 状況の説明。例: "RFI" / "vs CO RFI" */
  scenario: string;
  /** このシナリオで選べるアクション（UI のボタン順にも使う） */
  actions: Action[];
  /**
   * ハンド表記 → 混合戦略。
   * ここに無いハンドは「fold 100%」として扱う（fold を含むシナリオの場合）。
   */
  hands: Record<string, HandStrategy>;
}

/** アクションの日本語表示ラベル。 */
export const ACTION_LABELS: Record<Action, string> = {
  fold: "フォールド",
  call: "コール",
  raise: "レイズ",
  raise_small: "レイズ(小)",
  raise_large: "レイズ(大)",
};

/** アクションボタン用の表示ラベル（英大文字 + ベットサイズ）。デザインに合わせる。 */
export const ACTION_BUTTON_LABELS: Record<Action, string> = {
  fold: "FOLD",
  call: "CALL",
  raise: "RAISE 2.5bb",
  raise_small: "RAISE 2bb",
  raise_large: "RAISE 3.5bb",
};

/** ヒートマップ表示用のアクション色（混合戦略を積み上げ表示するため）。 */
export const ACTION_COLORS: Record<Action, string> = {
  fold: "#2c323b",
  call: "#2e9e5b",
  raise: "#e5484d",
  raise_small: "#e08e3c",
  raise_large: "#b02a2a",
};

/** 座席・ピル表示用のポジション名（6-max の MP は現代式に「HJ」と表示）。 */
export const POSITION_LABEL: Record<Position, string> = {
  UTG: "UTG",
  UTG1: "UTG+1",
  UTG2: "UTG+2",
  LJ: "LJ",
  HJ: "HJ",
  MP: "HJ",
  CO: "CO",
  BTN: "BTN",
  SB: "SB",
  BB: "BB",
};
