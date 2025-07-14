// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xhubdviugwuxhezfclgg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodWJkdml1Z3d1eGhlemZjbGdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMzUwMjcsImV4cCI6MjA2NzcxMTAyN30.v0PX5GeBVXOdL9ZaLYcEVbidAKN8uz7jN6RgHkEyqyo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
