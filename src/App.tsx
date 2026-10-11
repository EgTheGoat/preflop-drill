import { useState } from "react";
import { Quiz } from "./components/Quiz";
import { SessionStats } from "./components/SessionStats";
import { MoreHub } from "./components/MoreHub";
import { ChartView } from "./components/ChartView";
import { BottomNav, type View } from "./components/BottomNav";

const NAV_ITEMS: { id: View; label: string }[] = [
  { id: "train", label: "練習" },
  { id: "chart", label: "レンジ表" },
  { id: "stats", label: "履歴" },
  { id: "more", label: "その他" },
];

export default function App() {
  const [view, setView] = useState<View>("train");

  return (
    <>
      <header className="app-header">
        <div className="app-header-inner">
          <button className="app-header-brand" onClick={() => setView("train")}>
            <img src="/pf_icon.png" alt="" className="app-header-icon" />
            Preflop Trainer
          </button>
          <nav className="app-header-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`app-header-nav-btn${view === item.id ? " on" : ""}`}
                onClick={() => setView(item.id)}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="app" data-view={view}>
      <main className="layout">
        <section className="pane pane-train col-main">
          <Quiz />
        </section>

        <section className="pane pane-stats">
          <SessionStats />
        </section>

        <section className="pane pane-chart">
          <ChartView />
        </section>
        <section className="pane pane-more">
          <MoreHub />
        </section>
      </main>

      <footer className="app-footer">
        ヨコサワレンジ © 世界のヨコサワ（学習目的で参照）。 GTOレンジは近似解の一例です。
      </footer>

      <BottomNav view={view} onChange={setView} />
      </div>
    </>
  );
}
