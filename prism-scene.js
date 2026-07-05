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
  const reflectionTexture = makeReflectionTexture();
  scene.environment = reflectionTexture;
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf3fbff,
    metalness: 0,
    roughness: 0.024,
    transmission: 0.98,
    thickness: 2.2,
    ior: 1.84,
    transparent: true,
    opacity: 0.22,
    alphaMap: frostTexture,
    roughnessMap: frostTexture,
    metalnessMap: frostTexture,
    envMap: reflectionTexture,
    envMapIntensity: 2.45,
    clearcoat: 1,
    clearcoatRoughness: 0.006,
    reflectivity: 1,
    side: THREE.DoubleSide,
    depthWrite: false
  });
  glassMaterial.iridescence = 0.34;
  glassMaterial.iridescenceIOR = 1.72;

  const edgeMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.04
  });

  const nLogo = makeGlassN(glassMaterial, edgeMaterial, { filmOpacity: 1 });
  markRoot.add(nLogo);

  const spectralMaterialCyan = glassMaterial.clone();
  spectralMaterialCyan.color = new THREE.Color(0x00eaff);
  spectralMaterialCyan.opacity = 0.17;
  const spectralMaterialMagenta = glassMaterial.clone();
  spectralMaterialMagenta.color = new THREE.Color(0xff36f1);
  spectralMaterialMagenta.opacity = 0.14;
  const cyanGhost = makeGlassN(spectralMaterialCyan, new THREE.LineBasicMaterial({ color: 0x00eaff, transparent: true, opacity: 0.035 }), { filmOpacity: 0.055 });
  const magentaGhost = makeGlassN(spectralMaterialMagenta, new THREE.LineBasicMaterial({ color: 0xff3df0, transparent: true, opacity: 0.03 }), { filmOpacity: 0.045 });
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
      opacity: 0.19,
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
      opacity: 0.16,
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
      opacity: 0.18,
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
      opacity: 0.18,
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
    glassMaterial.envMapIntensity = 2.1 + Math.sin(drift * 0.42) * 0.22 + detailMix * 0.44 + accentMix * 0.52;
    glassMaterial.iridescence = 0.28 + detailMix * 0.18 + (glitchActive ? 0.2 : 0);
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
    const viewportScale = width < 720 ? 0.74 : 1;
    markRoot.scale.setScalar((0.62 + intro * 0.34) * (1.01 + worksDepth * 0.02 - aboutFade * 0.1 + finalDepth * 0.08) * viewportScale);
    markRoot.visible = finalDepth < 0.94;

    spectralRoot.rotation.copy(markRoot.rotation);
    spectralRoot.position.copy(markRoot.position);
    spectralRoot.scale.copy(markRoot.scale);
    spectralRoot.children.forEach((line, index) => {
      line.position.x = (index ? -1 : 1) * (glitchActive ? 0.2 : 0.072);
      line.position.y = (index ? 1 : -1) * (glitchActive ? 0.04 : 0.015);
      line.children.forEach((child) => {
        if (child.material) {
          const ghostBase = materialPreset === "white" ? 0.025 : materialPreset === "carbon" ? 0.07 : 0.045;
          child.material.opacity = (glitchActive ? 0.16 : ghostBase) * intro;
        }
      });
    });

    shardRoot.rotation.copy(markRoot.rotation);
    shardRoot.position.copy(markRoot.position);
    shardRoot.scale.copy(markRoot.scale);
    logoNoise.rotation.z = -drift * 0.035 + glitch * 2;
    logoNoise.material.opacity = (0.012 + detailMix * 0.012 + (glitchActive ? 0.02 : 0)) * intro;

    gridRoot.rotation.y = drift * 0.016 + pointer.x * 0.035 - worksDepth * 0.54 + productDepth * 0.28;
    gridRoot.position.z = -stageDepth * 2.9;
    gridRoot.position.y = -scroll.page * 1.38 + productDepth * 0.4;
    curveWall.material.opacity = 0.24 + (stageDepth * 0.2) - finalDepth * 0.08;
    tunnelLines.material.opacity = 0.018 + stageDepth * 0.075 - finalDepth * 0.03;
    crossMarkers.material.opacity = 0.055 + stageDepth * 0.08 - finalDepth * 0.055;
    bgGlyphs.children.forEach((glyph, index) => {
      glyph.material.opacity = (0.08 + index * 0.012 + stageDepth * 0.04) * (1 - finalDepth * 0.55);
      const base = glyph.userData.basePosition;
      if (base) {
        glyph.position.x = base.x + worksDepth * (index % 2 ? -1.6 : 1.2) + Math.sin(drift * 0.24 + index) * 0.08;
        glyph.position.y = base.y - scroll.page * 0.26 + worksDepth * (index - 1.5) * 0.18;
        glyph.position.z = base.z + worksDepth * (index % 2 ? 1.0 : -0.55);
      }
      glyph.rotation.z = glyph.userData.baseRotation + drift * (index % 2 ? -0.018 : 0.014) + worksDepth * (index % 2 ? -0.1 : 0.08);
    });
    darkPanels.children.forEach((panel, index) => {
      panel.material.opacity = (0.1 + stageDepth * 0.2 + Math.sin(drift * 0.34 + index) * 0.016) * (1 - finalDepth * 0.5);
    });

    glassMaterial.opacity = Math.max(0.012, preset.opacity - 0.07 - worksDepth * 0.048 - aboutFade * 0.05 + productDepth * 0.01 + (glitchActive ? 0.022 : 0)) * intro;
    glassMaterial.roughness = Math.max(0.014, preset.roughness - 0.018 + worksDepth * 0.075 + productDepth * 0.05 + Math.sin(drift * 0.36) * 0.006);
    edgeMaterial.opacity = Math.max(0.006, 0.014 - worksDepth * 0.006 + aboutFade * 0.018 + (glitchActive ? 0.018 : 0));
    caustics.children.forEach((stripe, index) => {
      stripe.position.y = stripe.userData.baseY + Math.sin(drift * 0.8 + index * 1.8) * 0.08;
      stripe.material.color.copy(new THREE.Color(index % 2 ? preset.secondary : preset.edge).lerp(accent.secondary, accentMix * 0.46));
      const baseOpacity = stripe.userData.isDark ? 0 : (stripe.userData.baseOpacity || 0.012);
      stripe.material.opacity = (baseOpacity + detailMix * 0.006 + Math.sin(drift * 1.2 + index) * 0.002) * intro * (1 - aboutFade * 0.62);
    });
    fractureLines.material.opacity = (detailMix * 0.001 + (glitchActive ? 0.004 : 0)) * intro;
    surfaceBlocks.children.forEach((block, index) => {
      block.material.opacity = (detailMix * (0.0018 + Math.sin(drift * 0.9 + index * 0.7) * 0.0008)) * intro;
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

function makeGlassN(material, edgeMaterial, options = {}) {
  const group = new THREE.Group();
  const geometry = makeNGeometry();
  const mesh = new THREE.Mesh(geometry, material);
  const film = makeLetterGlassFilm(options.filmOpacity ?? 1);
  const rimMaterial = edgeMaterial.clone();
  rimMaterial.opacity = 0.009;
  const rimLine = makeNContourLines(rimMaterial, 1);
  group.add(mesh, film, rimLine);
  group.rotation.z = 0.01;
  return group;
}

function makeNGeometry() {
  const shape = new THREE.Shape();
  const points = getNOutlinePoints();
  shape.moveTo(points[0].x, points[0].y);
  points.slice(1).forEach((point) => shape.lineTo(point.x, point.y));
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.038,
    bevelSegments: 12,
    curveSegments: 8
  });
  geometry.translate(0, 0, -0.04);
  geometry.computeVertexNormals();
  return geometry;
}

function getNOutlinePoints() {
  return [
    { x: -1.68, y: -2.18 },
    { x: -1.68, y: 2.18 },
    { x: -0.68, y: 2.18 },
    { x: 0.82, y: -2.18 },
    { x: 1.68, y: -2.18 },
    { x: 1.68, y: 2.18 },
    { x: 0.68, y: 2.18 },
    { x: -0.82, y: -2.18 }
  ];
}

function makeNContourLines(material, scale = 1) {
  const points = [];
  const z = 0.66;
  const add = (a, b) => points.push(a.x * scale, a.y * scale, z, b.x * scale, b.y * scale, z);
  const outline = getNOutlinePoints();
  outline.forEach((point, index) => add(point, outline[(index + 1) % outline.length]));
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  const line = new THREE.LineSegments(geometry, material);
  line.position.z = 0.02;
  return line;
}

function makeLetterGlassFilm(opacity = 1) {
  const texture = makeLetterFilmTexture();
  const group = new THREE.Group();
  const makeLayer = (color, alpha, x, z, blend = THREE.AdditiveBlending) => {
    const material = new THREE.MeshBasicMaterial({
      color,
      map: texture,
      transparent: true,
      opacity: alpha * opacity,
      blending: blend,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(4.55, 5.35), material);
    mesh.position.set(x, 0, z);
    return mesh;
  };
  group.add(
    makeLayer(0xf7fbff, 0.74, 0, 0.34),
    makeLayer(0xdff4ff, 0.36, 0.012, 0.35, THREE.NormalBlending),
    makeLayer(0x54eaff, 0.1, 0.03, 0.36),
    makeLayer(0xff51f3, 0.05, -0.034, 0.37)
  );
  const rimMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0xffffff,
    transparent: true,
    opacity: 0.18 * opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const rim = new THREE.Mesh(new THREE.PlaneGeometry(4.72, 5.55), rimMaterial);
  rim.position.z = 0.32;
  group.add(rim);
  return group;
}

function makeLetterFilmTexture() {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const random = seededRandom(6197);

  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.translate(size / 2, size / 2 + 12);
  ctx.scale(0.9, 1.07);
  ctx.font = "900 860px Arial Black, Impact, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "rgba(238,250,255,.42)";
  ctx.fillText("N", 0, 0);
  ctx.globalCompositeOperation = "source-in";
  const gradient = ctx.createLinearGradient(-size * 0.42, -size * 0.3, size * 0.46, size * 0.38);
  gradient.addColorStop(0, "rgba(76,150,210,.12)");
  gradient.addColorStop(0.2, "rgba(150,225,255,.42)");
  gradient.addColorStop(0.39, "rgba(255,255,255,.72)");
  gradient.addColorStop(0.55, "rgba(210,224,255,.42)");
  gradient.addColorStop(0.78, "rgba(255,255,255,.56)");
  gradient.addColorStop(1, "rgba(230,248,255,.3)");
  ctx.fillStyle = gradient;
  ctx.fillRect(-size / 2, -size / 2, size, size);

  ctx.globalCompositeOperation = "source-atop";
  for (let i = 0; i < 190; i += 1) {
    const x = -size * 0.5 + random() * size;
    const y = -size * 0.5 + random() * size;
    const w = 44 + random() * 320;
    const h = 2 + random() * 22;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((random() - 0.5) * 0.36);
    ctx.fillStyle = i % 4 === 0 ? "rgba(255,255,255,.18)" : "rgba(180,232,255,.055)";
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.restore();
  }

  ctx.globalCompositeOperation = "source-atop";
  const shine = ctx.createLinearGradient(-size * 0.45, -size * 0.02, size * 0.46, size * 0.1);
  shine.addColorStop(0, "rgba(255,255,255,0)");
  shine.addColorStop(0.42, "rgba(255,255,255,.04)");
  shine.addColorStop(0.5, "rgba(255,255,255,.42)");
  shine.addColorStop(0.58, "rgba(255,255,255,.04)");
  shine.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = shine;
  ctx.fillRect(-size / 2, -size * 0.12, size, size * 0.24);

  for (let i = 0; i < 6800; i += 1) {
    const x = -size * 0.5 + random() * size;
    const y = -size * 0.5 + random() * size;
    const alpha = random() > 0.52 ? 0.08 + random() * 0.12 : 0.024;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fillRect(x, y, 1.2 + random() * 1.4, 1.2 + random() * 1.4);
  }
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function makeCausticStripes() {
  const group = new THREE.Group();
  const colors = [0xffffff, 0xffffff, 0x84f2ff, 0x6e7bff, 0xff54f1, 0xffffff, 0x05060b];
  const specs = [
    { w: 2.7, h: 0.12, y: 0.12, x: 0.0, r: -0.08, opacity: 0.014 },
    { w: 2.35, h: 0.06, y: 0.38, x: -0.08, r: -0.12, opacity: 0.01 },
    { w: 2.1, h: 0.035, y: -0.12, x: 0.16, r: -0.04, opacity: 0.009 },
    { w: 1.85, h: 0.035, y: -0.46, x: -0.18, r: -0.1, opacity: 0.007 },
    { w: 1.8, h: 0.025, y: 0.72, x: 0.12, r: -0.15, opacity: 0.006 },
    { w: 2.2, h: 0.04, y: -0.82, x: 0.04, r: -0.08, opacity: 0.006 },
    { w: 1.4, h: 0.1, y: 0.0, x: 0.68, r: -0.04, opacity: 0 }
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
    mesh.userData.isDark = i === specs.length - 1;
    group.add(mesh);
  });
  return group;
}

function makeFractureLines() {
  const points = [];
  const random = seededRandom(27);
  for (let i = 0; i < 38; i += 1) {
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
  for (let i = 0; i < 14; i += 1) {
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
    opacity: 0.08,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  return new THREE.LineSegments(geometry, material);
}

function makeSurfaceBlocks() {
  const group = new THREE.Group();
  const random = seededRandom(91);
  const colors = [0xdfeaff, 0x76f3ff, 0x8d87ff, 0xffffff, 0x03040a, 0x11131e];
  for (let i = 0; i < 26; i += 1) {
    const width = 0.18 + random() * 0.62;
    const height = 0.06 + random() * 0.3;
    const isDark = i % 6 > 3;
    const material = new THREE.MeshBasicMaterial({
      color: colors[i % colors.length],
      transparent: true,
      opacity: isDark ? 0.08 : 0.052,
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
    glyph.userData.basePosition = glyph.position.clone();
    glyph.userData.baseRotation = spec.r;
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
  for (let i = 0; i < 1500; i += 1) {
    const point = sampleNPoint(random);
    vertices.push(
      point.x + (random() - 0.5) * 0.18,
      point.y + (random() - 0.5) * 0.18,
      (random() - 0.5) * 0.28
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
  if (preferredBar === 0) {
    return { x: -1.42 + random() * 0.66, y: -1.96 + random() * 3.92 };
  }
  if (preferredBar === 2) {
    return { x: 0.76 + random() * 0.66, y: -1.96 + random() * 3.92 };
  }
  if (preferredBar === 1) {
    const t = random();
    const center = { x: -0.64 + t * 1.28, y: 1.72 - t * 3.44 };
    const normal = { x: 0.94, y: 0.34 };
    const offset = (random() - 0.5) * 0.68;
    return { x: center.x + normal.x * offset, y: center.y + normal.y * offset };
  }
  const outline = getNOutlinePoints();
  for (let i = 0; i < 80; i += 1) {
    const point = {
      x: -1.62 + random() * 3.24,
      y: -2.08 + random() * 4.16
    };
    if (pointInPolygon(point, outline)) return point;
  }
  return { x: 0, y: 0 };
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

function makeReflectionTexture() {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#05050a");
  gradient.addColorStop(0.2, "#153d73");
  gradient.addColorStop(0.38, "#f7f7ff");
  gradient.addColorStop(0.5, "#070910");
  gradient.addColorStop(0.66, "#663eff");
  gradient.addColorStop(0.82, "#dff9ff");
  gradient.addColorStop(1, "#02030a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "screen";
  const random = seededRandom(8801);
  for (let i = 0; i < 96; i += 1) {
    const x = random() * width;
    const y = random() * height;
    const w = 50 + random() * 260;
    const h = 3 + random() * 18;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((random() - 0.5) * 0.42);
    ctx.fillStyle = i % 5 === 0 ? "rgba(255,255,255,.34)" : "rgba(128,205,255,.18)";
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.restore();
  }
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = "rgba(0,0,0,.34)";
  for (let y = 0; y < height; y += 7) ctx.fillRect(0, y, width, 1);
  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersect = ((yi > point.y) !== (yj > point.y))
      && (point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
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
