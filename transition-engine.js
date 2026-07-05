export function createTransitionEngine({ overlay, prismScene }) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let locked = false;

  async function run({ source, beforeSwap, afterSwap } = {}) {
    if (locked) return;
    locked = true;
    beforeSwap?.();
    await wait(reducedMotion ? 0 : 80);
    afterSwap?.();
    locked = false;
  }

  function sectionShift(nextSection, previousSection) {
    if (reducedMotion || locked || nextSection === previousSection) return;
    overlay?.setAttribute("data-section", nextSection || "");
  }

  function pulse(x, y) {
    const dot = document.createElement("span");
    dot.className = "click-pulse";
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    document.body.append(dot);
    dot.addEventListener("animationend", () => dot.remove(), { once: true });
  }

  return { run, pulse, sectionShift };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
