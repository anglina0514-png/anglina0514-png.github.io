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
      const frontX = 0;
      const x = mobile
        ? offset * width * 0.52
        : frontX + (offset >= 0 ? offset * width * 0.56 : offset * width * 0.42);
      const y = mobile ? -34 + depthStep * 16 : -70 + depthStep * 24 - Math.max(0, offset) * 10;
      const z = -depthStep * (mobile ? 150 : 315) - Math.max(0, offset) * 120;
      const rotateY = mobile ? -offset * 10 : offset >= 0 ? -17 - depthStep * 9 : 20 + depthStep * 7;
      const rotateX = mobile ? Math.min(5, abs * 1.2) : Math.max(-3, 1.5 - depthStep * 0.9);
      const scale = Math.max(mobile ? 0.68 : 0.38, 1.04 - depthStep * (mobile ? 0.12 : 0.15));
      const opacity = abs > (mobile ? 2.2 : 3.6) ? 0 : Math.max(0.12, 1 - abs * 0.27);
      const blur = abs > 1.15 ? Math.min(7, abs * 1.2) : 0;

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
      card.classList.toggle("is-front", index === focusedIndex);
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
