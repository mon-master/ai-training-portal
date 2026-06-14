# AI研修ポータル — CLAUDE.md

## プロジェクト概要

社内AI研修プログラムの公開サイト。Astro + Tailwind CSS で構築した静的サイト。
Claude Code で直接コンテンツ更新可能。本番稼働中（2026-06-14〜）。

**管理アカウント**: sim.mail1031@gmail.com（個人資産として管理。会社アカウント不使用）

---

## システム構成

| 項目 | 詳細 |
|---|---|
| ローカルパス | `C:\Users\simma\Documents\AI\ai-training-portal` |
| サイトURL | https://ai-training.smr-lab.com |
| GitHub | https://github.com/mon-master/ai-training-portal（masterブランチ） |
| デプロイ先 | Vercel（Hobbyプラン）— masterにpushで自動デプロイ |
| DNS | ムームーDNS: ai-training CNAME → cname.vercel-dns.com |
| スプレッドシート | `1Q7yPdJRXEdMiJBHZNH-Xb72GzGrzY3mpvHCLncWEw1Y` |
| スプレッドシートURL | https://docs.google.com/spreadsheets/d/1Q7yPdJRXEdMiJBHZNH-Xb72GzGrzY3mpvHCLncWEw1Y/edit |
| GASスクリプトID（旧・未使用） | `1GVa-Z5j2Nr2o7Pts-lgLRLqjOHAvzwrcZn_a0l9TW8egBkEGzQGTV5iM` |
| GASスクリプトID（現行・シート連携） | `18F8J0R6pv_jmkPGoD9zKbj2aHiYnKvfA2dqCJuoCGF6wjk4Y6-cUSBb3` |
| GASデプロイURL（現行） | `https://script.google.com/macros/s/AKfycbxl8vxepxzJIu9kv7bqy-JSSyG6looRfLJdManyG5NOhDqwng07YCRJgQLMHgeKcwDH/exec` |
| GASローカルパス | `C:\Users\simma\Documents\AI\社内AI研修\webapp\` |
| GAS GitHub | https://github.com/mon-master/ai-training-materials（mainブランチ） |
| Custom GPTs | https://chatgpt.com/g/g-6a292ed529788191bee0258e8fc880cd-aihuo-yong-torena |
| 認証情報 | Bitwarden「dev/ai-training-portal」 |
| 元コンテンツ | `C:\Users\simma\Documents\AI\社内AI研修\` |
| NASバックアップ | `Z:\ai-training-materials\` |

---

## 技術スタック

- **フレームワーク**: Astro v5（静的サイト生成）
- **CSS**: Tailwind CSS v4 + @tailwindcss/typography
- **コンテンツ**: Markdown（Content Collections）
- **認証**: middleware.ts（Vercel Edge Functionで Basic認証。トップ以外）

---

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
│   ├── index.astro        ← ホーム（Basic認証なし）
│   ├── curriculum.astro   ← カリキュラム一覧
│   ├── gpts.astro         ← GPTs活用ガイド
│   ├── submit.astro       ← ワークログ提出
│   └── days/
│       └── [slug].astro   ← Day詳細ページ
└── styles/
    └── global.css
middleware.ts              ← Basic認証設定
```

---

## よく使うコマンド

```powershell
cd C:\Users\simma\Documents\AI\ai-training-portal

# 開発サーバー
npx astro dev          # → http://localhost:4321

# ビルド確認
npx astro build
npx astro preview

# デプロイ（masterにpushするだけ）
git add src/content/days/day-XX.md
git commit -m "day-XX: 内容を更新"
git push
```

---

## コンテンツ更新方法

### 研修内容を変更する

`src/content/days/day-XX.md` を直接編集する。

frontmatter（---囲み）で以下を設定：

```yaml
---
title: "Day タイトル"
day: 1
level: "レベル1〜2"
duration: "90〜120分"
goals:
  - "ゴール1"
  - "ゴール2"
deliverable: "提出物の説明"
---
```

### ワークログフォームURLを変更する

GASを再デプロイした場合、`src/pages/submit.astro` の `GAS_APP_URL` 変数を更新する。

---

## 残タスク

- [x] GASウェブアプリの動作テスト（2026-06-14 完了：200応答、スプレッドシート書き込み確認済み）
- [ ] day-03〜10 のコンテンツ充実化（現在は最低限の内容）
- [ ] Bitwarden「dev/ai-training-portal」への認証情報登録確認

---

## 注意事項

- `shimura.sekido@gmail.com`（会社アカウント）は使わない。すべて `sim.mail1031@gmail.com` で管理
- `*.settings.local.json` は絶対にGitHubにpushしない（.gitignore設定済み）
- GASのURLは公開URL（秘密情報ではない）のためコードに直書きで問題なし
- VercelのBasic認証パスワードはVercel環境変数で管理（コードに書かない）
