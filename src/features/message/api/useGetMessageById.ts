
import useQuery from "@/app/hooks/useQuery";
import { getMessageById } from "@/lib/db/message";

export default function useGetMessageById(messageId: string) {
  return useQuery({
    queryFn: () => getMessageById(messageId),
    select: (data:any) => data?.[0],
  });
}
