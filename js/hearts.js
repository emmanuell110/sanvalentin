const layer = document.getElementById("hearts");

// por si lo cargas en una página sin layer:
if (layer) {
  const MAX_HEARTS = 22;            // cuántos max simultáneos
  const SPAWN_EVERY_MS = 220;       // frecuencia
  const MIN_DURATION = 5;           // segundos
  const MAX_DURATION = 10;

  const heartChars = ["❤", "💖", "💗", "💘"];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createHeart() {
    if (layer.childElementCount > MAX_HEARTS) return;

    const el = document.createElement("div");
    el.textContent = heartChars[Math.floor(rand(0, heartChars.length))];

    const startX = rand(0, 100);         // vw
    const size = rand(14, 30);           // px
    const drift = rand(-10, 10);         // vw drift
    const duration = rand(MIN_DURATION, MAX_DURATION);
    const opacity = rand(0.25, 0.55);

    el.style.position = "absolute";
    el.style.left = `${startX}vw`;
    el.style.top = `-8vh`;
    el.style.fontSize = `${size}px`;
    el.style.opacity = opacity;
    el.style.filter = "drop-shadow(0 10px 25px rgba(0,0,0,0.35))";

    // animación con keyframes inline (sin necesidad de CSS extra)
    const keyframes = [
      { transform: `translate(0, 0) rotate(${rand(-15, 15)}deg)` },
      { transform: `translate(${drift}vw, 112vh) rotate(${rand(120, 260)}deg)` }
    ];

    el.animate(keyframes, {
      duration: duration * 1000,
      iterations: 1,
      easing: "linear",
      fill: "forwards"
    });

    layer.appendChild(el);

    // limpiar al final
    setTimeout(() => {
      el.remove();
    }, duration * 1000 + 200);
  }

  setInterval(createHeart, SPAWN_EVERY_MS);
}
