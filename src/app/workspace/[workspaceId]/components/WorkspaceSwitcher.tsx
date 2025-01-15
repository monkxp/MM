import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader, Plus } from "lucide-react";
import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";
import { useGetWorkspace } from "@/features/workspaces/api/useGetWorkspace";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import CreateWorkspaceModal from "@/features/workspaces/components/CreatWorkspaceModal";
import { AuthContextType, useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
//  56	65	38
export default function WorkspaceSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const workspaceId = useWorkspaceId();
  const { data: workspace, isPending: isWorkspacePending } =
    useGetWorkspace(workspaceId);
  const { data: workspaces } = useGetWorkspaces();
  const router = useRouter();
  const { user } = useAuth() as AuthContextType;
  const filteredWorkspaces = workspaces?.data?.filter(
    (w: any) => w.id !== workspaceId
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-[#ABABAB] hover:bg-[#ABABAB]  size-9 text-lg font-bold text-slate-800">
            {isWorkspacePending ? (
              <Loader className="size-5 animate-spin" />
            ) : (
              workspace?.name?.[0].toUpperCase()
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="w-64">
          <DropdownMenuItem
            className="flex-col justify-start items-start cursor-pointer capitalize"
            onClick={() => {
              router.push(`/workspace/${workspaceId}`);
            }}
          >
            {workspace?.name}
            <span className="text-xs text-gray-500">current workspace</span>
          </DropdownMenuItem>
          {filteredWorkspaces?.map((workspace: any) => (
            <DropdownMenuItem
              key={workspace.id}
              className="flex-row justify-start items-center cursor-pointer capitalize overflow-hidden"
              onClick={() => {
                router.push(`/workspace/${workspace.id}`);
              }}
            >
              <div className="flex items-center justify-center size-8 bg-[#616161] text-white rounded-md text-lg">
                {workspace.name?.[0].toUpperCase()}
              </div>
              <span className="truncate">{workspace.name}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem
            className="capitalize cursor-pointer"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            <div className="flex items-center justify-center size-8 bg-[#F2F2F2] rounded-md text-lg">
              <Plus className="size-4" />
            </div>
            Create new workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateWorkspaceModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userId={user?.id}
      />
    </>
  );
}
