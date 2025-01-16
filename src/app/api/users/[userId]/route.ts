import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(
  request: Request,
  { params }: { params: { userId: string } },
) {
  // TODO: Add auth check
  const { data, error } = await supabaseAdmin.auth.admin.getUserById(
    params.userId,
  );
  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json(data.user);
}
