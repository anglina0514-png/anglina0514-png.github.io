import { initPrismScene } from "./prism-scene.js";
import { createTransitionEngine } from "./transition-engine.js";
import { createWorksCarousel } from "./works-carousel.js";

const cases = {
  dragon: {
    label: "AI Film",
    title: "龙影之后",
    lead: "以 1970 年代唐人街武馆为叙事空间，完成从 30 镜头脚本、角色设定、首尾帧控制到成片输出的 AI 短片制作链路。",
    media: { type: "video", src: "assets/media/dragon-case-loop.mp4", poster: "assets/media/dragon-poster.jpg" },
    points: ["30 镜头故事板", "角色设定", "首尾帧控制"],
    role: "Writer / Prompt System / AI Film Direction",
    method: "30-shot storyboard + character continuity + keyframe control",
    result: "AI short film production proof",
    gallery: [
      "assets/cases/dragon-process/dragon-role-sheet.jpg",
      "assets/cases/dragon-process/dragon-cut04-first.jpg",
      "assets/cases/dragon-process/dragon-cut04-end.jpg",
      "assets/cases/dragon-process/dragon-final-frame.jpg"
    ]
  },
  qwen: {
    label: "AI Commercial",
    title: "千问有千手",
    lead: "用竖屏广告语言呈现多任务场景中的 AI 协作能力，把一个人的忙乱转化为被技术托住的高识别度叙事。",
    media: { type: "video", src: "assets/media/qwen-full.mp4", poster: "assets/media/qwen-poster.jpg" },
    points: ["竖屏叙事", "AI 助手广告", "脚本 分镜 成片"],
    role: "Script / AI Visual / Edit",
    method: "Vertical attention narrative",
    result: "AI assistant commercial proof",
    gallery: ["assets/cases/qwen-overview.jpg"]
  },
  haoshi: {
    label: "Brand Film",
    title: "豪士工厂",
    lead: "从食品品牌、工厂空间和鸟背视角建立动画制作稿，突出品牌资产、镜头调度和商业分镜控制。",
    media: { type: "video", src: "assets/media/haoshi-full.mp4", poster: "assets/media/haoshi-poster.jpg" },
    points: ["横屏品牌片", "工厂空间", "故事板制作"],
    role: "Storyboard / Brand Film / Visual Plan",
    method: "Factory space + character journey",
    result: "Brand film concept delivery",
    gallery: ["assets/cases/haoshi-storyboard.jpg", "assets/cases/haoshi-factory.jpg"]
  },
  quanyun: {
    label: "Event Video",
    title: "全运会宣传视频",
    lead: "以城市公共空间和活动现场为素材，完成宣传视频的节奏组织、镜头选择与事件氛围表达。",
    media: { type: "video", src: "assets/media/quanyun-full.mp4", poster: "assets/media/quanyun-poster.jpg" },
    points: ["活动记录", "宣传剪辑", "现场叙事"],
    role: "Footage Selection / Rhythm Edit",
    method: "Event atmosphere through motion",
    result: "Public event video output",
    gallery: ["assets/media/quanyun-poster.jpg"]
  },
  marxism: {
    label: "Theory Visual",
    title: "马克思主义中国化时代化",
    lead: "围绕马克思主义中国化时代化主题，用历史场景、现代交通、城市建设和未来意象串联理论表达。",
    media: { type: "video", src: "assets/media/marxism-full.mp4", poster: "assets/media/marxism-poster.jpg" },
    points: ["理论视频", "AI 视觉", "主题叙事"],
    role: "Theme Script / AI Visual / Edit",
    method: "Historical imagery + modernization narrative",
    result: "Coursework theory video output",
    gallery: ["assets/media/marxism-poster.jpg"]
  },
  ue5: {
    label: "UE5 Visual",
    title: "UE5 视觉实验",
    lead: "用 Unreal Engine 建立大场景镜头和科幻运动视觉，展示实时引擎画面、镜头氛围和空间调度能力。",
    media: { type: "video", src: "assets/media/ue5-full.mp4", poster: "assets/media/ue5-poster.jpg" },
    points: ["Unreal Engine", "Cinematic shot", "3D space"],
    role: "UE5 Scene / Camera / Cinematic",
    method: "Realtime spatial composition",
    result: "Next-gen visual proof",
    gallery: ["assets/media/ue5-poster.jpg"]
  },
  zhitou: {
    label: "Product Prototype",
    title: "知投学堂",
    lead: "面向投资小白的本土化智能投教学习平台，用课程 Stories、AI 问答和学习计划把金融知识转化为行动流。",
    media: { type: "iframe", src: "cases/zhitou/", title: "知投学堂原型预览" },
    points: ["投教产品", "AI 问答", "可点击原型"],
    role: "Product Strategy / Prototype / AI Q&A",
    method: "Beginner investing learning flow",
    result: "Clickable education product",
    gallery: ["assets/cases/zhitou-main.jpg", "assets/cases/zhitou-deck.jpg"],
    actions: [["Open Product", "https://zhitou-xuetang-d4g4cw845a2883397-1448213860.tcloudbaseapp.com/?v=auth-fix-20260702#home", true]]
  },
  loan: {
    label: "Interactive Game",
    title: "防网贷视觉游戏",
    lead: "把网贷娱乐化风险做成视觉小说式 H5，用压力条、评论判断和求助节点建立可体验的风险教育过程。",
    media: { type: "iframe", src: "cases/loan-game/", title: "防网贷视觉游戏预览" },
    points: ["H5 game", "风险叙事", "压力条机制"],
    role: "Interactive Narrative / H5 Game",
    method: "Pressure bar + decision nodes",
    result: "Risk education experience",
    gallery: ["assets/cases/loan-home.jpg", "assets/cases/loan-pressure.jpg"],
    actions: [["Open Game", "cases/loan-game/", true]]
  }
};

const stageSections = ["hero", "news", "works", "about", "products", "final"];
const hudNumbers = [...document.querySelectorAll("[data-hud]")].reduce((map, node) => {
  map[node.dataset.hud] = node;
  return map;
}, {});
const hudOrb = document.querySelector("[data-hud-orb]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const prismScene = initPrismScene({
  canvas: document.getElementById("prismCanvas"),
  reducedMotion
});
const transitionEngine = createTransitionEngine({
  overlay: document.getElementById("transitionOverlay"),
  prismScene
});
const worksCounter = document.getElementById("worksCounter");
const worksCurrentTitle = document.getElementById("worksCurrentTitle");
const workHitbox = document.getElementById("workHitbox");
const materialPresets = {
  ice: { label: "冰蓝玻璃", accent: "#88dfff", accentAlt: "#f7fbff" },
  white: { label: "白色玻璃", accent: "#ffffff", accentAlt: "#c8d7ff" },
  violet: { label: "紫色折射", accent: "#8f6dff", accentAlt: "#f1d9ff" },
  carbon: { label: "深色玻璃", accent: "#35518e", accentAlt: "#75f4ff" }
};
let activeMaterial = "ice";

let latestScroll = -1;
let ticking = false;
let pointerState = { x: 0, y: 0 };
let activeWorkCard = null;
let activeStageSection = "hero";
let activeAccent = { primary: "#6078ff", secondary: "#92e9ff", strength: 0 };
let hasSettledInitialSection = false;

const carousel = createWorksCarousel({
  root: document.getElementById("workCarousel"),
  onOpen: (id) => openCase(id),
  onFocus: (card, index, total) => updateWorkFocus(card, index, total)
});

const modal = document.getElementById("caseModal");
const modalContent = document.getElementById("modalContent");
const navLinks = [...document.querySelectorAll(".nav-link")];
const railItems = [...document.querySelectorAll("[data-rail-section]")];
const parallaxItems = [...document.querySelectorAll("[data-parallax]")];
const productCaseButtons = [...document.querySelectorAll("[data-open-case]")];
const heroParticles = initHeroParticleTitle({
  wrap: document.getElementById("heroParticleTitle"),
  canvas: document.getElementById("heroParticleTitleCanvas"),
  text: "NING",
  reducedMotion
});
const outroCanvas = initOutroCanvas({
  canvas: document.getElementById("outroCanvas"),
  reducedMotion
});

initNavigation();
initMagneticHover();
initParallax();
initModal();
initProductButtons();
initWorkHitbox();
initMaterialControls();
initAutoplayVideos();
initAmbientStage();
updateScrollState();

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
document.addEventListener("pointerdown", (event) => {
  transitionEngine.pulse(event.clientX, event.clientY);
  heroParticles.burst?.(event.clientX, event.clientY);
});

function requestScrollUpdate() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    updateScrollState();
  });
}

function updateScrollState() {
  const y = window.scrollY;
  if (Math.abs(y - latestScroll) < 0.5) return;
  latestScroll = y;

  const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const pageProgress = clamp(y / maxScroll, 0, 1);
  document.documentElement.style.setProperty("--page-progress", pageProgress.toFixed(4));

  const works = document.getElementById("works");
  const about = document.getElementById("about");
  const hero = document.getElementById("hero");
  const news = document.getElementById("news");
  const products = document.getElementById("products");
  const finalSection = document.getElementById("final");

  const worksProgress = sectionProgress(works);
  const aboutProgress = sectionProgress(about);
  const heroProgress = sectionProgress(hero);
  const newsProgress = sectionProgress(news);
  const productsProgress = sectionProgress(products);
  const finalProgress = sectionProgress(finalSection);

  document.documentElement.style.setProperty("--hero-progress", heroProgress.toFixed(4));
  document.documentElement.style.setProperty("--news-progress", newsProgress.toFixed(4));
  document.documentElement.style.setProperty("--works-progress", worksProgress.toFixed(4));
  document.documentElement.style.setProperty("--about-progress", aboutProgress.toFixed(4));
  document.documentElement.style.setProperty("--products-progress", productsProgress.toFixed(4));
  document.documentElement.style.setProperty("--final-progress", finalProgress.toFixed(4));
  prismScene.setScroll?.({
    page: pageProgress,
    hero: heroProgress,
    news: newsProgress,
    works: worksProgress,
    about: aboutProgress,
    products: productsProgress,
    final: finalProgress
  });
  carousel.setProgress?.(worksProgress);
  outroCanvas.setProgress?.(finalProgress);
  if (activeWorkCard) {
    const intensity = worksProgress > 0 && worksProgress < 1 ? smoothstep(0.06, 0.24, worksProgress) * (1 - smoothstep(0.9, 1, worksProgress)) : 0;
    applyWorkAccent(activeWorkCard, intensity);
  }
  updateHud({
    page: pageProgress,
    hero: heroProgress,
    news: newsProgress,
    works: worksProgress,
    about: aboutProgress,
    products: productsProgress,
    final: finalProgress
  });

  const active = pickActiveSection();
  if (active !== activeStageSection) {
    const previous = activeStageSection;
    activeStageSection = active;
    if (hasSettledInitialSection) transitionEngine.sectionShift?.(active, previous);
  }
  hasSettledInitialSection = true;
  document.body.dataset.activeSection = active;
  navLinks.forEach((link) => {
    const id = link.getAttribute("href")?.replace("#", "");
    link.classList.toggle("is-active", id === active);
  });
  railItems.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.railSection === active);
  });
}

function updateWorkFocus(card, index, total) {
  if (!card) return;
  activeWorkCard = card;
  const title = card.querySelector(".work-meta h3")?.textContent?.trim() || "";
  const label = String(index + 1).padStart(2, "0");
  const count = String(total).padStart(2, "0");
  if (worksCounter) worksCounter.textContent = `${label} / ${count}`;
  if (worksCurrentTitle) worksCurrentTitle.textContent = title;
  if (workHitbox) workHitbox.setAttribute("aria-label", `打开${title}详情`);
  applyWorkAccent(card, Number(getComputedStyle(document.documentElement).getPropertyValue("--works-progress")) || 0);
}

function applyWorkAccent(card, intensity = 1) {
  const accent = card.dataset.accent || "#6078ff";
  const accentAlt = card.dataset.accentAlt || "#92e9ff";
  const amount = clamp(intensity, 0, 1);
  activeAccent = { primary: accent, secondary: accentAlt, strength: amount };
  document.documentElement.style.setProperty("--work-accent", accent);
  document.documentElement.style.setProperty("--work-accent-alt", accentAlt);
  document.documentElement.style.setProperty("--work-accent-strength", amount.toFixed(3));
  document.documentElement.style.setProperty("--work-accent-soft", `${Math.round(amount * 24)}%`);
  document.documentElement.style.setProperty("--work-accent-mid", `${Math.round(amount * 38)}%`);
  document.documentElement.style.setProperty("--work-accent-strong", `${Math.round(amount * 54)}%`);
  document.documentElement.style.setProperty("--work-accent-max", `${Math.round(amount * 72)}%`);
  prismScene.setAccent?.(accent, accentAlt, amount);
}

function initAmbientStage() {
  if (reducedMotion) {
    document.documentElement.style.setProperty("--ambient-hue", "210");
    document.documentElement.style.setProperty("--ambient-shift", "0");
    document.documentElement.style.setProperty("--ambient-strength", "0.24");
    return;
  }

  const baseHues = {
    hero: 214,
    news: 232,
    works: 248,
    about: 190,
    products: 222,
    final: 260
  };

  function tick(time) {
    const t = time * 0.001;
    const accentHue = hueFromHex(activeAccent.primary);
    const sectionHue = baseHues[activeStageSection] ?? 214;
    const workBlend = activeStageSection === "works" ? activeAccent.strength : activeStageSection === "products" ? 0.28 : 0;
    const drift = Math.sin(t * 0.18) * 18 + Math.sin(t * 0.07 + 1.4) * 10;
    const hue = normalizeHue(lerp(sectionHue + drift, accentHue + Math.sin(t * 0.22) * 8, workBlend));
    const strength = activeStageSection === "about"
      ? 0.12 + Math.sin(t * 0.2) * 0.02
      : 0.24 + activeAccent.strength * 0.38 + Math.max(0, Math.sin(t * 0.16)) * 0.08;
    document.documentElement.style.setProperty("--ambient-hue", hue.toFixed(1));
    document.documentElement.style.setProperty("--ambient-shift", Math.sin(t * 0.13).toFixed(3));
    document.documentElement.style.setProperty("--ambient-strength", clamp(strength, 0.08, 0.72).toFixed(3));
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function initMaterialControls() {
  const swatches = [...document.querySelectorAll("[data-material]")];
  if (!swatches.length) return;
  swatches.forEach((button) => {
    button.addEventListener("click", () => setMaterialPreset(button.dataset.material || "ice"));
  });
  setMaterialPreset(activeMaterial);
}

function setMaterialPreset(id = "ice") {
  const preset = materialPresets[id] || materialPresets.ice;
  activeMaterial = materialPresets[id] ? id : "ice";
  document.documentElement.style.setProperty("--material-accent", preset.accent);
  document.documentElement.style.setProperty("--material-accent-alt", preset.accentAlt);
  setHudText("material", preset.label);
  document.querySelectorAll("[data-material]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.material === activeMaterial);
  });
  prismScene.setMaterialPreset?.(activeMaterial);
  prismScene.triggerGlitch?.(0.38);
}

function sectionProgress(section) {
  if (!section) return 0;
  const rect = section.getBoundingClientRect();
  const travel = rect.height - window.innerHeight;
  if (travel <= 0) return rect.top <= 0 ? 1 : 0;
  return clamp(-rect.top / travel, 0, 1);
}

function pickActiveSection() {
  let current = "hero";
  for (const id of stageSections.slice(1)) {
    const node = document.getElementById(id);
    if (node && node.getBoundingClientRect().top < window.innerHeight * 0.42) {
      current = id;
    }
  }
  return current;
}

function initNavigation() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href")?.slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      event.preventDefault();
      transitionEngine.run({
        source: link,
        beforeSwap: () => {
          prismScene.triggerGlitch?.(0.5);
          target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
        },
        afterSwap: requestScrollUpdate
      });
    });
  });
  document.getElementById("resetStage")?.addEventListener("click", () => {
    setMaterialPreset("ice");
    transitionEngine.run({
      beforeSwap: () => {
        prismScene.triggerGlitch?.(0.65);
        window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      },
      afterSwap: requestScrollUpdate
    });
  });
}

function initMagneticHover() {
  if (reducedMotion) return;
  document.querySelectorAll(".magnetic").forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * 0.14}px, ${y * 0.14}px)`;
    });
    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });
}

function initParallax() {
  window.addEventListener("pointermove", (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    pointerState = { x, y };
    prismScene.setPointer?.(x, y);
    updateHudPointer();
    if (reducedMotion) return;
    parallaxItems.forEach((item) => {
      const depth = Number(item.dataset.parallax || 0.08);
      item.style.transform = `translate3d(${x * depth * 40}px, ${y * depth * 32}px, 0)`;
    });
  }, { passive: true });
}

function initProductButtons() {
  productCaseButtons.forEach((button) => {
    button.addEventListener("click", () => openCase(button.dataset.openCase));
  });
}

function initWorkHitbox() {
  if (!workHitbox) return;
  workHitbox.addEventListener("click", () => {
    const id = activeWorkCard?.dataset.case;
    if (id) openCase(id);
  });
}

function initAutoplayVideos() {
  const previewVideos = [...document.querySelectorAll(".work-card video[autoplay]")];
  if (!previewVideos.length) return;

  const playAll = () => {
    previewVideos.forEach(tryPlayVideo);
  };

  previewVideos.forEach((video) => {
    video.addEventListener("loadeddata", () => tryPlayVideo(video), { once: true });
    video.addEventListener("canplay", () => tryPlayVideo(video), { once: true });
    tryPlayVideo(video);
  });

  ["pointerdown", "touchstart", "scroll"].forEach((eventName) => {
    window.addEventListener(eventName, playAll, { passive: true });
  });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) playAll();
  });
}

function tryPlayVideo(video) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  const playPromise = video.play();
  if (playPromise?.catch) playPromise.catch(() => {});
}

function initModal() {
  document.querySelectorAll("[data-close-modal]").forEach((node) => {
    node.addEventListener("click", closeModal);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal?.classList.contains("is-open")) closeModal();
  });
}

function openCase(id) {
  const item = cases[id];
  if (!item || !modal || !modalContent) return;
  prismScene.triggerGlitch?.(1);
  modalContent.innerHTML = renderCase(item);
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modalContent.querySelectorAll("video[autoplay]").forEach(tryPlayVideo);
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalContent?.querySelectorAll("video").forEach((video) => video.pause());
}

function renderCase(item) {
  const points = item.points.map((point) => `<span>${point}</span>`).join("");
  const breakdown = renderBreakdown(item);
  const gallery = item.gallery?.length
    ? `<div class="modal-gallery">${item.gallery.map((src) => `<img src="${src}" alt="${item.title} 过程素材" loading="lazy">`).join("")}</div>`
    : "";
  const actions = item.actions?.length
    ? `<div class="modal-actions">${item.actions.map(([label, href, external]) => `<a class="modal-action magnetic" href="${href}" ${external ? 'target="_blank" rel="noreferrer"' : "download"}>${label}</a>`).join("")}</div>`
    : "";

  return `
    <div class="modal-hero">
      <p class="system-label">${item.label}</p>
      <h2 id="modalTitle">${item.title}</h2>
      <p>${item.lead}</p>
      <div class="modal-tags">${points}</div>
    </div>
    ${renderMedia(item.media)}
    ${breakdown}
    ${gallery}
    ${actions}
  `;
}

function renderBreakdown(item) {
  return `
    <div class="modal-breakdown" aria-label="${item.title} 项目拆解">
      <article>
        <span>Role</span>
        <p>${item.role}</p>
      </article>
      <article>
        <span>Method</span>
        <p>${item.method}</p>
      </article>
      <article>
        <span>Result</span>
        <p>${item.result}</p>
      </article>
    </div>
  `;
}

function renderMedia(media) {
  if (media.type === "video") {
    return `
      <div class="modal-media">
        <video controls autoplay muted playsinline preload="auto" poster="${media.poster || ""}">
          <source src="${media.src}" type="video/mp4">
        </video>
      </div>
    `;
  }
  if (media.type === "iframe") {
    return `
      <div class="modal-media modal-iframe">
        <iframe src="${media.src}" title="${media.title}" loading="lazy"></iframe>
      </div>
    `;
  }
  return `
    <div class="modal-media">
      <img src="${media.src}" alt="${media.alt || ""}" loading="lazy">
    </div>
  `;
}

function updateHud(progress) {
  const page = progress.page;
  const stageBias = progress.works * 0.42 + progress.products * 0.28 + progress.news * 0.09;
  const qx = pointerState.y * -0.18 + progress.about * 0.11;
  const qy = pointerState.x * 0.22 + stageBias;
  const qz = Math.sin(page * Math.PI * 1.7) * 0.12;
  const qw = Math.max(0.72, 1 - Math.abs(qx) * 0.16 - Math.abs(qy) * 0.12 - progress.final * 0.1);
  setHudValue("qx", qx, 3);
  setHudValue("qy", qy, 3);
  setHudValue("qz", qz, 3);
  setHudValue("qw", qw, 3);
  setHudValue("roughness", 0.1 + progress.works * 0.08 + progress.products * 0.04, 2);
  setHudValue("noise", 9 + progress.news * 0.6 + progress.works * 1.8 + progress.products * 0.9, 1);
  updateHudPointer();
}

function updateHudPointer() {
  if (!hudOrb) return;
  const x = pointerState.x * 46;
  const y = pointerState.y * 46;
  hudOrb.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
}

function setHudValue(key, value, digits) {
  const node = hudNumbers[key];
  if (!node) return;
  node.textContent = Number(value).toFixed(digits);
}

function setHudText(key, value) {
  const node = hudNumbers[key];
  if (!node) return;
  node.textContent = value;
}

function initHeroParticleTitle({ wrap, canvas, text, reducedMotion }) {
  if (!wrap || !canvas || reducedMotion) return {};

  const ctx = canvas.getContext("2d");
  if (!ctx) return {};
  const sampleCanvas = document.createElement("canvas");
  const sampleCtx = sampleCanvas.getContext("2d");
  if (!sampleCtx) return {};

  const particles = [];
  const mouse = { x: -9999, y: -9999, active: false };
  let animationFrame = 0;
  let resizeTimer = 0;
  let cssWidth = 0;
  let cssHeight = 0;

  function resize() {
    const rect = wrap.getBoundingClientRect();
    cssWidth = Math.max(1, Math.floor(rect.width));
    cssHeight = Math.max(1, Math.floor(rect.height));
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createParticles();
  }

  function fitFontSize() {
    let fontSize = Math.min(cssWidth / 2.05, cssHeight * 0.86);
    const minFontSize = 64;

    while (fontSize > minFontSize) {
      ctx.font = `950 ${fontSize}px ${getComputedStyle(document.documentElement).getPropertyValue("--font-main") || "system-ui"}`;
      if (ctx.measureText(text).width <= cssWidth * 0.94) break;
      fontSize -= 3;
    }

    return fontSize;
  }

  function createParticles() {
    particles.length = 0;
    sampleCanvas.width = cssWidth;
    sampleCanvas.height = cssHeight;
    sampleCtx.clearRect(0, 0, cssWidth, cssHeight);
    sampleCtx.save();
    sampleCtx.fillStyle = "#fff";
    sampleCtx.textAlign = "center";
    sampleCtx.textBaseline = "middle";
    sampleCtx.font = `950 ${fitFontSize()}px ${getComputedStyle(document.documentElement).getPropertyValue("--font-main") || "system-ui"}`;
    sampleCtx.fillText(text, cssWidth / 2, cssHeight / 2);
    sampleCtx.restore();

    const imageData = sampleCtx.getImageData(0, 0, cssWidth, cssHeight);
    const data = imageData.data;
    const gap = cssWidth < 680 ? 4 : 5;

    for (let y = 0; y < cssHeight; y += gap) {
      for (let x = 0; x < cssWidth; x += gap) {
        const index = (y * cssWidth + x) * 4;
        if (data[index + 3] <= 120) continue;

        const angle = Math.random() * Math.PI * 2;
        const distance = 90 + Math.random() * Math.max(120, cssWidth * 0.28);
        particles.push({
          x: cssWidth / 2 + Math.cos(angle) * distance,
          y: cssHeight / 2 + Math.sin(angle) * distance,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          size: 0.9 + Math.random() * 1.75,
          phase: Math.random() * Math.PI * 2,
          opacity: 0.5 + Math.random() * 0.48,
          color: pickParticleColor(particles.length)
        });
      }
    }

    ctx.clearRect(0, 0, cssWidth, cssHeight);
    document.body.classList.add("hero-particles-ready");
  }

  function pickParticleColor(index) {
    if (index % 41 === 0) return "rgba(178, 238, 255, 0.96)";
    if (index % 23 === 0) return "rgba(142, 125, 255, 0.92)";
    if (index % 17 === 0) return "rgba(244, 247, 255, 0.88)";
    return "rgba(220, 228, 218, 0.8)";
  }

  function draw() {
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    particles.forEach((particle) => {
      const dx = particle.baseX - particle.x;
      const dy = particle.baseY - particle.y;
      particle.vx += dx * 0.012;
      particle.vy += dy * 0.012;

      if (mouse.active) {
        const mx = particle.x - mouse.x;
        const my = particle.y - mouse.y;
        const distance = Math.hypot(mx, my);
        const radius = Math.min(180, Math.max(96, cssWidth * 0.13));

        if (distance < radius && distance > 0.1) {
          const force = (radius - distance) / radius;
          const angle = Math.atan2(my, mx);
          particle.vx += Math.cos(angle) * force * 1.7;
          particle.vy += Math.sin(angle) * force * 1.7;
        }
      }

      particle.vx *= 0.88;
      particle.vy *= 0.88;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.phase += 0.018;

      ctx.beginPath();
      ctx.globalAlpha = Math.max(0.18, Math.min(1, particle.opacity + Math.sin(particle.phase) * 0.11));
      ctx.fillStyle = particle.color;
      ctx.shadowColor = "rgba(116, 130, 255, 0.86)";
      ctx.shadowBlur = 8;
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    animationFrame = requestAnimationFrame(draw);
  }

  function setMouse(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = clientX - rect.left;
    mouse.y = clientY - rect.top;
    mouse.active = true;
  }

  canvas.addEventListener("pointermove", (event) => setMouse(event.clientX, event.clientY));
  canvas.addEventListener("pointerleave", () => {
    mouse.active = false;
    mouse.x = -9999;
    mouse.y = -9999;
  });
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 160);
  });

  resize();
  draw();

  return {
    burst(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return;
      setMouse(clientX, clientY);
      window.setTimeout(() => {
        mouse.active = false;
      }, 260);
    },
    destroy() {
      cancelAnimationFrame(animationFrame);
    }
  };
}

function initOutroCanvas({ canvas, reducedMotion }) {
  if (!canvas || reducedMotion) return {};
  const ctx = canvas.getContext("2d");
  if (!ctx) return {};
  let width = 1;
  let height = 1;
  let progress = 0;
  let noiseSeed = 0;
  let raf = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width * Math.min(window.devicePixelRatio || 1, 1.5)));
    height = Math.max(1, Math.floor(rect.height * Math.min(window.devicePixelRatio || 1, 1.5)));
    canvas.width = width;
    canvas.height = height;
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    const t = time * 0.001;
    const alpha = Math.min(1, Math.max(0, progress * 1.4));
    const fontSize = Math.max(110, width * 0.24);
    const scanShift = (t * 54) % 42;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(255,255,255,0.045)";
    for (let y = -42; y < height + 42; y += 18) {
      ctx.fillRect(0, y + scanShift + Math.sin(t + y * 0.01) * 6, width, 1);
    }

    ctx.save();
    ctx.globalAlpha = alpha * 0.18;
    ctx.fillStyle = "#fff";
    for (let i = 0; i < 800; i += 1) {
      noiseSeed = (noiseSeed * 1664525 + 1013904223) >>> 0;
      const x = (noiseSeed / 4294967296) * width;
      noiseSeed = (noiseSeed * 1664525 + 1013904223) >>> 0;
      const y = (noiseSeed / 4294967296) * height;
      ctx.fillRect(x, y, 1.1, 1.1);
    }
    ctx.restore();

    ctx.font = `900 ${fontSize}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const shift = Math.sin(t * 0.7) * width * 0.012;
    ctx.globalCompositeOperation = "lighter";
    ctx.fillStyle = "rgba(96,220,255,0.24)";
    ctx.fillText("NING", width / 2 + shift + 9, height / 2 - 4);
    ctx.fillStyle = "rgba(255,78,238,0.2)";
    ctx.fillText("NING", width / 2 - shift - 8, height / 2 + 7);
    ctx.fillStyle = "rgba(255,255,255,0.34)";
    ctx.fillText("NING", width / 2, height / 2);
    ctx.globalAlpha = alpha * 0.22;
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = Math.max(1, width * 0.001);
    ctx.strokeText("CONTACTME", width / 2, height / 2 + fontSize * 0.38);
    ctx.globalCompositeOperation = "source-over";
    raf = requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  raf = requestAnimationFrame(draw);

  return {
    setProgress(value) {
      progress = clamp(value, 0, 1);
    },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    }
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(edge0, edge1, value) {
  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}

function hueFromHex(hex) {
  const value = String(hex || "").replace("#", "");
  if (value.length !== 6) return 214;
  const r = parseInt(value.slice(0, 2), 16) / 255;
  const g = parseInt(value.slice(2, 4), 16) / 255;
  const b = parseInt(value.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (!delta) return 214;
  let hue = 0;
  if (max === r) hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;
  return (hue * 60 + 360) % 360;
}

function normalizeHue(value) {
  return ((value % 360) + 360) % 360;
}

function lerp(a, b, t) {
  return a + (b - a) * clamp(t, 0, 1);
}
