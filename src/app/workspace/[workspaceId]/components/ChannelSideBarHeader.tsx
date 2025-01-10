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
import PreferencesDialog from "./PreferencesDialog";
export default function ChannelSideBarHeader({
  workspace,
  isAdmin,
}: {
  workspace: any;
  isAdmin: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex items-center justify-between px-4 py-2 h-[49px]">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="transparent"
            className="p-1.5 w-auto overflow-hidden"
          >
            <span className="text-white font-semibold text-lg truncate">
              {workspace.name}
            </span>
            <ChevronDown className="size-4 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="w-72">
          <DropdownMenuItem className="cursor-pointer capitalize">
            <div className="flex items-center justify-center mr-2 text-white bg-[#616161]  rounded-md font-semibold text-lg w-10 h-10">
              {workspace.name.slice(0, 1).toUpperCase()}
            </div>
            <span className="flex flex-col justify-start">
              <p className="font-semibold truncate">{workspace.name}</p>
              <p className=" text-xs text-muted-foreground">active workspace</p>
            </span>
          </DropdownMenuItem>

          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer py-2 capitalize"
                onClick={() => {}}
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
    </div>
  );
}
