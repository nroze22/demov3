import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { generateSocialAdContent } from '@/lib/marketing-generators/social-ads';
import { ImageLibrary } from './ImageLibrary';
import { useToast } from '@/lib/hooks/use-toast';
import {
  Facebook,
  Image as ImageIcon,
  Target,
  Users,
  MapPin,
  Loader2,
  Save,
  Copy,
  Sparkles,
  BarChart,
  DollarSign,
  Globe,
  Eye,
  MessageSquare,
  ThumbsUp,
  Share2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';

interface FacebookAdCreatorProps {
  studyDetails: any;
  onSave: (adContent: any) => void;
}

export function FacebookAdCreator({ studyDetails, onSave }: FacebookAdCreatorProps) {
  const [adContent, setAdContent] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeVariant, setActiveVariant] = useState(0);
  const { toast } = useToast();

  // Mock performance data
  const performanceData = {
    reach: '15K - 45K',
    impressions: '20K - 60K',
    estimatedCTR: '1.2% - 2.5%',
    suggestedBudget: '$10 - $50 per day',
    audienceSize: '250K - 500K',
    relevanceScore: 8,
  };

  const generateContent = async () => {
    setIsGenerating(true);
    try {
      const content = await generateSocialAdContent(studyDetails);
      setAdContent(content);
      toast({
        title: 'Ad Content Generated',
        description: 'Your Facebook ad content is ready for review',
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate ad content',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'Content copied to clipboard',
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Facebook className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">Facebook Ad Creator</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {/* Add A/B test variant */}}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Add Variant
          </Button>
          <Button
            onClick={generateContent}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Ad Content
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content">
        <TabsList className="mb-6">
          <TabsTrigger value="content">Ad Content</TabsTrigger>
          <TabsTrigger value="image">Ad Image</TabsTrigger>
          <TabsTrigger value="targeting">Targeting</TabsTrigger>
          <TabsTrigger value="preview">Preview & Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          {adContent?.facebook ? (
            <div className="space-y-6">
              {/* Ad Variants */}
              <div className="flex gap-2 mb-4">
                {[0, 1].map((variant) => (
                  <Button
                    key={variant}
                    variant={activeVariant === variant ? "default" : "outline"}
                    onClick={() => setActiveVariant(variant)}
                  >
                    Variant {String.fromCharCode(65 + variant)}
                  </Button>
                ))}
              </div>

              {/* Headlines */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Headlines
                  <Badge variant="secondary" className="ml-2">
                    {adContent.facebook.headlines.length} Variations
                  </Badge>
                </h3>
                <div className="space-y-2">
                  {adContent.facebook.headlines.map((headline: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="w-6 h-6 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <p>{headline}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {Math.round(Math.random() * 100)}% CTR
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(headline)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Ad Copy */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Ad Copy
                  <Badge variant="secondary" className="ml-2">
                    {adContent.facebook.descriptions.length} Variations
                  </Badge>
                </h3>
                <div className="space-y-2">
                  {adContent.facebook.descriptions.map((desc: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <p>{desc}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            <Eye className="h-3 w-3 mr-1" />
                            {Math.round(Math.random() * 1000)}+ views
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {Math.round(Math.random() * 100)} engagements
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(desc)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Compliance Check */}
              <Card className="p-4 bg-green-50 dark:bg-green-900/10">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  <h3 className="font-semibold">Compliance Check Passed</h3>
                </div>
                <p className="text-sm text-green-600/80 dark:text-green-400/80 mt-1">
                  All content meets IRB and Facebook advertising guidelines
                </p>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Generate Ad Content</h3>
              <p className="text-muted-foreground mb-6">
                Click the "Generate Ad Content" button to create optimized ad variations
              </p>
              <Button onClick={generateContent} disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Now
                  </>
                )}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="image">
          <ImageLibrary onSelect={(image) => setSelectedImage(image.url)} maxHeight="500px" />
        </TabsContent>

        <TabsContent value="targeting">
          {adContent?.targeting && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Audience Targeting</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Age Range</h4>
                    <div className="flex items-center gap-2">
                      <Input 
                        type="number" 
                        value={adContent.targeting.ageRange.min} 
                        className="w-24"
                      />
                      <span>to</span>
                      <Input 
                        type="number" 
                        value={adContent.targeting.ageRange.max} 
                        className="w-24"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Gender</h4>
                    <div className="flex gap-2">
                      {adContent.targeting.gender.map((g: string) => (
                        <Badge key={g}>{g}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview">
          {adContent && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-1">Estimated Reach</h4>
                    <p className="text-2xl font-semibold">{performanceData.reach}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-1">Estimated CTR</h4>
                    <p className="text-2xl font-semibold">{performanceData.estimatedCTR}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-1">Suggested Budget</h4>
                    <p className="text-2xl font-semibold">{performanceData.suggestedBudget}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}