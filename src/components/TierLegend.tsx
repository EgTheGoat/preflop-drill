// ヨコサワ表の色（ティア）の意味を表の下に折りたたみ表示する。
// 色は「オープンしてよい後ろの人数」を表す（元画像の凡例準拠）。

import { YOKOSAWA_TIER_COLOR, type YokosawaTier } from "../data/yokosawaChart";

const TIER_DESC: { tier: YokosawaTier; label: string; wide?: boolean }[] = [
  { tier: "navy", label: "後ろ8人（強）" },
  { tier: "red", label: "後ろ8人（中）" },
  { tier: "orange", label: "後ろ8人（弱）" },
  { tier: "green", label: "後ろ6〜7人" },
  { tier: "lblue", label: "後ろ4〜5人" },
  { tier: "white", label: "後ろ3人" },
  { tier: "purple", label: "後ろ2人" },
  { tier: "pink", label: "BBのみ・BTNのレイズにコール", wide: true },
  { tier: "fold", label: "フォールド" },
];

export function TierLegend({ defaultOpen }: { defaultOpen?: boolean } = {}) {
  return (
    <details className="tier-legend" open={defaultOpen}>
      <summary>色の説明（オープンしてよい「後ろの人数」）</summary>
      <ul>
        {TIER_DESC.map(({ tier, label, wide }) => (
          <li key={tier} className={wide ? "wide" : undefined}>
            <i style={{ background: YOKOSAWA_TIER_COLOR[tier] }} />
            <span>{label}</span>
          </li>
        ))}
      </ul>

      <p className="legend-note">
        <b>vsレイズ</b>: 相手の下限より <b>1段上の色＝コール</b> / <b>2段以上上の色＝3bet</b>
        <br />
        （色の強さ: navy &gt; red &gt; orange &gt; green &gt; lblue &gt; white &gt; purple）
      </p>
    </details>
  );
}
