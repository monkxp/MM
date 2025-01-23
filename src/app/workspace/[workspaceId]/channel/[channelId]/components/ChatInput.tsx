import { useRef, useState } from "react";

import Editer from "./Editer";
import ToolBar, { AttachmentType } from "./ToolBar";
import { useUploadFile } from "@/features/channels/api/useUploadFile";
import { useSendMessage } from "@/features/channels/api/useSendMessage";
import { useRemoveFile } from "@/features/channels/api/useRemoveFile";
import useChannelId from "@/app/hooks/useChannelId";
import { MDXEditorMethods } from "@mdxeditor/editor";

export type MessageType = {
  message: string;
  attachments?: AttachmentType[];
};

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const [uploadFiles, setUploadFiles] = useState<AttachmentType[]>([]);
  const editorRef = useRef<MDXEditorMethods | null>(null);
  const { mutate: uploadFile } = useUploadFile();
  const { mutate: sendMessage } = useSendMessage();
  const channelId = useChannelId();
  const { mutate: removeFile } = useRemoveFile();

   const setEditorRef = (ref: MDXEditorMethods | null) => {
    editorRef.current = ref;
  };

  const handleSendMessage = () => {
    const content: MessageType = {
      message: message,
    };
    if (uploadFiles.length > 0) {
      content.attachments = uploadFiles;
    }
    sendMessage(
      {
        channelId: channelId,
        content: JSON.stringify(content),
      },
      {
        onSuccess: () => {
          console.log(" message  send success!");
          setMessage("");
          setUploadFiles([]);
        },
      },
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (const file of files) {
        const uploadedFile = await uploadFile({ file });
        if (uploadedFile) {
          setUploadFiles((prev) => [
            ...prev,
            {
              publicUrl: uploadedFile.publicUrl,
              id: uploadedFile.id,
              path: uploadedFile.path,
            },
          ]);
        }
      }
    }
  };

  const handleRemoveFile = (file: AttachmentType) => {
    removeFile(
      { path: file.path },
      {
        onSuccess: () => {
          setUploadFiles((prev) => prev.filter((f) => f.id !== file.id));
        },
      },
    );
  };

  const handleEmojiSelect = (emoji: any) => {
    console.log(emoji);
    editorRef.current?.focus();
    editorRef.current?.insertMarkdown(`${emoji.native}`);
  };

  return (
    <div>
      <Editer
        markdown={message}
        onChange={setMessage}
        onSend={handleSendMessage}
        setEditorRef={setEditorRef}
      />
      <ToolBar
        onEmojiSelect={handleEmojiSelect}
        uploadFiles={uploadFiles}
        message={message}
        handleRemoveFile={handleRemoveFile}
        handleFileChange={handleFileChange}
        onSend={handleSendMessage}
      />
    </div>
  );
}
