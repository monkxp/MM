import Attachment from "./Attachment";
import { AttachmentType } from "./ToolBar";

export default function Attachments({
  files,
  onRemove,
}: {
  files: AttachmentType[];
  onRemove: (file: AttachmentType) => void;
}) {
  return (
    <div className="flex flex-row gap-3 py-2 pl-3">
      {files.map((file) => (
        <Attachment key={file.path} file={file} onRemove={onRemove} />
      ))}
    </div>
  );
}
