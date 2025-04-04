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
      const { error } = await supabase.from("scores").insert([{ player_name: playerName, score }])

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
