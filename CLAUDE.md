# AI研修ポータル — CLAUDE.md

## プロジェクト概要

社内AI研修プログラムの公開サイト。
Astro + Tailwind CSS で構築した静的サイト。Claude Code で直接コンテンツ更新可能。

## 技術スタック

- **フレームワーク**: Astro v5（静的サイト生成）
- **CSS**: Tailwind CSS v4 + @tailwindcss/typography
- **コンテンツ**: Markdown（Content Collections）
- **デプロイ**: 未定（GitHub Pages / Vercel 予定）

## フォルダ構成

```
src/
├── content/
│   └── days/          ← 研修コンテンツ（day-01.md 〜 day-10.md）
├── content.config.ts  ← コレクション定義
├── layouts/
│   └── Layout.astro   ← 共通レイアウト
├── components/
│   └── DayCard.astro  ← Day一覧カード
├── pages/
│   ├── index.astro    ← ホーム
│   ├── curriculum.astro ← カリキュラム一覧
│   ├── gpts.astro     ← GPTs活用ガイド
│   ├── submit.astro   ← ワークログ提出
│   └── days/
│       └── [slug].astro ← Day詳細ページ
└── styles/
    └── global.css
```

## よく使うコマンド

```powershell
cd C:\Users\simma\ai-training-portal

# 開発サーバー
npx astro dev

# ビルド
npx astro build

# プレビュー
npx astro preview
```

## コンテンツ更新方法

### 研修内容を変更する

`src/content/days/day-XX.md` を直接編集する。

frontmatter（---囲み）で以下を設定：
- `title`: Day タイトル
- `day`: Day番号（1〜10）
- `level`: ChatGPT活用レベル（例: "レベル1〜2"）
- `duration`: 所要時間（例: "90〜120分"）
- `goals`: 今日のゴール（配列）
- `deliverable`: 提出物の説明

### ワークログフォームURLを設定する

`src/pages/submit.astro` の `GAS_APP_URL` 変数にGASデプロイURLを設定する。

## 関連ファイル

- 元コンテンツ: `C:\Users\simma\Documents\AI\社内AI研修\`
- GASワークログシステム: `C:\Users\simma\Documents\AI\社内AI研修\webapp\`
- NASバックアップ: `Z:\ai-training-materials\`
