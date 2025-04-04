import "./style.css"
import { Game } from "./game"
import { ScoreboardService } from "./utils/scoreboard"

const startGame = (game: Game) => {
  game.start()
  document.getElementById("start-screen")?.classList.add("hidden")
  document.getElementById("mobile-controls")?.classList.remove("hidden")
}

window.addEventListener("DOMContentLoaded", () => {
  const game = new Game()

  // Start immediately if the URL has a startImmediately parameter
  const url = new URL(window.location.href)
  if (url.searchParams.get("startImmediately") === "true") {
    startGame(game)
  }

  // Start button click handler
  const startButton = document.getElementById("start-button") as HTMLButtonElement
  startButton.addEventListener("click", () => {
    startGame(game)
  })

  // Restart button click handler
  const restartButton = document.getElementById("restart-button") as HTMLButtonElement
  restartButton.addEventListener("click", () => {
    game.restart()
  })

  // Handle player name input and score saving
  const playerNameInput = document.getElementById("player-name-input") as HTMLInputElement
  const saveScoreButton = document.getElementById("save-score-button") as HTMLButtonElement

  if (playerNameInput && saveScoreButton) {
    // Enter key on input
    playerNameInput.addEventListener("keyup", async (event) => {
      if (event.key === "Enter" && playerNameInput.value.trim()) {
        const playerName = playerNameInput.value.trim()
        const finalScore = parseInt(document.getElementById("final-score")?.textContent || "0")

        // Save player name and score
        ScoreboardService.savePlayerName(playerName)
        await game.saveScore(playerName, finalScore)

        // Hide input container
        document.getElementById("player-name-container")?.classList.add("hidden")
      }
    })

    // Save button click
    saveScoreButton.addEventListener("click", async () => {
      if (playerNameInput.value.trim()) {
        const playerName = playerNameInput.value.trim()
        const finalScore = parseInt(document.getElementById("final-score")?.textContent || "0")

        // Save player name and score
        ScoreboardService.savePlayerName(playerName)
        await game.saveScore(playerName, finalScore)

        // Get and display player's rank
        const rank = await ScoreboardService.getPlayerRank(playerName, finalScore)
        const rankMessage = document.getElementById("rank-message")
        if (rank && rankMessage) {
          rankMessage.textContent = `You finished in ${rank}${getOrdinalSuffix(rank)} place overall!`
          rankMessage.classList.remove("hidden")
        }

        // Hide input container
        document.getElementById("player-name-container")?.classList.add("hidden")
      }
    })
  }

  // Helper function for ordinal suffixes
  const getOrdinalSuffix = (n: number): string => {
    const s = ["th", "st", "nd", "rd"]
    const v = n % 100
    return s[(v - 20) % 10] || s[v] || s[0]
  }

  // Keyboard controls
  window.addEventListener("keydown", (event) => {
    switch (event.code) {
      case "Space":
        if (!game.isRunning) {
          game.start()
          document.getElementById("start-screen")?.classList.add("hidden")
          document.getElementById("mobile-controls")?.classList.remove("hidden")
        }
        break
      case "ArrowLeft":
        game.moveLeft()
        break
      case "ArrowRight":
        game.moveRight()
        break
    }
  })

  // Mobile controls
  const leftBtn = document.getElementById("left-btn")
  const rightBtn = document.getElementById("right-btn")

  if (leftBtn) {
    leftBtn.addEventListener("click", () => game.moveLeft())
  }

  if (rightBtn) {
    rightBtn.addEventListener("click", () => game.moveRight())
  }

  // Handle window resize
  window.addEventListener("resize", () => {
    game.handleResize()
  })
})
