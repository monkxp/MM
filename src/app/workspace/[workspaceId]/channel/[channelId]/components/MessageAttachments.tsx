import Image from "next/image";

import { ImageIcon, FileIcon } from "lucide-react";
import { BsFillFilePdfFill } from "react-icons/bs";
import { useState } from "react";
import { getAttachmentName } from "@/lib/utils";
import PDFPreview from "./PDFPreview";

type Attachment = {
  id: string;
  path: string;
  publicUrl: string;
};

export default function MessageAttachments({
  attachments,
}: {
  attachments: any;
}) {
  if (!attachments?.length) return null;

  return (
    <div className="mt-2 flex flex-col gap-2">
      {attachments.map((attachment: Attachment) => (
        <div
          key={attachment.id}
          className="max-h-[320px] max-w-[480px] overflow-y-auto"
        >
          <div className="mb-1 flex items-center gap-1 truncate text-sm text-gray-500">
            {getAttachmentName(attachment.path)}
          </div>

          <a
            href={attachment.publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            {isPreviewable(attachment.path) ? (
              <PreviewableFile attachment={attachment} />
            ) : (
              <NonPreviewableFile attachment={attachment} />
            )}
          </a>
        </div>
      ))}
    </div>
  );
}

function PreviewableFile({ attachment }: { attachment: Attachment }) {
  const [aspectRatio, setAspectRatio] = useState<number>(3 / 4);
  if (
    attachment.path.endsWith(".png") ||
    attachment.path.endsWith(".jpg") ||
    attachment.path.endsWith(".jpeg")
  ) {
    return (
      <div className="max-w-[320px]">
        <div
          className="relative w-full"
          style={{ paddingBottom: `${(1 / aspectRatio) * 100}%` }}
        >
          <Image
            src={attachment.publicUrl}
            alt={getAttachmentName(attachment.path) || "attachment file"}
            fill
            className="rounded-lg object-contain"
            sizes="(max-width: 768px) 100vw, 320px"
            onLoad={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              setAspectRatio(
                e.currentTarget?.naturalWidth / e.currentTarget?.naturalHeight,
              );
            }}
          />
        </div>
      </div>
    );
  }

  if (attachment.path.endsWith(".pdf")) {
    return (
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="flex flex-row items-center justify-start gap-2 bg-gray-50 p-4">
          <BsFillFilePdfFill className="h-8 w-8 text-red-500" />
          <p className="truncate text-sm font-medium">
            {getAttachmentName(attachment.path)}
          </p>
        </div>
        <div className="bg-white p-3">
          <div className="flex items-center gap-2">
            <PDFPreview url={attachment.publicUrl} />
          </div>
        </div>
      </div>
    );
  }

  // Add more previewable types here
  return <NonPreviewableFile attachment={attachment} />;
}

function NonPreviewableFile({ attachment }: { attachment: Attachment }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="flex items-center gap-2">
        <FileTypeIcon type={attachment.path} />
        <span className="text-sm">{getAttachmentName(attachment.path)}</span>
      </div>
    </div>
  );
}

function FileTypeIcon({ type }: { type: string }) {
  if (type.endsWith(".png") || type.endsWith(".jpg") || type.endsWith(".jpeg"))
    return <ImageIcon className="h-5 w-5 text-blue-500" />;
  if (type.endsWith(".pdf"))
    return <BsFillFilePdfFill className="h-5 w-5 text-red-500" />;
  // Add more specific icons for different file types
  return <FileIcon className="h-5 w-5 text-gray-500" />;
}

function isPreviewable(type: string): boolean {
  return (
    type.endsWith(".png") ||
    type.endsWith(".jpg") ||
    type.endsWith(".jpeg") ||
    type.endsWith(".pdf")
  );
}
