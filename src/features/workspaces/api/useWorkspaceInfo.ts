import useQuery from "@/app/hooks/useQuery";
import { getWorkspaceInfo } from "@/lib/db";

export const useWorkspaceInfo = (workspaceId: string) => {
  return useQuery({
    queryFn: () => getWorkspaceInfo(workspaceId),
    enabled: !!workspaceId,
    select: (data: any) => data?.[0],
  });
};

export default useWorkspaceInfo;
