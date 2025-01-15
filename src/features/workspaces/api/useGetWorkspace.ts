import { useAuth, AuthContextType } from "@/contexts/AuthContext";
import { getWorkspace } from "@/lib/db";
import useQuery from "@/app/hooks/useQuery";

export const useGetWorkspace = (workspaceId: string) => {
  const { user } = useAuth() as AuthContextType;

  return useQuery({
    queryFn: () => getWorkspace(workspaceId, user?.id as string),
    enabled: !!workspaceId && !!user?.id,
  });
};
