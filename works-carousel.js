export function createWorksCarousel({ root, onOpen }) {
  if (!root) return createNoopCarousel();

  const cards = [...root.querySelectorAll(".work-card")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let progress = 0;
  let width = 1;

  function setProgress(nextProgress) {
    progress = clamp(nextProgress, 0, 1);
    layout();
  }

  function layout() {
    width = Math.max(360, root.clientWidth || window.innerWidth);
    const travel = cards.length - 1;
    const focus = progress * travel;
    const radius = Math.min(920, Math.max(420, width * 0.62));
    const mobile = window.innerWidth < 720;

    cards.forEach((card, index) => {
      const offset = index - focus;
      const abs = Math.abs(offset);
      const angle = offset * (mobile ? 18 : 27);
      const x = Math.sin(angle * Math.PI / 180) * radius;
      const z = Math.cos(angle * Math.PI / 180) * 220 - 235 - abs * 68;
      const y = Math.sin((progress * 1.8 + index) * Math.PI) * (mobile ? 10 : 24);
      const scale = Math.max(mobile ? 0.62 : 0.5, 1.04 - abs * (mobile ? 0.13 : 0.18));
      const opacity = abs > (mobile ? 2.6 : 3.35) ? 0 : Math.max(0.18, 1 - abs * 0.24);
      const blur = abs > 1.35 ? Math.min(5, abs * 0.85) : 0;

      card.style.transform = `
        translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px)
        rotateY(${-angle * 0.92}deg)
        rotateX(${Math.min(8, abs * 2.2)}deg)
        scale(${scale})
      `;
      card.style.opacity = opacity;
      card.style.filter = `blur(${blur}px)`;
      card.style.zIndex = String(100 - Math.round(abs * 10));
      card.classList.toggle("is-front", abs < 0.55);
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
