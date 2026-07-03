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
      const x = mobile
        ? offset * width * 0.38
        : offset >= 0
          ? 110 + offset * width * 0.28
          : -120 + offset * width * 0.18;
      const y = mobile ? depthStep * 10 : depthStep * 30 - Math.max(0, offset) * 10;
      const z = -depthStep * (mobile ? 115 : 170) - Math.max(0, offset) * 46;
      const rotateY = mobile ? -offset * 10 : offset >= 0 ? -18 - depthStep * 11 : 13 + depthStep * 5;
      const rotateX = mobile ? Math.min(7, abs * 1.6) : Math.max(-3, 4 - depthStep * 1.8);
      const scale = Math.max(mobile ? 0.64 : 0.46, 1.05 - depthStep * (mobile ? 0.13 : 0.17));
      const opacity = abs > (mobile ? 2.7 : 4.4) ? 0 : Math.max(0.16, 1 - abs * 0.2);
      const blur = abs > 1.45 ? Math.min(5.2, abs * 0.82) : 0;

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
