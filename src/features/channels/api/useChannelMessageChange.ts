import { useState, useEffect } from "react";

import supabase from "@/lib/supabaseClient";
import { Tables } from "@/lib/schema";
import { RealtimeChannel } from "@supabase/supabase-js";

type Message = Tables<"messages">;

const useChannelMessageChange = (channelId: string) => {
  const [type, setType] = useState<string>("");
  const [message, setMessage] = useState<Message | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!channelId) return;

    let messageSubscription: RealtimeChannel;

    try {
      messageSubscription = supabase
        .channel(`public:messages:channel_id=eq.${channelId}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages" },
          (payload) => {
            const { eventType, new: message } = payload;
            setType(eventType);
            setMessage(message as Message);
          },
        )
        .subscribe();
    } catch (error) {
      setError(error as Error);
    }

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [channelId]);

  return { type, message, error };
};

export default useChannelMessageChange;
