import supabase from "@/lib/supabaseClient";

const useChannelMessageChange = () => {
  supabase
    .channel("db-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
      },
      (payload) => console.log(payload)
    )
    .subscribe();
};

export default useChannelMessageChange;
