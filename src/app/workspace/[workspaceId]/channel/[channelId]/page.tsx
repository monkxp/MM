"use client";

import ChannelHeader from "./components/ChannelHeader";
import useGetChannel from "@/features/channels/api/useGetChannel";
import useChannelId from "@/app/hooks/useChannelId";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import { AlertTriangle, Loader } from "lucide-react";
import ChatInput from "./components/ChatInput";
import MessageList from "./components/MessageList";

export default function ChannelPage() {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const { data, isError, isPending } = useGetChannel(workspaceId, channelId);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full bg-[#5E2C5E] text-white">
        <Loader className="animate-spin" />
      </div>
    );
  }
  if (!data || isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#5E2C5E] text-white">
        <AlertTriangle className="size-6" />
        <p className="text-sm text-white">Channel not found</p>
      </div>
    );
  }
  if (data.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#5E2C5E] text-white">
        <AlertTriangle className="size-6" />
        <p className="text-sm text-white">{data.error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-3 h-full w-full">
      <ChannelHeader channel={data.data!} />
      <MessageList />
      <div className="px-3 mt-auto">
        <div className="border border-gray-200 rounded-md p-2">
          <ChatInput />
        </div>
      </div>
    </div>
  );
}
