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
  scene.add(root);
  root.add(gridRoot, markRoot, spectralRoot);

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
  const scroll = { page: 0, hero: 0, works: 0, about: 0 };
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
    const aboutFade = smoothstep(0.08, 0.6, scroll.about);
    const worksDepth = smoothstep(0.05, 0.86, scroll.works);

    root.rotation.y = THREE.MathUtils.lerp(root.rotation.y, pointer.x * 0.09 - worksDepth * 0.2, 0.05);
    root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, -pointer.y * 0.05, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.22 - scroll.page * 0.62, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, (width < 720 ? 12.5 : 9.6) - worksDepth * 1.5, 0.035);

    markRoot.rotation.y = drift * 0.11 + pointer.x * 0.18 + glitch + worksDepth * 0.36;
    markRoot.rotation.x = Math.sin(drift * 0.38) * 0.035 - pointer.y * 0.08;
    markRoot.position.y = -scroll.page * 1.8 + Math.sin(drift * 0.8) * 0.03;
    markRoot.scale.setScalar(1 + worksDepth * 0.16 - aboutFade * 0.24);
    markRoot.visible = aboutFade < 0.96;

    spectralRoot.rotation.copy(markRoot.rotation);
    spectralRoot.position.copy(markRoot.position);
    spectralRoot.scale.copy(markRoot.scale);
    spectralRoot.children.forEach((line, index) => {
      line.position.x = (index ? -1 : 1) * (glitchActive ? 0.18 : 0.055);
      line.position.y = (index ? 1 : -1) * (glitchActive ? 0.04 : 0.015);
      line.material.opacity = glitchActive ? 0.55 : 0.26;
    });

    gridRoot.rotation.y = drift * 0.025 + pointer.x * 0.05 - worksDepth * 0.45;
    gridRoot.position.z = -worksDepth * 2.4;
    gridRoot.position.y = -scroll.page * 1.2;
    curveWall.material.opacity = 0.18 + (worksDepth * 0.12) - aboutFade * 0.16;

    glassMaterial.opacity = Math.max(0.16, 0.42 - aboutFade * 0.3 + (glitchActive ? 0.1 : 0));
    edgeMaterial.opacity = Math.max(0.1, 0.74 - aboutFade * 0.55);
    rings.forEach((ring, index) => {
      ring.rotation.z = drift * (0.02 + index * 0.01);
      ring.material.opacity = Math.max(0.03, 0.11 - aboutFade * 0.08);
    });

    stars.rotation.y = drift * 0.01;
    stars.material.opacity = Math.max(0.05, 0.28 - aboutFade * 0.22);

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
