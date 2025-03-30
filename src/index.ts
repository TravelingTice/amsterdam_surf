import "./style.css";
import { Game } from "./game";

window.addEventListener("DOMContentLoaded", () => {
  const game = new Game();

  // Start button click handler
  const startButton = document.getElementById("start-button") as HTMLButtonElement;
  startButton.addEventListener("click", () => {
    game.start();
    document.getElementById("start-screen")?.classList.add("hidden");
    document.getElementById("mobile-controls")?.classList.remove("hidden");
  });

  // Restart button click handler
  const restartButton = document.getElementById("restart-button") as HTMLButtonElement;
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
          document.getElementById("mobile-controls")?.classList.remove("hidden");
        }
        break;
      case "ArrowLeft":
        game.moveLeft();
        break;
      case "ArrowRight":
        game.moveRight();
        break;
    }
  });

  // Mobile controls
  const leftBtn = document.getElementById("left-btn");
  const rightBtn = document.getElementById("right-btn");

  if (leftBtn) {
    leftBtn.addEventListener("click", () => game.moveLeft());
  }

  if (rightBtn) {
    rightBtn.addEventListener("click", () => game.moveRight());
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    game.handleResize();
  });
});
