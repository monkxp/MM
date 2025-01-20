"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

//auth.admin.getUserById only can call on server side need create client use server role key
//server role key do not public in the client side
export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {
  const supabase = await createClient();

  const user = await supabase.auth.getUser();

  if (!user.data.user)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { userId } = await params;
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json(data.user);
}
