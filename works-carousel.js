export function createWorksCarousel({ root, onOpen }) {
  if (!root) return createNoopCarousel();

  const ring = root.querySelector(".carousel-ring");
  const cards = [...root.querySelectorAll(".work-card")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let radius = 520;
  let autoTimer = 0;

  function layout() {
    radius = Math.max(360, Math.min(660, root.clientWidth * 0.46));
    cards.forEach((card, cardIndex) => {
      const angle = (360 / cards.length) * cardIndex;
      card.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`;
    });
    update();
  }

  function update() {
    const angle = -(360 / cards.length) * index;
    ring.style.transform = `translateZ(${-radius}px) rotateY(${angle}deg)`;
    cards.forEach((card, cardIndex) => {
      const distance = Math.min(
        Math.abs(cardIndex - index),
        Math.abs(cardIndex - index + cards.length),
        Math.abs(cardIndex - index - cards.length)
      );
      card.classList.toggle("is-front", distance === 0);
      card.classList.toggle("is-dimmed", distance > 1);
      card.tabIndex = distance === 0 ? 0 : -1;
      card.style.zIndex = String(20 - distance);
      card.style.pointerEvents = distance === 0 ? "" : "none";
    });
  }

  function go(direction) {
    index = (index + direction + cards.length) % cards.length;
    update();
  }

  function open(card) {
    const id = card.dataset.case;
    if (!id) return;
    const cardIndex = cards.indexOf(card);
    if (cardIndex !== index) {
      index = cardIndex;
      update();
      return;
    }
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

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  });

  root.addEventListener("pointerenter", () => clearInterval(autoTimer));
  root.addEventListener("pointerleave", startAuto);
  window.addEventListener("resize", layout);

  function startAuto() {
    clearInterval(autoTimer);
    if (!reducedMotion) autoTimer = window.setInterval(() => go(1), 9000);
  }

  layout();
  startAuto();

  return {
    go,
    refresh: layout,
    destroy() {
      clearInterval(autoTimer);
      window.removeEventListener("resize", layout);
    }
  };
}

function createNoopCarousel() {
  return {
    go() {},
    refresh() {},
    destroy() {}
  };
}
