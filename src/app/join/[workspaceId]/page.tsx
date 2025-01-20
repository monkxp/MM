"use client";

import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import useJoinWorkspace from "@/features/workspaces/api/useJoinWorkspace";
import { useState } from "react";
import VerificationInput from "react-verification-input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useWorkspaceInfo from "@/features/workspaces/api/useWorkspaceInfo";
import { AlertTriangle, Loader } from "lucide-react";

export default function JoinWorkspacePage() {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const { data: workspaceInfo, isPending } = useWorkspaceInfo(workspaceId);
  const { mutate: joinWorkspace } = useJoinWorkspace();
  const [value, setValue] = useState("");
  const handleComplete = (value: string) => {
    joinWorkspace(
      { joinCode: value.toLowerCase(), workspaceId },
      {
        onSuccess: () => {
          router.push(`/workspace/${workspaceId}`);
        },
      },
    );
  };

  if (isPending)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-4 w-4 animate-spin" />
      </div>
    );

  if (!workspaceInfo)
    return (
      <div className="flex h-screen items-center justify-center">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <p className="text-sm text-red-500">Can&apos;t join the workspace.</p>
      </div>
    );

  console.log(workspaceInfo);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-y-4">
      <div className="flex flex-col items-center justify-center gap-y-4">
        <h1 className="text-2xl font-bold">
          Join Workspace {workspaceInfo.name}
        </h1>
        <p className="text-sm text-gray-500">
          Enter the 6-digit code to join the workspace.
        </p>
      </div>
      <div>
        <VerificationInput
          classNames={{
            container: "flex gap-x-2",
            character:
              "uppercase rounded-md border border-gray-200 flex items-center justify-center font-medium text-lg text-gray-600",
            characterInactive: "bg-muted",
            characterSelected: "bg-white text-black",
            characterFilled: "bg-white text-black",
          }}
          length={6}
          onChange={(value) => setValue(value)}
          onComplete={handleComplete}
          value={value}
          autoFocus
        />
      </div>
      <div>
        <Button variant="outline" className="gap-x-2 px-4">
          <Link href="/">Back</Link>
        </Button>
      </div>
    </div>
  );
}
