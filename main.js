const cases = {
  dragon: {
    label: "AIGC 影视 / 长案例",
    title: "龙影之后",
    lead: "以 4K AI 动画成片为核心，展示从角色、场景、分镜到最终视频的影视视觉生成能力。",
    media: { type: "video", src: "assets/media/dragon-case-loop.mp4", poster: "assets/media/dragon-poster.jpg" },
    meta: [
      ["角色", "视觉生成与剪辑整合"],
      ["产出", "成片 / 分镜 / 作业报告"],
      ["关键词", "AIGC 影视、武馆、霓虹叙事"]
    ],
    points: [
      "把长片项目拆成可展示的短循环、关键视觉帧和创作过程，适合面试或作品集快速理解。",
      "网页首屏使用该项目的视觉氛围作为全站背景，让作品本身承担第一印象。",
      "不上传原始 2.1GB 大文件，公开版保留高识别度片段和可进一步索取的完整材料。"
    ],
    gallery: ["assets/media/dragon-poster.jpg", "assets/cases/haoshi-factory.jpg"],
    actions: [
      ["下载简历", "新媒体运营经历-许智宁.pdf", false]
    ]
  },
  ads: {
    label: "商业 AI 广告 / 分镜生成",
    title: "千问有千手 × 豪士工厂",
    lead: "两个商业命题合并展示：一个偏 AI 助手广告，一个偏食品工厂品牌片，重点呈现脚本、分镜和风格控制。",
    media: { type: "image", src: "assets/cases/qwen-overview.jpg", alt: "千问有千手故事板总览" },
    meta: [
      ["角色", "脚本拆解与视觉预演"],
      ["产出", "故事板 / 风格板 / 制作稿"],
      ["关键词", "品牌叙事、AI 分镜、商业广告"]
    ],
    points: [
      "千问案例突出“一个人面对多任务，AI 像多只手一样协作”的短视频广告抓手。",
      "豪士工厂案例从品牌资产、工厂空间、鸟背视角和逐镜故事板建立完整动画制作稿。",
      "公开页只展示精选分镜和视觉板，源文件、脚本表和制作稿保留为线下材料。"
    ],
    gallery: ["assets/cases/haoshi-storyboard.jpg", "assets/cases/haoshi-factory.jpg"],
    actions: []
  },
  loan: {
    label: "交互叙事 / H5 原型",
    title: "网贷娱乐化压力条游戏",
    lead: "把网贷娱乐化风险做成视觉小说式 H5 原型，用压力条、评论判断、证据收集和求助节点建立课堂演示体验。",
    media: { type: "iframe", src: "cases/loan-game/", title: "网贷娱乐化压力条游戏预览" },
    meta: [
      ["角色", "交互原型与视觉叙事"],
      ["产出", "可点击 H5 / 视觉资产 / 课程展示"],
      ["关键词", "压力条、反诈、视觉小说"]
    ],
    points: [
      "将抽象社会议题收束为“网贷风险被轻松化表达”的具体互动体验。",
      "通过多节点选择和反馈机制，让用户在剧情里理解借贷诱导、证据保存和求助路径。",
      "当前网页嵌入轻量预览；视频素材包较大，线上版本以图片与语音降级为主。"
    ],
    gallery: ["assets/cases/loan-home.jpg", "assets/cases/loan-pressure.jpg"],
    actions: [
      ["独立打开", "cases/loan-game/", true]
    ]
  },
  zhitou: {
    label: "产品原型 / 投资教育",
    title: "知投学堂",
    lead: "面向投资小白的本土化智能投教学习平台，用课程、Stories、AI 问答和计划模块把金融知识做成行动流。",
    media: { type: "iframe", src: "cases/zhitou/", title: "知投学堂原型预览" },
    meta: [
      ["角色", "产品策划与前端原型"],
      ["产出", "Web 原型 / PPT / 课程视觉"],
      ["关键词", "投教、AI 问答、学习计划"]
    ],
    points: [
      "产品定位保持教育优先，避免真实交易和收益承诺表达。",
      "课程内容使用故事化案例、热点拆解和知识测试降低学习门槛。",
      "从产品 deck 到本地原型形成可演示链路，适合作为产品设计能力证明。"
    ],
    gallery: ["assets/cases/zhitou-main.jpg", "assets/cases/zhitou-deck.jpg"],
    actions: [
      ["独立打开", "cases/zhitou/", true]
    ]
  }
};

const track = document.getElementById("workTrack");
const modal = document.getElementById("caseModal");
const modalContent = document.getElementById("modalContent");
const heroVideo = document.getElementById("heroVideo");
const splineShell = document.querySelector(".spline-shell");
const splineViewer = document.querySelector("spline-viewer");

if (splineViewer && splineShell) {
  let splineLoaded = false;
  splineViewer.addEventListener("load", () => {
    splineLoaded = true;
  });
  setTimeout(() => {
    if (!splineLoaded) splineShell.classList.add("spline-timeout");
  }, 6500);
}

document.querySelectorAll("[data-track-dir]").forEach((button) => {
  button.addEventListener("click", () => {
    const direction = Number(button.dataset.trackDir);
    track.scrollBy({ left: direction * track.clientWidth * 0.86, behavior: "smooth" });
  });
});

document.querySelectorAll(".work-card").forEach((card) => {
  card.addEventListener("click", () => openCase(card.dataset.case));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCase(card.dataset.case);
    }
  });
  card.tabIndex = 0;
});

document.querySelectorAll("[data-close-modal]").forEach((node) => {
  node.addEventListener("click", closeCase);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("is-open")) closeCase();
});

function openCase(id) {
  const detail = cases[id];
  if (!detail) return;

  modalContent.innerHTML = renderCase(detail);
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeCase() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalContent.innerHTML = "";
}

function renderCase(detail) {
  return `
    <div class="case-detail">
      <div class="case-detail-media">${renderMedia(detail.media)}</div>
      <div class="case-detail-body">
        <p class="eyebrow">${detail.label}</p>
        <h2 id="modalTitle">${detail.title}</h2>
        <p class="lead">${detail.lead}</p>
        <div class="case-meta-grid">
          ${detail.meta.map(([label, value]) => `<span>${label}<strong>${value}</strong></span>`).join("")}
        </div>
        <ul class="case-points">
          ${detail.points.map((item) => `<li>${item}</li>`).join("")}
        </ul>
        <div class="case-gallery">
          ${detail.gallery.map((src) => `<img src="${src}" alt="${detail.title} 作品素材" loading="lazy">`).join("")}
        </div>
        <div class="case-actions">
          ${detail.actions.map(([label, href, external]) => `<a class="${external ? "primary" : ""}" href="${href}" ${external ? 'target="_blank" rel="noreferrer"' : ""}>${label}</a>`).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderMedia(media) {
  if (media.type === "video") {
    return `<video autoplay muted playsinline loop controls poster="${media.poster || ""}"><source src="${media.src}" type="video/mp4"></video>`;
  }
  if (media.type === "iframe") {
    return `<iframe src="${media.src}" title="${media.title}" loading="lazy"></iframe>`;
  }
  return `<img src="${media.src}" alt="${media.alt || ""}">`;
}

function syncVideoWithScroll() {
  if (!heroVideo || !Number.isFinite(heroVideo.duration) || heroVideo.duration <= 0) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  const target = progress * heroVideo.duration;
  if (Math.abs(heroVideo.currentTime - target) > 0.45) {
    heroVideo.currentTime = target;
  }
}

let scrollTicking = false;
window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      syncVideoWithScroll();
      markActiveNav();
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}, { passive: true });

function markActiveNav() {
  const sections = ["capabilities", "works", "evidence", "contact"];
  const current = sections.findLast((id) => {
    const el = document.getElementById(id);
    return el && el.getBoundingClientRect().top < window.innerHeight * 0.45;
  });
  document.querySelectorAll(".topnav a").forEach((link) => {
    link.classList.toggle("is-active", current && link.getAttribute("href") === `#${current}`);
  });
}

const canvas = document.getElementById("signalCanvas");
const ctx = canvas.getContext("2d");
let width = 0;
let height = 0;
let nodes = [];

function resizeCanvas() {
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * scale);
  canvas.height = Math.floor(height * scale);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  nodes = Array.from({ length: Math.max(28, Math.floor(width / 34)) }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    r: Math.random() * 1.8 + 0.6
  }));
}

function drawSignal() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(94, 231, 255, 0.7)";
  ctx.strokeStyle = "rgba(94, 231, 255, 0.13)";
  ctx.lineWidth = 1;
  nodes.forEach((node, index) => {
    node.x += node.vx;
    node.y += node.vy;
    if (node.x < 0 || node.x > width) node.vx *= -1;
    if (node.y < 0 || node.y > height) node.vy *= -1;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
    ctx.fill();
    for (let j = index + 1; j < nodes.length; j += 1) {
      const other = nodes[j];
      const dx = node.x - other.x;
      const dy = node.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 120) {
        ctx.globalAlpha = 1 - distance / 120;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  });
  requestAnimationFrame(drawSignal);
}

resizeCanvas();
drawSignal();
markActiveNav();
window.addEventListener("resize", resizeCanvas);
