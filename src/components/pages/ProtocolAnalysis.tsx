import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/lib/hooks/use-toast';
import {
  ArrowLeft,
  Brain,
  AlertCircle,
  CheckCircle,
  FileText,
  Target,
  Users,
  Calendar,
  BarChart,
  Clock,
  Download,
  Upload,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { analyzeProtocol, type AnalysisResult } from '@/lib/protocol-analyzer';

export function ProtocolAnalysis() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a protocol file to analyze",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.match('application/pdf|text/plain|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF, DOC, DOCX, or TXT file",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        if (typeof e.target?.result !== 'string') {
          throw new Error('Failed to read file content');
        }

        const result = await analyzeProtocol(e.target.result);
        setAnalysis(result);
        toast({
          title: "Analysis Complete",
          description: "Protocol analysis is ready for review",
        });
      } catch (error) {
        console.error('Protocol analysis error:', error);
        toast({
          title: "Analysis Failed",
          description: error instanceof Error ? error.message : "Failed to analyze the protocol",
          variant: "destructive",
        });
      } finally {
        setIsAnalyzing(false);
      }
    };

    reader.onerror = () => {
      toast({
        title: "File Read Error",
        description: "Failed to read the protocol file",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    };

    reader.readAsText(file);
  };

  const sections = analysis ? [
    {
      title: "Overview",
      icon: <FileText className="h-5 w-5" />,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Protocol Quality Score</h3>
              <p className="text-sm text-muted-foreground">Based on comprehensive analysis</p>
            </div>
            <div className="text-4xl font-bold text-blue-600">{analysis.score}/100</div>
          </div>
          <Progress value={analysis.score} className="h-2" />
        </div>
      ),
    },
    {
      title: "Suggestions",
      icon: <Brain className="h-5 w-5" />,
      content: (
        <ul className="space-y-4">
          {analysis.suggestions.map((suggestion, i) => (
            <li key={i} className="flex items-start">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500 shrink-0 mt-0.5" />
              <span>{suggestion}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Risks",
      icon: <AlertCircle className="h-5 w-5" />,
      content: (
        <ul className="space-y-4">
          {analysis.risks.map((risk, i) => (
            <li key={i} className="flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500 shrink-0 mt-0.5" />
              <span>{risk}</span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Timeline",
      icon: <Calendar className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="text-lg font-semibold">{analysis.timeline}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h4 className="text-sm font-medium mb-2">Startup Phase</h4>
              <Progress value={analysis.phases.startup.progress} className="h-1" />
              <p className="text-sm text-muted-foreground mt-2">{analysis.phases.startup.duration}</p>
            </Card>
            <Card className="p-4">
              <h4 className="text-sm font-medium mb-2">Enrollment Phase</h4>
              <Progress value={analysis.phases.enrollment.progress} className="h-1" />
              <p className="text-sm text-muted-foreground mt-2">{analysis.phases.enrollment.duration}</p>
            </Card>
            <Card className="p-4">
              <h4 className="text-sm font-medium mb-2">Analysis Phase</h4>
              <Progress value={analysis.phases.analysis.progress} className="h-1" />
              <p className="text-sm text-muted-foreground mt-2">{analysis.phases.analysis.duration}</p>
            </Card>
          </div>
        </div>
      ),
    },
  ] : [];

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
        <h1 className="text-3xl font-bold">Protocol Analysis</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Upload Protocol</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              <input
                type="file"
                id="protocol-upload"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                disabled={isAnalyzing}
              />
              <label
                htmlFor="protocol-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-8 w-8 mb-2 text-gray-400" />
                <span className="text-sm font-medium">
                  Drop protocol file here or click to upload
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  Supports PDF, DOC, DOCX, TXT
                </span>
              </label>
            </div>

            {isAnalyzing && (
              <div className="space-y-2">
                <Progress value={undefined} className="h-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Analyzing protocol...
                </p>
              </div>
            )}
          </div>

          {analysis && (
            <div className="mt-6">
              <Button className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Analysis Report
              </Button>
            </div>
          )}
        </Card>

        <Card className="p-6 lg:col-span-2">
          {analysis ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-6">
                {sections.map((section) => (
                  <TabsTrigger
                    key={section.title.toLowerCase()}
                    value={section.title.toLowerCase()}
                    className="flex items-center"
                  >
                    {section.icon}
                    <span className="ml-2">{section.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              {sections.map((section) => (
                <TabsContent
                  key={section.title.toLowerCase()}
                  value={section.title.toLowerCase()}
                >
                  <ScrollArea className="h-[500px] pr-4">
                    {section.content}
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="h-[500px] flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Upload a protocol to begin analysis</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}