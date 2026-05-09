import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = 'https://fazvffsqjyqbxhxwvino.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhenZmZnNxanlxYnhoeHd2aW5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2ODc0NjMsImV4cCI6MjA4ODI2MzQ2M30.G-c1v2hJi6AfZIUHp0VZpgdA7hjjnD1VdKcH-M6hBRQ'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
