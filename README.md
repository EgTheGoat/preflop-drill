# preflop-drill

テキサスホールデムのプリフロップレンジを反復練習するための Web アプリ。  
ポジションとハンドがランダムに出題され、選んだアクションを GTO レンジと照合してスコア表示する。  
PWA 対応でオフライン動作可能。

---

## 練習モード

| モード | テーブル | シナリオ |
|---|---|---|
| **GTO 6m** | 6-max 100bb キャッシュ | RFI（オープンするか） |
| **GTO 9m** | 9-max 100bb キャッシュ | RFI |
| **ヨコサワ（トーナメント）** | 9-max | オープン / vsレイズ（コール・3bet） |

## 採点方式

選んだアクションの **GTO 頻度 × 100** がそのまま得点になる。

- `raise 80% / fold 20%` のハンドで **raise** を選ぶ → **80点 ◯**
- 同ハンドで **fold** を選ぶ → **20点 ✗**
- 複数アクションが 20% 以上ある **混合域** では、いずれを選んでも ◯ 扱い

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
├── components/     # UI コンポーネント（Quiz, RangeGrid, TableDiagram など）
├── data/
│   ├── ranges/     # GTO レンジデータ（JSON）
│   ├── yokosawa.ts # ヨコサワモードのレンジ定義
│   └── yokosawaChart.ts / yokosawaVs.ts
├── lib/
│   ├── hands.ts    # ハンドのランダム生成・表記変換
│   ├── scoring.ts  # 採点ロジック
│   ├── trainer.ts  # 出題フロー制御
│   └── explain.ts  # 回答解説テキスト生成
├── store/
│   └── session.ts  # Zustand セッションストア（スコア・履歴）
└── types/
    └── range.ts    # Range / Action / Position 型定義
```

## インストール（PWA）

ブラウザからホーム画面に追加することで、アプリとして使える。

| ブラウザ | 手順 |
|---|---|
| iOS Safari | 共有ボタン →「ホーム画面に追加」 |
| Android Chrome | メニュー →「アプリをインストール」 |
| Desktop Chrome | アドレスバー右端のインストールアイコン |

インストール後はオフラインでも動作する。

## Contributing

バグ報告・機能提案は [Issues](https://github.com/EgTheGoat/preflop-drill/issues) へ。  

## レンジデータの追加

`src/data/ranges/*.json` に JSON を追加するだけで練習シナリオを増やせる。  
スキーマは `src/types/range.ts` の `Range` 型を参照。

```ts
// 最小構成の例
{
  "id": "6max_100bb_rfi_btn",
  "label": "BTN オープン (RFI)",
  "format": "6-max 100bb",
  "position": "BTN",
  "scenario": "RFI",
  "actions": ["fold", "raise"],
  "hands": {
    "AKs": { "raise": 1 },
    "72o": { "fold": 1 }
  }
}
```

ヨコサワモードのレンジ構造は `src/data/yokosawa.ts` を参照。

## ライセンス

[AGPL-3.0-or-later](./LICENSE)  
ヨコサワレンジ © 世界のヨコサワ（学習目的で参照）。GTOレンジは教科書的な自作サンプル。
