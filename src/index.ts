import "./style.css";
import { Game } from "./game";

window.addEventListener("DOMContentLoaded", () => {
  const game = new Game();

  // Start button click handler
  const startButton = document.getElementById(
    "start-button"
  ) as HTMLButtonElement;
  startButton.addEventListener("click", () => {
    game.start();
    document.getElementById("start-screen")?.classList.add("hidden");
    document.getElementById("mobile-controls")?.classList.remove("hidden");
  });

  // Restart button click handler
  const restartButton = document.getElementById(
    "restart-button"
  ) as HTMLButtonElement;
  restartButton.addEventListener("click", () => {
    game.restart();
    document.getElementById("game-over-screen")?.classList.add("hidden");
    document.getElementById("mobile-controls")?.classList.remove("hidden");
  });

  // Keyboard controls
  window.addEventListener("keydown", (event) => {
    switch (event.code) {
      case "Space":
        if (!game.isRunning) {
          game.start();
          document.getElementById("start-screen")?.classList.add("hidden");
          document
            .getElementById("mobile-controls")
            ?.classList.remove("hidden");
        }
        break;
      case "ArrowLeft":
        game.moveLeft();
        break;
      case "ArrowRight":
        game.moveRight();
        break;
      case "ArrowDown":
        game.duck();
        break;
      case "ArrowUp":
        game.standUp();
        break;
    }
  });

  window.addEventListener("keyup", (event) => {
    if (event.code === "ArrowDown") {
      game.standUp();
    }
  });

  // Mobile controls
  const leftBtn = document.getElementById("left-btn");
  const rightBtn = document.getElementById("right-btn");
  const downBtn = document.getElementById("down-btn");

  if (leftBtn) {
    leftBtn.addEventListener("touchstart", () => game.moveLeft());
    leftBtn.addEventListener("mousedown", () => game.moveLeft());
  }

  if (rightBtn) {
    rightBtn.addEventListener("touchstart", () => game.moveRight());
    rightBtn.addEventListener("mousedown", () => game.moveRight());
  }

  if (downBtn) {
    downBtn.addEventListener("touchstart", () => game.duck());
    downBtn.addEventListener("touchend", () => game.standUp());
    downBtn.addEventListener("mousedown", () => game.duck());
    downBtn.addEventListener("mouseup", () => game.standUp());
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    game.handleResize();
  });
});
