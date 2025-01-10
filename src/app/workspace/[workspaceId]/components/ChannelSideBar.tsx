import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import { useGetWorkspace } from "@/features/workspaces/api/useGetWorkspace";
import { AlertTriangle, Loader } from "lucide-react";
import ChannelSideBarHeader from "./ChannelSideBarHeader";

export default function ChannelSideBar() {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isPending } = useGetWorkspace(workspaceId);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full bg-[#5E2C5E] text-white">
        <Loader className="animate-spin" />
      </div>
    );
  }
  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#5E2C5E] text-white">
        <AlertTriangle className="size-6" />
        <p className="text-sm text-white">Workspace not found</p>
      </div>
    );
  }

  return (
    <div className="bg-[#5E2C5E] flex flex-col h-full">
      <ChannelSideBarHeader
        workspace={workspace}
        isAdmin={workspace.role === "admin"}
      />
    </div>
  );
}
