import { Tables } from "./schema";
import { createClient } from "./supabase/client";
import { genUUIDv4, sanitizeS3Key } from "./utils";

const supabase = createClient();
export const createWorkspace = async ({
  name,
  userId,
  joinCode,
}: {
  name: string;
  userId: string;
  joinCode: string;
}) => {
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const { data, error } = await supabase
    .from("workspaces")
    .insert({ name, created_by: userId, join_code: joinCode })
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  const { error: memberError } = await supabase
    .from("workspace_members")
    .insert({
      user_id: userId,
      workspace_id: data?.[0]?.id,
      role: "admin",
    });

  if (memberError) {
    throw new Error(memberError.message);
  }

  const { error: channelError } = await supabase
    .from("channels")
    .insert({ name: "general", workspace_id: data?.[0]?.id });

  if (channelError) {
    throw new Error(channelError.message);
  }

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
    .from("workspace_members")
    .select("*")
    .eq("user_id", userId);

  const workspaces = data?.filter((workspace) => {
    const member = members?.find(
      (member) => member.workspace_id === workspace.id,
    );
    if (member) {
      return { ...workspace, role: member.role };
    }
  });

  return { data: workspaces, error };
};

export const getWorkspace = async (workspaceId: string, userId: string) => {
  if (!userId) {
    return null;
  }
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId);

  if (error) {
    throw new Error(error.message);
  }

  const { data: members, error: membersError } = await supabase
    .from("workspace_members")
    .select("*")
    .eq("workspace_id", workspaceId)
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
  userId: string,
) => {
  if (!userId) {
    return null;
  }
  const { data, error } = await supabase
    .from("workspace_members")
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
  name: string,
) => {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { data: members, error: memberError } = await supabase
    .from("workspace_members")
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

export const getChannels = async (
  workspaceId: string,
  userId: string,
): Promise<{ data: Tables<"channels">[]; error: string }> => {
  if (!userId) {
    return { data: [], error: "Unauthorized" };
  }

  const { data: members, error: memberError } = await supabase
    .from("workspace_members")
    .select("*")
    .eq("user_id", userId)
    .eq("workspace_id", workspaceId);

  if (memberError) {
    return { data: [], error: memberError.message };
  }

  if (members?.length === 0) {
    return { data: [], error: "You are not a member of this workspace" };
  }

  const { data, error } = await supabase
    .from("channels")
    .select("*")
    .eq("workspace_id", workspaceId);

  if (error) {
    return { data: [], error: error.message };
  }

  return { data, error: "" };
};

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

export const createMessage = async (
  channelId: string,
  userId: string,
  content: string,
) => {
  const contentObj = JSON.parse(content as string);
  if (contentObj.attachments) {
    for (const attachment of contentObj.attachments) {
      if (attachment) {
        const { error } = await supabase.storage
          .from("slack_clone")
          .move(
            attachment.path,
            attachment.path.replace("unused/", "messages/"),
          );
        if (error) {
          throw new Error(error.message);
        }
        attachment.path = attachment.path.replace("unused/", "messages/");
        attachment.publicUrl = attachment.publicUrl.replace(
          "unused/",
          "messages/",
        );
      }
    }
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      channel_id: channelId,
      user_id: userId,
      content: JSON.stringify(contentObj),
    })
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const uploadFile = async (file: File) => {
  const filePath = `unused/${genUUIDv4()}.${sanitizeS3Key(file?.name)}`;
  const { data, error } = await supabase.storage
    .from("slack_clone")
    .upload(filePath, file);

  if (error) {
    throw new Error(error.message);
  }

  const { data: fileData } = await supabase.storage
    .from("slack_clone")
    .getPublicUrl(data?.path);

  return { ...fileData, ...data };
};

export const deleteFile = async (path: string) => {
  const { data, error } = await supabase.storage
    .from("slack_clone")
    .remove([path]);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const moveFile = async (path: string, newPath: string) => {
  const { data, error } = await supabase.storage
    .from("slack_clone")
    .move(path, newPath);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getChannelMessages = async (channelId: string) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("channel_id", channelId);

  if (error) {
    return { data: [], error };
  }

  return { data, error };
};

export const signInWithOAuth = async (provider: string, redirectTo: string) => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: provider as "google" | "github" | "discord",
    options: {
      redirectTo,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const joinWorkspace = async (
  joinCode: string,
  workspaceId: string,
  userId: string,
) => {
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const { data: workspaces, error: workspaceError } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId);

  const workspace = workspaces?.[0];

  if (workspaceError) {
    throw new Error(workspaceError.message);
  }

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  if (workspace.join_code !== joinCode) {
    throw new Error("Invalid join code");
  }

  const existingMember = await getWorkspaceMember(workspaceId, userId);

  if (existingMember) {
    throw new Error("You are already a member of this workspace");
  }

  const { data, error } = await supabase.from("workspace_members").insert({
    user_id: userId,
    workspace_id: workspaceId,
    role: "member",
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// get workspace info by auth user
export const getWorkspaceInfo = async (workspaceId: string) => {
  const user = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId);

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.[0]) {
    return null;
  }

  return data;
};
