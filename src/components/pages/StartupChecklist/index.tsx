import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StudySetupForm } from './StudySetupForm';
import { ChecklistView } from './ChecklistView';
import { Header } from '@/components/layout/Header';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';
import { generateStartupChecklist } from '@/lib/checklist-generators/startup-checklist';

interface StudySetupValues {
  monitoringFrequency: string;
  siteReadiness: string;
  regulatoryTimeline: string;
  budgetDetails: string;
  vendorRequirements: string;
}

export function StartupChecklist() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checklist, setChecklist] = useState<any>(null);

  const handleSubmit = async (data: StudySetupValues) => {
    setIsSubmitting(true);
    try {
      // Get existing study data
      const studyData = JSON.parse(localStorage.getItem('studyData') || '{}');
      
      // Combine with form data
      const combinedData = {
        ...studyData,
        ...data
      };

      // Generate checklist
      const generatedChecklist = await generateStartupChecklist(combinedData);
      setChecklist(generatedChecklist);
      
      toast({
        title: 'Checklist Generated',
        description: 'Your study startup checklist has been created successfully.',
      });
    } catch (error) {
      console.error('Failed to generate checklist:', error);
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate checklist. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-24">
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
            <h1 className="text-3xl font-bold">Study Startup Checklist</h1>
            <p className="text-muted-foreground mt-1">
              Generate a comprehensive checklist for your study startup process
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {!checklist ? (
            <StudySetupForm 
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          ) : (
            <ChecklistView 
              checklist={checklist}
              onReset={() => setChecklist(null)}
            />
          )}
        </div>
      </main>
    </div>
  );
}