import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

import { Database } from "./schema";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase1 = createClient(supabaseUrl || "", supabaseKey || "");

const supabase = createBrowserClient<Database>(
  supabaseUrl || "",
  supabaseKey || "",
);

export default supabase;
