import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";

export default function InviteDialog({
  open,
  setOpen,
  name,
  joinCode,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}) {
  const workspaceId = useWorkspaceId();
  const handleCopy = () => {
    const joinLink = `${window.location.origin}/join/${workspaceId}`;
    navigator.clipboard.writeText(joinLink).then(() => {
      toast.success("Invite link copied to clipboard");
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite people to {name}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Use the code below to invite people to {name}
        </DialogDescription>
        <div className="flex flex-col items-center justify-center p-4 py-10">
          <p className="mb-4 text-4xl font-bold uppercase tracking-widest">
            {joinCode}
          </p>
          <Button
            variant="transparent"
            size="sm"
            className="text-slate-500 hover:bg-slate-300"
            onClick={handleCopy}
          >
            Copy kink
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
