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
  renderer.toneMappingExposure = 1.24;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x010105, 0.014);

  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 140);
  camera.position.set(0, 0.22, 9.6);

  const root = new THREE.Group();
  const gridRoot = new THREE.Group();
  const markRoot = new THREE.Group();
  const spectralRoot = new THREE.Group();
  const shardRoot = new THREE.Group();
  scene.add(root);
  root.add(gridRoot, markRoot, spectralRoot, shardRoot);

  const frostTexture = makeFrostTexture();
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf3fbff,
    metalness: 0,
    roughness: 0.035,
    transmission: 0.98,
    thickness: 6.2,
    ior: 1.84,
    transparent: true,
    opacity: 0.58,
    alphaMap: frostTexture,
    roughnessMap: frostTexture,
    clearcoat: 1,
    clearcoatRoughness: 0.01,
    reflectivity: 1,
    side: THREE.DoubleSide,
    depthWrite: false
  });

  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.58
  });

  const nLogo = makeGlassN(glassMaterial, edgeMaterial);
  markRoot.add(nLogo);

  const spectralMaterialCyan = glassMaterial.clone();
  spectralMaterialCyan.color = new THREE.Color(0x00eaff);
  spectralMaterialCyan.opacity = 0.17;
  const spectralMaterialMagenta = glassMaterial.clone();
  spectralMaterialMagenta.color = new THREE.Color(0xff36f1);
  spectralMaterialMagenta.opacity = 0.14;
  const cyanGhost = makeGlassN(spectralMaterialCyan, new THREE.LineBasicMaterial({ color: 0x00eaff, transparent: true, opacity: 0.25 }));
  const magentaGhost = makeGlassN(spectralMaterialMagenta, new THREE.LineBasicMaterial({ color: 0xff3df0, transparent: true, opacity: 0.2 }));
  cyanGhost.position.x = 0.075;
  magentaGhost.position.x = -0.075;
  spectralRoot.add(cyanGhost, magentaGhost);

  const curveWall = makeCurvedWall();
  gridRoot.add(curveWall);

  const tunnelLines = makeTunnelLines();
  const darkPanels = makeDarkPanels();
  const crossMarkers = makeCrossMarkers();
  const bgGlyphs = makeBackgroundGlyphs();
  gridRoot.add(tunnelLines, darkPanels, crossMarkers, bgGlyphs);

  const logoNoise = makeLogoNoise();
  shardRoot.add(logoNoise);

  const caustics = makeCausticStripes();
  const fractureLines = makeFractureLines();
  const surfaceBlocks = makeSurfaceBlocks();
  markRoot.add(caustics, fractureLines, surfaceBlocks);

  const rings = [];
  for (let i = 0; i < 3; i += 1) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.35 + i * 0.78, 0.005, 8, 180),
      new THREE.MeshBasicMaterial({ color: i % 2 ? 0x7597ff : 0xffffff, wireframe: true, transparent: true, opacity: 0.055 })
    );
    ring.rotation.set(Math.PI / 2 + i * 0.09, i * 0.22, i * 0.08);
    markRoot.add(ring);
    rings.push(ring);
  }

  const stars = makeStars();
  scene.add(stars);

  const key = new THREE.DirectionalLight(0xffffff, 4.9);
  key.position.set(2.8, 4.8, 5.2);
  const blue = new THREE.PointLight(0x58a8ff, 10.8, 28);
  blue.position.set(-3, 0.8, 3.4);
  const rim = new THREE.PointLight(0xffffff, 7.4, 22);
  rim.position.set(3.4, -1.2, 2.6);
  const glint = new THREE.PointLight(0xffffff, 8.2, 12);
  glint.position.set(0.4, 0.1, 3.2);
  scene.add(key, blue, rim, glint, new THREE.HemisphereLight(0xffffff, 0x060712, 1.45));

  const pointer = { x: 0, y: 0 };
  const scroll = { page: 0, hero: 0, news: 0, works: 0, about: 0, products: 0, final: 0 };
  const accent = {
    primary: new THREE.Color(0x6078ff),
    secondary: new THREE.Color(0x92e9ff),
    strength: 0
  };
  const materialPresets = {
    ice: {
      base: 0xdffbff,
      primary: 0x7ce5ff,
      secondary: 0xf7fbff,
      glow: 0x42baff,
      edge: 0xd8fbff,
      ghostA: 0x00eaff,
      ghostB: 0xf8fbff,
      opacity: 0.5,
      roughness: 0.045,
      transmission: 0.98
    },
    white: {
      base: 0xffffff,
      primary: 0xffffff,
      secondary: 0xd8e4ff,
      glow: 0xffffff,
      edge: 0xffffff,
      ghostA: 0xeef6ff,
      ghostB: 0xffffff,
      opacity: 0.34,
      roughness: 0.018,
      transmission: 1
    },
    violet: {
      base: 0xae7bff,
      primary: 0x8759ff,
      secondary: 0xff8cf8,
      glow: 0x7a4dff,
      edge: 0xe6ceff,
      ghostA: 0xff48f7,
      ghostB: 0x69eaff,
      opacity: 0.56,
      roughness: 0.068,
      transmission: 0.9
    },
    carbon: {
      base: 0x233968,
      primary: 0x1a2a55,
      secondary: 0x75f4ff,
      glow: 0x1d3b7a,
      edge: 0x89f2ff,
      ghostA: 0x1a2d62,
      ghostB: 0x00e8ff,
      opacity: 0.68,
      roughness: 0.14,
      transmission: 0.58
    }
  };
  let materialPreset = "ice";
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
    camera.position.z = width < 720 ? 15.2 : 9.9;
    camera.updateProjectionMatrix();
  }

  function setScroll(next) {
    Object.assign(scroll, next);
  }

  function setPointer(x, y) {
    pointer.x = x;
    pointer.y = y;
  }

  function setAccent(primary = "#6078ff", secondary = "#92e9ff", strength = 0) {
    accent.primary.set(primary);
    accent.secondary.set(secondary);
    accent.strength = Math.min(1, Math.max(0, strength));
  }

  function setMaterialPreset(id = "ice") {
    materialPreset = materialPresets[id] ? id : "ice";
  }

  function triggerGlitch(intensity = 1) {
    glitchUntil = performance.now() + 520 * intensity;
  }

  function render(time) {
    if (!running) return;
    const seconds = time * 0.001;
    const intro = reducedMotion ? 1 : smoothstep(0.1, 2.05, seconds);
    const glitchActive = time < glitchUntil;
    const glitch = glitchActive ? Math.sin(time * 0.12) * 0.075 : 0;
    const drift = reducedMotion ? 0 : seconds;
    const aboutFade = smoothstep(0.08, 0.76, scroll.about);
    const worksDepth = smoothstep(0.05, 0.86, scroll.works);
    const newsDepth = smoothstep(0.08, 0.82, scroll.news);
    const productDepth = smoothstep(0.08, 0.86, scroll.products);
    const finalDepth = smoothstep(0.12, 0.88, scroll.final);
    const stageDepth = Math.max(worksDepth, productDepth * 0.78, newsDepth * 0.46);
    const detailMix = Math.min(1, stageDepth * 1.25);
    const preset = materialPresets[materialPreset];
    const accentMix = Math.max(worksDepth * accent.strength, productDepth * 0.18);
    const glassColor = new THREE.Color(preset.base).lerp(accent.primary, accentMix * 0.38);
    const lineColor = new THREE.Color(preset.edge).lerp(accent.secondary, accentMix * 0.68);
    const wallColor = new THREE.Color(preset.primary).lerp(accent.primary, accentMix * 0.72);
    glassMaterial.color.copy(glassColor);
    glassMaterial.transmission = preset.transmission;
    glassMaterial.attenuationColor = new THREE.Color(preset.secondary);
    glassMaterial.attenuationDistance = materialPreset === "carbon" ? 1.7 : 3.6;
    edgeMaterial.color.copy(lineColor);
    spectralMaterialCyan.color.copy(new THREE.Color(preset.ghostA).lerp(accent.secondary, accentMix * 0.32));
    spectralMaterialMagenta.color.copy(new THREE.Color(preset.ghostB).lerp(accent.primary, accentMix * 0.26));
    blue.color.copy(new THREE.Color(preset.glow).lerp(accent.primary, accentMix));
    rim.color.copy(new THREE.Color(preset.secondary).lerp(accent.secondary, accentMix * 0.9));
    glint.color.copy(new THREE.Color(0xffffff).lerp(accent.secondary, accentMix * 0.35));
    curveWall.material.color.copy(wallColor);
    tunnelLines.material.color.copy(new THREE.Color(0x9aa8ff).lerp(accent.secondary, accentMix));
    crossMarkers.material.color.copy(new THREE.Color(0xffffff).lerp(accent.secondary, accentMix * 0.25));
    bgGlyphs.children.forEach((glyph, index) => {
      glyph.material.color.copy(new THREE.Color(index % 2 ? preset.secondary : preset.primary).lerp(accent.primary, accentMix * 0.42));
    });
    stars.material.color.copy(new THREE.Color(0xffffff).lerp(accent.secondary, accentMix * 0.38));

    root.rotation.y = THREE.MathUtils.lerp(root.rotation.y, pointer.x * 0.09 - worksDepth * 0.28 + productDepth * 0.18, 0.05);
    root.rotation.x = THREE.MathUtils.lerp(root.rotation.x, -pointer.y * 0.05, 0.05);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.34 + productDepth * 0.55 - finalDepth * 0.28, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.18 - scroll.page * 0.54 + newsDepth * 0.08, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, (width < 720 ? 15.2 : 9.6) - intro * 1.28 - stageDepth * 1.85 + finalDepth * 1.08, 0.035);

    markRoot.rotation.y = (1 - intro) * -1.18 + drift * 0.038 + pointer.x * 0.1 + glitch + worksDepth * 0.44 - productDepth * 0.42 + aboutFade * -0.18;
    markRoot.rotation.x = (1 - intro) * 0.34 + Math.sin(drift * 0.28) * 0.018 - pointer.y * 0.052 + newsDepth * 0.04 + aboutFade * 0.08;
    markRoot.rotation.z = glitch * 0.7 + finalDepth * 0.1;
    markRoot.position.x = -0.12 * (1 - stageDepth) + productDepth * -0.42 + finalDepth * 0.28;
    markRoot.position.y = -0.04 + intro * 0.1 - scroll.page * 0.54 + Math.sin(drift * 0.58) * 0.022 + productDepth * 0.38;
    markRoot.scale.setScalar((0.52 + intro * 0.3) * (1.01 + worksDepth * 0.02 - aboutFade * 0.1 + finalDepth * 0.08));
    markRoot.visible = finalDepth < 0.94;

    spectralRoot.rotation.copy(markRoot.rotation);
    spectralRoot.position.copy(markRoot.position);
    spectralRoot.scale.copy(markRoot.scale);
    spectralRoot.children.forEach((line, index) => {
      line.position.x = (index ? -1 : 1) * (glitchActive ? 0.2 : 0.072);
      line.position.y = (index ? 1 : -1) * (glitchActive ? 0.04 : 0.015);
      line.children.forEach((child) => {
        if (child.material) {
          const ghostBase = materialPreset === "white" ? 0.06 : materialPreset === "carbon" ? 0.18 : 0.13;
          child.material.opacity = (glitchActive ? 0.34 : ghostBase) * intro;
        }
      });
    });

    shardRoot.rotation.copy(markRoot.rotation);
    shardRoot.position.copy(markRoot.position);
    shardRoot.scale.copy(markRoot.scale);
    logoNoise.rotation.z = -drift * 0.035 + glitch * 2;
    logoNoise.material.opacity = (0.18 + detailMix * 0.14 + (glitchActive ? 0.16 : 0)) * intro;

    gridRoot.rotation.y = drift * 0.016 + pointer.x * 0.035 - worksDepth * 0.54 + productDepth * 0.28;
    gridRoot.position.z = -stageDepth * 2.9;
    gridRoot.position.y = -scroll.page * 1.38 + productDepth * 0.4;
    curveWall.material.opacity = 0.24 + (stageDepth * 0.2) - finalDepth * 0.08;
    tunnelLines.material.opacity = 0.018 + stageDepth * 0.075 - finalDepth * 0.03;
    crossMarkers.material.opacity = 0.055 + stageDepth * 0.08 - finalDepth * 0.055;
    bgGlyphs.children.forEach((glyph, index) => {
      glyph.material.opacity = (0.08 + index * 0.012 + stageDepth * 0.04) * (1 - finalDepth * 0.55);
    });
    darkPanels.children.forEach((panel, index) => {
      panel.material.opacity = (0.1 + stageDepth * 0.2 + Math.sin(drift * 0.34 + index) * 0.016) * (1 - finalDepth * 0.5);
    });

    glassMaterial.opacity = Math.max(0.18, preset.opacity + 0.08 - worksDepth * 0.06 - aboutFade * 0.34 + productDepth * 0.06 + (glitchActive ? 0.1 : 0)) * intro;
    glassMaterial.roughness = Math.max(0.018, preset.roughness - 0.012 + worksDepth * 0.08 + productDepth * 0.06);
    edgeMaterial.opacity = Math.max(0.34, 0.94 - worksDepth * 0.18 + aboutFade * 0.18);
    caustics.children.forEach((stripe, index) => {
      stripe.position.y = stripe.userData.baseY + Math.sin(drift * 0.8 + index * 1.8) * 0.08;
      stripe.material.color.copy(new THREE.Color(index % 2 ? preset.secondary : preset.edge).lerp(accent.secondary, accentMix * 0.46));
      stripe.material.opacity = ((stripe.userData.baseOpacity || 0.14) + detailMix * 0.08 + Math.sin(drift * 1.2 + index) * 0.018) * intro * (1 - aboutFade * 0.62);
    });
    fractureLines.material.opacity = (detailMix * 0.09 + (glitchActive ? 0.12 : 0)) * intro;
    surfaceBlocks.children.forEach((block, index) => {
      block.material.opacity = (detailMix * (0.07 + Math.sin(drift * 0.9 + index * 0.7) * 0.014)) * intro;
      block.position.z = 0.62 + Math.sin(drift * 0.6 + index) * 0.018;
    });
    rings.forEach((ring, index) => {
      ring.rotation.z = drift * (0.02 + index * 0.01);
      ring.material.opacity = Math.max(0, detailMix * 0.04 - aboutFade * 0.03);
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
    setAccent,
    setMaterialPreset,
    triggerGlitch,
    destroy() {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      renderer.dispose();
    }
  };
}

function makeGlassN(material, edgeMaterial) {
  const group = new THREE.Group();
  const barSpecs = [
    { x: -1.34, y: 0, length: 4.34, width: 0.72, rotation: 0 },
    { x: 1.34, y: 0, length: 4.34, width: 0.72, rotation: 0 },
    { x: 0, y: 0, length: 5.15, width: 0.76, rotation: -0.62 }
  ];
  barSpecs.forEach((spec) => {
    const mesh = makeBar(spec.x, spec.y, spec.length, spec.width, spec.rotation, material);
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry, 18), edgeMaterial);
    edge.position.copy(mesh.position);
    edge.rotation.copy(mesh.rotation);
    group.add(mesh, edge);
  });
  group.rotation.z = 0.01;
  return group;
}

function makeBar(x, y, length, width, rotation, material) {
  const shape = new THREE.Shape();
  const halfWidth = width / 2;
  const halfLength = length / 2;
  shape.moveTo(-halfWidth, -halfLength);
  shape.lineTo(halfWidth, -halfLength);
  shape.lineTo(halfWidth, halfLength);
  shape.lineTo(-halfWidth, halfLength);
  shape.lineTo(-halfWidth, -halfLength);
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 1.18,
    bevelEnabled: true,
    bevelThickness: 0.15,
    bevelSize: 0.14,
    bevelSegments: 4,
    curveSegments: 1
  });
  geometry.translate(0, 0, -0.59);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, 0.12);
  mesh.rotation.z = rotation;
  return mesh;
}

function makeCausticStripes() {
  const group = new THREE.Group();
  const colors = [0xffffff, 0xffffff, 0x84f2ff, 0x6e7bff, 0xff54f1, 0xffffff, 0x05060b];
  const specs = [
    { w: 5.55, h: 0.42, y: 0.15, x: 0.02, r: -0.08, opacity: 0.34 },
    { w: 5.15, h: 0.22, y: 0.38, x: -0.1, r: -0.12, opacity: 0.24 },
    { w: 4.65, h: 0.08, y: -0.12, x: 0.18, r: -0.04, opacity: 0.18 },
    { w: 3.9, h: 0.1, y: -0.46, x: -0.25, r: -0.1, opacity: 0.16 },
    { w: 3.65, h: 0.07, y: 0.72, x: 0.16, r: -0.15, opacity: 0.16 },
    { w: 4.8, h: 0.16, y: -0.82, x: 0.05, r: -0.08, opacity: 0.12 },
    { w: 2.6, h: 0.2, y: 0.0, x: 0.8, r: -0.04, opacity: 0.14 }
  ];
  specs.forEach((spec, i) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(spec.w, spec.h),
      new THREE.MeshBasicMaterial({
        color: colors[i],
        transparent: true,
        opacity: spec.opacity,
        blending: i === specs.length - 1 ? THREE.NormalBlending : THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    mesh.position.set(spec.x, spec.y, 0.7 + i * 0.012);
    mesh.rotation.z = spec.r;
    mesh.userData.baseY = spec.y;
    mesh.userData.baseOpacity = spec.opacity;
    group.add(mesh);
  });
  return group;
}

function makeFractureLines() {
  const points = [];
  const random = seededRandom(27);
  for (let i = 0; i < 88; i += 1) {
    const point = sampleNPoint(random);
    const x = point.x + (random() - 0.5) * 0.18;
    const y = point.y + (random() - 0.5) * 0.18;
    const length = 0.24 + random() * 0.82;
    const angle = -0.86 + random() * 1.72;
    points.push(
      x,
      y,
      0.64,
      x + Math.cos(angle) * length,
      y + Math.sin(angle) * length,
      0.64
    );
  }
  for (let i = 0; i < 36; i += 1) {
    const point = sampleNPoint(random, 2);
    const x = point.x + (random() - 0.5) * 0.28;
    const y = point.y + (random() - 0.5) * 0.28;
    points.push(x, y, 0.65, x + 0.58 + random() * 0.6, y - 0.4 + random() * 0.8, 0.65);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  const material = new THREE.LineBasicMaterial({
    color: 0xf2f7ff,
    transparent: true,
    opacity: 0.24,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  return new THREE.LineSegments(geometry, material);
}

function makeSurfaceBlocks() {
  const group = new THREE.Group();
  const random = seededRandom(91);
  const colors = [0xdfeaff, 0x76f3ff, 0x8d87ff, 0xffffff, 0x03040a, 0x11131e];
  for (let i = 0; i < 62; i += 1) {
    const width = 0.18 + random() * 0.62;
    const height = 0.06 + random() * 0.3;
    const isDark = i % 6 > 3;
    const material = new THREE.MeshBasicMaterial({
      color: colors[i % colors.length],
      transparent: true,
      opacity: isDark ? 0.16 : 0.1,
      blending: isDark ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material);
    const column = i % 3;
    const point = sampleNPoint(random, column);
    mesh.position.x = point.x + (random() - 0.5) * 0.22;
    mesh.position.y = point.y + (random() - 0.5) * 0.24;
    mesh.position.z = 0.62;
    mesh.rotation.z = column === 1 ? -0.62 + (random() - 0.5) * 0.28 : (random() - 0.5) * 0.3;
    group.add(mesh);
  }
  return group;
}

function makeDarkPanels() {
  const group = new THREE.Group();
  const random = seededRandom(513);
  const material = new THREE.MeshBasicMaterial({
    color: 0x02030a,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  for (let i = 0; i < 12; i += 1) {
    const width = 0.7 + random() * 1.8;
    const height = 0.8 + random() * 2.2;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material.clone());
    mesh.position.set(-6.6 + random() * 13.2, -3.2 + random() * 6.4, -7.8 - random() * 7.5);
    mesh.rotation.y = (random() - 0.5) * 0.2;
    mesh.rotation.z = (random() - 0.5) * 0.08;
    group.add(mesh);
  }
  return group;
}

function makeCrossMarkers() {
  const points = [];
  const radius = 10.3;
  const arc = Math.PI * 1.04;
  const columns = 11;
  const rows = 7;
  const size = 0.065;
  for (let yIndex = 0; yIndex < rows; yIndex += 1) {
    const y = -3.4 + yIndex * 1.12;
    for (let xIndex = 0; xIndex < columns; xIndex += 1) {
      const angle = -arc / 2 + (arc / (columns - 1)) * xIndex;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius - radius - 3.25;
      points.push(x - size, y, z, x + size, y, z);
      points.push(x, y - size, z, x, y + size, z);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  const material = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  return new THREE.LineSegments(geometry, material);
}

function makeBackgroundGlyphs() {
  const group = new THREE.Group();
  const materialA = new THREE.LineBasicMaterial({
    color: 0x7fa6ff,
    transparent: true,
    opacity: 0.08,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const materialB = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.06,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const specs = [
    { x: -4.8, y: 1.6, z: -7.9, s: 1.2, r: -0.02, material: materialA },
    { x: 3.8, y: 0.8, z: -8.6, s: 1.0, r: 0.04, material: materialB },
    { x: -1.6, y: -2.1, z: -9.8, s: 1.45, r: 0.01, material: materialA },
    { x: 5.5, y: -2.8, z: -11.2, s: 1.24, r: -0.06, material: materialB }
  ];
  specs.forEach((spec) => {
    const glyph = makeLineGlyphN(spec.material.clone());
    glyph.position.set(spec.x, spec.y, spec.z);
    glyph.rotation.z = spec.r;
    glyph.scale.setScalar(spec.s);
    group.add(glyph);
  });
  return group;
}

function makeLineGlyphN(material) {
  const points = [
    -0.85, -1.1, 0, -0.85, 1.1, 0,
    -0.85, 1.1, 0, 0.85, -1.1, 0,
    0.85, -1.1, 0, 0.85, 1.1, 0
  ];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  return new THREE.LineSegments(geometry, material);
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function makeCurvedWall() {
  const points = [];
  const radius = 10.8;
  const rows = 22;
  const cols = 58;
  const arc = Math.PI * 1.08;
  for (let r = 0; r <= rows; r += 1) {
    const y = -4.8 + r * 0.46;
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
      const y1 = -4.8 + r * 0.46;
      const y2 = -4.8 + (r + 1) * 0.46;
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
  const random = seededRandom(717);
  for (let i = 0; i < 980; i += 1) {
    const point = sampleNPoint(random);
    vertices.push(
      point.x + (random() - 0.5) * 0.32,
      point.y + (random() - 0.5) * 0.32,
      (random() - 0.5) * 0.34
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

function sampleNPoint(random, preferredBar) {
  const bar = preferredBar ?? Math.floor(random() * 3);
  const width = bar === 1 ? 0.76 : 0.72;
  const length = bar === 1 ? 5.15 : 4.34;
  const localX = (random() - 0.5) * width;
  const localY = (random() - 0.5) * length;
  if (bar === 0) return { x: -1.34 + localX, y: localY };
  if (bar === 2) return { x: 1.34 + localX, y: localY };
  const rotation = -0.62;
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  return {
    x: localX * cos - localY * sin,
    y: localX * sin + localY * cos
  };
}

function makeFrostTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const image = ctx.createImageData(size, size);
  const random = seededRandom(2407);
  for (let i = 0; i < image.data.length; i += 4) {
    const grain = random();
    const bright = grain > 0.82 ? 255 : grain > 0.6 ? 210 : 155 + grain * 60;
    image.data[i] = bright;
    image.data[i + 1] = bright;
    image.data[i + 2] = bright;
    image.data[i + 3] = grain > 0.16 ? 230 : 150;
  }
  ctx.putImageData(image, 0, 0);
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = "#fff";
  for (let i = 0; i < 46; i += 1) {
    const x = random() * size;
    const y = random() * size;
    const w = 8 + random() * 42;
    const h = 2 + random() * 9;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((random() - 0.5) * 0.5);
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.restore();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.4, 2.4);
  texture.needsUpdate = true;
  return texture;
}

function makeStars() {
  const vertices = [];
  const random = seededRandom(1149);
  for (let i = 0; i < 220; i += 1) {
    vertices.push((random() - 0.5) * 28, (random() - 0.5) * 14, -random() * 18 - 4);
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
    setAccent() {},
    setMaterialPreset() {},
    triggerGlitch() {},
    destroy() {}
  };
}
