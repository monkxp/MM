import { getEmojis } from "@/lib/db/message";
import useQuery from "@/app/hooks/useQuery";

export const useGetEmojis = (messageId: string) => {
  return useQuery({
    queryFn: () => getEmojis(messageId),
  });
};  