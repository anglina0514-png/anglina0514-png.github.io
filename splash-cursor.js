export function initSplashCursor({ canvas, reducedMotion = false, config = {} }) {
  if (!canvas || reducedMotion) return createNoopSplash();

  const settings = {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1440,
    DENSITY_DISSIPATION: 3.5,
    VELOCITY_DISSIPATION: 2,
    PRESSURE: 0.1,
    CURL: 3,
    SPLAT_RADIUS: 0.2,
    SPLAT_FORCE: 6000,
    COLOR_UPDATE_SPEED: 10,
    ...config
  };

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return createNoopSplash();

  const splats = [];
  const pointer = {
    active: false,
    x: 0,
    y: 0,
    px: 0,
    py: 0,
    vx: 0,
    vy: 0
  };
  let width = 1;
  let height = 1;
  let dpr = 1;
  let rafId = 0;
  let running = true;
  let lastTime = performance.now();
  let idleTimer = 0;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.65);
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function colorAt(time, force = 1) {
    const hue = Number(getComputedStyle(document.documentElement).getPropertyValue("--ambient-hue")) || 214;
    const speed = settings.COLOR_UPDATE_SPEED * 0.025;
    const h = (hue + Math.sin(time * speed) * 24 + force * 18) % 360;
    return {
      a: `hsla(${h}, 92%, 68%, 0.18)`,
      b: `hsla(${(h + 62) % 360}, 86%, 74%, 0.12)`,
      c: `hsla(${(h + 142) % 360}, 90%, 62%, 0.07)`
    };
  }

  function addSplat(x, y, vx = 0, vy = 0, force = 1) {
    const now = performance.now() * 0.001;
    const speed = Math.min(1.9, Math.hypot(vx, vy) / Math.max(1, settings.SPLAT_FORCE * 0.018));
    const radius = Math.max(42, Math.min(width, height) * settings.SPLAT_RADIUS * (0.18 + speed * 0.36) * force);
    const color = colorAt(now, force + speed);
    splats.push({
      x,
      y,
      vx: vx * 0.012,
      vy: vy * 0.012,
      radius,
      life: 1,
      spin: (Math.random() - 0.5) * settings.CURL * 0.75,
      angle: Math.atan2(vy || 0.1, vx || 0.1),
      color
    });
    if (splats.length > 46) splats.splice(0, splats.length - 46);
  }

  function updatePointer(event) {
    const x = event.clientX;
    const y = event.clientY;
    pointer.vx = x - pointer.x;
    pointer.vy = y - pointer.y;
    pointer.px = pointer.x;
    pointer.py = pointer.y;
    pointer.x = x;
    pointer.y = y;
    pointer.active = true;
    if (Math.hypot(pointer.vx, pointer.vy) > 2) {
      addSplat(x, y, pointer.vx * settings.SPLAT_FORCE * 0.035, pointer.vy * settings.SPLAT_FORCE * 0.035, 0.72);
    }
  }

  function pointerDown(event) {
    updatePointer(event);
    addSplat(event.clientX, event.clientY, (Math.random() - 0.5) * settings.SPLAT_FORCE, -settings.SPLAT_FORCE * 0.24, 1.4);
  }

  function ambientSplat(time) {
    const phase = time * 0.00018;
    const x = width * (0.5 + Math.sin(phase * 1.7) * 0.23);
    const y = height * (0.46 + Math.cos(phase * 1.3) * 0.16);
    addSplat(x, y, Math.cos(phase) * settings.SPLAT_FORCE * 0.32, Math.sin(phase * 1.2) * settings.SPLAT_FORCE * 0.2, 0.48);
  }

  function draw(time) {
    if (!running) return;
    const dt = Math.min(0.05, (time - lastTime) / 1000 || 0.016);
    lastTime = time;
    idleTimer += dt;

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(0.18, 0.02 + settings.DENSITY_DISSIPATION * 0.012)})`;
    ctx.fillRect(0, 0, width, height);

    if (idleTimer > 1.45) {
      idleTimer = 0;
      ambientSplat(time);
    }

    ctx.globalCompositeOperation = "lighter";
    for (let i = splats.length - 1; i >= 0; i -= 1) {
      const splat = splats[i];
      splat.x += splat.vx * dt;
      splat.y += splat.vy * dt;
      splat.vx *= 1 - Math.min(0.12, settings.VELOCITY_DISSIPATION * dt * 0.12);
      splat.vy *= 1 - Math.min(0.12, settings.VELOCITY_DISSIPATION * dt * 0.12);
      splat.angle += splat.spin * dt;
      splat.radius += (settings.PRESSURE * 38 + 12) * dt;
      splat.life -= dt * (0.18 + settings.DENSITY_DISSIPATION * 0.018);
      if (splat.life <= 0) {
        splats.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.translate(splat.x, splat.y);
      ctx.rotate(splat.angle);
      ctx.scale(1.9, 0.74);
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, splat.radius);
      gradient.addColorStop(0, splat.color.a);
      gradient.addColorStop(0.38, splat.color.b);
      gradient.addColorStop(0.72, splat.color.c);
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      ctx.globalAlpha = Math.max(0, splat.life * 0.82);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, splat.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = Math.max(0, splat.life * 0.09);
      ctx.strokeStyle = "rgba(255,255,255,0.74)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, splat.radius * 0.34, -Math.PI * 0.2, Math.PI * 1.12);
      ctx.stroke();
      ctx.restore();
    }

    rafId = requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", updatePointer, { passive: true });
  window.addEventListener("pointerdown", pointerDown, { passive: true });
  resize();
  ambientSplat(performance.now());
  rafId = requestAnimationFrame(draw);

  return {
    splat(x, y, force = 1) {
      addSplat(x, y, (Math.random() - 0.5) * settings.SPLAT_FORCE, (Math.random() - 0.5) * settings.SPLAT_FORCE, force);
    },
    destroy() {
      running = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerdown", pointerDown);
    }
  };
}

function createNoopSplash() {
  return {
    splat() {},
    destroy() {}
  };
}
