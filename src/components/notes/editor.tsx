"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Undo, 
  Redo 
} from "lucide-react";

interface EditorProps {
  content: any;
  onChange: (content: any) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const btnClass = (active: boolean) => `
    p-2 rounded-lg transition-colors 
    ${active ? 'bg-accent text-background shadow-[0_0_10px_rgba(204,255,0,0.4)]' : 'text-foreground/40 hover:bg-white/5 hover:text-foreground'}
  `;

  return (
    <div className="flex flex-wrap items-center gap-1 mb-6 p-1 rounded-xl bg-white/5 border border-white/5">
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={btnClass(editor.isActive('heading', { level: 1 }))}
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive('heading', { level: 2 }))}
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-white/10 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive('bold'))}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive('italic'))}
      >
        <Italic className="w-4 h-4" />
      </button>
      <div className="w-px h-4 bg-white/10 mx-1" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive('bulletList'))}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={btnClass(editor.isActive('orderedList'))}
      >
        <ListOrdered className="w-4 h-4" />
      </button>
      <div className="flex-1" />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className={btnClass(false)}
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className={btnClass(false)}
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function Editor({ content, onChange }: EditorProps) {
  // Ensure content is parsed if it's a string to prevent "code" appearing in editor
  const getInitialContent = () => {
    try {
      if (typeof content === 'string') return JSON.parse(content);
      return content;
    } catch {
      return content;
    }
  };

  const editor = useEditor({
    extensions: [StarterKit],
    content: getInitialContent(),
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] text-foreground/80 leading-relaxed tracking-wide',
      },
    },
  });

  return (
    <div className="w-full">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="glass-card p-8 border-white/5" />
    </div>
  );
}
