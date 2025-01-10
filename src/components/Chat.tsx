"use client";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import supabase from "@/lib/supabaseClient";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, formatDistanceToNow } from "date-fns";
import { User } from "@supabase/supabase-js";
import { AuthContextType } from "@/contexts/AuthContext";
interface Message {
  id: string;
  channel_id: string;
  user_id: string;
  content: string;
  created_at: string;
  users?: User;
}

const Chat: React.FC<{ channelId: string }> = ({ channelId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth() as AuthContextType;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (channelId) {
        const { data, error } = await supabase
          .from("messages")
          .select("*, users:user_id(id, email)")
          .eq("channel_id", channelId)
          .order("created_at", { ascending: true });
        if (error) {
          console.error("Error fetching messages", error);
        } else {
          setMessages(data as Message[]);
        }
      }
    };

    fetchMessages();

    const messageSubscription = supabase
      .channel(`public:messages:channel_id=eq.${channelId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            payload.new as Message,
          ]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [channelId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            channel_id: channelId,
            user_id: user?.id,
            content: newMessage,
          },
        ])
        .select("*")
        .single();

      console.log("handleSubmit:", data);

      if (error) {
        console.error("Error sending message", error);
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <ScrollArea className="flex-grow mb-4" ref={scrollRef}>
        <div className="space-y-2">
          {messages.map((message) => (
            <div key={message.id} className="bg-muted p-3 rounded-md">
              <div className="text-sm font-bold">{message.users?.email}</div>
              <div className="mb-1">{message.content}</div>
              <div className="text-xs text-gray-500">
                {format(new Date(message.created_at), "PPp")} (
                {formatDistanceToNow(new Date(message.created_at), {
                  addSuffix: true,
                })}
                )
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};

export default Chat;
