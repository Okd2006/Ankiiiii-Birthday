const pages = Array.from(document.querySelectorAll(".page"));
const music = document.getElementById("music");
const leftArrow = document.querySelector(".nav-arrow-left");
const rightArrow = document.querySelector(".nav-arrow-right");
const dotsContainer = document.querySelector(".progress-dots");

let current = 0;
let hasStarted = false;
let isAnimating = false;
let autoAdvanceTimer;
let touchStartX = 0;

function buildDots() {
  pages.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to page ${index + 1}`);
    dot.addEventListener("click", () => goToPage(index));
    dotsContainer.appendChild(dot);
  });
}

function updateDots() {
  const dots = dotsContainer.querySelectorAll("button");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === current);
  });
}

function updateArrows() {
  leftArrow.disabled = current === 0;
  rightArrow.disabled = current === pages.length - 1;
}

function updateUI() {
  updateArrows();
  updateDots();
}

function goToPage(index) {
  if (index === current || index < 0 || index >= pages.length || isAnimating) {
    return;
  }

  const direction = index > current ? "forward" : "backward";
  const currentPage = pages[current];
  const nextPage = pages[index];

  isAnimating = true;
  nextPage.classList.add(direction === "forward" ? "enter-right" : "enter-left");
  nextPage.classList.add("active");

  requestAnimationFrame(() => {
    currentPage.classList.add(direction === "forward" ? "exit-left" : "exit-right");
    nextPage.classList.remove(direction === "forward" ? "enter-right" : "enter-left");
  });

  window.setTimeout(() => {
    currentPage.classList.remove("active", "exit-left", "exit-right");
    current = index;
    updateUI();
    isAnimating = false;
  }, 650);
}

function startAuto() {
  window.clearInterval(autoAdvanceTimer);
  autoAdvanceTimer = window.setInterval(() => {
    const isGalleryPage = current >= 2 && current < pages.length - 1;
    if (isGalleryPage) {
      goToPage(current + 1);
    }
  }, 5000);
}

function start() {
  hasStarted = true;
  music.play().catch(() => {});
  goToPage(1);
  startAuto();
}

function nextPage() {
  if (!hasStarted) {
    start();
    return;
  }

  if (current < pages.length - 1) {
    goToPage(current + 1);
  }
}

function previousPage() {
  if (current > 0) {
    goToPage(current - 1);
  }
}

function restart() {
  window.clearInterval(autoAdvanceTimer);
  window.location.reload();
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    nextPage();
  }

  if (event.key === "ArrowLeft") {
    previousPage();
  }
});

document.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

document.addEventListener("touchend", (event) => {
  const touchEndX = event.changedTouches[0].clientX;
  const deltaX = touchEndX - touchStartX;

  if (Math.abs(deltaX) < 50) {
    return;
  }

  if (deltaX < 0) {
    nextPage();
  } else {
    previousPage();
  }
}, { passive: true });

buildDots();
updateUI();

window.start = start;
window.nextPage = nextPage;
window.previousPage = previousPage;
window.restart = restart;
