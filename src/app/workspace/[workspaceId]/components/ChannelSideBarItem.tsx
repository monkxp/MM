import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import { Button } from "@/components/ui/button";

const sideBarItemVariants = cva(
  "flex items-center justify-start gap-2 h-7 text-sm overflow-hidden px-2",
  {
    variants: {
      variant: {
        default: "text-[#F9EDFFCC]",
        active: "text-[#481939] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export default function ChannelSideBarItem({
  label,
  id,
  icon: Icon,
  variant = "default",
}: {
  label: string;
  id: string;
  icon: LucideIcon;
  variant?: VariantProps<typeof sideBarItemVariants>["variant"];
}) {
  const workspaceId = useWorkspaceId();
  return (
    <Button
      variant="transparent"
      className={cn(sideBarItemVariants({ variant }))}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <Icon className="size-4 mr-1 shrink-0" />
        <span className="truncate text-sm">{label}</span>
      </Link>
    </Button>
  );
}
