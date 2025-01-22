import { useAuth } from "@/contexts/AuthContext";
import { AuthContextType } from "@/contexts/AuthContext";
import { getChannel } from "@/lib/db/db";
import useQuery from "@/app/hooks/useQuery";

const useGetChannel = (workspaceId: string, channelId: string) => {
  const { user } = useAuth() as AuthContextType;

  return useQuery({
    queryFn: () => getChannel(workspaceId, channelId, user?.id as string),
  });
};

export default useGetChannel;
