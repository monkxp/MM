import useChannelId from "@/app/hooks/useChannelId";
import useChannelMessageChange from "@/features/channels/api/useChannelMessageChange";
import useGetChannelMessage from "@/features/channels/api/useGetChannelMessage";
import { Tables } from "@/lib/schema";
import { useEffect } from "react";
import { useRef } from "react";
import MessageGroup from "./MessageGroup";
import { formatDateHeader } from "@/lib/utils";

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
  const channelId = useChannelId();
  const { data, isError, isPending } = useGetChannelMessage(channelId);
  const { type, message, error } = useChannelMessageChange(channelId);

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (type === "INSERT") {
      handleScroll();
    }
  }, [type, message]);

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  if (error) return <div>Error</div>;

  const groupedMessages = groupMessagesByDate(data?.data || []);

  return (
    <div className="overflow-y-auto">
      {groupedMessages.map((group) => (
        <div
          ref={scrollRef}
          key={group.date}
          className="mt-6 border-t border-gray-200"
        >
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
