import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLICSUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLICSUPABASE_URL!

export const supabase = createClient(supabaseUrl, supabaseKey)
