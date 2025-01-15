"use client";

import {
  MDXEditor,
  MDXEditorMethods,
  headingsPlugin,
  quotePlugin,
  codeBlockPlugin,
  BoldItalicUnderlineToggles,
  UndoRedo,
  toolbarPlugin,
  StrikeThroughSupSubToggles,
  ListsToggle,
  CodeToggle,
  CreateLink,
  linkDialogPlugin,
  linkPlugin,
  Separator,
} from "@mdxeditor/editor";
import { FC } from "react";

interface EditorProps {
  markdown: string;
  editorRef?: React.RefObject<MDXEditorMethods | null>;
  onChange?: (e: string) => void;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const Editor: FC<EditorProps> = ({
  markdown,
  editorRef,
  onChange,
}: EditorProps) => {
  return (
    <MDXEditor
      onChange={onChange}
      ref={editorRef}
      markdown={markdown}
      plugins={[
        headingsPlugin(),
        quotePlugin(),
        codeBlockPlugin(),
        linkDialogPlugin(),
        linkPlugin(),
        toolbarPlugin({
          toolbarClassName: "my-classname",
          toolbarContents: () => (
            <>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <Separator />
              <StrikeThroughSupSubToggles />
              <Separator />
              <CreateLink />
              <Separator />
              <ListsToggle />
              <Separator />
              <CodeToggle />
            </>
          ),
        }),
      ]}
    />
  );
};

export default Editor;
