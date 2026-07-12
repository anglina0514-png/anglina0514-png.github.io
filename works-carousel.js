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
    const focus = smoothstep(0, 1, progress) * travel;
    const stairShift = Math.sin(focus * Math.PI * 0.5);
    document.documentElement.style.setProperty("--work-index-progress", focus.toFixed(3));
    document.documentElement.style.setProperty("--work-stair-shift", stairShift.toFixed(3));
    document.documentElement.style.setProperty("--work-stair-x", `${(stairShift * 2).toFixed(3)}%`);
    document.documentElement.style.setProperty("--work-stair-y", `${(stairShift * 1.5).toFixed(3)}vh`);
    document.documentElement.style.setProperty("--work-stair-rot", `${(stairShift * 1.6).toFixed(3)}deg`);
    document.documentElement.style.setProperty("--work-ghost-shift", `${(focus * -18).toFixed(3)}vw`);
    document.documentElement.style.setProperty("--work-symbol-x", `${(focus * -90).toFixed(3)}px`);
    document.documentElement.style.setProperty("--work-symbol-y", `${(focus * 44).toFixed(3)}px`);
    document.documentElement.style.setProperty("--work-symbol-x-alt", `${(focus * -130).toFixed(3)}px`);
    document.documentElement.style.setProperty("--work-symbol-y-alt", `${(focus * -42).toFixed(3)}px`);
    document.documentElement.style.setProperty("--work-symbol-x-wide", `${(focus * -170).toFixed(3)}px`);
    document.documentElement.style.setProperty("--work-symbol-x-rev", `${(focus * 110).toFixed(3)}px`);
    document.documentElement.style.setProperty("--work-symbol-y-neg", `${(focus * -36).toFixed(3)}px`);
    document.documentElement.style.setProperty("--work-symbol-y-soft", `${(focus * 28).toFixed(3)}px`);
    document.documentElement.style.setProperty("--work-symbol-y-deep", `${(focus * 58).toFixed(3)}px`);
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
      const depthStep = Math.min(abs, 4.2);
      const stair = Math.max(-2, Math.min(2, Math.round(offset)));
      const nearCenter = 1 - clamp(abs, 0, 1);
      const boundaryEase = Math.min(1, abs / 2.8);
      const side = direction || (index < focusedIndex ? -1 : 1);
      const x = mobile
        ? offset * width * 0.62
        : side * (Math.pow(abs, 0.82) * width * (offset > 0 ? 0.49 : 0.43));
      const y = mobile
        ? -34 + depthStep * 22
        : -34 + depthStep * 34 + Math.sin((index + focus) * 0.8) * 8 - Math.max(0, offset) * 20;
      const z = nearCenter > 0.52
        ? -18 + nearCenter * 26
        : -boundaryEase * (mobile ? 230 : 650) - Math.max(0, offset) * (mobile ? 70 : 180);
      const rotateY = mobile
        ? -offset * 13
        : nearCenter > 0.55
          ? offset * -4
          : side * (24 + boundaryEase * 28) * -1;
      const rotateX = mobile ? Math.min(7, abs * 1.6) : -1.8 + nearCenter * 2.2 + boundaryEase * 3.4;
      const rotateZ = mobile ? offset * -0.7 : side * boundaryEase * -1.8;
      const scale = Math.max(mobile ? 0.6 : 0.34, 1.03 - depthStep * (mobile ? 0.15 : 0.17) + nearCenter * 0.035);
      const opacity = abs > (mobile ? 2.25 : 3.85) ? 0 : Math.max(0.08, 1 - abs * 0.31);
      const blur = abs > 1.08 ? Math.min(8, (abs - 0.8) * 1.55) : 0;

      card.style.transform = `
        translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px)
        rotateY(${rotateY}deg)
        rotateX(${rotateX}deg)
        rotateZ(${rotateZ}deg)
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

function smoothstep(edge0, edge1, value) {
  const x = clamp((value - edge0) / (edge1 - edge0 || 1), 0, 1);
  return x * x * (3 - 2 * x);
}
