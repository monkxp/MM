import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useUpdateWorkspaceName } from "@/features/workspaces/api/useUpdateWorkspaceName";
import { useDeleteWorkspace } from "@/features/workspaces/api/useDeleteWorkspace";
import useConfirm from "@/app/hooks/useConfirm";
export default function PreferencesDialog({
  isOpen,
  setIsOpen,
  workspace,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workspace: any;
}) {
  const [name, setName] = useState(workspace.name);
  const { mutate: update, isPending } = useUpdateWorkspaceName();
  const { mutate: delWorkspace, isPending: isPendingDelete } =
    useDeleteWorkspace();
  const router = useRouter();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete workspace",
    "Are you sure you want to delete this workspace?"
  );

  const handleUpdate = async () => {
    await update(
      { workspaceId: workspace.id, name },
      {
        onSuccess: (res) => {
          if (res) {
            const { name } = res;
            setName(name);
          }
          toast.success("Workspace name updated");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };
  const handleDelete = async () => {
    const isDelete = await confirm();
    if (!isDelete) return;
    await delWorkspace(workspace.id, {
      onSuccess: () => {
        toast.success("Workspace deleted");
        setIsOpen(false);
        router.replace("/");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gray-100 p-0">
          <DialogHeader className="p-3 border-b bg-white rounded-md">
            <DialogTitle>Preferences</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className=" px-3  flex flex-col">
            <div className="px-4 py-3 bg-white rounded-md border hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Workspace name</p>
                <Button
                  variant="ghost"
                  className="text-sm text-gray-500"
                  onClick={handleUpdate}
                >
                  {isPending && <Loader className="size-4 animate-spin" />}
                  Change
                </Button>
              </div>
              <p className="text-sm mt-2">
                <Input
                  className="w-full"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </p>
            </div>
            <button
              className="flex items-center justify-start my-3 gap-x-2 px-4 py-3 bg-white rounded-md border cursor-pointer text-rose-500 hover:bg-gray-50"
              onClick={handleDelete}
              disabled={isPendingDelete}
            >
              {isPendingDelete && (
                <Loader className="size-4 animate-spin text-rose-500" />
              )}
              <Trash className="size-4  " />
              <p className="text-sm font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog />
    </>
  );
}
