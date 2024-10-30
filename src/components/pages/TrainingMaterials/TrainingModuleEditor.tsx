import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DocumentEditor } from '@/components/shared/DocumentEditor';
import { PresentationViewer } from '@/components/training/PresentationViewer';
import { QuizViewer } from '@/components/training/QuizViewer';
import { TrainingModule } from '@/lib/document-generators/training-materials';
import {
  Save,
  Download,
  Share2,
  Clock,
  Users,
  Target,
  CheckCircle,
  History,
  Play,
  Edit,
  Eye,
} from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TrainingModuleEditorProps {
  module: TrainingModule;
  onChange: (content: string) => void;
}

export function TrainingModuleEditor({ module, onChange }: TrainingModuleEditorProps) {
  const [activeTab, setActiveTab] = useState('edit');
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');

  const handlePreviewComplete = (data: any) => {
    console.log('Preview completed:', data);
    // Handle quiz completion or presentation end
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">{module.title}</h2>
              <Badge variant="outline" className="text-sm">
                {module.type === 'presentation' ? 'Slides' : module.type === 'quiz' ? 'Quiz' : 'Document'}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {module.status === 'draft' ? 'Draft' : 'Published'}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {module.duration} minutes
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {module.targetAudience.join(', ')}
              </div>
              <div className="flex items-center">
                <Target className="h-4 w-4 mr-1" />
                {module.objectives.length} objectives
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setPreviewMode(prev => prev === 'edit' ? 'preview' : 'edit')}>
              {previewMode === 'edit' ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="objectives">Objectives</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="mt-6">
            {previewMode === 'edit' ? (
              <DocumentEditor
                content={module.content}
                onChange={onChange}
                versions={module.versions}
                collaborators={module.collaborators}
              />
            ) : (
              module.type === 'presentation' ? (
                <PresentationViewer
                  content={module.content}
                  onSlideChange={(indexh, indexv) => {
                    console.log('Slide changed:', { indexh, indexv });
                  }}
                />
              ) : module.type === 'quiz' ? (
                <QuizViewer
                  definition={JSON.parse(module.content)}
                  onComplete={handlePreviewComplete}
                />
              ) : (
                <div className="prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: module.content }} />
              )
            )}
          </TabsContent>

          <TabsContent value="objectives" className="mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Learning Objectives</h3>
              <ul className="space-y-4">
                {module.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Version History</h3>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {module.versions.map((version) => (
                    <div
                      key={version.id}
                      className="flex items-start gap-4 pb-4 border-b last:border-0"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={version.createdBy.avatar} />
                        <AvatarFallback>
                          {version.createdBy.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            Version {version.version}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {version.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {version.createdBy.name} •{' '}
                          {format(version.createdAt, 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}