const fs = require("node:fs");
const path = require("node:path");
const { expect, test } = require("@playwright/test");

const assertNoBrokenImages = async (page) => {
  const brokenImages = await page.$$eval("img", (images) =>
    images
      .filter((image) => !image.complete || image.naturalWidth === 0 || image.naturalHeight === 0)
      .map((image) => image.getAttribute("src"))
  );
  expect(brokenImages).toEqual([]);
};

const assertNoHorizontalOverflow = async (page) => {
  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(hasHorizontalOverflow).toBe(false);
};

test("renders the Art Shimoura site without broken assets", async ({ page }, testInfo) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/株式会社Art Shimoura/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("試作モデルのことなら、Art Shimouraへ。");
  await expect(page.locator('a[href="tel:09021980078"]')).toHaveCount(4);
  await expect(page.getByRole("navigation").getByRole("link", { name: "制作実績" })).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "サービス詳細ナビ" }).getByRole("link", { name: "塗装" })).toBeVisible();
  await expect(page.locator('.service-card a[href="./painting.html"]')).toHaveCount(1);
  await expect(page.locator('.service-card a[href="./modeling.html"]')).toHaveCount(1);
  await expect(page.locator('.service-card a[href="./industrial-design.html"]')).toHaveCount(1);
  await expect(page.locator('.service-card a[href="./data-production.html"]')).toHaveCount(1);
  await expect(page.locator("body")).toContainText("Professional Modeling Network System");
  await expect(page.locator("body")).toContainText("下浦 真実");
  await expect(page.locator("body")).toContainText("モデリングデータ作成販売");
  await expect(page.locator("body")).toContainText("少ロット簡易金型試作成型");
  await expect(page.locator("body")).toContainText("shimoura@art-shimoura.com");
  await expect(page.locator("body")).toContainText("Master CAM / FFCAM");
  await expect(page.locator("body")).toContainText("Rhinoceros");

  await assertNoBrokenImages(page);
  await assertNoHorizontalOverflow(page);

  const screenshotsDir = path.join(process.cwd(), "screenshots");
  fs.mkdirSync(screenshotsDir, { recursive: true });
  await page.screenshot({
    path: path.join(screenshotsDir, `${testInfo.project.name}-home.png`),
    fullPage: true,
  });
});

[
  { path: "/painting.html", heading: "塗装", text: "メッキ処理", images: 1 },
  { path: "/modeling.html", heading: "試作モデル", text: "ジュラコン", images: 7 },
  { path: "/industrial-design.html", heading: "工業デザイン", text: "25,000円", images: 2 },
  { path: "/data-production.html", heading: "データ製作", text: "STEP", images: 1 },
].forEach((servicePage) => {
  test(`renders ${servicePage.heading} detail page`, async ({ page }, testInfo) => {
    await page.goto(servicePage.path);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(servicePage.heading);
    await expect(page.locator("body")).toContainText(servicePage.text);
    if (servicePage.path === "/painting.html") {
      await expect(page.locator("body")).toContainText("インレタ");
      await expect(page.locator("body")).toContainText("シルク印刷");
      await expect(page.locator("body")).toContainText("コスト削減 - 発泡ウレタンでデザインモデル化");
      await expect(page.locator("body")).toContainText("材料費は約半額");
      await expect(page.locator("body")).toContainText("あらゆる造形仕上げから塗装まで対応します");
      await expect(page.locator("body")).toContainText("塗装なしの発泡モデル");
      await expect(page.locator("body")).toContainText("下地処理の発泡モデル");
      await expect(page.locator("body")).toContainText("上塗り塗装のイメージ");
      await expect(page.locator(".finish-carousel [data-rotator-overlay='3'] .painting-overlay-label", { hasText: "塗装なしの発泡モデル" })).toHaveCount(1);
      const paintingRotator = page.locator("[data-rotator-image]");
      await expect(paintingRotator).toHaveAttribute(
        "data-rotator-images",
        /^\.\/assets\/images\/services\/painting\/painting-01-display\.jpg\|\.\/assets\/images\/services\/painting\/painting-02-display\.jpg\|\.\/assets\/images\/services\/painting\/painting-04-display\.jpg\|\.\/assets\/images\/services\/painting\/painting-05-display\.jpg\|\.\/assets\/images\/services\/painting\/painting-06-display\.jpg\|\.\/assets\/images\/services\/painting\/painting-07-display\.jpg$/
      );
      await expect(paintingRotator).not.toHaveAttribute("data-rotator-images", /painting-03-display\.jpg/);
      expect(await paintingRotator.getAttribute("data-rotator-captions")).toBeNull();
      await expect(page.locator(".finish-carousel figcaption")).toHaveCount(0);
      await expect(page.locator(".finish-carousel .painting-overlay-note")).toHaveCount(0);
      await expect(page.locator("[data-rotator-dot]")).toHaveCount(6);
      const firstPaintingSource = await paintingRotator.getAttribute("src");
      await page.waitForTimeout(3200);
      expect(await paintingRotator.getAttribute("src")).not.toBe(firstPaintingSource);
    }
    if (servicePage.path === "/modeling.html") {
      await expect(page.locator("body")).toContainText("設備紹介");
      await expect(page.locator("body")).toContainText("表面処理を手加工にて対応します");
      await expect(page.locator("body")).toContainText("切削できる材料");
      await expect(page.locator("body")).toContainText("PPS（ガラス40％）");
      await expect(page.locator("body")).toContainText("部分変更");
      await expect(page.locator("body")).toContainText("溶接加工");
      await expect(page.locator("body")).toContainText("パイプ構造の溶接加工例");
      await expect(page.locator("body")).toContainText("ベイク 布・紙");
      await expect(page.locator("body")).toContainText("メーカー名 OKK");
      await expect(page.locator(".labeled-media .media-label", { hasText: "ジュラコン" })).toBeVisible();
      await expect(page.locator(".labeled-media .media-label", { hasText: "PP" })).toBeVisible();
      await expect(page.locator('img[src="./assets/images/services/modeling/modeling-06.jpg"]')).toHaveCount(1);
      await expect(page.locator('img[src="./assets/images/services/modeling/modeling-07.jpg"]')).toHaveCount(1);
    }
    if (servicePage.path === "/data-production.html") {
      await expect(page.locator("body")).toContainText("2Dデータから3Dデータを製作します");
      await expect(page.locator("body")).toContainText("その他主要3Dデータ形式");
      await expect(page.locator("body")).not.toContainText("設計データ・3D-CADギャラリー");
      await expect(page.locator("body")).toContainText("Master CAM / FFCAM");
      await expect(page.locator("body")).toContainText("IDEAS");
      await expect(page.locator("body")).toContainText("Pro Engineer");
      await expect(page.locator("body")).toContainText("Rhinoceros");
      await expect(page.locator("body")).toContainText("Solid Edge");
    }
    if (servicePage.path === "/industrial-design.html") {
      const rotatorImages = page.locator("[data-rotator-image]");
      await expect(rotatorImages).toHaveCount(2);
      const productRotator = rotatorImages.nth(0);
      const sketchRotator = rotatorImages.nth(1);
      await expect(productRotator).toHaveAttribute(
        "data-rotator-images",
        /^\.\/assets\/images\/services\/design\/design-01-display\.jpg\|\.\/assets\/images\/services\/design\/design-02-display\.jpg\|\.\/assets\/images\/services\/design\/design-06-display\.jpg\|\.\/assets\/images\/services\/design\/design-07-display\.png\|\.\/assets\/images\/services\/design\/design-08-display\.jpg\|\.\/assets\/images\/services\/design\/design-03-display\.jpg$/
      );
      await expect(sketchRotator).toHaveAttribute("data-rotator-images", /design-04-display\.jpg/);
      await expect(sketchRotator).toHaveAttribute("data-rotator-images", /design-05-display\.jpg/);
      expect(await productRotator.getAttribute("data-rotator-captions")).toBeNull();
      expect(await sketchRotator.getAttribute("data-rotator-captions")).toBeNull();
      await expect(page.locator(".design-carousel figcaption")).toHaveCount(0);
      await expect(page.locator(".design-carousel").nth(0).locator("[data-rotator-dot]")).toHaveCount(6);
      await expect(page.locator("body")).toContainText("コストを考慮します");
      await expect(page.locator("body")).toContainText("技術力はあるがデザインを採用したことがない");
      await expect(page.locator("body")).toContainText("お気軽にお問い合わせください");
      const firstProductSource = await productRotator.getAttribute("src");
      const firstSketchSource = await sketchRotator.getAttribute("src");
      await page.waitForTimeout(3200);
      expect(await productRotator.getAttribute("src")).not.toBe(firstProductSource);
      expect(await sketchRotator.getAttribute("src")).not.toBe(firstSketchSource);
    }
    await expect(page.getByRole("navigation", { name: "サービス詳細ナビ" }).getByRole("link", { name: servicePage.heading })).toBeVisible();
    await expect(page.locator("img")).toHaveCount(servicePage.images);

    await assertNoBrokenImages(page);
    await assertNoHorizontalOverflow(page);

    if (
      servicePage.path === "/painting.html" ||
      servicePage.path === "/modeling.html" ||
      servicePage.path === "/industrial-design.html"
    ) {
      const screenshotsDir = path.join(process.cwd(), "screenshots");
      fs.mkdirSync(screenshotsDir, { recursive: true });
      await page.screenshot({
        path: path.join(screenshotsDir, `${testInfo.project.name}-${servicePage.path.slice(1, -5)}.png`),
        fullPage: true,
      });
    }
  });
});

test("mobile navigation opens and closes", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile menu is only visible on the mobile project.");

  await page.goto("/");
  const toggle = page.getByRole("button", { name: "メニュー" });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#site-nav").getByRole("link", { name: "サービス" })).toBeVisible();

  await page.locator("#site-nav").getByRole("link", { name: "サービス" }).click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});
