// 「世界のヨコサワ」レンジ表 (public/yokosawa.png) のティア配色。
// 元画像から各ハンドの色を直接サンプリングして生成（色を忠実に合わせるため）。
// 再生成は scripts ではなく画像差し替え時に手動で行う。

export type YokosawaTier =
  | "navy" | "red" | "orange" | "green" | "lblue" | "white" | "purple" | "pink" | "fold";

/** ティア → 配色（元画像の凡例カラー）。 */
export const YOKOSAWA_TIER_COLOR: Record<YokosawaTier, string> = {
  navy: "#11284d",
  red: "#aa2925",
  orange: "#e9ad3d",
  green: "#3d8344",
  lblue: "#419dc9",
  white: "#fdfdfd",
  purple: "#c41af6",
  pink: "#fca4e5",
  fold: "#898989",
};

/** 169ハンド → ティア（元画像準拠）。 */
export const YOKOSAWA_TIER_OF: Record<string, YokosawaTier> = {
  "AA":"navy", "AKs":"navy", "AQs":"red", "AJs":"red", "ATs":"red", "A9s":"green", "A8s":"green", "A7s":"green", "A6s":"green", "A5s":"green", "A4s":"green", "A3s":"green", "A2s":"green",
  "AKo":"navy", "KK":"navy", "KQs":"red", "KJs":"orange", "KTs":"green", "K9s":"green", "K8s":"white", "K7s":"white", "K6s":"white", "K5s":"white", "K4s":"white", "K3s":"white", "K2s":"white",
  "AQo":"red", "KQo":"orange", "QQ":"navy", "QJs":"orange", "QTs":"green", "Q9s":"lblue", "Q8s":"white", "Q7s":"white", "Q6s":"white", "Q5s":"purple", "Q4s":"purple", "Q3s":"purple", "Q2s":"purple",
  "AJo":"orange", "KJo":"green", "QJo":"lblue", "JJ":"red", "JTs":"orange", "J9s":"lblue", "J8s":"white", "J7s":"white", "J6s":"purple", "J5s":"pink", "J4s":"pink", "J3s":"pink", "J2s":"pink",
  "ATo":"green", "KTo":"lblue", "QTo":"white", "JTo":"lblue", "TT":"red", "T9s":"green", "T8s":"lblue", "T7s":"purple", "T6s":"pink", "T5s":"pink", "T4s":"pink", "T3s":"pink", "T2s":"fold",
  "A9o":"lblue", "K9o":"white", "Q9o":"white", "J9o":"white", "T9o":"white", "99":"red", "98s":"lblue", "97s":"white", "96s":"purple", "95s":"pink", "94s":"fold", "93s":"fold", "92s":"fold",
  "A8o":"white", "K8o":"pink", "Q8o":"pink", "J8o":"pink", "T8o":"pink", "98o":"purple", "88":"orange", "87s":"white", "86s":"purple", "85s":"pink", "84s":"fold", "83s":"fold", "82s":"fold",
  "A7o":"white", "K7o":"pink", "Q7o":"pink", "J7o":"fold", "T7o":"fold", "97o":"pink", "87o":"pink", "77":"orange", "76s":"white", "75s":"purple", "74s":"pink", "73s":"fold", "72s":"fold",
  "A6o":"purple", "K6o":"pink", "Q6o":"fold", "J6o":"fold", "T6o":"fold", "96o":"fold", "86o":"fold", "76o":"fold", "66":"green", "65s":"white", "64s":"purple", "63s":"pink", "62s":"fold",
  "A5o":"pink", "K5o":"pink", "Q5o":"fold", "J5o":"fold", "T5o":"fold", "95o":"fold", "85o":"fold", "75o":"fold", "65o":"fold", "55":"green", "54s":"purple", "53s":"pink", "52s":"fold",
  "A4o":"pink", "K4o":"fold", "Q4o":"fold", "J4o":"fold", "T4o":"fold", "94o":"fold", "84o":"fold", "74o":"fold", "64o":"fold", "54o":"fold", "44":"lblue", "43s":"pink", "42s":"fold",
  "A3o":"pink", "K3o":"fold", "Q3o":"fold", "J3o":"fold", "T3o":"fold", "93o":"fold", "83o":"fold", "73o":"fold", "63o":"fold", "53o":"fold", "43o":"fold", "33":"lblue", "32s":"fold",
  "A2o":"pink", "K2o":"fold", "Q2o":"fold", "J2o":"fold", "T2o":"fold", "92o":"fold", "82o":"fold", "72o":"fold", "62o":"fold", "52o":"fold", "42o":"fold", "32o":"fold", "22":"lblue",
};

/** ハンドの表示色（元画像のティアカラー）。未収録は fold 灰。 */
export function yokosawaColor(hand: string): string {
  return YOKOSAWA_TIER_COLOR[YOKOSAWA_TIER_OF[hand] ?? "fold"];
}
