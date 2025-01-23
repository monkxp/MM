import { useState } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function EmojiPopover({
  children,
  onEmojiSelect,
}: {
  children: React.ReactNode;
  onEmojiSelect: (emoji: any) => void;
}) {
  const [open, setOpen] = useState(false);
  const handleEmojiSelect = (emoji: any) => {
    onEmojiSelect(emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-full h-full p-0">
        <Picker
          data={data}
          onEmojiSelect={handleEmojiSelect}
        />
      </PopoverContent>
    </Popover>
  );
}
