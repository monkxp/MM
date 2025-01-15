import useMutation from "@/app/hooks/useMutation";
import { AuthContextType, useAuth } from "@/contexts/AuthContext";
import { deleteWorkspace } from "@/lib/db";

interface UseDeleteWorkspaceProps {
  workspaceId: string;
}

export const useDeleteWorkspace = () => {
  const { user } = useAuth() as AuthContextType;

  return useMutation({
    mutateFn: (data: UseDeleteWorkspaceProps) =>
      deleteWorkspace(data.workspaceId, user?.id as string),
  });
};
