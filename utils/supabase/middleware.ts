import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from "@supabase/supabase-js";
import type { NextRequest } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Minimal middleware helper: returns a Supabase client for server-side usage.
// If you need full cookie integration (for SSR auth flows), use
// '@supabase/auth-helpers-nextjs' or '@supabase/ssr' (install separately).
export const createClient = (_req: NextRequest): SupabaseClient => {
  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
};
