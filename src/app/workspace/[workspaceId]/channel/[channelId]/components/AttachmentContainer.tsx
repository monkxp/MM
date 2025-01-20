import Hint from "@/components/Hint";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

export default function AttachmentContainer({
  children,
  onRemove,
}: {
  children: React.ReactNode;
  onRemove: () => void;
}) {
  return (
    <div className="group relative h-fit w-fit">
      {children}
      <Hint content="Remove file" side="top">
        <Button
          variant="transparent"
          className="absolute -right-2 -top-2 h-[20px] w-[20px]"
          onClick={onRemove}
        >
          <div className="absolute right-0 flex size-5 cursor-pointer items-center justify-center rounded-full bg-slate-600 opacity-0 hover:bg-black/100 group-hover:opacity-80">
            <XIcon className="size-4 text-white" />
          </div>
        </Button>
      </Hint>
    </div>
  );
}
