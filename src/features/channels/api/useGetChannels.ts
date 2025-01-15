import { AuthContextType, useAuth } from "@/contexts/AuthContext";
import { getChannels } from "@/lib/db";
import useQuery from "@/app/hooks/useQuery";

const useGetChannels = (workspaceId: string) => {
  const { user } = useAuth() as AuthContextType;

  return useQuery({
    queryFn: () => getChannels(workspaceId, user?.id as string),
  });
};

export default useGetChannels;
