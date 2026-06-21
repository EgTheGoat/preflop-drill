import { useState } from "react";
import { Quiz } from "./components/Quiz";
import { SessionStats } from "./components/SessionStats";
import { MoreHub } from "./components/MoreHub";
import { ChartView } from "./components/ChartView";
import { BottomNav, type View } from "./components/BottomNav";

export default function App() {
  const [view, setView] = useState<View>("train");

  return (
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
        ヨコサワレンジ © 世界のヨコサワ（学習目的で参照）。 GTOレンジは教科書的な自作サンプル。
      </footer>

      <BottomNav view={view} onChange={setView} />
    </div>
  );
}
