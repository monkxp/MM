import Image from "next/image";

import { XIcon } from "lucide-react";
import { AttachmentType } from "./ToolBar";
import Hint from "@/components/Hint";
import { Button } from "@/components/ui/button";
import useRemoveFile from "@/features/channels/api/useRemoveFile";

export default function Attachment({
  file,
  onRemove,
}: {
  file: AttachmentType;
  onRemove: (file: AttachmentType) => void;
}) {
  const { mutate: removeFile } = useRemoveFile();

  const handleRemoveFile = () => {
    removeFile(
      { path: file.path },
      {
        onSuccess: () => {
          onRemove(file);
        },
      }
    );
  };

  return (
    // TODO: add file type support
    <div className="w-[64px] h-[64px] relative group">
      <div className="relative size-[64px]">
        <Image
          src={file.publicUrl}
          alt={file.path.split("/").pop() || ""}
          className=" object-cover rounded-lg cursor-pointer hover:opacity-80 hover:bg-black/70"
          fill
          sizes="100vw 100vh"
        />
      </div>
      <Hint content="Remove file" side="top">
        <Button
          variant="transparent"
          className="absolute -top-2 -right-2 h-[20px] w-[20px]"
          onClick={handleRemoveFile}
        >
          <div className="absolute right-0 opacity-0 hover:bg-black/100 group-hover:opacity-80 bg-slate-600 rounded-full size-5 flex items-center justify-center cursor-pointer">
            <XIcon className="size-4 text-white" />
          </div>
        </Button>
      </Hint>
    </div>
  );
}
