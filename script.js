const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const year = document.querySelector("[data-year]");
const imageRotators = document.querySelectorAll("[data-image-rotator]");

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
