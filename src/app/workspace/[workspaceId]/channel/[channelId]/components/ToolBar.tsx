import { useRef } from "react";
import { IoMdSend } from "react-icons/io";
import { PlusIcon } from "lucide-react";

import Attachments from "./Attachments";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
}: {
  message: string;
  uploadFiles: AttachmentType[];
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: (file: AttachmentType) => void;
  onSend: () => void;
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
          <span className="cursor-pointer">
            <Button
              variant="transparent"
              onClick={() => fileRef.current?.click()}
            >
              <PlusIcon
                style={{ width: "1.5rem", height: "1.5rem" }}
                className="bg-gray-200 rounded-full m-0 "
              />
            </Button>
          </span>
        </div>
        <div>
          <Button
            variant="transparent"
            className={cn(
              "bg-green-500 hover:bg-green-600 w-12 h-[28px] mr-2",
              message.length === 0 &&
                "bg-transparent hover:bg-transparent cursor-default"
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
