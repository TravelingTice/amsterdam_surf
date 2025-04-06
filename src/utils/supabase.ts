import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://ilubxwjxatjfwtpjteim.supabase.co"
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsdWJ4d2p4YXRqZnd0cGp0ZWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NDE1NDgsImV4cCI6MjA1OTAxNzU0OH0.L02CVOVVIl_K1BhNjK_3sU8mRedStpx64SkUTGF_-F8"

export const supabase = createClient(supabaseUrl, supabaseKey)
