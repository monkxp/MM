import { useLayoutEffect, useEffect, useState, useRef } from "react";

import useChannelId from "@/app/hooks/useChannelId";
import useChannelMessageChange from "@/features/message/api/useChannelMessageChange";
import useGetChannelMessage from "@/features/message/api/useGetChannelMessage";
import { Tables } from "@/lib/schema";
import { cn, formatDateHeader } from "@/lib/utils";
import { Loader } from "lucide-react";

import MessageGroup from "./MessageGroup";

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

  const handleUpdateMessage = (message: Tables<"messages">) => {
    setNewMessageArrived(true);
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === message.id
          ? { ...msg, content: message.content, is_edited: true }
          : msg,
      ),
    );
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => msg.id !== messageId),
    );
  };

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
    if (data?.data && !newMessageArrived) {
      setMessages(data.data);
    }

    if (type === "INSERT" && message) {
      if(!message.parent_id){
        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessageArrived(true);
        handleScroll();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div key={group.date} className="mt-6 border-t border-gray-200 px-0">
          <div className="sticky top-5 z-10 items-center py-2">
            <div className="relative flex items-center justify-center">
              <div className="absolute -top-[22px] rounded-full border bg-white px-4 py-1 text-xs text-gray-500">
                {group.date}
              </div>
            </div>
          </div>
          <MessageGroup
            messages={group.messages}
            updateMessages={handleUpdateMessage}
            deleteMessage={handleDeleteMessage}
            threadCount={data?.threadCount}
          />
        </div>
      ))}
    </div>
  );
}
