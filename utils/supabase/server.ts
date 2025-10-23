import {
  createClient as createSupabaseClient,
  SupabaseClient,
} from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Minimal server-side helper that returns a Supabase client for server usage.
// If you need cookie integration (for SSR auth), consider using
// '@supabase/auth-helpers-nextjs' which provides helpers for request/response.
export const createClient = (): SupabaseClient => {
  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
};
