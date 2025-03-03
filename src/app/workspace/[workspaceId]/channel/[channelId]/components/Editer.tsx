import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import { MDXEditorMethods } from "@mdxeditor/editor";

const EditorComp = dynamic(() => import("./EditorComponent"), { ssr: false });

export default function Editer({
  onChange,
  markdown,
  onSend,
  setEditorRef,
}: {
  onChange: (e: string) => void;
  markdown: string;
  onSend: () => void;
  setEditorRef: (ref: MDXEditorMethods | null) => void;
}) {
  const editorRef = useRef<MDXEditorMethods | null>(null);

  editorRef.current?.setMarkdown(markdown);

  useEffect(() => {
    if (!editorRef.current) return;
    setEditorRef(editorRef.current);
  }, [editorRef.current]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && e.altKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Suspense fallback={null}>
      <div onKeyDown={handleKeyDown}>
        <EditorComp
          markdown={markdown}
          onChange={onChange}
          editorRef={editorRef}
        />
      </div>
    </Suspense>
  );
}
