import { updateMessage } from "@/lib/db/db";

import useMutation from "@/app/hooks/useMutation";

interface UseUpdateMessageProps {
  messageId: string;
  content: string;
}

export const useUpdateMessage = () => {
  return useMutation({
    mutateFn: (data: UseUpdateMessageProps) =>
      updateMessage(data.messageId, data.content),
  });
};
