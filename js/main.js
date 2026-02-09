const introText = document.getElementById("introText");
const clickHint = document.getElementById("clickHint");
const startBtn = document.getElementById("startBtn");

function reveal(el) {
  el.classList.remove("hidden");
  // for transition to apply
  requestAnimationFrame(() => el.classList.add("reveal"));
}

window.addEventListener("DOMContentLoaded", () => {
  // 1) aparece el texto
  setTimeout(() => reveal(introText), 250);

  // 2) aparece el hint + flecha
  setTimeout(() => reveal(clickHint), 1500);

  // 3) aparece el botón
  setTimeout(() => reveal(startBtn), 2400);

  startBtn.addEventListener("click", () => {
    window.location.href = "gallery.html";
  });
});
