"use server";

import { createClient } from "./supabase/server";
// import { encodedRedirect } from "@/lib/supabase/utils";
import { redirect } from "next/navigation";

import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

export async function signInAction(prevState: any, formData: FormData) {
  console.log("formData:", formData);

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log("error:", error);

  // if (error) {
  //   return encodedRedirect("error", "/signin", error.message);
  // }
  if (error) {
    return { message: error.message };
  }

  return redirect("/");
}

export async function signUpAction(prevState: any, formData: FormData) {
  console.log("formData:", formData);
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const supabase = await createClient();

  if (password !== confirmPassword) {
    return { message: "Passwords do not match" };
  }

  let name = "";
  if (email) {
    name = email.split("@")[0];
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  console.log("error:", error);

  if (error) {
    return { message: error.message };
  }

  await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return redirect("/");
}

// supabase don't support transaction
// so we use postgres transaction
// need maintain the database url in the .env file
export async function deleteWorkspaceAction(workspaceId: string) {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const res = await sql.begin(async (tx) => {
    // check user is admin of the workspace
    const userId = user?.data?.user?.id || "";
    const members =
      await tx`SELECT * FROM workspace_members WHERE workspace_id = ${workspaceId} AND user_id = ${userId}`;

    if (members.length === 0) {
      throw new Error("You are not a member of this workspace");
    }

    const member = members[0];
    if (member.role !== "admin") {
      throw new Error("You are not an admin of this workspace");
    }

    const channels =
      await tx`SELECT * FROM channels WHERE workspace_id = ${workspaceId}`;
    //delete all messages of the workspace
    for (const channel of channels) {
      await tx`DELETE FROM messages WHERE channel_id = ${channel.id}`;
    }
    await tx`DELETE FROM channels WHERE workspace_id = ${workspaceId}`;
    // delete the workspace_members
    await tx`DELETE FROM workspace_members WHERE workspace_id = ${workspaceId}`;
    // delete the workspace
    await tx`DELETE FROM workspaces WHERE id = ${workspaceId}`;
    return { message: "Workspace deleted successfully" };
  });

  return res;
}
