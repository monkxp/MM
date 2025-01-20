import { useRouter } from "next/navigation";

import { AuthContextType, useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOutIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function UserButton() {
  const { user, signOut } = useAuth() as AuthContextType;
  const router = useRouter();
  const logout = async () => {
    await signOut();
    router.push("/signin");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="size-10 cursor-pointer rounded-md transition hover:opacity-80">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback className="bg-[#160616] text-lg text-white">
            {user?.email?.[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        <DropdownMenuItem className="cursor-pointer" onClick={logout}>
          <LogOutIcon className="size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
