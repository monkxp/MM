"use client";

import ChannelSideBar from "./components/ChannelSideBar";
import SideBar from "./components/SideBar";
import ToolBar from "./components/ToolBar";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import usePanel from "@/app/hooks/usePanel";
import ThreadMessage from "./channel/[channelId]/components/ThreadMessage";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { threadId } = usePanel();

  const showThread = !!threadId;

  return (
    <div className="h-full">
      <ToolBar />
      <div className="flex h-[calc(100vh-40px)]">
        <SideBar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="workspace-layout"
        >
          <ResizablePanel
            id="sidebar"
            order={1}
            defaultSize={25}
            minSize={12}
            className="bg-[#5E2C5E]"
          >
            <ChannelSideBar />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel 
            id="main"
            order={2}
            defaultSize={75} 
            minSize={25}
          >
            {children}
          </ResizablePanel>
          {showThread && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel 
                id="thread"
                order={3}
                defaultSize={40} 
                minSize={10}
              >
                <ThreadMessage />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
