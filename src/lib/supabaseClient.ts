import { createBrowserClient } from "@supabase/ssr";

import { Database } from "./schema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createBrowserClient<Database>(
  supabaseUrl || "",
  supabaseKey || "",
);

export default supabase;
