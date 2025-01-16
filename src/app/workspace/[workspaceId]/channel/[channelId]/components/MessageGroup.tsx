import { Tables } from "@/lib/schema";
import MessageItem from "./MessageItem";

const TIME_BETWEEN_MESSAGES = 5 * 60 * 1000;

type Message = Tables<"messages">;
export default function MessageGroup({ messages }: { messages: Message[] }) {
  const shouldShowHeader = (currentMsg: Message, prevMsg: Message | null) => {
    if (!prevMsg) return true;
    const timeDiff =
      new Date(currentMsg.created_at).getTime() -
      new Date(prevMsg.created_at).getTime();
    return (
      currentMsg.user_id !== prevMsg.user_id || timeDiff > TIME_BETWEEN_MESSAGES
    );
  };
  return (
    <div className="flex flex-col gap-2 px-4">
      {messages.map((message, index) => (
        <MessageItem
          key={message.id}
          message={message}
          showHeader={shouldShowHeader(message, messages[index - 1])}
        />
      ))}
    </div>
  );
}
