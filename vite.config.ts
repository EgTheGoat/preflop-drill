/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 既存の public/manifest.webmanifest と index.html の <link rel="manifest"> を
      // そのまま使うため、プラグインによる manifest 生成は無効化し SW のみ担当させる。
      manifest: false,
      injectRegister: "auto", // SW 登録スクリプトを自動注入
      registerType: "autoUpdate", // 新ビルドを検知したら自動更新
      workbox: {
        // ビルド成果物（JS/CSS/HTML/画像/フォント等）をプリキャッシュ → オフライン起動
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2,json,webmanifest}"],
        navigateFallback: "/index.html", // SPA のオフライン時フォールバック
        cleanupOutdatedCaches: true,
      },
      includeAssets: ["icon.svg", "apple-touch-icon.png"],
      devOptions: {
        enabled: false, // 開発時は SW 無効（キャッシュで混乱しないように）
      },
    }),
  ],
  server: {
    host: true, // LAN 内の他デバイス（iPhone 等）からアクセスできるよう全インターフェースにバインド
    port: 5180,
  },
  preview: {
    host: true,
    port: 5180,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
