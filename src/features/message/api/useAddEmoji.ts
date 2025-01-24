import { addEmojiToMessage } from "@/lib/db/message";
import useMutation from "@/app/hooks/useMutation";

interface AddEmojiProps {
  messageId: string;
  workspaceId: string;
  userId: string;
  emoji: string;
}

export const useAddEmoji = () => {
  return useMutation({
    mutateFn: (data: AddEmojiProps) => addEmojiToMessage(data.messageId, data.workspaceId, data.userId, data.emoji),
  });
};