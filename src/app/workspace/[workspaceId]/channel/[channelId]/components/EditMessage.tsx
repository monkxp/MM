import { Button } from "@/components/ui/button";
import { Tables } from "@/lib/schema";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetUser from "@/app/(auth-pages)/api/useUser";
import Editer from "./Editer";
import { useState } from "react";
import { useUpdateMessage } from "@/features/channels/api/useUpdateMessage";
import { toast } from "sonner";

export default function EditMessage({
  message,
  showHeader,
  setEditMessageId,
  updateMessages,
}: {
  message: Tables<"messages">;
  showHeader: boolean;
  setEditMessageId: (id: string) => void;
  updateMessages: (message: Tables<"messages">) => void;
}) {
  let content: any = message.content;
  if (typeof content === "string") {
    content = JSON.parse(message.content as string);
  }
  const [markdown, setMarkdown] = useState(content.message as string);

  const { mutate: updateMessage, isPending: updatePending } =
    useUpdateMessage();
  const { data: user, isError, isPending } = useGetUser(message.user_id || "");
  if (isPending) return null;
  if (isError) return null;

  const handleSave = () => {
    content.message = markdown;
    updateMessage(
      { messageId: message.id, content: JSON.stringify(content) },
      {
        onSuccess: () => {
          setEditMessageId("");
          updateMessages({
            ...message,
            content: JSON.stringify(content),
          });
          toast.success("Message updated");
        },
      },
    );
  };

  return (
    <div className="group relative flex flex-row gap-4 px-6 py-2 hover:bg-gray-100">
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
      <div
        className={`relative flex-1 rounded-md border p-2 ${!showHeader && "ml-14"}`}
      >
        <Editer markdown={markdown} onChange={setMarkdown} onSend={() => {}} />
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditMessageId("")}
          >
            Cancel
          </Button>
          <Button
            disabled={!markdown || updatePending}
            size="sm"
            className="w-20"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
