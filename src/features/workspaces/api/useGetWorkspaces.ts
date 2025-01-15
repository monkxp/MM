import { AuthContextType } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { getWorkspaces } from "@/lib/db";
import useQuery from "@/app/hooks/useQuery";

export const useGetWorkspaces = () => {
  const { user } = useAuth() as AuthContextType;

  return useQuery({
    queryFn: () => getWorkspaces(user?.id as string),
    enabled: !!user?.id,
    select: (response: any) => ({
      data: response.data || [],
      error: response.error || null,
    }),
  });
};
