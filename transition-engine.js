export function createTransitionEngine() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let locked = false;

  function run({ beforeSwap, afterSwap } = {}) {
    if (locked) return;
    locked = true;
    try {
      beforeSwap?.();
      afterSwap?.();
    } finally {
      locked = false;
    }
  }

  function pulse(x, y) {
    if (reducedMotion) return;
    const dot = document.createElement("span");
    dot.className = "click-pulse";
    dot.setAttribute("aria-hidden", "true");
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    document.body.append(dot);
    dot.addEventListener("animationend", () => dot.remove(), { once: true });
  }

  return { run, pulse };
}
