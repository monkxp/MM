import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import { Button } from "@/components/ui/button";
import { useGetWorkspace } from "@/features/workspaces/api/useGetWorkspace";
import { Info, Search } from "lucide-react";

export default function ToolBar() {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace(workspaceId);
  return (
    <nav className="bg-[#481349] flex items-center justify-between h-10 text-white p-1.5">
      <div className="flex-1" />
      <div className="min-w-[300px] max-w-[600px] grow-[2] shrink">
        <Button variant="transparent" className="flex items-center gap-2">
          <Search className="size-4 text-white mr-2" />
          <span className="text-sm text-white">Search {data?.name}</span>
        </Button>
      </div>
      <div className="flex-1 ml-auto flex items-center justify-end">
        <Button variant="transparent" className="flex items-center gap-2">
          <Info className="size-4 text-white mr-2" />
        </Button>
      </div>
    </nav>
  );
}
