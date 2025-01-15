"use client";
import { useEffect } from "react";
import { AlertTriangle, Loader } from "lucide-react";
import { useRouter } from "next/navigation";

import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import useGetChannels from "@/features/channels/api/useGetChannels";

const WorkspaceIdPage = () => {
  const workspaceId = useWorkspaceId();
  const { data, isError, isPending, error } = useGetChannels(workspaceId);
  const router = useRouter();

  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      router.replace(`/workspace/${workspaceId}/channel/${data.data[0].id}`);
    }
  }, [data, router, workspaceId]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full bg-[#5E2C5E] text-white">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#5E2C5E] text-white">
        <AlertTriangle className="size-6" />
        <p className="text-sm text-white">
          {typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof error.message === "string"
            ? error.message
            : "An error occurred"}
        </p>
      </div>
    );
  }

  if (data?.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#5E2C5E] text-white">
        <AlertTriangle className="size-6" />
        <p className="text-sm text-white">{data.error}</p>
      </div>
    );
  }
  if (data?.data?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#5E2C5E] text-white">
        <AlertTriangle className="size-6" />
        <p className="text-sm text-white">No channels found</p>
      </div>
    );
  }
};

export default WorkspaceIdPage;
