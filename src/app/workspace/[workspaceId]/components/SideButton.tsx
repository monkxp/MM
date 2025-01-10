import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export default function SideButton({
  label,
  active,
  icon: Icon,
}: {
  label: string;
  active: boolean;
  icon: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-white rounded-md gap-y-1 group">
      <Button
        variant="transparent"
        className={cn(
          "size-9 p-2 group-hover:bg-accent/20",
          active && "bg-accent/20"
        )}
      >
        <Icon className="size-5 group-hover:scale-125 transition-all" />
      </Button>
      <span className="text-[10px] text-white group-hover:text-accent transition-all">
        {label}
      </span>
    </div>
  );
}
