import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/Header';
import { PosterDesigner } from '@/components/marketing/PosterDesigner';
import { BrochureEditor } from '@/components/marketing/BrochureEditor';
import { FacebookAdCreator } from '@/components/marketing/FacebookAdCreator';
import { useToast } from '@/lib/hooks/use-toast';
import {
  ArrowLeft,
  FileText,
  Layout,
  Facebook,
  Download,
  Share2,
  History,
  Megaphone,
  Palette,
  Target,
  MessageSquare,
} from 'lucide-react';

export function MarketingSuite() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('poster');

  // Get study data from localStorage
  const studyData = JSON.parse(localStorage.getItem('studyData') || '{}');

  const handleSave = (content: any) => {
    toast({
      title: 'Content Saved',
      description: 'Your marketing material has been saved successfully.',
    });
  };

  const marketingTools = [
    {
      id: 'poster',
      title: 'Study Poster',
      icon: <FileText className="h-4 w-4" />,
      description: 'Create professional recruitment posters'
    },
    {
      id: 'brochure',
      title: 'Brochure',
      icon: <Layout className="h-4 w-4" />,
      description: 'Design informative study brochures'
    },
    {
      id: 'social',
      title: 'Social Ads',
      icon: <Facebook className="h-4 w-4" />,
      description: 'Generate social media campaigns'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Marketing Materials</h1>
              <p className="text-muted-foreground mt-1">
                Create professional recruitment and study materials
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline">
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
          </div>
        </div>

        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-6">
              <TabsList className="grid grid-cols-3 w-[400px]">
                {marketingTools.map(tool => (
                  <TabsTrigger 
                    key={tool.id}
                    value={tool.id} 
                    className="flex items-center gap-2"
                  >
                    {tool.icon}
                    {tool.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Target className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Get Feedback
                </Button>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <TabsContent value="poster" className="mt-4">
              <PosterDesigner 
                studyDetails={studyData}
                onSave={handleSave}
              />
            </TabsContent>

            <TabsContent value="brochure" className="mt-4">
              <BrochureEditor
                studyDetails={studyData}
                onSave={handleSave}
              />
            </TabsContent>

            <TabsContent value="social" className="mt-4">
              <FacebookAdCreator
                studyDetails={studyData}
                onSave={handleSave}
              />
            </TabsContent>
          </Tabs>
        </Card>
      </main>
    </div>
  );
}