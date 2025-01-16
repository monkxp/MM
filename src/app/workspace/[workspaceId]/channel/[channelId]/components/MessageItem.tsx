import useGetUser from "@/app/auth/api/useUser";
import { Tables } from "@/lib/schema";
import { formatTime } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MessageAttachments from "./MessageAttachments";

export default function MessageItem({
  message,
  showHeader,
}: {
  message: Tables<"messages">;
  showHeader: boolean;
}) {
  const { data: user, isError, isPending } = useGetUser(message.user_id || "");
  if (isPending) return;
  if (isError) return;
  let content: any = message.content;
  if (typeof content === "string") {
    content = JSON.parse(message.content as string);
  }
  return (
    <div className="flex flex-row gap-4">
      {showHeader && (
        <div className="h-10 w-10 flex-shrink-0">
          <Avatar className="size-10 cursor-pointer transition hover:opacity-80">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-[#160616] text-lg text-white">
              {user?.email?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      <div className={`flex-1 ${!showHeader && "ml-14"}`}>
        {showHeader && (
          <div className="flex items-baseline gap-2">
            <span className="font-semibold">{user?.user_metadata?.name}</span>
            <span className="text-xs text-slate-500">
              {formatTime(new Date(message.created_at))}
            </span>
          </div>
        )}
        <div className="text-sm text-slate-500">
          {content?.message as string}
        </div>
        {content?.attachments && (
          <MessageAttachments attachments={content.attachments} />
        )}
      </div>
    </div>
  );
}
