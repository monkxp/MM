"use client";
import { useState, useEffect, useMemo } from "react";
import ChannelList from "@/components/ChannelList";
import Chat from "@/components/Chat";
import { AuthContextType, useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

import { useGetWorkspaces } from "@/features/workspaces/api/useGetWorkspaces";

import CreateWorkspaceModal from "@/features/workspaces/components/CreatWorkspaceModal";
export default function Dashboard() {
  // const [selectedChannelId, setSelectedChannelId] = useState<string | null>(
  //   null
  // );

  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth() as AuthContextType;
  const router = useRouter();

  const { data, isPending } = useGetWorkspaces();
  const workspaceId = useMemo(() => {
    return data?.[0]?.id;
  }, [data]);
  console.log("user: ", user);
  useEffect(() => {
    if (!user && !loading) {
      router.push("/auth");
    }
    if (isPending) {
      return;
    }
    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!isOpen) {
      setIsOpen(true);
    }
  }, [user, router, loading, workspaceId, isOpen, isPending]);

  // const handleChannelSelect = (channelId: string) => {
  //   // setSelectedChannelId(channelId);
  // };

  // const handleSignOut = async () => {
  //   try {
  //     await signOut();
  //     router.push("/auth");
  //   } catch (error) {
  //     console.error("Failed to sign out", error);
  //   }
  // };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // console.log("workspaceId: ", workspaceId);

  return (
    <div>
      {workspaceId ? (
        <div>Workspaces</div>
      ) : (
        <CreateWorkspaceModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          userId={user?.id}
        />
      )}
    </div>
    // <div className="flex h-screen">
    //   <aside className="w-64 p-4 border-r">
    //     <ChannelList
    //       onSelectChannel={handleChannelSelect}
    //       selectedChannelId={selectedChannelId}
    //     />
    //   </aside>
    //   <main className="flex-1 p-4">
    //     {user && (
    //       <div className="flex items-center justify-end mb-4">
    //         <Button variant={"destructive"} onClick={handleSignOut}>
    //           Sign Out
    //         </Button>
    //       </div>
    //     )}
    //     {selectedChannelId ? (
    //       <Chat channelId={selectedChannelId} />
    //     ) : (
    //       <div className="text-gray-500 text-center flex items-center justify-center h-full">
    //         Select a channel to start chatting.
    //       </div>
    //     )}
    //   </main>
    // </div>
  );
}
