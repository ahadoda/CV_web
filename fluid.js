/**
 * Fluid background: mouse click spawns random-colored glowing blobs that drift and merge.
 */
(function () {
  const canvas = document.getElementById('fluidCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let animationId = 0;

  const COLORS = [
    [255, 230, 80],   // yellow
    [80, 255, 160],   // neon green
    [80, 220, 255],   // cyan
    [255, 80, 120],   // red/pink
    [255, 100, 255],  // magenta
    [255, 160, 80],   // orange
  ];

  const blobs = [];
  const MAX_BLOBS = 28;
  const FADE = 0.992;
  const DRIFT = 0.2;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  function addBlob(x, y, color = randomColor()) {
    const radius = 80 + Math.random() * 120;
    blobs.push({
      x,
      y,
      radius,
      color,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 1,
    });
    while (blobs.length > MAX_BLOBS) blobs.shift();
  }

  function drawBlob(b) {
    const r = b.color[0];
    const g = b.color[1];
    const B = b.color[2];
    const gradient = ctx.createRadialGradient(
      b.x, b.y, 0,
      b.x, b.y, b.radius
    );
    gradient.addColorStop(0, `rgba(${r},${g},${B},${0.5 * b.life})`);
    gradient.addColorStop(0.4, `rgba(${r},${g},${B},${0.2 * b.life})`);
    gradient.addColorStop(1, `rgba(${r},${g},${B},0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);

    for (let i = blobs.length - 1; i >= 0; i--) {
      const b = blobs[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vx *= 0.98;
      b.vy *= 0.98;
      b.vx += (Math.random() - 0.5) * DRIFT;
      b.vy += (Math.random() - 0.5) * DRIFT;
      b.life *= FADE;

      if (b.life < 0.02) {
        blobs.splice(i, 1);
        continue;
      }

      drawBlob(b);
    }

    animationId = requestAnimationFrame(tick);
  }

  function start() {
    resize();
    // A few initial blobs so the canvas isn’t empty
    for (let i = 0; i < 5; i++) {
      addBlob(
        width * (0.2 + Math.random() * 0.6),
        height * (0.2 + Math.random() * 0.6)
      );
    }
    tick();
  }

  window.addEventListener('resize', resize);
  canvas.addEventListener('click', function (e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    addBlob(x, y);
    addBlob(x + (Math.random() - 0.5) * 60, y + (Math.random() - 0.5) * 60);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
