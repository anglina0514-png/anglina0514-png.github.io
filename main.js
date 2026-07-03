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

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const prismScene = initPrismScene({
  canvas: document.getElementById("prismCanvas"),
  reducedMotion
});
const transitionEngine = createTransitionEngine({
  overlay: document.getElementById("transitionOverlay"),
  prismScene
});
const carousel = createWorksCarousel({
  root: document.getElementById("workCarousel"),
  onOpen: (id) => openCase(id)
});

const modal = document.getElementById("caseModal");
const modalContent = document.getElementById("modalContent");
const navLinks = [...document.querySelectorAll(".nav-link")];
const parallaxItems = [...document.querySelectorAll("[data-parallax]")];

let latestScroll = -1;
let ticking = false;

initNavigation();
initMagneticHover();
initParallax();
initModal();
updateScrollState();

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
document.addEventListener("pointerdown", (event) => {
  transitionEngine.pulse(event.clientX, event.clientY);
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

  const worksProgress = sectionProgress(works);
  const aboutProgress = sectionProgress(about);
  const heroProgress = sectionProgress(hero);

  document.documentElement.style.setProperty("--works-progress", worksProgress.toFixed(4));
  document.documentElement.style.setProperty("--about-progress", aboutProgress.toFixed(4));
  prismScene.setScroll?.({
    page: pageProgress,
    hero: heroProgress,
    works: worksProgress,
    about: aboutProgress
  });
  carousel.setProgress?.(worksProgress);

  const active = pickActiveSection();
  document.body.dataset.activeSection = active;
  navLinks.forEach((link) => {
    const id = link.getAttribute("href")?.replace("#", "");
    link.classList.toggle("is-active", id === active);
  });
}

function sectionProgress(section) {
  if (!section) return 0;
  const rect = section.getBoundingClientRect();
  const travel = rect.height - window.innerHeight;
  if (travel <= 0) return rect.top <= 0 ? 1 : 0;
  return clamp(-rect.top / travel, 0, 1);
}

function pickActiveSection() {
  const anchors = ["works", "about", "resume", "final"];
  let current = "hero";
  for (const id of anchors) {
    const node = id === "final" ? document.querySelector(".final-section") : document.getElementById(id);
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
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      transitionEngine.run({
        beforeSwap: () => prismScene.triggerGlitch?.(0.5),
        afterSwap: requestScrollUpdate
      });
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
    prismScene.setPointer?.(x, y);
    if (reducedMotion) return;
    parallaxItems.forEach((item) => {
      const depth = Number(item.dataset.parallax || 0.08);
      item.style.transform = `translate3d(${x * depth * 40}px, ${y * depth * 32}px, 0)`;
    });
  }, { passive: true });
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
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalContent.querySelectorAll("video").forEach((video) => video.pause());
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
        <video controls playsinline preload="metadata" poster="${media.poster || ""}">
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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
