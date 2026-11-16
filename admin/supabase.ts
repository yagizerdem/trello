import "./read-env";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.VITE_SUPABASE_URL ??
  (() => {
    throw new Error("VITE_SUPABASE_URL is not defined");
  })();
const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ??
  (() => {
    throw new Error("SUPABASE_SECRET_KEY is not defined");
  })();

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export default supabase;
