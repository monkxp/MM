"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

//

export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {
  const supabase = await createClient();

  const user = await supabase.auth.getUser();
  console.log("current user", user);

  if (!user.data.user)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { userId } = await params;
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
  console.log("get user data", data);
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json(data.user);
}
