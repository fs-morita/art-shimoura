# 株式会社Art Shimoura 静的サイト

既存HPを参考に作成した、GitHub Pages公開向けの静的サイトです。

## ファイル構成

- `index.html`: サイト本体（塗装・PP溶着を2枚看板にした構成）
- `painting.html`: 塗装の詳細ページ
- `pp-welding.html`: PP溶着の詳細ページ
- `modeling.html`: 試作モデルの詳細ページ
- `industrial-design.html`: 工業デザインの詳細ページ
- `data-production.html`: データ製作の詳細ページ
- `styles.css`: レイアウト、レスポンシブ、デザイン
- `script.js`: モバイルナビ、ヘッダー表示、年表示、ヒーロー動画、スクロール表示アニメーション
- `assets/images/`: TOP用に生成した画像、既存HPから取得した画像、表示用に軽量化した画像
- `assets/images/services/`: 既存HPの各サービス詳細ページから取得した画像
- `assets/images/morita/`: 社長支給の実写（**守秘義務あり・非公開**。`.gitignore` 済み）
- `assets/videos/`: ヒーロー動画（`hero-painting.mp4` が本番用。`hero-candidate-a/b.mp4` は選定用の候補）

## ローカルで確認する

ブラウザで `index.html` を直接開くと確認できます。

ローカルサーバーで確認する場合:

```bash
python3 -m http.server 8000
```

その後、ブラウザで以下を開きます。

```text
http://localhost:8000
```

## Playwrightで表示確認する

初回のみ依存関係とブラウザをインストールします。

```bash
npm install
npm run playwright:install
```

LinuxでChromium起動時に `libnspr4.so` などの共有ライブラリ不足が出る場合は、OS依存パッケージも入れます。

```bash
sudo npm run playwright:install-deps
```

PC幅・スマホ幅のスクリーンショット確認を実行します。

```bash
npm test
```

スクリーンショットは `screenshots/` に出力されます。

## GitHub Pagesで公開する

1. このリポジトリをGitHubにpushします。
2. GitHubのリポジトリ画面で `Settings` を開きます。
3. `Pages` を開きます。
4. `Build and deployment` の `Source` を `Deploy from a branch` にします。
5. `Branch` を `main`、フォルダを `/root` に設定して保存します。

## 社長支給の実写について（守秘義務・重要）

`assets/images/morita/` に、社長から支給されたPP溶着・塗装・切削の実写があります。
**守秘義務があり公開できません。** `.gitignore` に登録済みで、リポジトリには含まれません。

- サイトには一切掲載していません。
- 外部のAIサービスにもアップロードしていません（img2imgは使っていません）。
- AI画像を作る際の**参考**としてのみ使用し、特徴（乳白半透明のPP・削り出し・
  溶着継ぎ目・明るい工房）だけを再現した**架空の部品**をテキストプロンプトで生成しています。

このディレクトリを誤ってコミットしないよう、作業前に必ず確認してください。

```bash
git check-ignore -v assets/images/morita/   # 無視されていることを確認
git status --short | grep morita            # 何も出なければOK
```

## 差し替えが必要な仮素材（重要）

現在、以下はAI生成の仮素材・仮テキストです。実素材が入手でき次第、差し替えてください。
該当箇所はHTML内に `TODO(要確認)` コメントを入れています。

- `assets/images/services/pp-welding/*.jpg`（PP溶着の製作物イメージ／全6枚AI生成）
- `pp-welding.html` の本文（支給写真から読み取った内容。対応寸法・工法の使い分け・
  対応樹脂・水密性の実績は**未確認**）
- `index.html` のPP溶着カード内の4項目
- `assets/images/services/painting/painting-hero.jpg`（塗装ページのヒーロー／AI生成）
- **`assets/images/hero-painting-still.jpg` と `assets/videos/hero-painting.mp4`（トップのヒーロー動画とポスター）**
  現状は**車のボンネットを塗っている絵**で、試作モデルの塗装屋という業種と合っていません。
  動画の作り直しに約10クレジット必要なため未対応です。優先度high。
  ※塗装ページ側のヒーローは差し替え済み。動画を作り直す際、ポスターも同時に差し替えてください。

社長ヒアリングで確定させたい項目:

- 溶着で対応できる最大寸法
- 熱板／熱風／押出の使い分け（対応していない工法は削除する）
- PP以外に対応できる樹脂（PE / PVC / PVDF は現状**裏付けなしの仮置き**）
- 水密・気密の実績をうたってよいか
- 公開可能な実写の有無（AI画像より優先して差し替える）

TODO箇所の一覧は次のコマンドで確認できます。

```bash
grep -rn "TODO(要確認)" *.html
```

## 更新時の注意

- 会社名は `株式会社Art Shimoura` に統一しています。
- 代表者名は `下浦 真実` に統一しています。
- お問い合わせは電話案内のみで、フォームは設置していません。
- 画像を差し替える場合は `assets/images/` に配置し、`index.html` の画像パスを変更してください。
