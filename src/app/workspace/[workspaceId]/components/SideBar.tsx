import UserButton from "@/components/UserButton";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import SideButton from "./SideButton";
import { Home, MessagesSquare, MoreHorizontal } from "lucide-react";

export default function SideBar() {
  return (
    <div className="flex h-full w-[70px] flex-col items-center gap-y-4 bg-[#481349] pt-4 text-white">
      <WorkspaceSwitcher />
      <SideButton icon={Home} label="Home" active={true} />
      <SideButton icon={MessagesSquare} label="DMs" active={false} />
      <SideButton icon={MoreHorizontal} label="More" active={false} />
      <div className="mb-4 mt-auto flex flex-col items-center justify-center gap-4 gap-y-1">
        <UserButton />
      </div>
    </div>
  );
}
