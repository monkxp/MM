import { createClient } from "../supabase/client";

const supabase = createClient();
export const getChannel = async (
  workspaceId: string,
  channelId: string,
  userId: string,
) => {
  if (!userId) {
    return { data: null, error: "Unauthorized" };
  }
  const { data: members, error: memberError } = await supabase
    .from("workspace_members")
    .select("*")
    .eq("user_id", userId)
    .eq("workspace_id", workspaceId);

  if (memberError) {
    return { data: null, error: memberError.message };
  }

  if (members?.length === 0) {
    return { data: null, error: "You are not a member of this workspace" };
  }

  const { data, error } = await supabase
    .from("channels")
    .select("*")
    .eq("id", channelId)
    .eq("workspace_id", workspaceId);

  if (error) {
    return { data: null, error: error.message };
  }

  if (data?.length === 0) {
    return { data: null, error: "Channel not found" };
  }

  return { data: data?.[0], error: null };
};
