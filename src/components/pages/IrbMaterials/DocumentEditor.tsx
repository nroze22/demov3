import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { IrbDocument } from '@/lib/document-generators/irb-materials';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Save,
  Download,
  Share2,
  History,
} from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DocumentEditorProps {
  document: IrbDocument;
  onChange: (content: string) => void;
}

export function DocumentEditor({ document, onChange }: DocumentEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: document.content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none dark:prose-invert focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Document Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-xl font-semibold">{document.title}</h2>
          <div className="flex items-center gap-4 mt-1">
            <Badge variant="outline">Version {document.version}</Badge>
            <span className="text-sm text-muted-foreground">
              Last modified {format(new Date(document.lastModified), 'MMM d, h:mm a')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Editor Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          data-active={editor.isActive('bold')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          data-active={editor.isActive('italic')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          data-active={editor.isActive('heading', { level: 1 })}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          data-active={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          data-active={editor.isActive('bulletList')}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          data-active={editor.isActive('orderedList')}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          data-active={editor.isActive({ textAlign: 'left' })}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          data-active={editor.isActive({ textAlign: 'center' })}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          data-active={editor.isActive({ textAlign: 'right' })}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <ScrollArea className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <EditorContent editor={editor} />
        </div>
      </ScrollArea>

      {/* Collaborators */}
      <div className="flex items-center gap-2 p-2 border-t bg-muted/50">
        <span className="text-sm text-muted-foreground">Collaborators:</span>
        {document.collaborators.map((collaborator) => (
          <Avatar key={collaborator.name} className="h-6 w-6">
            <AvatarImage src={collaborator.avatar} />
            <AvatarFallback>{collaborator.name[0]}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  );
}