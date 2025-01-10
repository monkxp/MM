import UserButton from "@/components/UserButton";
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import SideButton from "./SideButton";
import { BellIcon, Home, MessagesSquare, MoreHorizontal } from "lucide-react";

export default function SideBar() {
  return (
    <div className="bg-[#481349] w-[70px] h-full flex flex-col items-center pt-4 text-white gap-y-4">
      <WorkspaceSwitcher />
      <SideButton icon={Home} label="Home" active={true} />
      <SideButton icon={MessagesSquare} label="DMs" active={false} />
      <SideButton icon={BellIcon} label="Activity" active={false} />
      <SideButton icon={MoreHorizontal} label="More" active={false} />
      <div className="flex flex-col items-center gap-4 justify-center gap-y-1 mt-auto mb-4">
        <UserButton />
      </div>
    </div>
  );
}
