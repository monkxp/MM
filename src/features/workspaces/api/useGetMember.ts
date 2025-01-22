import { useAuth, AuthContextType } from "@/contexts/AuthContext";
import { getWorkspaceMember } from "@/lib/db/db";
import useQuery from "@/app/hooks/useQuery";

export const useGetMember = (workspaceId: string) => {
  const { user } = useAuth() as AuthContextType;

  return useQuery({
    queryFn: () => getWorkspaceMember(workspaceId, user?.id as string),
  });
};
