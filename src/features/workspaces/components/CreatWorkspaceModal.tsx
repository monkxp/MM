import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCreateWorkspace } from "../api/useCreateWorkspace";
import { toast } from "sonner";
import { generateJoinCode } from "@/lib/utils";

export default function CreateWorkspaceModal({
  isOpen,
  setIsOpen,
  userId,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userId: string | undefined;
}) {
  const [workspaceName, setWorkspaceName] = useState("");
  const { create, isPending } = useCreateWorkspace();
  const router = useRouter();
  const handleCreateWorkspace = async () => {
    await create(
      {
        name: workspaceName,
        userId: userId || "",
        joinCode: generateJoinCode(),
      },
      {
        onSuccess: (res) => {
          router.replace(`/workspace/${res}`);
          toast.success("Workspace created successfully");
        },
        onError: (error) => {
          console.log("error", error);
        },
        onSettled: () => {
          console.log("settled");
        },
      }
    );
  };
  const handleClose = () => {
    setIsOpen(false);
    setWorkspaceName("");
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Create a new workspace to start collaborating with your team.
        </DialogDescription>
        <Input
          placeholder="Workspace Name e.g. 'My Workspace'"
          autoFocus
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
        />
        <div className="flex justify-end">
          <Button disabled={isPending} onClick={handleCreateWorkspace}>
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
