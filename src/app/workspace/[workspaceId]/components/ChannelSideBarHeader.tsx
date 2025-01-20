import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SquarePen } from "lucide-react";
import Hint from "@/components/Hint";
import InviteDialog from "./InviteDialog";
import PreferencesDialog from "./PreferencesDialog";
export default function ChannelSideBarHeader({
  workspace,
  isAdmin,
}: {
  workspace: any;
  isAdmin: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  return (
    <div className="flex h-[49px] items-center justify-between px-4 py-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="transparent"
            className="w-auto overflow-hidden p-1.5"
          >
            <span className="truncate text-lg font-semibold text-white">
              {workspace.name}
            </span>
            <ChevronDown className="size-4 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="w-72">
          <DropdownMenuItem className="cursor-pointer capitalize">
            <div className="mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-[#616161] text-lg font-semibold text-white">
              {workspace.name.slice(0, 1).toUpperCase()}
            </div>
            <span className="flex flex-col justify-start">
              <p className="truncate font-semibold">{workspace.name}</p>
              <p className="text-xs text-muted-foreground">active workspace</p>
            </span>
          </DropdownMenuItem>

          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer py-2 capitalize"
                onClick={() => setIsInviteOpen(true)}
              >
                invite to {workspace.name}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer py-2 capitalize"
                onClick={() => setIsOpen(true)}
              >
                preferences
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer py-2 capitalize"
            onClick={() => {}}
          >
            logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex items-center">
        <Hint content="New message">
          <Button variant="transparent" size="iconSm">
            <SquarePen className="size-4" />
          </Button>
        </Hint>
      </div>
      <PreferencesDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        workspace={workspace}
      />
      <InviteDialog
        open={isInviteOpen}
        setOpen={setIsInviteOpen}
        name={workspace.name}
        joinCode={workspace.join_code}
      />
    </div>
  );
}
