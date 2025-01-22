import { useState } from "react";

import { Tables } from "@/lib/schema";
import MessageItem from "./MessageItem";
import EditMessage from "./EditMessage";

const TIME_BETWEEN_MESSAGES = 5 * 60 * 1000;

type Message = Tables<"messages">;
export default function MessageGroup({
  messages,
  updateMessages,
  deleteMessage,
}: {
  messages: Message[];
  updateMessages: (messages: Message) => void;
  deleteMessage: (messageId: string) => void;
}) {
  const [editMessageId, setEditMessageId] = useState<string | null>(null);
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
    <div className="flex flex-col">
      {messages.map((message, index) => {
        if (message.id === editMessageId) {
          return (
            <EditMessage
              key={message.id}
              message={message}
              showHeader={shouldShowHeader(message, messages[index - 1])}
              setEditMessageId={setEditMessageId}
              updateMessages={updateMessages}
            />
          );
        }
        return (
          <MessageItem
            key={message.id}
            message={message}
            showHeader={shouldShowHeader(message, messages[index - 1])}
            setEditMessageId={setEditMessageId}
            deleteMessageById={deleteMessage}
          />
        );
      })}
    </div>
  );
}
