import { ChevronDown, LogOutIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { Tables } from "@/lib/schema";

export default function ChannelHeader({
  channel,
}: {
  channel: Tables<"channels">;
}) {
  return (
    <div className="flex h-[49px] items-center justify-between px-4 py-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="transparent"
            className="w-auto overflow-hidden p-1.5"
          >
            <p className="truncate text-lg font-semibold text-slate-600">
              #{channel.name}
            </p>
            <ChevronDown className="size-4 shrink-0 text-slate-600" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="w-72">
          <DropdownMenuItem className="flex cursor-pointer flex-col items-start justify-start">
            <div className="flex items-center justify-start">
              <p className="truncate font-semibold">Channel name</p>
            </div>
            <p className="truncate text-sm text-slate-600">#{channel.name}</p>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <LogOutIcon className="size-4 shrink-0" />
            <span className="flex flex-col justify-start">
              <p className="truncate font-semibold">leave channel</p>
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
