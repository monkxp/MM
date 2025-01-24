import useQuery from "@/app/hooks/useQuery";
import { getThreadMessages } from "@/lib/db/message";

export default function useThreadMessages(messageId: string) {
  return useQuery({
    queryFn: () => getThreadMessages(messageId),
  });
}