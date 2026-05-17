import { createClient } from "@supabase/supabase-js";

// These values are safe to include in client-side code.
// The anon/publishable key is intentionally public — Supabase security is enforced
// via Row Level Security (RLS) policies, not by hiding the anon key.
// Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env to override.
const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  "https://fkqazoltrxmwlareblpi.supabase.co";

const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
  "sb_publishable_r_YTJolEVNR9vQR7oTVENA_7ZADmY3o";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type SupabaseClient = typeof supabase;
