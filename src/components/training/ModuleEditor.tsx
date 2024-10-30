import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModulePreview } from './ModulePreview';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Save,
  Eye,
} from 'lucide-react';

interface ModuleEditorProps {
  content: string;
  type: 'presentation' | 'quiz' | 'document';
  onChange: (content: string) => void;
  onSave: () => void;
}

export function ModuleEditor({
  content,
  type,
  onChange,
  onSave,
}: ModuleEditorProps) {
  const [activeTab, setActiveTab] = useState('edit');

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setActiveTab('preview')}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        <TabsContent value="edit">
          <div className="border-b pb-4 mb-4">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                data-active={editor.isActive('bold')}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                data-active={editor.isActive('italic')}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                data-active={editor.isActive('heading', { level: 1 })}
              >
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                data-active={editor.isActive('heading', { level: 2 })}
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                data-active={editor.isActive('bulletList')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                data-active={editor.isActive('orderedList')}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <EditorContent editor={editor} className="min-h-[500px] prose max-w-none" />
        </TabsContent>

        <TabsContent value="preview">
          <ModulePreview
            type={type}
            content={{
              title: 'Training Module',
              html: content,
              totalSlides: 10, // Calculate based on content
            }}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}