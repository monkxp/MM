import { Divide, X } from "lucide-react";
import { useEffect, useState } from "react";

import Loading from "@/components/Loder";
import { Button } from "@/components/ui/button";

import usePanel from "@/app/hooks/usePanel";
import useGetMessageById from "@/features/message/api/useGetMessageById";
import MessageItem from "./MessageItem";
import ChatInput from "./ChatInput";
import useThreadMessages from "@/features/message/api/useThreadMessages";
import MessageGroup from "./MessageGroup";
import { Tables } from "@/lib/schema";

export default function ThreadMessage() {
    const [threadMessages, setThreadMessages] = useState<Tables<"messages">[]>([]);
    const { closeThread, threadId } = usePanel();
    const { data: message , isPending: isMessagePending, refetch: refetchMessage} = useGetMessageById(threadId|| "");
    const { data: threadData , isPending: isThreadPending, refetch: refetchThread} = useThreadMessages(threadId|| "");

    useEffect(()=>{
        if(threadId){
            refetchMessage();
            refetchThread();
        }
    },[threadId]);

    useEffect(()=>{
        if(threadData && threadData.data){
            setThreadMessages(threadData.data);
        }
    },[threadData]);

    if(!threadId || isMessagePending || isThreadPending){
        return <Loading/>;
    }
    if(!message || !threadData){
        return <div>Message not found</div>;
    }
    const {count} = threadData;

    const handleUpdateMessage = (message: Tables<"messages">) => {
        setThreadMessages((prevMessages) =>
            prevMessages.map((msg) =>
                msg.id === message.id
                    ? { ...msg, content: message.content, is_edited: true }
          : msg,
      ),
    );
  };

    const handleSendMessage = (message: Tables<"messages">) => {
        setThreadMessages((prevMessages) =>
             [...prevMessages, message]
        );
    }


    const handleDeleteMessage = (messageId: string) => {
        setThreadMessages((prevMessages) =>
            prevMessages.filter((msg) => msg.id !== messageId),
        );
    }

    return( 
    <div className="flex flex-col h-full">
        <div className="flex flex-row gap-2 items-center justify-between">
            <h2 className="pl-4 text-lg font-bold">Thread</h2>
            <Button variant="transparent" onClick={closeThread}>
                <X style={{ width: "24px", height: "24px" }} className="text-black"/>
            </Button>
        </div>
            <div  className="overflow-y-auto overflow-x-auto">
                <div>
                    <MessageItem message={message} showHeader={true} setEditMessageId={()=>{}} deleteMessageById={()=>{}}/>
                </div>
                {count !== null && count > 0 && (
                    <>
                        <div className="flex flex-row gap-2 ml-2 items-center justify-start"    >
                            <div className="text-sm text-gray-500">
                                {count} replies
                            </div>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>
                        <div className="flex flex-col gap-2">
                            {threadMessages && threadMessages.length > 0 && 
                                <MessageGroup
                                    messages={threadMessages} 
                                    updateMessages={handleUpdateMessage} 
                                    deleteMessage={()=>{}}
                                />
                            }
                        </div>
                    </>
                )}
                <div className="border border-gray-200 rounded-md m-4 p-1">
                    <ChatInput messageId={threadId} onSendMessage={handleSendMessage}/>
                </div>
            </div>
    </div>
    );
}
