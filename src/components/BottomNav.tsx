// ホーム画面追加（スタンドアロン）で使う前提の、アプリ風な下部タブバー。
// モバイルで画面（練習 / 履歴 / その他）を切り替える。デスクトップでは非表示。
// モード（流派）切替は練習画面ヘッダーのセグメントに統合したのでタブには持たない。

export type View = "train" | "stats" | "chart" | "more";

const TABS: { id: View; label: string; icon: JSX.Element }[] = [
  {
    id: "train",
    label: "練習",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "stats",
    label: "履歴",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <line x1="6" y1="20" x2="6" y2="13" />
        <line x1="12" y1="20" x2="12" y2="8" />
        <line x1="18" y1="20" x2="18" y2="4" />
      </svg>
    ),
  },
  {
    id: "chart",
    label: "レンジ表",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" stroke="none" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" stroke="none" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" stroke="none" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "more",
    label: "その他",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="5" cy="12" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export function BottomNav({
  view,
  onChange,
}: {
  view: View;
  onChange: (v: View) => void;
}) {
  return (
    <nav className="bottom-nav" aria-label="メインメニュー">
      {TABS.map((t) => {
        const on = view === t.id;
        return (
          <button
            key={t.id}
            className={`nav-tab${on ? " on" : ""}`}
            onClick={() => onChange(t.id)}
            aria-current={on ? "page" : undefined}
          >
            <span className="nav-icon">{t.icon}</span>
            <span className="nav-label">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
