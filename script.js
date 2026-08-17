const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");
const imageRotators = document.querySelectorAll("[data-image-rotator]");
const heroVideo = document.querySelector("[data-hero-video]");
const revealTargets = document.querySelectorAll("[data-reveal]");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (year) {
  year.textContent = String(new Date().getFullYear());
}

const syncHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const closeNav = () => {
  if (!nav || !navToggle) return;
  nav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
};

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeNav();
    }
  });
}

// ヒーロー動画: PC幅かつ通信量の制限がない場合のみ読み込む
// （スマホ・低速回線・アニメーション抑制設定ではポスター画像のみを表示）
if (heroVideo instanceof HTMLVideoElement) {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const saveData = Boolean(connection && connection.saveData);
  const source = heroVideo.dataset.heroVideoSrc;
  const canLoadVideo = Boolean(source) && !prefersReducedMotion && !saveData && window.innerWidth >= 760;

  heroVideo.addEventListener("error", () => {
    heroVideo.hidden = true;
  });

  if (canLoadVideo) {
    heroVideo.src = source;
    const playAttempt = heroVideo.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {
        /* 自動再生がブロックされた場合はポスター画像を表示したままにする */
      });
    }
  }
}

// スクロールに合わせた表示アニメーション
if (revealTargets.length > 0) {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("is-revealed"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );

    revealTargets.forEach((target) => revealObserver.observe(target));
  }
}

imageRotators.forEach((rotator) => {
  const image = rotator.querySelector("[data-rotator-image]");
  if (!(image instanceof HTMLImageElement)) return;

  const sources = (image.dataset.rotatorImages || "").split("|").filter(Boolean);
  if (sources.length < 2) return;

  const alts = (image.dataset.rotatorAlts || "").split("|");
  const captions = (image.dataset.rotatorCaptions || "").split("|");
  const caption = rotator.querySelector("[data-rotator-caption]");
  const dots = Array.from(rotator.querySelectorAll("[data-rotator-dot]"));
  const overlays = Array.from(rotator.querySelectorAll("[data-rotator-overlay]"));
  let currentIndex = 0;

  sources.forEach((source) => {
    const preload = new Image();
    preload.src = source;
  });

  const syncOverlays = () => {
    overlays.forEach((overlay) => {
      overlay.classList.toggle("is-active", overlay.dataset.rotatorOverlay === String(currentIndex));
    });
  };

  syncOverlays();

  const showImage = (nextIndex) => {
    currentIndex = nextIndex % sources.length;
    image.classList.add("is-changing");

    window.setTimeout(() => {
      image.src = sources[currentIndex];
      image.alt = alts[currentIndex] || image.alt;
      if (caption) {
        caption.textContent = captions[currentIndex] || "";
      }
      dots.forEach((dot, index) => {
        dot.classList.toggle("is-active", index === currentIndex);
      });
      syncOverlays();
      image.classList.remove("is-changing");
    }, 180);
  };

  window.setInterval(() => {
    showImage(currentIndex + 1);
  }, 2600);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNav();
  }
});

window.addEventListener("scroll", syncHeaderState, { passive: true });
syncHeaderState();
