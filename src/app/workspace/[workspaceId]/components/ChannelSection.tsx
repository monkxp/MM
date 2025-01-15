import { Plus } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";
import { useToggle } from "react-use";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ChannelSection({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, toggleOpen] = useToggle(true);

  return (
    <div className="flex flex-col px-3">
      <div className="group flex items-center">
        <Button
          variant="transparent"
          className="size-6 shrink-0 p-0.5 text-sm text-[#F9EDFFCC]"
          onClick={toggleOpen}
        >
          <FaCaretDown
            className={cn(
              "mr-1 size-4 shrink-0 transition-transform",
              !isOpen && "-rotate-90",
            )}
          />
        </Button>
        <Button
          variant="transparent"
          className="items-center justify-start overflow-hidden px-2 text-sm text-[#F9EDFFCC]"
        >
          <span className="truncate">Channels</span>
        </Button>
        <Button
          variant="transparent"
          className="ml-auto size-6 p-0.5 text-[#F9EDFFCC] opacity-0 transition-opacity group-hover:opacity-100"
        >
          <Plus className="size-4" />
        </Button>
      </div>
      <div className="flex flex-col px-4">{isOpen && children}</div>
    </div>
  );
}
