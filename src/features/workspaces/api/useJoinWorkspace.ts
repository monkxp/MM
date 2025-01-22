import { joinWorkspace } from "@/lib/db/db";
import useMutation from "@/app/hooks/useMutation";
import { useAuth, AuthContextType } from "@/contexts/AuthContext";

interface JoinWorkspaceProps {
  joinCode: string;
  workspaceId: string;
}

export const useJoinWorkspace = () => {
  const { user } = useAuth() as AuthContextType;
  return useMutation({
    mutateFn: (data: JoinWorkspaceProps) =>
      joinWorkspace(data.joinCode, data.workspaceId, user?.id as string),
  });
};

export default useJoinWorkspace;
