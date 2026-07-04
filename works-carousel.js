export function createWorksCarousel({ root, onOpen, onFocus }) {
  if (!root) return createNoopCarousel();

  const cards = [...root.querySelectorAll(".work-card")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let progress = 0;
  let width = 1;
  let activeIndex = -1;

  function setProgress(nextProgress) {
    progress = clamp(nextProgress, 0, 1);
    layout();
  }

  function layout() {
    width = Math.max(360, root.clientWidth || window.innerWidth);
    const travel = cards.length - 1;
    const focus = progress * travel;
    const focusedIndex = Math.round(focus);
    if (focusedIndex !== activeIndex) {
      activeIndex = focusedIndex;
      onFocus?.(cards[activeIndex], activeIndex, cards.length);
    }
    const mobile = window.innerWidth < 720;

    cards.forEach((card, index) => {
      const offset = index - focus;
      const abs = Math.abs(offset);
      const direction = Math.sign(offset || 0);
      const depthStep = Math.min(abs, 4);
      const stair = Math.max(-2, Math.min(2, Math.round(offset)));
      const frontX = mobile ? 0 : -70;
      const x = mobile
        ? offset * width * 0.42
        : frontX + (offset >= 0 ? offset * width * 0.36 : offset * width * 0.24);
      const y = mobile ? -24 + depthStep * 14 : -58 + depthStep * 26 - Math.max(0, offset) * 16;
      const z = -depthStep * (mobile ? 125 : 230) - Math.max(0, offset) * 78;
      const rotateY = mobile ? -offset * 9 : offset >= 0 ? -22 - depthStep * 10 : 16 + depthStep * 5;
      const rotateX = mobile ? Math.min(6, abs * 1.4) : Math.max(-2, 3 - depthStep * 1.4);
      const scale = Math.max(mobile ? 0.62 : 0.4, 1.12 - depthStep * (mobile ? 0.13 : 0.18));
      const opacity = abs > (mobile ? 2.8 : 4.2) ? 0 : Math.max(0.1, 1 - abs * 0.23);
      const blur = abs > 1.35 ? Math.min(6.5, abs * 1.05) : 0;

      card.style.transform = `
        translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px)
        rotateY(${rotateY}deg)
        rotateX(${rotateX}deg)
        scale(${scale})
      `;
      card.style.opacity = opacity;
      card.style.filter = `blur(${blur}px)`;
      card.style.zIndex = String(160 - Math.round(abs * 16) + (direction < 0 ? 4 : 0));
      card.style.setProperty("--stair-index", String(stair));
      card.style.setProperty("--card-depth", abs.toFixed(3));
      card.classList.toggle("is-front", abs < 0.55);
      card.classList.toggle("is-next", offset > 0.5 && offset < 1.65);
      card.classList.toggle("is-prev", offset < -0.5 && offset > -1.65);
      card.tabIndex = abs < 0.8 ? 0 : -1;
    });
  }

  function open(card) {
    const id = card.dataset.case;
    if (!id) return;
    onOpen?.(id, card);
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => open(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open(card);
      }
    });
  });

  window.addEventListener("resize", layout);
  layout();

  return {
    setProgress,
    refresh: layout,
    destroy() {
      window.removeEventListener("resize", layout);
    }
  };
}

function createNoopCarousel() {
  return {
    setProgress() {},
    refresh() {},
    destroy() {}
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
