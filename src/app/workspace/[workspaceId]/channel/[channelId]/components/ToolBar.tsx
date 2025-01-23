import { useRef, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { PlusIcon, SmileIcon } from "lucide-react";

import Attachments from "./Attachments";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import EmojiPopover from "./EmojiPopover";
import { MDXEditorMethods } from "@mdxeditor/editor";
export type AttachmentType = {
  id: string;
  publicUrl: string;
  path: string;
};

export default function ToolBar({
  message,
  uploadFiles,
  handleFileChange,
  handleRemoveFile,
  onSend,
  onEmojiSelect,
}: {
  message: string;
  uploadFiles: AttachmentType[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: (file: AttachmentType) => void;
  onSend: () => void;
  onEmojiSelect: (emoji: any) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        ref={fileRef}
        hidden
      />
      <div>
        <Attachments files={uploadFiles} onRemove={handleRemoveFile} />
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2">
          <span className="float-start cursor-pointer gap-2">
            <Button
              variant="transparent"
              onClick={() => fileRef.current?.click()}
              className="group p-1"
            >
              <PlusIcon
                style={{ width: "1.5rem", height: "1.5rem" }}
                className="hover:bg-salte m-0 rounded-full bg-gray-200 group-hover:bg-gray-400"
              />
            </Button>
            <EmojiPopover onEmojiSelect={onEmojiSelect}>
              <Button variant="transparent" className="group p-1">
                <SmileIcon
                  style={{ width: "1.5rem", height: "1.5rem" }}
                className="m-0 rounded-full bg-gray-200 group-hover:bg-gray-400"
              />
            </Button>
            </EmojiPopover>
          </span>
        </div>
        <div>
          <Button
            variant="transparent"
            className={cn(
              "mr-2 h-[28px] w-12 bg-green-500 hover:bg-green-600",
              message.length === 0 &&
                "cursor-default bg-transparent hover:bg-transparent",
            )}
            onClick={onSend}
          >
            <IoMdSend
              className={cn(message.length === 0 && "bg-white text-gray-400")}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
