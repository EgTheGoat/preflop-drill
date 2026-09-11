# preflop-drill

[日本語](./README.md) | [English](./README.en.md)

テキサスホールデムのプリフロップレンジを反復練習するための Web アプリ。  
ポジションとハンドがランダムに出題され、選んだアクションを GTO レンジと照合して正誤判定する。  
PWA 対応でオフライン動作可能。

---

## 練習モード

| モード | テーブル | シナリオ |
|---|---|---|
| **GTOWiz RFI** | 6-max NL25 100bb | RFI（オープンするか）|
| **vs UTG** | 6-max NL25 100bb | UTG オープンに対する HJ/CO/BTN/SB/BB のアクション |
| **vs HJ** | 6-max NL25 100bb | HJ オープンに対する CO/BTN/SB/BB のアクション |
| **vs CO** | 6-max NL25 100bb | CO オープンに対する BTN/SB/BB のアクション |
| **vs BTN** | 6-max NL25 100bb | BTN オープンに対する SB/BB のアクション |
| **vs SB** | 6-max NL25 100bb | SB オープンに対する BB のアクション |
| **vs 3bet** | 6-max NL25 100bb | オープナーが 3bet に直面（fold/call/4bet）|
| **vs 4bet** | 6-max NL25 100bb | 3bettor が 4bet に直面（fold/call/5bet）|
| **ヨコサワ（トーナメント）** | 9-max | オープン / vsレイズ（コール・3bet） |


<div align="center">
  <img width="320" alt="IMG_2407" src="https://github.com/user-attachments/assets/05ef6767-42d9-4ae5-88c9-63f2ee38ceaf" />
</div>

## インストール（PWA）

ブラウザからホーム画面に追加することで、アプリとして使える。

| ブラウザ | 手順 |
|---|---|
| iOS Safari | 共有ボタン →「ホーム画面に追加」 |
| Android Chrome | メニュー →「アプリをインストール」 |
| Desktop Chrome | アドレスバー右端のインストールアイコン |

インストール後はオフラインでも動作する。

## 採点方式

選んだアクションが **GTO の最頻アクション** と一致すれば ◯、そうでなければ ✗。

- `raise 80% / fold 20%` のハンドで **raise** を選ぶ → **◯**
- 同ハンドで **fold** を選ぶ → **✗**
- 複数アクションが 20% 以上ある **混合域** では、いずれを選んでも ◯ 扱い

## セッション履歴

回答後、成績画面に履歴が積み上がる。

- カード・ポジション・選択アクション・正誤を一覧表示
- 行をタップするとレンジグリッドが開き、そのハンドがどこに位置するか確認できる
- ヨコサワモードの vsシナリオでは自分と相手のポジションを両方表示

## スタック

| 役割 | ライブラリ |
|---|---|
| UI | React 18 |
| 型 | TypeScript |
| ビルド | Vite |
| 状態管理 | Zustand |
| PWA | vite-plugin-pwa |
| テスト | Vitest |

## 開発

**前提条件:** [mise](https://mise.jdx.dev/) がインストールされていること。

```bash
mise install   # Node 24 を用意
npm install
npm run dev    # 開発サーバー (localhost:5173)
npm test       # ユニットテスト
npm run build  # 本番ビルド → dist/
```

## ディレクトリ構成

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── components/
│   ├── Quiz.tsx          # 出題メイン（テーブル図・ハンド・ボタン・回答モーダル）
│   ├── ActionButtons.tsx # fold/call/raise ボタン
│   ├── BottomNav.tsx     # 下部タブナビ
│   ├── ChartPopover.tsx  # その他タブのレンジ表ポップオーバー
│   ├── ChartView.tsx     # レンジ表単独ページ
│   ├── Feedback.tsx      # 回答後の頻度バー
│   ├── ModeSwitch.tsx    # モード切替
│   ├── MoreHub.tsx       # その他タブ
│   ├── PlayingCard.tsx   # カード画像
│   ├── PositionFilter.tsx# ポジション絞り込みフィルター
│   ├── RangeGrid.tsx     # 169ハンドのレンジグリッド
│   ├── SessionStats.tsx  # セッション成績・履歴
│   ├── TableDiagram.tsx  # テーブル図
│   └── TierLegend.tsx    # ヨコサワ色の凡例
├── data/
│   ├── ranges/           # レンジデータ（JSON）
│   ├── ranges.ts         # モード定義・レンジ一覧
│   ├── yokosawa.ts       # ヨコサワオープンレンジ定義
│   ├── yokosawaChart.ts  # ヨコサワレンジ表（ティア配色）
│   └── yokosawaVs.ts     # ヨコサワ vsレイズレンジ
├── lib/
│   ├── cards.ts          # カード生成ユーティリティ
│   ├── explain.ts        # 回答解説テキスト生成
│   ├── hands.ts          # ハンドのランダム生成・表記変換
│   ├── scoring.ts        # 採点ロジック
│   └── trainer.ts        # 出題フロー制御
├── store/
│   └── session.ts        # Zustand セッションストア（スコア・履歴）
└── types/
    └── range.ts          # Range / Action / Position 型定義
```

## Contributing

バグ報告・機能提案は [Issues](https://github.com/EgTheGoat/preflop-drill/issues) へ。  

## レンジデータの追加

`src/data/ranges/*.json` に JSON を追加するだけで練習シナリオを増やせる。  
スキーマは `src/types/range.ts` の `Range` 型を参照。

```ts
// 最小構成の例
{
  "id": "gtowiz_6max_vs_utg_bb",
  "label": "BB vs UTG オープン",
  "format": "6-max 100bb",
  "position": "BB",
  "scenario": "vs UTG オープン",
  "actions": ["fold", "call", "raise"],
  "hands": {
    "AKs": { "raise": 1 },
    "22":  { "call": 1 },
    "72o": { "fold": 1 }
  }
}
```

ヨコサワモードのレンジ構造は `src/data/yokosawa.ts` を参照。

## ライセンス

[MIT](./LICENSE)  
ヨコサワレンジ © 世界のヨコサワ（学習目的で参照）。
