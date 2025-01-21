import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import { Button } from "@/components/ui/button";
import { useGetWorkspace } from "@/features/workspaces/api/useGetWorkspace";
import { Info, Search } from "lucide-react";

export default function ToolBar() {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace(workspaceId);
  return (
    <nav className="flex h-10 items-center justify-between bg-[#481349] p-1.5 text-white">
      <div className="max-w-[370px] flex-1" />
      <div className="min-w-[300px] max-w-[600px] shrink grow-[2]">
        <Button variant="transparent" className="flex items-center gap-2">
          <Search className="mr-2 size-4 text-white" />
          <span className="text-sm text-white">Search {data?.name}</span>
        </Button>
      </div>
      <div className="ml-auto flex flex-1 items-center justify-end">
        <Button variant="transparent" className="flex items-center gap-2">
          <Info className="mr-2 size-4 text-white" />
        </Button>
      </div>
    </nav>
  );
}
