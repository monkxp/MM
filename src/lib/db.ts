import supabase from "./supabaseClient";

export const createWorkspace = async (
  name: string,
  userId: string,
  joinCode: string
) => {
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const { data } = await supabase
    .from("workspaces")
    .insert({ name, created_by: userId, join_code: joinCode })
    .select("*");
  await supabase.from("members").insert({
    user_id: userId,
    workspace_id: data?.[0]?.id,
    role: "admin",
  });
  return data?.[0]?.id;
};

export const getWorkspaces = async (userId: string) => {
  if (!userId) {
    return { data: [], error: "Unauthorized" };
  }
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: members } = await supabase
    .from("members")
    .select("*")
    .eq("user_id", userId);

  const workspaces = data?.filter((workspace) => {
    const member = members?.find(
      (member) => member.workspace_id === workspace.id
    );
    if (member) {
      return { ...workspace, role: member.role };
    }
  });

  return { data: workspaces, error };
};

export const getWorkspace = async (workspaceId: string, userId: string) => {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId);

  if (error) {
    throw new Error(error.message);
  }

  const { data: members, error: membersError } = await supabase
    .from("members")
    .select("*")
    .eq("user_id", userId);

  if (membersError) {
    throw new Error(membersError.message);
  }

  if (members?.length === 0) {
    return null;
  }

  const workspace = data?.[0];

  return { ...workspace, role: members?.[0]?.role };
};

export const getWorkspaceMember = async (
  workspaceId: string,
  userId: string
) => {
  if (!userId) {
    return null;
  }
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  return data?.[0];
};

export const updateWorkspaceName = async (
  workspaceId: string,
  userId: string,
  name: string
) => {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { data: members, error: memberError } = await supabase
    .from("members  ")
    .select("*")
    .eq("user_id", userId)
    .eq("workspace_id", workspaceId);

  if (memberError) {
    throw new Error(memberError.message);
  }

  if (members?.length === 0) {
    throw new Error("You are not a member of this workspace");
  }

  if (members?.[0]?.role !== "admin") {
    throw new Error("You are not an admin of this workspace");
  }

  const { data, error } = await supabase
    .from("workspaces")
    .update({ name })
    .eq("id", workspaceId)
    .select("*");
  if (error) {
    throw new Error(error.message);
  }
  return data?.[0];
};

export const deleteWorkspace = async (workspaceId: string, userId: string) => {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { data: members, error: memberError } = await supabase
    .from("members  ")
    .select("*")
    .eq("user_id", userId)
    .eq("workspace_id", workspaceId);

  if (memberError) {
    throw new Error(memberError.message);
  }

  if (members?.length === 0) {
    throw new Error("You are not a member of this workspace");
  }

  if (members?.[0]?.role !== "admin") {
    throw new Error("You are not an admin of this workspace");
  }
  // delete all members of the workspace
  await supabase.from("members").delete().eq("workspace_id", workspaceId);
  // delete the workspace
  const { data, error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", workspaceId);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
