import useQuery from "@/app/hooks/useQuery";
import { getChannelMessages } from "@/lib/db/db";

export const useGetChannelMessage = (channelId: string) => {
  return useQuery({
    queryFn: () => getChannelMessages(channelId),
  });
};

export default useGetChannelMessage;
