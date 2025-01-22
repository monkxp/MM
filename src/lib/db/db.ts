import { createClient } from "../supabase/client";

const supabase = createClient();

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

export * from "./workspace";
export * from "./channel";
export * from "./message";
