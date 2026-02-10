const introText = document.getElementById("introText");
const clickHint = document.getElementById("clickHint");
const startBtn = document.getElementById("startBtn");
const plane = document.getElementById("plane");
const hitLetter = document.getElementById("hitLetter");

function reveal(el) {
  el.classList.remove("hidden");
  requestAnimationFrame(() => el.classList.add("reveal"));
}

function getRelativePos(child, parent) {
  const c = child.getBoundingClientRect();
  const p = parent.getBoundingClientRect();
  return {
    x: c.left - p.left,
    y: c.top - p.top,
    w: c.width,
    h: c.height,
  };
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function runPlaneLongTrip() {
  const wrap = plane.closest(".intro-wrap") || document.body;

  // Reset estado visual
  plane.getAnimations().forEach(a => a.cancel());
  plane.style.opacity = "1";
  plane.style.display = "block";

  // Posición objetivo (letra)
  const target = getRelativePos(hitLetter, wrap);

  // Medidas
  const wrapW = wrap.clientWidth;
  const wrapH = wrap.clientHeight;
  const planeRect = plane.getBoundingClientRect();
  const pW = planeRect.width || 34;
  const pH = planeRect.height || 34;

  // Inicio: muy fuera a la izquierda y arriba un poco
  const startX = -pW - 80;
  const startY = clamp(target.y - 120, 20, wrapH - 120);

  // Fin: justo en la letra (para “choque”)
  const endX = target.x + target.w / 2 - pW / 2 - 6;
  const endY = target.y + target.h / 2 - pH / 2 + 2;

  // Recorrido largo: usamos puntos intermedios a lo largo de la pantalla
  // P1: entra y sube
  const p1x = wrapW * 0.20;
  const p1y = clamp(target.y - 200, 20, wrapH * 0.55);

  // P2: cruza arriba (casi toda la pantalla)
  const p2x = wrapW * 0.78;
  const p2y = clamp(40, 20, wrapH * 0.35);

  // P3: baja y se alinea hacia el objetivo
  const p3x = wrapW * 0.60;
  const p3y = clamp(target.y + 60, wrapH * 0.30, wrapH - 80);

  // Coloca el avión en el inicio (sin transform)
  plane.style.left = `${startX}px`;
  plane.style.top = `${startY}px`;

  // Animación larga + curva
  const anim = plane.animate(
    [
      { transform: `translate(0px, 0px) rotate(18deg) scale(1)`, opacity: 0 },
      { transform: `translate(40px, 12px) rotate(18deg) scale(1)`, opacity: 1, offset: 0.08 },

      // Punto 1
      {
        transform: `translate(${p1x - startX}px, ${p1y - startY}px) rotate(-8deg) scale(1)`,
        opacity: 1,
        offset: 0.35
      },

      // Punto 2 (cruza casi toda la pantalla)
      {
        transform: `translate(${p2x - startX}px, ${p2y - startY}px) rotate(8deg) scale(1)`,
        opacity: 1,
        offset: 0.62
      },

      // Punto 3 (baja)
      {
        transform: `translate(${p3x - startX}px, ${p3y - startY}px) rotate(22deg) scale(1)`,
        opacity: 1,
        offset: 0.82
      },

      // Final: choque
      {
        transform: `translate(${endX - startX}px, ${endY - startY}px) rotate(8deg) scale(1.04)`,
        opacity: 1
      }
    ],
    {
      duration: 2400, // más recorrido
      easing: "cubic-bezier(.2,.9,.2,1)",
      fill: "forwards"
    }
  );

  anim.onfinish = () => {
    // choque: vibrar letra
    hitLetter.classList.remove("hit");
    void hitLetter.offsetWidth; // reinicia anim
    hitLetter.classList.add("hit");

    // avión: mini "impacto" + desaparecer
    const impact = plane.animate(
      [
        { transform: `translate(${endX - startX}px, ${endY - startY}px) rotate(8deg) scale(1.04)`, opacity: 1 },
        { transform: `translate(${endX - startX + 10}px, ${endY - startY + 6}px) rotate(30deg) scale(0.98)`, opacity: 0.0 }
      ],
      { duration: 420, easing: "ease-out", fill: "forwards" }
    );

    impact.onfinish = () => {
      plane.style.display = "none"; // desaparece de verdad

      // revelar texto + hint + botón
      reveal(introText);
      setTimeout(() => reveal(clickHint), 1200);
      setTimeout(() => reveal(startBtn), 2000);
    };
  };
}

window.addEventListener("DOMContentLoaded", () => {
  // Espera un poquito por layout/fonts
  setTimeout(runPlaneLongTrip, 250);

  // Si rota o cambia tamaño antes de revelar, recalcula la ruta
  let t;
  window.addEventListener("resize", () => {
    clearTimeout(t);
    t = setTimeout(() => {
      if (introText.classList.contains("hidden")) {
        plane.style.display = "block";
        plane.style.opacity = "0";
        setTimeout(runPlaneLongTrip, 100);
      }
    }, 160);
  });

  startBtn.addEventListener("click", () => {
    window.location.href = "gallery.html";
  });
});
