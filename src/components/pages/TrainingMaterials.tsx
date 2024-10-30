import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/lib/hooks/use-toast';
import {
  ArrowLeft,
  GraduationCap,
  Users,
  FileText,
  Brain,
  Save,
  Download,
  Share2,
  History,
  Play,
  PlusCircle,
  Settings,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TrainingModule {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'document';
  content: string;
  status: 'draft' | 'published';
  duration: number;
  targetAudience: string[];
  objectives: string[];
  lastModified: Date;
}

// Changed to named export to match the import in Routes.tsx
export function TrainingMaterials() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string>('');
  const [generatingStatus, setGeneratingStatus] = useState<number>(0);
  const [activeModule, setActiveModule] = useState<TrainingModule | null>(null);
  const [modules, setModules] = useState<TrainingModule[]>([]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: activeModule?.content || '',
    onUpdate: ({ editor }) => {
      if (activeModule) {
        setActiveModule({
          ...activeModule,
          content: editor.getHTML(),
          lastModified: new Date(),
        });
      }
    },
  });

  const trainingTypes = [
    { value: 'protocol', label: 'Protocol Training' },
    { value: 'safety', label: 'Safety Procedures' },
    { value: 'regulatory', label: 'Regulatory Compliance' },
    { value: 'crf', label: 'CRF Completion' },
    { value: 'adverse', label: 'Adverse Event Reporting' },
  ];

  const audiences = [
    { value: 'investigators', label: 'Principal Investigators' },
    { value: 'coordinators', label: 'Study Coordinators' },
    { value: 'nurses', label: 'Research Nurses' },
    { value: 'pharmacists', label: 'Clinical Pharmacists' },
    { value: 'monitors', label: 'Clinical Research Associates' },
  ];

  const generateTrainingContent = async () => {
    if (!selectedType) {
      toast({
        title: 'Selection Required',
        description: 'Please select a training type to continue',
        variant: 'destructive',
      });
      return;
    }

    setGeneratingStatus(0);
    const steps = 4; // Content generation steps

    // Step 1: Generate learning objectives
    await simulateProgress(25);
    
    // Step 2: Create main content
    await simulateProgress(50);
    
    // Step 3: Generate assessment questions
    await simulateProgress(75);
    
    // Step 4: Finalize and format
    await simulateProgress(100);

    const newModule: TrainingModule = {
      id: `training-${Date.now()}`,
      title: `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Training`,
      type: 'document',
      content: generateSampleContent(selectedType),
      status: 'draft',
      duration: 30,
      targetAudience: ['investigators', 'coordinators'],
      objectives: [
        'Understand key protocol requirements',
        'Identify safety reporting procedures',
        'Demonstrate compliance knowledge'
      ],
      lastModified: new Date(),
    };

    setModules(prev => [...prev, newModule]);
    setActiveModule(newModule);

    toast({
      title: 'Training Module Generated',
      description: 'Your training content is ready for review',
    });
  };

  const simulateProgress = async (target: number) => {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        setGeneratingStatus(current => {
          if (current >= target) {
            clearInterval(interval);
            resolve();
            return target;
          }
          return current + 1;
        });
      }, 20);
    });
  };

  const generateSampleContent = (type: string) => {
    return `
      <h1>Training Module: ${type.charAt(0).toUpperCase() + type.slice(1)}</h1>
      <h2>Learning Objectives</h2>
      <ul>
        <li>Understand key aspects of ${type}</li>
        <li>Implement best practices</li>
        <li>Maintain compliance standards</li>
      </ul>
      <h2>Content Overview</h2>
      <p>This training module covers essential information about ${type}...</p>
    `;
  };

  const saveModule = () => {
    if (activeModule) {
      setModules(prev =>
        prev.map(mod =>
          mod.id === activeModule.id ? activeModule : mod
        )
      );
      toast({
        title: 'Module Saved',
        description: 'Your changes have been saved successfully',
      });
    }
  };

  const publishModule = () => {
    if (activeModule) {
      const updatedModule = { ...activeModule, status: 'published' as const };
      setActiveModule(updatedModule);
      setModules(prev =>
        prev.map(mod =>
          mod.id === activeModule.id ? updatedModule : mod
        )
      );
      toast({
        title: 'Module Published',
        description: 'Training module is now available to participants',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold">Training Materials Generator</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Training Configuration</h2>
          
          <div className="space-y-4">
            <div>
              <Label>Training Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select training type..." />
                </SelectTrigger>
                <SelectContent>
                  {trainingTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={generateTrainingContent}
              disabled={!selectedType || generatingStatus > 0}
              className="w-full"
            >
              <Brain className="h-4 w-4 mr-2" />
              Generate Training Content
            </Button>

            {generatingStatus > 0 && generatingStatus < 100 && (
              <div className="space-y-2">
                <Progress value={generatingStatus} />
                <p className="text-sm text-muted-foreground">
                  Generating training content... {Math.round(generatingStatus)}%
                </p>
              </div>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Training Modules</h3>
            <div className="space-y-2">
              {modules.map(mod => (
                <Button
                  key={mod.id}
                  variant={activeModule?.id === mod.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveModule(mod)}
                >
                  <ModuleIcon type={mod.type} className="h-4 w-4 mr-2" />
                  {mod.title}
                  {mod.status === 'published' && (
                    <CheckCircle className="h-3 w-3 ml-2 text-green-500" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          {activeModule ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{activeModule.title}</h2>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {activeModule.duration} minutes
                    <Target className="h-4 w-4 ml-4 mr-1" />
                    {activeModule.targetAudience.join(', ')}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={saveModule}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button 
                    variant={activeModule.status === 'published' ? 'secondary' : 'default'}
                    size="sm"
                    onClick={publishModule}
                    disabled={activeModule.status === 'published'}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {activeModule.status === 'published' ? 'Published' : 'Publish'}
                  </Button>
                </div>
              </div>

              <div className="prose max-w-none">
                <EditorContent editor={editor} />
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a training module to edit or generate new content
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

const ModuleIcon = ({ type, className }: { type: TrainingModule['type']; className?: string }) => {
  switch (type) {
    case 'video':
      return <Play className={className} />;
    case 'quiz':
      return <FileText className={className} />;
    default:
      return <FileText className={className} />;
  }
};