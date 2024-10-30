import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { FormBuilder } from '@/components/ecrf/FormBuilder';
import { FormPreview } from '@/components/ecrf/FormPreview';
import { FormAnalytics } from '@/components/ecrf/FormAnalytics';
import { generateECRFSuggestions } from '@/lib/ecrf/generators';
import { useToast } from '@/lib/hooks/use-toast';
import type { ECRFForm } from '@/lib/ecrf/types';
import {
  ArrowLeft,
  FileText,
  Brain,
  Loader2,
  Download,
  Share2,
  History,
  Play,
  Save,
  Settings,
} from 'lucide-react';

export function ECRFBuilder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [forms, setForms] = useState<ECRFForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<ECRFForm | null>(null);
  const [activeTab, setActiveTab] = useState<'builder' | 'preview' | 'analytics'>('builder');

  // Get study data from localStorage
  const studyData = JSON.parse(localStorage.getItem('studyData') || '{}');

  const handleGenerate = async () => {
    if (!studyData.title) {
      toast({
        title: 'Study Information Required',
        description: 'Please complete study setup first',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const generatedForms = await generateECRFSuggestions({
        title: studyData.title,
        phase: studyData.phase,
        type: studyData.type,
        therapeuticArea: studyData.therapeuticArea,
        primaryObjective: studyData.primaryObjective,
        endpoints: studyData.endpoints || [],
        procedures: studyData.procedures || [],
        population: {
          inclusion: studyData.inclusionCriteria?.split('\n') || [],
          exclusion: studyData.exclusionCriteria?.split('\n') || [],
        },
      });

      setForms(generatedForms);
      setSelectedForm(generatedForms[0]);
      
      toast({
        title: 'eCRF Generated',
        description: 'Your electronic Case Report Forms are ready for review',
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate eCRF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!selectedForm) return;
    
    try {
      // Save form logic here
      toast({
        title: 'Form Saved',
        description: 'Your eCRF has been saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Save Failed',
        description: 'Failed to save eCRF',
        variant: 'destructive',
      });
    }
  };

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
              <h1 className="text-3xl font-bold">eCRF Builder</h1>
              <p className="text-muted-foreground mt-1">
                Design and manage electronic Case Report Forms
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!selectedForm ? (
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating eCRF...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Generate eCRF
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Test
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline">
                  <History className="h-4 w-4 mr-2" />
                  History
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            )}
          </div>
        </div>

        {!selectedForm && !isGenerating && (
          <Card className="p-12 flex flex-col items-center justify-center text-center">
            <FileText className="h-12 w-12 mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No eCRF Generated Yet</h2>
            <p className="text-muted-foreground mb-6">
              Click "Generate eCRF" to create forms based on your study details
            </p>
            <Button onClick={handleGenerate}>
              <Brain className="h-4 w-4 mr-2" />
              Generate eCRF
            </Button>
          </Card>
        )}

        {selectedForm && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedForm.title}</h2>
                  <p className="text-muted-foreground">
                    Version {selectedForm.version} • {selectedForm.status}
                  </p>
                </div>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Form Settings
                </Button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <Button
                  variant={activeTab === 'builder' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('builder')}
                >
                  Builder
                </Button>
                <Button
                  variant={activeTab === 'preview' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('preview')}
                >
                  Preview
                </Button>
                <Button
                  variant={activeTab === 'analytics' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('analytics')}
                >
                  Analytics
                </Button>
              </div>

              {activeTab === 'builder' && (
                <FormBuilder
                  form={selectedForm}
                  onChange={(updatedForm) => setSelectedForm(updatedForm)}
                />
              )}

              {activeTab === 'preview' && (
                <FormPreview form={selectedForm} />
              )}

              {activeTab === 'analytics' && (
                <FormAnalytics form={selectedForm} />
              )}
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}