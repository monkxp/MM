import { useEffect, useState } from "react";
import { MessageCircleMore, MoreHorizontal, SmilePlus } from "lucide-react";
import { toast } from "sonner";

import useGetUser from "@/app/(auth-pages)/api/useUser";
import { Tables } from "@/lib/schema";
import { formatTime } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageAttachments from "./MessageAttachments";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDeleteMessage } from "@/features/message/api/useDeleteMessage";
import { useAddEmoji } from "@/features/message/api/useAddEmoji";
import { useGetEmojis } from "@/features/message/api/useGetEmojis";
import useConfirm from "@/app/hooks/useConfirm";
import EmojiPopover from "./EmojiPopover";
import { useWorkspaceId } from "@/app/hooks/useWorkspaceId";
import usePanel from "@/app/hooks/usePanel";
import { useUser } from "@/app/hooks/useUser";
import { useRouter } from "next/navigation";

export default function MessageItem({
  message,
  showHeader,
  setEditMessageId,
  deleteMessageById,
  threadCount,
}: {
  message: Tables<"messages">;
  showHeader: boolean;
  setEditMessageId: (id: string) => void;
  deleteMessageById: (messageId: string) => void;
  threadCount?: {id: string, count: number}[];
}) {
  const [emojis, setEmojis] = useState<any[]>([]);
  const { data: user, isError, isPending } = useGetUser(message.user_id || "");
  const { mutate: deleteMessage } = useDeleteMessage();
  const { mutate: addEmoji } = useAddEmoji();
  const { data: emojisData } = useGetEmojis(message.id);
  const workspaceId = useWorkspaceId();
  const { openThread, closeThread, threadId } = usePanel();

  const currentUser = useUser();
  const router = useRouter();

  const isOwner = currentUser?.id === message.user_id;
  const isThread = message.parent_id !== null;

  let threadMessageCount = 0;
  if(threadCount){
    threadMessageCount = threadCount.find(thread => thread.id === message.id)?.count || 0;
  }

  useEffect(() => {
      if (emojisData) {
        setEmojis(emojisData);
    }
  }, [emojisData]);

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete message",
    "Are you sure you want to delete this message?",
  );
  if (isPending) return;
  if (isError) return;
  let content: any = message.content;
  if (typeof content === "string") {
    content = JSON.parse(message.content as string);
  }

  const handleDelete = async () => {
    const isDelete = await confirm();
    if (!isDelete) return;
    deleteMessage(
      { messageId: message.id },
      {
        onSuccess: () => {
          toast.success("Message deleted");
          deleteMessageById(message.id);
        },
      },
    );  
  };

  const handleEmojiSelect = (emoji: any) => {
    addEmoji(
      {
        messageId: message.id,
        workspaceId,
        userId: user?.id,
        emoji: emoji.native,
      },
      {
        onSuccess: (res) => {
          toast.success("Emoji updated");
          if(res&&res.length>0){
            setEmojis((prevEmojis) => [...prevEmojis, res[0]]);
          }
        },
      },
    );
  };

  const handleEmojiClick = (emoji: any) => {
    addEmoji(
      {
        messageId: message.id,
        workspaceId,
        userId: user?.id,
        emoji: emoji,
      },
      {
        onSuccess: () => {
          toast.success("Emoji updated");
          setEmojis(
            (prevEmojis) => 
              prevEmojis.filter((e: any) => e.reaction !== emoji));
        },
      },
    );
  }

  const handleOpenThread = () => {
    openThread(message.id);
  }


  return (
    <div className="group relative flex flex-row gap-4 px-6 py-2 hover:bg-gray-100">
      <ConfirmDialog />
      <div className="invisible absolute -top-2 right-4 group-hover:visible">
        <div className="flex flex-row gap-2 border rounded-md p-1 bg-white">
          <EmojiPopover onEmojiSelect={handleEmojiSelect}>
            <Button  variant="transparent" className="hover:bg-gray-100 p-1">
              <SmilePlus className="size-4 text-gray-500" />
              <span className="text-slate-500">React</span>
            </Button>
          </EmojiPopover>
          {!isThread && (
            <Button variant="transparent" onClick={handleOpenThread} className="hover:bg-gray-100 p-1">
              <MessageCircleMore className="size-4 text-gray-500" />
              <span className="text-slate-500">Reply</span>
            </Button>
          )}
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="transparent">
                <MoreHorizontal className="size-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setEditMessageId(message.id)}
              >
                Edit message
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={handleDelete}>
                Delete message
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {showHeader && (
        <div className="h-10 w-10 flex-shrink-0">
          <Avatar className="size-10 rounded-md cursor-pointer transition hover:opacity-80">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-[#160616] text-lg text-white">
              {user?.email?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      <div className={`flex-1 ${!showHeader && "ml-14"}`}>
        {showHeader && (
          <div className="flex items-center gap-2">
            <span className="font-semibold">{user?.user_metadata?.name}</span>
            <span className="text-xs text-slate-500">
              {formatTime(new Date(message.created_at))}
            </span>
          </div>
        )}
        {!showHeader && (
          <div className="invisible absolute -left-11 bottom-0 top-0 my-auto h-fit text-xs text-gray-500 group-hover:visible">
            {formatTime(new Date(message.created_at)).replace(/\s[AP]M/, "")}
          </div>
        )}
        <div className="flex flex-col text-sm text-slate-500">
          <div className="flex flex-row gap-1 items-center justify-start">
            {content?.message as string}
            {message.is_edited && (
              <span className="text-xs text-gray-500"> (edited)</span>
            )}
          </div>
          {emojis && emojis.length > 0 && (
            <div className="flex flex-row gap-1 items-center">
              {emojis.map((emoji) => (
                <span 
                  key={emoji.id} 
                  className="text-lg cursor-pointer" 
                  onClick={() => handleEmojiClick(emoji.reaction)}
                >
                  {emoji.reaction}
                </span>
              ))}
              <EmojiPopover onEmojiSelect={handleEmojiSelect}>
                <Button 
                  variant="transparent" 
                  onClick={handleOpenThread} 
                className="text-xs text-gray-500 h-[24px] w-[24px] hover:bg-white flex items-center justify-center p-0"
              >
                  <SmilePlus className="size-4 text-gray-500" />
                </Button>
              </EmojiPopover>
            </div>
          )}
        </div>
        {content?.attachments && (
          <MessageAttachments attachments={content.attachments} />
        )}
        {threadMessageCount > 0 && (
          <Button variant="transparent" onClick={handleOpenThread} className="text-xs text-gray-500 hover:bg-white">
            <Avatar className="size-5 rounded-md cursor-pointer transition hover:opacity-80">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-[#160616] text-lg text-white">
              {user?.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500 hover:underline">
              {threadMessageCount} replies
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
