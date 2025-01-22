import { deleteMessage } from "@/lib/db/db";

import useMutation from "@/app/hooks/useMutation";

interface UseDeleteMessageProps {
  messageId: string;
}

export const useDeleteMessage = () => {
  return useMutation({
    mutateFn: (data: UseDeleteMessageProps) => deleteMessage(data.messageId),
  });
};
