// 「その他」ハブ。回遊の入口としてのリンク群＋アプリの使い方/解説をまとめる。
// 外側はカードで包まず、リンクカードと折りたたみセクションを直接並べる。

import { ChartPopover } from "./ChartPopover";

interface HubSection {
  title: string;
  body: JSX.Element;
}

const SECTIONS: HubSection[] = [
  {
    title: "使い方",
    body: (
      <ol className="hub-steps">
        <li>テーブル図で「自分の席（ポジション）」と配られた2枚のハンドを確認します。</li>
        <li>そのハンドで取るべきアクション（フォールド / コール / レイズ・3bet）を選びます。</li>
        <li>回答すると正誤・得点と、その状況の正解レンジ表が表示されます。</li>
        <li>「次のハンドへ」で出題が切り替わります。席は毎回ランダムです。</li>
      </ol>
    ),
  },
  {
    title: "練習モードの違い",
    body: (
      <dl className="hub-defs">
        <dt>ヨコサワ（トーナメント）</dt>
        <dd>
          9-max のトーナメント想定。世界のヨコサワのレンジ表をベースに、オープンと vsレイズ（コール /
          3bet）を出題します。表は色（ティア）で「オープンしてよい後ろの人数」を示す二値レンジで、頻度はありません。
        </dd>
        <dt>GTO 6m / GTO 9m（キャッシュ）</dt>
        <dd>
          100bb キャッシュの RFI（オープンレイズするか）。6-max と 9-max を切り替えられます。
          各ハンドは頻度つきの混合戦略で、表には頻度バーが出ます。
        </dd>
      </dl>
    ),
  },
  {
    title: "採点とレンジ表の見方",
    body: (
      <ul className="hub-bullets">
        <li>
          得点は<b>選んだアクションのGTO頻度 ×100</b>。例: raise 80% / fold 20% のハンドで raise なら 80点、fold なら 20点。
        </li>
        <li>
          <b>最頻アクション</b>を選べば◯。複数アクションが 20% 以上ある<b>混合域</b>では、20%
          以上のアクションも◯として扱います。
        </li>
        <li>
          レンジ表は、GTOモードでは頻度バー、ヨコサワモードではティア配色で表示します（色の意味は回答画面の凡例を参照）。
        </li>
      </ul>
    ),
  },
  {
    title: "よくある質問",
    body: (
      <dl className="hub-faq">
        <dt>席（ポジション）は選べますか？</dt>
        <dd>選べません。モードだけ選び、席は出題ごとにランダムです。</dd>
        <dt>モードを変えると成績はどうなりますか？</dt>
        <dd>成績はリセットされ、新しい問題が出題されます。</dd>
        <dt>オフラインで使えますか？</dt>
        <dd>PWA対応です。ホーム画面に追加すればオフラインでも動きます。</dd>
      </dl>
    ),
  },
];

export function MoreHub() {
  return (
    <div className="more-hub">
      <h3>その他</h3>

      <ul className="hub-list">
        <li>
          <ChartPopover />
        </li>
      </ul>

      <div className="hub-sections">
        {SECTIONS.map((s) => (
          <details key={s.title} className="hub-section">
            <summary>{s.title}</summary>
            <div className="hub-section-body">{s.body}</div>
          </details>
        ))}
      </div>

      <p className="hub-credit">
        ヨコサワレンジ © 世界のヨコサワ（学習目的で参照）。 GTOレンジは教科書的な自作サンプルです。
        本アプリは学習用で、出典各位とは無関係です。
      </p>
    </div>
  );
}
