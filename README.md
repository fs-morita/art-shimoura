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

## 差し替えが必要な仮素材（重要）

現在、以下はAI生成の仮素材・仮テキストです。実素材が入手でき次第、差し替えてください。
該当箇所はHTML内に `TODO(要確認)` コメントを入れています。

- `pp-welding.html` の本文全体（工法、対応素材、製作例、フロー）
- `index.html` のPP溶着カード内の4項目
- `assets/images/services/pp-welding/*.jpg`（PP溶着の作業・製作物イメージ）
- `assets/images/hero-painting-still.jpg`、`assets/videos/hero-painting.mp4`（塗装ブースの映像・静止画）

TODO箇所の一覧は次のコマンドで確認できます。

```bash
grep -rn "TODO(要確認)" *.html
```

## 更新時の注意

- 会社名は `株式会社Art Shimoura` に統一しています。
- 代表者名は `下浦 真実` に統一しています。
- お問い合わせは電話案内のみで、フォームは設置していません。
- 画像を差し替える場合は `assets/images/` に配置し、`index.html` の画像パスを変更してください。
