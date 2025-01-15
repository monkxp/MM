import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import { useGetWorkspace } from "@/features/workspaces/api/useGetWorkspace";
import useGetChannels from "@/features/channels/api/useGetChannels";
import { AlertTriangle, Loader, Hash } from "lucide-react";
import ChannelSideBarHeader from "./ChannelSideBarHeader";
import ChannelSideBarItem from "./ChannelSideBarItem";
import ChannelSection from "./ChannelSection";

export default function ChannelSideBar() {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isPending } = useGetWorkspace(workspaceId);
  const { data: channels, isPending: channelsPending } =
    useGetChannels(workspaceId);
  if (isPending || channelsPending) {
    return (
      <div className="flex h-full items-center justify-center bg-[#5E2C5E] text-white">
        <Loader className="animate-spin" />
      </div>
    );
  }
  if (!workspace) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#5E2C5E] text-white">
        <AlertTriangle className="size-6" />
        <p className="text-sm text-white">Workspace not found</p>
      </div>
    );
  }
  if (channels?.error) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#5E2C5E] text-white">
        <AlertTriangle className="size-6" />
        <p className="text-sm text-white">{channels?.error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-[#5E2C5E]">
      <ChannelSideBarHeader
        workspace={workspace}
        isAdmin={workspace.role === "admin"}
      />
      <div className="flex flex-col">
        <ChannelSection>
          {channels?.data?.map((item: any) => (
            <ChannelSideBarItem
              key={item.id}
              label={item.name}
              id={item.id}
              icon={Hash}
            />
          ))}
        </ChannelSection>
      </div>
    </div>
  );
}
