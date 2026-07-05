export function createTransitionEngine({ overlay, prismScene }) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let locked = false;
  let sectionTimer = 0;

  async function run({ source, beforeSwap, afterSwap } = {}) {
    if (locked) return;
    locked = true;
    document.body.classList.add("is-transitioning");
    overlay?.classList.add("is-active", "is-route");
    prismScene?.triggerGlitch(reducedMotion ? 0.22 : 0.46);

    if (!reducedMotion) scatterFragments(source, 8);
    await wait(reducedMotion ? 80 : 360);
    beforeSwap?.();
    await wait(reducedMotion ? 60 : 180);
    afterSwap?.();
    await wait(reducedMotion ? 80 : 360);

    overlay?.classList.remove("is-active", "is-route");
    document.body.classList.remove("is-transitioning");
    locked = false;
  }

  function sectionShift(nextSection, previousSection) {
    if (reducedMotion || locked || nextSection === previousSection) return;
    window.clearTimeout(sectionTimer);
    document.body.classList.add("is-section-shifting");
    overlay?.classList.add("is-active", "is-section");
    overlay?.setAttribute("data-section", nextSection || "");
    prismScene?.triggerGlitch(0.18);
    sectionTimer = window.setTimeout(() => {
      overlay?.classList.remove("is-active", "is-section");
      document.body.classList.remove("is-section-shifting");
    }, 640);
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

function scatterFragments(source, limit = 10) {
  const candidates = source
    ? [source, ...source.querySelectorAll("h1,h2,h3,p,strong,span,.data-card,.work-card")]
    : [...document.querySelectorAll(".page-panel.is-active h1,.page-panel.is-active h2,.page-panel.is-active .data-card")];

  candidates.slice(0, limit).forEach((node, index) => {
    const rect = node.getBoundingClientRect();
    if (rect.width < 12 || rect.height < 10) return;
    const fragment = document.createElement("span");
    fragment.className = "fragment";
    fragment.textContent = node.textContent?.trim().slice(0, 18) || "DATA";
    fragment.style.left = `${rect.left + rect.width * (0.18 + (index % 4) * 0.18)}px`;
    fragment.style.top = `${rect.top + rect.height * (0.24 + (index % 3) * 0.2)}px`;
    fragment.style.fontSize = `${Math.max(12, Math.min(24, rect.height * 0.22))}px`;
    fragment.style.setProperty("--tx", `${(index % 2 ? -1 : 1) * (80 + index * 10)}px`);
    fragment.style.setProperty("--ty", `${-24 + (index % 4) * 18}px`);
    fragment.style.setProperty("--rot", `${(index % 2 ? -1 : 1) * (2 + index * 0.6)}deg`);
    document.body.append(fragment);
    fragment.addEventListener("animationend", () => fragment.remove(), { once: true });
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
