import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/lib/hooks/use-toast';
import { generateWithGPT4 } from '@/lib/gpt';
import {
  ArrowLeft,
  Users,
  Target,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Globe,
  Download,
  Copy,
  Loader2,
} from 'lucide-react';

interface RecruitmentMaterial {
  id: string;
  type: string;
  title: string;
  content: string;
  format: string;
}

// Changed to named export to match the import in Routes.tsx
export function RecruitmentMaterials() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [studyTitle, setStudyTitle] = useState('');
  const [targetPopulation, setTargetPopulation] = useState('');
  const [keyInclusion, setKeyInclusion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [materials, setMaterials] = useState<RecruitmentMaterial[]>([]);

  const materialTypes = [
    {
      id: 'print',
      title: 'Print Materials',
      icon: <FileText className="h-5 w-5" />,
      description: 'Flyers, brochures, and posters',
    },
    {
      id: 'digital',
      title: 'Digital Content',
      icon: <Globe className="h-5 w-5" />,
      description: 'Website content and digital ads',
    },
    {
      id: 'social',
      title: 'Social Media',
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Social media posts and campaigns',
    },
    {
      id: 'email',
      title: 'Email Templates',
      icon: <Mail className="h-5 w-5" />,
      description: 'Email outreach templates',
    },
  ];

  const generateMaterials = async () => {
    if (!studyTitle || !targetPopulation || !keyInclusion) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const systemPrompt = `You are an expert in clinical trial recruitment and marketing. Create compelling recruitment materials for the following study:
      Study: ${studyTitle}
      Target Population: ${targetPopulation}
      Key Inclusion Criteria: ${keyInclusion}`;

      const materialsToGenerate = [
        {
          type: 'print',
          title: 'Study Flyer',
          format: 'text',
          prompt: 'Create a compelling flyer text for patient recruitment.',
        },
        {
          type: 'digital',
          title: 'Website Content',
          format: 'text',
          prompt: 'Generate website content for study recruitment page.',
        },
        {
          type: 'social',
          title: 'Social Media Campaign',
          format: 'text',
          prompt: 'Create a series of social media posts for recruitment.',
        },
        {
          type: 'email',
          title: 'Patient Outreach Email',
          format: 'text',
          prompt: 'Write an email template for patient outreach.',
        },
      ];

      const generatedMaterials = await Promise.all(
        materialsToGenerate.map(async (material) => {
          const response = await generateWithGPT4([
            { role: 'system', content: systemPrompt },
            { role: 'user', content: material.prompt },
          ]);

          return {
            id: `${material.type}-${Date.now()}`,
            type: material.type,
            title: material.title,
            content: response || 'Failed to generate content',
            format: material.format,
          };
        })
      );

      setMaterials(generatedMaterials);
      toast({
        title: 'Materials Generated',
        description: 'Your recruitment materials are ready for review',
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate materials',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: 'Copied',
        description: 'Content copied to clipboard',
      });
    } catch (error) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy content',
        variant: 'destructive',
      });
    }
  };

  const downloadMaterial = (material: RecruitmentMaterial) => {
    const blob = new Blob([material.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${material.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        <div>
          <h1 className="text-3xl font-bold">Recruitment Materials Generator</h1>
          <p className="text-muted-foreground mt-1">
            Create targeted recruitment materials for your study
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Study Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="study-title">Study Title</Label>
              <Input
                id="study-title"
                value={studyTitle}
                onChange={(e) => setStudyTitle(e.target.value)}
                placeholder="Enter study title"
              />
            </div>
            <div>
              <Label htmlFor="target-population">Target Population</Label>
              <Input
                id="target-population"
                value={targetPopulation}
                onChange={(e) => setTargetPopulation(e.target.value)}
                placeholder="Describe target population"
              />
            </div>
            <div>
              <Label htmlFor="key-inclusion">Key Inclusion Criteria</Label>
              <Textarea
                id="key-inclusion"
                value={keyInclusion}
                onChange={(e) => setKeyInclusion(e.target.value)}
                placeholder="List key inclusion criteria"
                rows={4}
              />
            </div>
            <Button
              onClick={generateMaterials}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Materials...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Generate Materials
                </>
              )}
            </Button>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Material Types</h3>
            <div className="space-y-2">
              {materialTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex items-center p-3 rounded-lg border"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {type.icon}
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium">{type.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {type.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          {materials.length > 0 ? (
            <Tabs defaultValue="print">
              <TabsList className="grid grid-cols-4">
                {materialTypes.map((type) => (
                  <TabsTrigger
                    key={type.id}
                    value={type.id}
                    className="flex items-center"
                  >
                    {type.icon}
                    <span className="ml-2">{type.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              {materialTypes.map((type) => (
                <TabsContent key={type.id} value={type.id}>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-6">
                      {materials
                        .filter((m) => m.type === type.id)
                        .map((material) => (
                          <Card key={material.id} className="p-6">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-xl font-semibold">
                                {material.title}
                              </h3>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    copyToClipboard(material.content)
                                  }
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => downloadMaterial(material)}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </div>
                            <Textarea
                              value={material.content}
                              readOnly
                              className="min-h-[200px] font-mono text-sm"
                            />
                          </Card>
                        ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="h-[600px] flex items-center justify-center text-center text-muted-foreground">
              <div>
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No Materials Generated Yet</p>
                <p className="text-sm">
                  Fill in the study information and generate materials to get
                  started
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}