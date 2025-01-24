import { AuthContextType, useAuth } from "@/contexts/AuthContext";
import { createMessage } from "@/lib/db/db";

import useMutation from "@/app/hooks/useMutation";

interface UseSendMessageProps {
  channelId: string;
  content: string;
  parentId?: string;
}

export const useSendMessage = () => {
  const { user } = useAuth() as AuthContextType;

  return useMutation({
    mutateFn: (data: UseSendMessageProps) =>
      createMessage(data.channelId, user?.id as string, data.content, data.parentId),
  });
};
