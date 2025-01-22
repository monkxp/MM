import { useAuth, AuthContextType } from "@/contexts/AuthContext";
import { updateWorkspaceName } from "@/lib/db/db";
import useMutation from "@/app/hooks/useMutation";

interface UseUpdateWorkspaceNameProps {
  workspaceId: string;
  name: string;
}

export const useUpdateWorkspaceName = () => {
  const { user } = useAuth() as AuthContextType;

  return useMutation({
    mutateFn: (data: UseUpdateWorkspaceNameProps) =>
      updateWorkspaceName(data.workspaceId, data.name, user?.id as string),
  });
};
