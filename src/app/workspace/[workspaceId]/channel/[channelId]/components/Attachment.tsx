import Image from "next/image";
import { useEffect, useState } from "react";

import { AttachmentType } from "./ToolBar";
import useRemoveFile from "@/features/channels/api/useRemoveFile";
import { getFileType } from "@/lib/utils";
import { BsFillFilePdfFill } from "react-icons/bs";
import { FaFileAlt } from "react-icons/fa";
import AttachmentContainer from "./AttachmentContainer";
import { getAttachmentName } from "@/lib/utils";

export default function Attachment({
  file,
  onRemove,
}: {
  file: AttachmentType;
  onRemove: (file: AttachmentType) => void;
}) {
  const { mutate: removeFile } = useRemoveFile();
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    const fileType = getFileType(file.path);
    setFileType(fileType);
  }, [file]);

  const handleRemoveFile = () => {
    removeFile(
      { path: file.path },
      {
        onSuccess: () => {
          onRemove(file);
        },
      },
    );
  };

  if (fileType === "image") {
    return (
      <AttachmentContainer onRemove={handleRemoveFile}>
        <ImageAttachment file={file} />
      </AttachmentContainer>
    );
  }

  if (fileType === "pdf") {
    return (
      <AttachmentContainer onRemove={handleRemoveFile}>
        <PDFAttachment file={file} />
      </AttachmentContainer>
    );
  }

  return (
    <AttachmentContainer onRemove={handleRemoveFile}>
      <FileAttachment file={file} />
    </AttachmentContainer>
  );
}

function PDFAttachment({ file }: { file: AttachmentType }) {
  return (
    <div className="flex h-[48px] w-[168px] flex-row rounded-md border border-gray-200">
      <div className="flex h-[48px] w-[48px] items-center justify-center">
        <BsFillFilePdfFill
          style={{ width: "32px", height: "32px" }}
          className="text-red-500"
        />
      </div>
      <div className="flex w-[120px] flex-col justify-center">
        <p className="truncate text-sm font-medium">
          {getAttachmentName(file.path)}
        </p>
        <p className="text-xs text-gray-500">PDF</p>
      </div>
    </div>
  );
}

function ImageAttachment({ file }: { file: AttachmentType }) {
  return (
    <div className="relative size-[64px]">
      <Image
        src={file.publicUrl}
        alt={file.path.split("/").pop() || ""}
        className="cursor-pointer rounded-lg object-cover hover:bg-black/70 hover:opacity-80"
        fill
        sizes="100vw 100vh"
      />
    </div>
  );
}

function FileAttachment({ file }: { file: AttachmentType }) {
  return (
    <div className="flex h-[48px] w-[168px] flex-row rounded-md border border-gray-200">
      <div className="flex h-[48px] w-[48px] items-center justify-center">
        <FaFileAlt
          style={{ width: "32px", height: "32px" }}
          className="text-gray-500"
        />
      </div>
      <div className="flex w-[120px] flex-col justify-center">
        <p className="truncate text-sm font-medium">
          {getAttachmentName(file.path)}
        </p>
        <p className="text-xs text-gray-500">File</p>
      </div>
    </div>
  );
}
