"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, Heading1, Heading2, Quote, Undo, Redo, Code } from "lucide-react";

interface ContentEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "<p>Commencez à rédiger votre leçon ici...</p>",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none p-4 min-h-[300px] border border-t-0 border-border-brand rounded-b-sm bg-white text-text-dark text-sm leading-relaxed"
      }
    }
  });

  if (!editor) return null;

  return (
    <div className="border border-border-brand rounded-sm overflow-hidden flex flex-col font-sans">
      {/* Toolbar */}
      <div className="bg-beige-light border-b border-border-brand p-2 flex flex-wrap gap-1 items-center">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1.5 rounded-sm hover:bg-beige-base transition-colors ${editor.isActive("bold") ? "bg-green-mid/20 text-green-dark" : "text-text-mid"}`}
          title="Gras"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded-sm hover:bg-beige-base transition-colors ${editor.isActive("italic") ? "bg-green-mid/20 text-green-dark" : "text-text-mid"}`}
          title="Italique"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded-sm hover:bg-beige-base transition-colors ${editor.isActive("heading", { level: 1 }) ? "bg-green-mid/20 text-green-dark" : "text-text-mid"}`}
          title="Titre 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded-sm hover:bg-beige-base transition-colors ${editor.isActive("heading", { level: 2 }) ? "bg-green-mid/20 text-green-dark" : "text-text-mid"}`}
          title="Titre 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded-sm hover:bg-beige-base transition-colors ${editor.isActive("bulletList") ? "bg-green-mid/20 text-green-dark" : "text-text-mid"}`}
          title="Liste à puces"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded-sm hover:bg-beige-base transition-colors ${editor.isActive("blockquote") ? "bg-green-mid/20 text-green-dark" : "text-text-mid"}`}
          title="Citation"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded-sm hover:bg-beige-base transition-colors ${editor.isActive("codeBlock") ? "bg-green-mid/20 text-green-dark" : "text-text-mid"}`}
          title="Bloc de code"
        >
          <Code className="w-4 h-4" />
        </button>

        <span className="w-px h-5 bg-border-brand mx-2" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-1.5 rounded-sm hover:bg-beige-base text-text-mid disabled:opacity-30"
          title="Annuler"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-1.5 rounded-sm hover:bg-beige-base text-text-mid disabled:opacity-30"
          title="Rétablir"
        >
          <Redo className="w-4 h-4" />
        </button>

        {/* Custom Medical alert shortcuts directly inserting HTML */}
        <span className="w-px h-5 bg-border-brand mx-2" />
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().insertContent(`
              <div class="p-4 border-l-4 border-blue-accent bg-blue-light/35 my-4 rounded-sm text-text-mid text-sm">
                <strong>💡 Note Clinique :</strong> Insérez une astuce ou définition médicale ici.
              </div>
            `).run();
          }}
          className="text-[10px] font-bold uppercase border border-blue-accent/30 bg-blue-light text-blue-dark px-2 py-1 rounded-sm hover:bg-blue-accent hover:text-white transition-colors"
        >
          + Astuce Info
        </button>
        <button
          type="button"
          onClick={() => {
            editor.chain().focus().insertContent(`
              <div class="p-4 border-l-4 border-error-brand bg-red-50 my-4 rounded-sm text-text-mid text-sm">
                <strong>⚠️ Warning Pathologique :</strong> Insérez un risque thérapeutique ou une contre-indication ici.
              </div>
            `).run();
          }}
          className="text-[10px] font-bold uppercase border border-error-brand/35 bg-red-50 text-error-brand px-2 py-1 rounded-sm hover:bg-error-brand hover:text-white transition-colors ml-1"
        >
          + Warning Alerte
        </button>
      </div>

      {/* Content */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default ContentEditor;
