import useGetUser from "@/app/(auth-pages)/api/useUser";
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
    <div className="group flex flex-row gap-4 px-6 py-2 hover:bg-gray-100">
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
      <div className={`relative flex-1 ${!showHeader && "ml-14"}`}>
        {showHeader && (
          <div className="flex items-baseline gap-2">
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
