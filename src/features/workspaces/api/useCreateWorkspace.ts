import { createWorkspace } from "@/lib/db/db";
import useMutation from "@/app/hooks/useMutation";

interface UseCreateWorkspaceProps {
  name: string;
  userId: string;
  joinCode: string;
}

export const useCreateWorkspace = () => {
  return useMutation({
    mutateFn: (data: UseCreateWorkspaceProps) => createWorkspace(data),
  });
};
