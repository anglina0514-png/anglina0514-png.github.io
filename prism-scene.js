import * as THREE from "./vendor/three.module.js";

const themePalette = {
  night: {
    clear: 0x000000,
    prism: 0xeafaff,
    line: 0xffffff,
    lineOpacity: 0.18,
    accent: 0x9ef7ff,
    second: 0xff4df0,
    fog: 0x000000
  },
  day: {
    clear: 0xffffff,
    prism: 0xffffff,
    line: 0x8994a8,
    lineOpacity: 0.16,
    accent: 0x006dff,
    second: 0xff6adf,
    fog: 0xffffff
  }
};

export function initPrismScene({ canvas, reducedMotion = false }) {
  if (!canvas) return createNoopScene();

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.016);

  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 120);
  camera.position.set(0, 0.35, 9.2);

  const root = new THREE.Group();
  const gridRoot = new THREE.Group();
  const prismRoot = new THREE.Group();
  scene.add(root);
  root.add(gridRoot, prismRoot);

  const prismGeometry = new THREE.CylinderGeometry(1.42, 1.42, 2.9, 3, 1, false, Math.PI / 6);
  prismGeometry.rotateZ(Math.PI / 2);

  const prismMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xeafaff,
    metalness: 0,
    roughness: 0.05,
    transmission: 0.72,
    thickness: 1.25,
    ior: 1.8,
    transparent: true,
    opacity: 0.56,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    side: THREE.DoubleSide
  });

  const prism = new THREE.Mesh(prismGeometry, prismMaterial);
  prismRoot.add(prism);

  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.72
  });
  const prismEdges = new THREE.LineSegments(new THREE.EdgesGeometry(prismGeometry), edgeMaterial);
  prismRoot.add(prismEdges);

  const chromaPrisms = [
    makeGhostPrism(prismGeometry, 0xff2eea, -0.035),
    makeGhostPrism(prismGeometry, 0x28f8ff, 0.035)
  ];
  chromaPrisms.forEach((ghost) => prismRoot.add(ghost));

  const ringMaterials = [];
  for (let i = 0; i < 5; i += 1) {
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.08,
      wireframe: true
    });
    ringMaterials.push(material);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.5 + i * 0.78, 0.006, 8, 160), material);
    ring.rotation.set(Math.PI / 2 + i * 0.18, i * 0.36, i * 0.11);
    prismRoot.add(ring);
  }

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.18
  });
  const geometryLines = makeGeometryLines(120);
  const lineSegments = new THREE.LineSegments(geometryLines, lineMaterial);
  gridRoot.add(lineSegments);

  const grid = new THREE.GridHelper(28, 28, 0xffffff, 0xffffff);
  grid.material.transparent = true;
  grid.material.opacity = 0.08;
  grid.position.y = -3.2;
  grid.rotation.x = Math.PI * 0.02;
  gridRoot.add(grid);

  const axes = makeAxes();
  gridRoot.add(axes);

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(3.8, 5.2, 5);
  const fill = new THREE.PointLight(0x9ef7ff, 4.4, 18);
  fill.position.set(-4, 1, 4);
  const rim = new THREE.PointLight(0xff4df0, 2.8, 18);
  rim.position.set(4, -2, -3);
  const hemi = new THREE.HemisphereLight(0xffffff, 0x1b1e2c, 1.5);
  scene.add(key, fill, rim, hemi);

  const pointer = { x: 0, y: 0 };
  let targetTheme = "night";
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
    camera.position.z = width < 720 ? 11.5 : 9.2;
    camera.updateProjectionMatrix();
  }

  function setTheme(theme) {
    targetTheme = theme === "day" ? "day" : "night";
    const palette = themePalette[targetTheme];
    renderer.setClearColor(palette.clear, 0);
    scene.fog.color.setHex(palette.fog);
    prismMaterial.color.setHex(palette.prism);
    prismMaterial.opacity = targetTheme === "day" ? 0.38 : 0.56;
    prismMaterial.transmission = targetTheme === "day" ? 0.88 : 0.72;
    edgeMaterial.color.setHex(palette.line);
    edgeMaterial.opacity = targetTheme === "day" ? 0.4 : 0.72;
    lineMaterial.color.setHex(palette.line);
    lineMaterial.opacity = palette.lineOpacity;
    grid.material.color.setHex(palette.line);
    grid.material.opacity = targetTheme === "day" ? 0.05 : 0.08;
    ringMaterials.forEach((material, index) => {
      material.color.setHex(index % 2 ? palette.accent : palette.line);
      material.opacity = targetTheme === "day" ? 0.06 : 0.09;
    });
    fill.color.setHex(palette.accent);
    rim.color.setHex(palette.second);
  }

  function triggerGlitch(intensity = 1) {
    glitchUntil = performance.now() + 680 * intensity;
  }

  function setPointer(x, y) {
    pointer.x = x;
    pointer.y = y;
  }

  function render(time) {
    if (!running) return;
    const seconds = time * 0.001;
    const glitchActive = time < glitchUntil;
    const glitch = glitchActive ? Math.sin(time * 0.08) * 0.08 : 0;
    const drift = reducedMotion ? 0 : seconds;

    root.rotation.y = THREE.MathUtils.lerp(root.rotation.y, pointer.x * 0.12, 0.05);
    root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, -pointer.y * 0.08, 0.05);
    prismRoot.rotation.y = drift * 0.28 + pointer.x * 0.22 + glitch;
    prismRoot.rotation.x = Math.sin(drift * 0.42) * 0.12 - pointer.y * 0.18;
    prismRoot.rotation.z = Math.sin(drift * 0.31) * 0.05;
    gridRoot.rotation.y = drift * 0.035 + pointer.x * 0.04;
    gridRoot.position.x = pointer.x * 0.3;
    gridRoot.position.y = pointer.y * 0.2;

    chromaPrisms.forEach((ghost, index) => {
      const direction = index === 0 ? -1 : 1;
      ghost.position.x = direction * (glitchActive ? 0.18 : 0.05);
      ghost.position.y = direction * (glitchActive ? 0.04 : 0.01);
      ghost.material.opacity = glitchActive ? 0.34 : 0.11;
    });

    lineSegments.material.opacity = themePalette[targetTheme].lineOpacity + (glitchActive ? 0.12 : 0);
    prism.scale.setScalar(glitchActive ? 1 + Math.abs(Math.sin(time * 0.13)) * 0.06 : 1);

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(render);
  }

  window.addEventListener("resize", resize);
  resize();
  setTheme("night");
  rafId = requestAnimationFrame(render);

  return {
    setTheme,
    triggerGlitch,
    setPointer,
    destroy() {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      prismGeometry.dispose();
      prismMaterial.dispose();
      edgeMaterial.dispose();
      geometryLines.dispose();
      lineMaterial.dispose();
      ringMaterials.forEach((material) => material.dispose());
    }
  };
}

function makeGhostPrism(geometry, color, x) {
  const material = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.11,
    wireframe: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = x;
  mesh.scale.setScalar(1.02);
  return mesh;
}

function makeGeometryLines(count) {
  const positions = [];
  for (let i = 0; i < count; i += 1) {
    const z = -18 + Math.random() * 28;
    const y = -5 + Math.random() * 10;
    const x = -12 + Math.random() * 24;
    const length = 1.2 + Math.random() * 5.5;
    if (i % 3 === 0) {
      positions.push(x, y, z, x + length, y, z);
    } else if (i % 3 === 1) {
      positions.push(x, y, z, x, y + length * 0.5, z);
    } else {
      positions.push(x, y, z, x + length * 0.55, y + length * 0.55, z);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

function makeAxes() {
  const group = new THREE.Group();
  const colors = [0x9ef7ff, 0xff4df0, 0xf7ff6a];
  const vectors = [
    [new THREE.Vector3(-7, 0, 0), new THREE.Vector3(7, 0, 0)],
    [new THREE.Vector3(0, -4, 0), new THREE.Vector3(0, 4, 0)],
    [new THREE.Vector3(0, 0, -8), new THREE.Vector3(0, 0, 8)]
  ];
  vectors.forEach(([start, end], index) => {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({
      color: colors[index],
      transparent: true,
      opacity: 0.22
    });
    group.add(new THREE.Line(geometry, material));
  });
  return group;
}

function createNoopScene() {
  return {
    setTheme() {},
    triggerGlitch() {},
    setPointer() {},
    destroy() {}
  };
}
