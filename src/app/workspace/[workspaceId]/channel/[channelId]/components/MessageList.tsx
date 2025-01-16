import { useState } from "react";

import useChannelId from "@/app/hooks/useChannelId";
import useChannelMessageChange from "@/features/channels/api/useChannelMessageChange";
import useGetChannelMessage from "@/features/channels/api/useGetChannelMessage";
import { Tables } from "@/lib/schema";
import { useEffect } from "react";
import { useRef } from "react";
import MessageGroup from "./MessageGroup";
import { cn, formatDateHeader } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useLayoutEffect } from "react";

interface MessageGroup {
  date: string;
  messages: Tables<"messages">[];
}

const groupMessagesByDate = (
  messages: Tables<"messages">[],
): MessageGroup[] => {
  return messages.reduce((groups: MessageGroup[], message) => {
    const messageDate = new Date(message.created_at);
    const dateLabel = formatDateHeader(messageDate);

    const existingGroup = groups.find((g) => g.date === dateLabel);
    if (existingGroup) {
      existingGroup.messages.push(message);
    } else {
      groups.push({ date: dateLabel, messages: [message] });
    }
    return groups;
  }, []);
};

export default function MessageList() {
  const [messages, setMessages] = useState<Tables<"messages">[]>([]);
  const [newMessageArrived, setNewMessageArrived] = useState(false);

  const channelId = useChannelId();
  const { data, isError, isPending } = useGetChannelMessage(channelId);
  const { type, message, error } = useChannelMessageChange(channelId);

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.classList.add("no-scroll-animation");
          const maxScroll =
            scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
          scrollRef.current.scrollTop = maxScroll;
          scrollRef.current.classList.remove("no-scroll-animation");
        }
      }, 300);
    }
  };

  useEffect(() => {
    if (data?.data) {
      setMessages(data.data);
    }

    if (type === "INSERT" && message) {
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessageArrived(true);
      handleScroll();
    }
  }, [type, message, data?.data]);

  useLayoutEffect(() => {
    if (!isPending && data?.data) {
      handleScroll();
    }
  }, [isPending, data?.data]);

  if (isPending)
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#5E2C5E] text-white">
        <Loader className="size-6" />
        <p className="text-sm text-white">Loading...</p>
      </div>
    );
  if (isError) return <div>Error</div>;
  if (error) return <div>Error</div>;

  const groupedMessages = groupMessagesByDate(messages || []);

  return (
    <div
      ref={scrollRef}
      className={cn("overflow-y-auto", newMessageArrived && "scroll-smooth")}
      style={{ height: "calc(100vh - 200px)" }}
    >
      {groupedMessages.map((group) => (
        <div key={group.date} className="mt-6 border-t border-gray-200">
          <div className="sticky top-5 z-10 items-center py-2">
            <div className="relative flex items-center justify-center">
              <div className="absolute -top-[22px] rounded-full border bg-white px-4 py-1 text-xs text-gray-500">
                {group.date}
              </div>
            </div>
          </div>
          <MessageGroup messages={group.messages} />
        </div>
      ))}
    </div>
  );
}
