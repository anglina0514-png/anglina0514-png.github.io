import * as THREE from "./vendor/three.module.js";

export function initPrismScene({ canvas, reducedMotion = false }) {
  if (!canvas) return createNoopScene();

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x010105, 0.018);

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 140);
  camera.position.set(0, 0.22, 9.6);

  const root = new THREE.Group();
  const gridRoot = new THREE.Group();
  const markRoot = new THREE.Group();
  const spectralRoot = new THREE.Group();
  const shardRoot = new THREE.Group();
  scene.add(root);
  root.add(gridRoot, markRoot, spectralRoot, shardRoot);

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xb8c8ff,
    metalness: 0,
    roughness: 0.03,
    transmission: 0.78,
    thickness: 1.6,
    ior: 1.68,
    transparent: true,
    opacity: 0.42,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    side: THREE.DoubleSide
  });

  const triangle = new THREE.Mesh(makeTriangleGeometry(3.8, 3.35), glassMaterial);
  triangle.position.y = 0.05;
  markRoot.add(triangle);

  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.74
  });
  const outline = makeTriangleOutline(4.1, 3.6, edgeMaterial);
  const inner = makeTriangleOutline(1.35, 1.18, edgeMaterial);
  inner.position.y = -0.42;
  markRoot.add(outline, inner);

  const aBars = makeABars();
  markRoot.add(aBars);

  const cyanGhost = makeTriangleOutline(4.12, 3.62, new THREE.LineBasicMaterial({ color: 0x00eaff, transparent: true, opacity: 0.34 }));
  const magentaGhost = makeTriangleOutline(4.08, 3.58, new THREE.LineBasicMaterial({ color: 0xff3df0, transparent: true, opacity: 0.28 }));
  cyanGhost.position.x = 0.045;
  magentaGhost.position.x = -0.045;
  spectralRoot.add(cyanGhost, magentaGhost);

  const curveWall = makeCurvedWall();
  gridRoot.add(curveWall);

  const tunnelLines = makeTunnelLines();
  gridRoot.add(tunnelLines);

  const logoNoise = makeLogoNoise();
  shardRoot.add(logoNoise);

  const rings = [];
  for (let i = 0; i < 4; i += 1) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.35 + i * 0.78, 0.005, 8, 180),
      new THREE.MeshBasicMaterial({ color: i % 2 ? 0x7597ff : 0xffffff, wireframe: true, transparent: true, opacity: 0.1 })
    );
    ring.rotation.set(Math.PI / 2 + i * 0.09, i * 0.22, i * 0.08);
    markRoot.add(ring);
    rings.push(ring);
  }

  const stars = makeStars();
  scene.add(stars);

  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(2.8, 4.8, 5.2);
  const blue = new THREE.PointLight(0x4558ff, 5.8, 20);
  blue.position.set(-3, 0.8, 3.4);
  const rim = new THREE.PointLight(0xe8f4ff, 2.8, 18);
  rim.position.set(3.4, -1.2, 2.6);
  scene.add(key, blue, rim, new THREE.HemisphereLight(0xffffff, 0x060712, 0.95));

  const pointer = { x: 0, y: 0 };
  const scroll = { page: 0, hero: 0, news: 0, works: 0, about: 0, products: 0, final: 0 };
  let glitchUntil = 0;
  let width = 1;
  let height = 1;
  let running = true;
  let rafId = 0;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = width < 720 ? 12.5 : 9.6;
    camera.updateProjectionMatrix();
  }

  function setScroll(next) {
    Object.assign(scroll, next);
  }

  function setPointer(x, y) {
    pointer.x = x;
    pointer.y = y;
  }

  function triggerGlitch(intensity = 1) {
    glitchUntil = performance.now() + 520 * intensity;
  }

  function render(time) {
    if (!running) return;
    const seconds = time * 0.001;
    const glitchActive = time < glitchUntil;
    const glitch = glitchActive ? Math.sin(time * 0.12) * 0.075 : 0;
    const drift = reducedMotion ? 0 : seconds;
    const aboutFade = smoothstep(0.08, 0.76, scroll.about);
    const worksDepth = smoothstep(0.05, 0.86, scroll.works);
    const newsDepth = smoothstep(0.08, 0.82, scroll.news);
    const productDepth = smoothstep(0.08, 0.86, scroll.products);
    const finalDepth = smoothstep(0.12, 0.88, scroll.final);
    const stageDepth = Math.max(worksDepth, productDepth * 0.78, newsDepth * 0.46);

    root.rotation.y = THREE.MathUtils.lerp(root.rotation.y, pointer.x * 0.09 - worksDepth * 0.28 + productDepth * 0.18, 0.05);
    root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, -pointer.y * 0.05, 0.05);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.34 + productDepth * 0.55 - finalDepth * 0.28, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.22 - scroll.page * 0.78 + newsDepth * 0.22, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, (width < 720 ? 12.5 : 9.6) - stageDepth * 1.85 + finalDepth * 1.2, 0.035);

    markRoot.rotation.y = drift * 0.12 + pointer.x * 0.18 + glitch + worksDepth * 0.46 - productDepth * 0.42;
    markRoot.rotation.x = Math.sin(drift * 0.38) * 0.035 - pointer.y * 0.08 + newsDepth * 0.18;
    markRoot.rotation.z = glitch * 0.7 + finalDepth * 0.1;
    markRoot.position.x = productDepth * -0.55 + finalDepth * 0.35;
    markRoot.position.y = -scroll.page * 1.2 + Math.sin(drift * 0.8) * 0.03 + productDepth * 0.5;
    markRoot.scale.setScalar(1.02 + worksDepth * 0.12 - aboutFade * 0.18 + finalDepth * 0.2);
    markRoot.visible = finalDepth < 0.94;

    spectralRoot.rotation.copy(markRoot.rotation);
    spectralRoot.position.copy(markRoot.position);
    spectralRoot.scale.copy(markRoot.scale);
    spectralRoot.children.forEach((line, index) => {
      line.position.x = (index ? -1 : 1) * (glitchActive ? 0.18 : 0.055);
      line.position.y = (index ? 1 : -1) * (glitchActive ? 0.04 : 0.015);
      line.material.opacity = glitchActive ? 0.55 : 0.26;
    });

    shardRoot.rotation.copy(markRoot.rotation);
    shardRoot.position.copy(markRoot.position);
    shardRoot.scale.copy(markRoot.scale);
    logoNoise.rotation.z = -drift * 0.04 + glitch * 2;
    logoNoise.material.opacity = 0.16 + newsDepth * 0.18 + worksDepth * 0.14 + (glitchActive ? 0.2 : 0);

    gridRoot.rotation.y = drift * 0.025 + pointer.x * 0.05 - worksDepth * 0.54 + productDepth * 0.28;
    gridRoot.position.z = -stageDepth * 2.9;
    gridRoot.position.y = -scroll.page * 1.38 + productDepth * 0.4;
    curveWall.material.opacity = 0.18 + (stageDepth * 0.16) - finalDepth * 0.08;
    tunnelLines.material.opacity = 0.12 + stageDepth * 0.18 - finalDepth * 0.04;

    glassMaterial.opacity = Math.max(0.16, 0.45 - aboutFade * 0.18 + productDepth * 0.08 + (glitchActive ? 0.1 : 0));
    glassMaterial.roughness = 0.03 + worksDepth * 0.16 + productDepth * 0.08;
    edgeMaterial.opacity = Math.max(0.12, 0.74 - aboutFade * 0.36);
    rings.forEach((ring, index) => {
      ring.rotation.z = drift * (0.02 + index * 0.01);
      ring.material.opacity = Math.max(0.03, 0.11 - aboutFade * 0.08);
    });

    stars.rotation.y = drift * 0.01;
    stars.material.opacity = Math.max(0.05, 0.28 - aboutFade * 0.08 + productDepth * 0.06);

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize);
  resize();
  rafId = requestAnimationFrame(render);

  return {
    setScroll,
    setPointer,
    triggerGlitch,
    destroy() {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      renderer.dispose();
    }
  };
}

function makeTriangleGeometry(width, height) {
  const shape = new THREE.Shape();
  shape.moveTo(0, height / 2);
  shape.lineTo(-width / 2, -height / 2);
  shape.lineTo(width / 2, -height / 2);
  shape.closePath();
  return new THREE.ShapeGeometry(shape);
}

function makeTriangleOutline(width, height, material) {
  const points = [
    new THREE.Vector3(0, height / 2, 0.05),
    new THREE.Vector3(-width / 2, -height / 2, 0.05),
    new THREE.Vector3(width / 2, -height / 2, 0.05),
    new THREE.Vector3(0, height / 2, 0.05)
  ];
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material);
}

function makeABars() {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.32 });
  const left = makeBar(-0.78, -0.22, 1.62, Math.PI * -0.16, material);
  const right = makeBar(0.78, -0.22, 1.62, Math.PI * 0.16, material);
  const cross = makeBar(0, -0.68, 1.05, Math.PI / 2, material);
  group.add(left, right, cross);
  return group;
}

function makeBar(x, y, length, rotation, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.09, length, 0.04), material);
  mesh.position.set(x, y, 0.12);
  mesh.rotation.z = rotation;
  return mesh;
}

function makeCurvedWall() {
  const points = [];
  const radius = 10.5;
  const rows = 15;
  const cols = 34;
  const arc = Math.PI * 0.92;
  for (let r = 0; r <= rows; r += 1) {
    const y = -4.2 + r * 0.58;
    for (let c = 0; c < cols; c += 1) {
      const a1 = -arc / 2 + (arc / cols) * c;
      const a2 = -arc / 2 + (arc / cols) * (c + 1);
      points.push(Math.sin(a1) * radius, y, Math.cos(a1) * radius - radius - 3);
      points.push(Math.sin(a2) * radius, y, Math.cos(a2) * radius - radius - 3);
    }
  }
  for (let c = 0; c <= cols; c += 1) {
    const a = -arc / 2 + (arc / cols) * c;
    for (let r = 0; r < rows; r += 1) {
      const y1 = -4.2 + r * 0.58;
      const y2 = -4.2 + (r + 1) * 0.58;
      points.push(Math.sin(a) * radius, y1, Math.cos(a) * radius - radius - 3);
      points.push(Math.sin(a) * radius, y2, Math.cos(a) * radius - radius - 3);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 });
  return new THREE.LineSegments(geometry, material);
}

function makeTunnelLines() {
  const points = [];
  const radius = 13.5;
  const depth = 20;
  for (let i = 0; i < 34; i += 1) {
    const angle = -Math.PI * 0.46 + i * (Math.PI * 0.92 / 33);
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius - radius - 2;
    points.push(x, -4.8, z, x * 0.42, 4.8, z - depth);
  }
  for (let i = 0; i < 13; i += 1) {
    const y = -4.8 + i * 0.8;
    points.push(-8.8, y, -6, 8.8, y, -13);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  const material = new THREE.LineBasicMaterial({ color: 0x9aa8ff, transparent: true, opacity: 0.18 });
  return new THREE.LineSegments(geometry, material);
}

function makeLogoNoise() {
  const vertices = [];
  for (let i = 0; i < 520; i += 1) {
    const row = i % 4;
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.55 + Math.random() * (row === 0 ? 1.8 : 2.35);
    vertices.push(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius * 0.82 + (Math.random() - 0.5) * 0.45,
      (Math.random() - 0.5) * 0.34
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  const material = new THREE.PointsMaterial({
    color: 0xe7eeff,
    size: 0.018,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending
  });
  return new THREE.Points(geometry, material);
}

function makeStars() {
  const vertices = [];
  for (let i = 0; i < 220; i += 1) {
    vertices.push((Math.random() - 0.5) * 28, (Math.random() - 0.5) * 14, -Math.random() * 18 - 4);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.018,
    transparent: true,
    opacity: 0.28
  });
  return new THREE.Points(geometry, material);
}

function smoothstep(edge0, edge1, value) {
  const x = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return x * x * (3 - 2 * x);
}

function createNoopScene() {
  return {
    setScroll() {},
    setPointer() {},
    triggerGlitch() {},
    destroy() {}
  };
}
