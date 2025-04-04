# Scoreboard Implementation Plan

## Overview

Add a scoreboard to the game that appears when "Game Over" is shown. It will:

- Prompt for player name if not already stored in localStorage
- Automatically use saved name if available
- Save scores to Supabase
- Display a leaderboard with top scores

## Step 1: Set Up Supabase

1. Install Supabase client library:

   ```bash
   npm install @supabase/supabase-js
   ```

2. Create a Supabase project at https://supabase.com/

   - Sign up for a free account if needed
   - Create a new project

3. Create a `scores` table in Supabase with columns:

   - `id` (auto-generated)
   - `player_name` (text)
   - `score` (integer)
   - `created_at` (timestamp with default value)

4. Create a Supabase configuration file:

   ```typescript
   // src/utils/supabase.ts
   import { createClient } from "@supabase/supabase-js"

   const supabaseUrl = "https://your-project-url.supabase.co"
   const supabaseKey = "your-anon-key"

   export const supabase = createClient(supabaseUrl, supabaseKey)
   ```

## Step 2: Update HTML Structure

1. Modify the game-over-screen in index.html to include scoreboard elements:

   ```html
   <div id="game-over-screen" class="hidden">
     <h2>Game Over!</h2>
     <p>Distance: <span id="final-score">0</span>m</p>

     <!-- Player name input (shown only when name not in localStorage) -->
     <div id="player-name-container" class="hidden">
       <p>Enter your name to save your score:</p>
       <input type="text" id="player-name-input" maxlength="15" placeholder="Your name" />
       <button id="save-score-button">Save Score</button>
     </div>

     <!-- Scoreboard display -->
     <div id="scoreboard-container">
       <h3>Top Scores</h3>
       <div id="scoreboard-loading">Loading scores...</div>
       <table id="scoreboard">
         <thead>
           <tr>
             <th>Rank</th>
             <th>Name</th>
             <th>Score</th>
           </tr>
         </thead>
         <tbody id="scoreboard-body">
           <!-- Scores will be inserted here -->
         </tbody>
       </table>
     </div>

     <button id="restart-button">PLAY AGAIN</button>
   </div>
   ```

2. Add CSS styles for the scoreboard in src/style.css

## Step 3: Create Scoreboard Management Logic

1. Create a new scoreboard service:

   ```typescript
   // src/utils/scoreboard.ts
   import { supabase } from "./supabase"

   interface Score {
     id?: number
     player_name: string
     score: number
     created_at?: string
   }

   const PLAYER_NAME_KEY = "amsterdamSurfer.playerName"

   export const ScoreboardService = {
     // Get player name from localStorage
     getPlayerName(): string | null {
       return localStorage.getItem(PLAYER_NAME_KEY)
     },

     // Save player name to localStorage
     savePlayerName(name: string): void {
       localStorage.setItem(PLAYER_NAME_KEY, name)
     },

     // Save score to Supabase
     async saveScore(playerName: string, score: number): Promise<boolean> {
       try {
         const { error } = await supabase
           .from("scores")
           .insert([{ player_name: playerName, score }])

         return !error
       } catch (err) {
         console.error("Error saving score:", err)
         return false
       }
     },

     // Get top scores from Supabase
     async getTopScores(limit: number = 10): Promise<Score[]> {
       try {
         const { data, error } = await supabase
           .from("scores")
           .select("*")
           .order("score", { ascending: false })
           .limit(limit)

         if (error) throw error
         return data || []
       } catch (err) {
         console.error("Error fetching scores:", err)
         return []
       }
     },
   }
   ```

## Step 4: Integrate Scoreboard into Game Logic

1. Modify the Game class to handle scoreboard integration:

   ```typescript
   // src/game.ts
   import { ScoreboardService } from './utils/scoreboard'

   // Add to the gameOver method:
   public gameOver(): void {
     this.isRunning = false
     this.speed = 0

     // Update final score
     const finalScore = Math.floor(this.score)
     if (this.finalScoreElement) {
       this.finalScoreElement.textContent = `${finalScore}`
     }

     // Check if player name exists
     const playerName = ScoreboardService.getPlayerName()
     const playerNameContainer = document.getElementById('player-name-container')
     const scoreboardLoading = document.getElementById('scoreboard-loading')

     if (!playerName) {
       // Show name input if no name saved
       playerNameContainer?.classList.remove('hidden')
     } else {
       // Auto-save score if name exists
       this.saveScore(playerName, finalScore)
     }

     // Load and display scoreboard
     this.loadScoreboard()

     // Show game over screen
     document.getElementById('game-over-screen')?.classList.remove('hidden')
     document.getElementById('mobile-controls')?.classList.add('hidden')
   }

   // Add new methods for scoreboard handling
   private async saveScore(playerName: string, score: number): Promise<void> {
     const success = await ScoreboardService.saveScore(playerName, score)
     if (success) {
       this.loadScoreboard() // Refresh scoreboard after saving
     }
   }

   private async loadScoreboard(): Promise<void> {
     const scoreboardBody = document.getElementById('scoreboard-body')
     const scoreboardLoading = document.getElementById('scoreboard-loading')

     if (!scoreboardBody || !scoreboardLoading) return

     scoreboardLoading.classList.remove('hidden')
     scoreboardBody.innerHTML = ''

     try {
       const scores = await ScoreboardService.getTopScores()
       scoreboardLoading.classList.add('hidden')

       if (scores.length === 0) {
         const noScoresRow = document.createElement('tr')
         noScoresRow.innerHTML = '<td colspan="3">No scores yet</td>'
         scoreboardBody.appendChild(noScoresRow)
         return
       }

       scores.forEach((score, index) => {
         const row = document.createElement('tr')
         row.innerHTML = `
           <td>${index + 1}</td>
           <td>${score.player_name}</td>
           <td>${score.score}m</td>
         `
         scoreboardBody.appendChild(row)
       })
     } catch (err) {
       scoreboardLoading.classList.add('hidden')
       const errorRow = document.createElement('tr')
       errorRow.innerHTML = '<td colspan="3">Error loading scores</td>'
       scoreboardBody.appendChild(errorRow)
     }
   }
   ```

## Step 5: Add Event Listeners for Name Input and Score Saving

1. Update index.ts to add event listeners for the player name input:

   ```typescript
   // Add to the DOMContentLoaded event listener
   // Handle player name input and score saving
   const playerNameInput = document.getElementById("player-name-input") as HTMLInputElement
   const saveScoreButton = document.getElementById("save-score-button") as HTMLButtonElement

   if (playerNameInput && saveScoreButton) {
     // Enter key on input
     playerNameInput.addEventListener("keyup", (event) => {
       if (event.key === "Enter" && playerNameInput.value.trim()) {
         const playerName = playerNameInput.value.trim()
         const finalScore = parseInt(document.getElementById("final-score")?.textContent || "0")

         // Save player name and score
         ScoreboardService.savePlayerName(playerName)
         game.saveScore(playerName, finalScore)

         // Hide input container
         document.getElementById("player-name-container")?.classList.add("hidden")
       }
     })

     // Save button click
     saveScoreButton.addEventListener("click", () => {
       if (playerNameInput.value.trim()) {
         const playerName = playerNameInput.value.trim()
         const finalScore = parseInt(document.getElementById("final-score")?.textContent || "0")

         // Save player name and score
         ScoreboardService.savePlayerName(playerName)
         game.saveScore(playerName, finalScore)

         // Hide input container
         document.getElementById("player-name-container")?.classList.add("hidden")
       }
     })
   }
   ```

## Step 6: Update Game Restart Logic

1. Ensure the scoreboard elements are properly reset when restarting the game:

   ```typescript
   // In game.ts, update the restart method
   public restart(): void {
     // Reset game state
     this.score = 0
     this.speed = 0
     this.obstacles.forEach((obstacle) => {
       this.scene.remove(obstacle.mesh)
       this.world.removeBody(obstacle.body)
     })
     this.obstacles = []

     // Hide game over screen
     document.getElementById('game-over-screen')?.classList.add('hidden')

     // Hide player name input container
     document.getElementById('player-name-container')?.classList.add('hidden')

     // Reset scoreboard loading state
     document.getElementById('scoreboard-loading')?.classList.remove('hidden')

     // Start the game again
     this.start()
   }
   ```

## Step 7: Test and Debug

1. Test the full flow:
   - Play the game and get a score
   - Enter name and save score
   - Verify score appears in the leaderboard
   - Play again and verify name is remembered
   - Check that scores are saved to Supabase

## Step 8: Additional Enhancements (Optional)

1. Add visual feedback when saving scores (success/failure messages)
2. Highlight the player's score in the leaderboard
3. Add animations for the scoreboard appearance
4. Implement pagination if the number of scores grows large
5. Add filters to view scores (today, this week, all time)
6. Add rank badges for top 3 scores

## Environment Variables and Security

1. Use environment variables for Supabase credentials:

   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Update the Supabase client initialization:

   ```typescript
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
   const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
   ```

3. Add environment variables documentation in README.md

## Deployment Considerations

1. Update the build configuration to handle environment variables
2. Add rate limiting on the Supabase side to prevent abuse
3. Consider implementing server-side validation for score submissions in production
