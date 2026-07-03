import { initPrismScene } from "./prism-scene.js";
import { createTransitionEngine } from "./transition-engine.js";
import { createWorksCarousel } from "./works-carousel.js";

const cases = {
  dragon: {
    label: "AI / UE 视觉",
    title: "龙影之后",
    lead: "以 4K AI 动画成片为核心 展示从角色 场景 分镜到最终视频的影视视觉生成能力",
    media: { type: "video", src: "assets/media/dragon-case-loop.mp4", poster: "assets/media/dragon-poster.jpg" },
    meta: [
      ["角色", "视觉生成与剪辑整合"],
      ["产出", "成片 分镜 作业报告"],
      ["关键词", "AIGC 影视 武馆 霓虹叙事"]
    ],
    points: [
      "把长片项目拆成可展示的短循环 关键视觉帧和创作过程",
      "首屏 WebGL 风格延续该项目的未来感 让作品本身承担第一印象",
      "公开版保留高识别度片段 完整大文件作为线下材料"
    ],
    gallery: ["assets/media/dragon-poster.jpg", "assets/cases/haoshi-factory.jpg"],
    actions: [["下载简历", "新媒体运营经历-许智宁.pdf", false]]
  },
  ads: {
    label: "商业 AI 广告",
    title: "千问有千手 × 豪士工厂",
    lead: "两个商业命题合并展示 一个偏 AI 助手广告 一个偏食品工厂品牌片 重点呈现脚本 分镜和风格控制",
    media: {
      type: "videoPair",
      items: [
        {
          label: "千问有千手",
          orientation: "portrait",
          src: "assets/media/qwen-full.mp4",
          poster: "assets/media/qwen-poster.jpg"
        },
        {
          label: "豪士工厂",
          orientation: "landscape",
          src: "assets/media/haoshi-full.mp4",
          poster: "assets/media/haoshi-poster.jpg"
        }
      ]
    },
    meta: [
      ["角色", "脚本拆解与视觉预演"],
      ["产出", "故事板 风格板 制作稿"],
      ["关键词", "品牌叙事 AI 分镜 商业广告"]
    ],
    points: [
      "千问案例突出一个人面对多任务时 AI 协作的广告抓手",
      "豪士工厂案例从品牌资产 工厂空间 鸟背视角和逐镜故事板建立动画制作稿",
      "公开页展示精选分镜和视觉板 源文件 脚本表 制作稿保留为线下材料"
    ],
    gallery: ["assets/cases/haoshi-storyboard.jpg", "assets/cases/haoshi-factory.jpg"],
    actions: []
  },
  loan: {
    label: "交互叙事游戏",
    title: "网贷娱乐化压力条游戏",
    lead: "把网贷娱乐化风险做成视觉小说式 H5 原型 用压力条 评论判断 证据收集和求助节点建立课堂演示体验",
    media: { type: "iframe", src: "cases/loan-game/", title: "网贷娱乐化压力条游戏预览" },
    meta: [
      ["角色", "交互原型与视觉叙事"],
      ["产出", "可点击 H5 视觉资产 课程展示"],
      ["关键词", "压力条 反诈 视觉小说"]
    ],
    points: [
      "将抽象社会议题收束为网贷风险被轻松化表达的具体互动体验",
      "通过多节点选择和反馈机制让用户理解借贷诱导 证据保存和求助路径",
      "当前网页嵌入轻量预览 视频素材包较大 线上版本以图片与语音降级为主"
    ],
    gallery: ["assets/cases/loan-home.jpg", "assets/cases/loan-pressure.jpg"],
    actions: [["独立打开", "cases/loan-game/", true]]
  },
  zhitou: {
    label: "投资教育产品",
    title: "知投学堂",
    lead: "面向投资小白的本土化智能投教学习平台 用课程 Stories AI 问答和计划模块把金融知识做成行动流",
    media: { type: "iframe", src: "cases/zhitou/", title: "知投学堂原型预览" },
    meta: [
      ["角色", "产品策划与前端原型"],
      ["产出", "Web 原型 PPT 课程视觉"],
      ["关键词", "投教 AI 问答 学习计划"]
    ],
    points: [
      "产品定位保持教育优先 避免真实交易和收益承诺表达",
      "课程内容使用故事化案例 热点拆解和知识测试降低学习门槛",
      "从产品 deck 到本地原型形成可演示链路 适合作为产品设计能力证明"
    ],
    gallery: ["assets/cases/zhitou-main.jpg", "assets/cases/zhitou-deck.jpg"],
    actions: [["独立打开", "cases/zhitou/", true]]
  }
};

const dashboardData = {
  about: [
    { val: "1000W+", label: "全网流量操盘" },
    { val: "3.89", label: "专业排名前 10%" },
    { val: "30+", label: "行研标的库搭建" },
    { val: "UE5/AI", label: "次世代视觉引擎" }
  ],
  capabilities: [
    { val: "10W+", label: "单条视频爆发" },
    { val: "Sora/MJ", label: "商业视觉生成" },
    { val: "SPSS", label: "量化数据清洗" },
    { val: "产品原型", label: "Web 交互交付" }
  ],
  works: [
    { val: "4", label: "精选作品舱" },
    { val: "3D", label: "弧形传送带" },
    { val: "H5", label: "交互叙事预览" },
    { val: "AI", label: "广告分镜系统" }
  ],
  evidence: [
    { val: "PDF", label: "简历与运营经历" },
    { val: "PPT", label: "业务框架材料" },
    { val: "HTML", label: "可点击产品原型" },
    { val: "CASE", label: "作品过程证据" }
  ],
  contact: [
    { val: "MAIL", label: "加密通信入口" },
    { val: "OPEN", label: "作品链路可索取" },
    { val: "CN/EN", label: "跨语境表达" },
    { val: "READY", label: "System Ready" }
  ]
};

const sectionsList = ["about", "capabilities", "works", "evidence", "contact"];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const prismScene = initPrismScene({ canvas: document.getElementById("prismCanvas"), reducedMotion });
const transitionEngine = createTransitionEngine({
  overlay: document.getElementById("transitionOverlay"),
  prismScene
});

let currentPage = "about";
let currentTheme = "night";

const dashboard = document.getElementById("dynamicDashboard");
const themeToggle = document.getElementById("themeToggle");
const modal = document.getElementById("caseModal");
const modalContent = document.getElementById("modalContent");

const carousel = createWorksCarousel({
  root: document.getElementById("workCarousel"),
  onOpen: (id, source) => openCase(id, source)
});

renderDashboard(currentPage);
typeIntro();
initSignalCanvas();
initNavigation();
initMagneticHover();
initParallax();
initModal();

document.querySelectorAll("[data-carousel-dir]").forEach((button) => {
  button.addEventListener("click", () => carousel.go(Number(button.dataset.carouselDir)));
});

themeToggle?.addEventListener("click", () => {
  const nextTheme = currentTheme === "night" ? "day" : "night";
  transitionEngine.run({
    source: document.querySelector(".page-panel.is-active"),
    beforeSwap: () => applyTheme(nextTheme),
    afterSwap: () => replayActivePanel()
  });
});

document.addEventListener("pointerdown", (event) => {
  transitionEngine.pulse(event.clientX, event.clientY);
});

function initNavigation() {
  document.querySelectorAll("[data-page]").forEach((control) => {
    control.addEventListener("click", () => {
      const target = control.dataset.page;
      if (!target || target === currentPage) return;
      switchPage(target);
    });
  });
}

function switchPage(target) {
  const source = document.querySelector(".page-panel.is-active");
  transitionEngine.run({
    source,
    beforeSwap: () => {
      document.querySelectorAll(".page-panel").forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.pagePanel === target);
        panel.classList.remove("glitching");
      });
      document.querySelectorAll(".nav-item").forEach((item) => {
        item.classList.toggle("is-active", item.dataset.page === target);
      });
      currentPage = target;
      renderDashboard(target);
      if (target === "works") carousel.refresh();
    },
    afterSwap: () => replayActivePanel()
  });
}

function replayActivePanel() {
  const active = document.querySelector(".page-panel.is-active");
  if (!active) return;
  active.classList.remove("glitching");
  void active.offsetWidth;
  active.classList.add("glitching");
  setTimeout(() => active.classList.remove("glitching"), reducedMotion ? 80 : 760);
}

function applyTheme(theme) {
  currentTheme = theme;
  document.body.classList.toggle("theme-day", theme === "day");
  document.body.classList.toggle("theme-night", theme !== "day");
  prismScene.setTheme(theme);
  if (themeToggle) {
    themeToggle.querySelector(".theme-icon").textContent = theme === "day" ? "☀" : "☾";
    themeToggle.querySelector(".theme-label").textContent = theme === "day" ? "DAY" : "NIGHT";
  }
}

function renderDashboard(pageId) {
  if (!dashboard) return;
  const data = dashboardData[pageId] || dashboardData.about;
  dashboard.innerHTML = data.map((item) => `
    <div class="data-card tilt-card">
      <strong>${item.val}</strong>
      <span>${item.label}</span>
    </div>
  `).join("");
}

function typeIntro() {
  const target = document.getElementById("typewriter");
  if (!target) return;
  const lines = ["Angie Angel", "全栈内容操盘手", "千万级自媒体矩阵", "System Ready"];
  const text = lines.join("\n");
  let index = 0;
  function tick() {
    target.innerHTML = text.slice(0, index).replace(/\n/g, "<br>");
    index += 1;
    if (index <= text.length) setTimeout(tick, reducedMotion ? 4 : 42);
  }
  tick();
}

function initModal() {
  document.querySelectorAll("[data-close-modal]").forEach((node) => {
    node.addEventListener("click", closeCase);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal?.classList.contains("is-open")) closeCase();
  });
}

function openCase(id, source) {
  const detail = cases[id];
  if (!detail || !modal || !modalContent) return;
  transitionEngine.run({
    source,
    beforeSwap: () => {
      modalContent.innerHTML = renderCase(detail);
      modal.classList.add("is-open", "reconstructing");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    },
    afterSwap: () => {
      setTimeout(() => modal.classList.remove("reconstructing"), reducedMotion ? 60 : 760);
    }
  });
}

function closeCase() {
  if (!modal || !modalContent) return;
  transitionEngine.run({
    source: modal.querySelector(".modal-panel"),
    beforeSwap: () => {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    },
    afterSwap: () => {
      modalContent.innerHTML = "";
    }
  });
}

function renderCase(detail) {
  return `
    <div class="case-detail">
      <div class="case-detail-media">${renderMedia(detail.media)}</div>
      <div class="case-detail-body">
        <p class="eyebrow">${detail.label}</p>
        <h2 id="modalTitle" class="glitch-text" data-text="${detail.title}">${detail.title}</h2>
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
  if (media.type === "videoPair") {
    return `
      <div class="case-video-pair">
        ${media.items.map((item) => `
          <figure class="case-video-item ${item.orientation}">
            <video controls playsinline preload="metadata" poster="${item.poster || ""}">
              <source src="${item.src}" type="video/mp4">
            </video>
            <figcaption>${item.label}</figcaption>
          </figure>
        `).join("")}
      </div>
    `;
  }
  if (media.type === "video") {
    return `<video autoplay muted playsinline loop controls poster="${media.poster || ""}"><source src="${media.src}" type="video/mp4"></video>`;
  }
  if (media.type === "iframe") {
    return `<iframe src="${media.src}" title="${media.title}" loading="lazy"></iframe>`;
  }
  return `<img src="${media.src}" alt="${media.alt || ""}">`;
}

function initMagneticHover() {
  const strength = 18;
  document.querySelectorAll(".magnetic").forEach((node) => {
    node.addEventListener("pointermove", (event) => {
      if (reducedMotion) return;
      const rect = node.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
      node.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    node.addEventListener("pointerleave", () => {
      node.style.transform = "";
    });
  });
}

function initParallax() {
  const nodes = [...document.querySelectorAll("[data-parallax]")];
  let px = 0;
  let py = 0;

  window.addEventListener("pointermove", (event) => {
    px = (event.clientX / window.innerWidth - 0.5) * 2;
    py = (event.clientY / window.innerHeight - 0.5) * 2;
    prismScene.setPointer(px, py);
  }, { passive: true });

  function render() {
    if (!reducedMotion) {
      nodes.forEach((node) => {
        const depth = Number(node.dataset.parallax || 0.08);
        node.style.transform = `translate3d(${px * depth * 28}px, ${py * depth * 24}px, 0) rotateX(${-py * depth * 3}deg) rotateY(${px * depth * 4}deg)`;
      });
    }
    requestAnimationFrame(render);
  }
  render();
}

function initSignalCanvas() {
  const canvas = document.getElementById("signalCanvas");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  let width = 0;
  let height = 0;
  let nodes = [];
  let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  function resize() {
    const scale = Math.min(window.devicePixelRatio || 1, 1.6);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * scale);
    canvas.height = Math.floor(height * scale);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    const amount = reducedMotion ? 28 : Math.max(48, Math.floor((width * height) / 18000));
    nodes = Array.from({ length: amount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.4 + 0.5
    }));
  }

  window.addEventListener("pointermove", (event) => {
    pointer = { x: event.clientX, y: event.clientY };
  }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const isDay = document.body.classList.contains("theme-day");
    ctx.fillStyle = isDay ? "rgba(5, 7, 10, 0.28)" : "rgba(255, 255, 255, 0.58)";
    ctx.strokeStyle = isDay ? "rgba(5, 7, 10, 0.11)" : "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 1;

    nodes.forEach((node, index) => {
      if (!reducedMotion) {
        node.x += node.vx;
        node.y += node.vy;
      }
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fill();

      const dx = pointer.x - node.x;
      const dy = pointer.y - node.y;
      const pointerDistance = Math.sqrt(dx * dx + dy * dy);
      if (pointerDistance < 170) {
        ctx.globalAlpha = 1 - pointerDistance / 170;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(pointer.x, pointer.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      for (let j = index + 1; j < nodes.length; j += 1) {
        const other = nodes[j];
        const distance = Math.hypot(node.x - other.x, node.y - other.y);
        if (distance < 132) {
          ctx.globalAlpha = 1 - distance / 132;
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}
