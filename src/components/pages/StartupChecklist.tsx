import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StudySetupForm } from './StartupChecklist/StudySetupForm';
import { ChecklistView } from './StartupChecklist/ChecklistView';
import { Header } from '@/components/layout/Header';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';

interface StudySetupValues {
  studyTitle: string;
  startDate: Date;
  estimatedDuration: string;
  siteCount: string;
  regulatoryPath: 'IND' | 'IDE' | 'HDE' | 'None';
  fundingSource: string;
  targetEnrollment: string;
  monitoringStrategy: string;
  dataManagement: string;
  safetyReporting: string;
}

// Changed to named export to match the import in Routes.tsx
export function StartupChecklist() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checklist, setChecklist] = useState<any>(null);

  const handleSubmit = async (data: StudySetupValues) => {
    setIsSubmitting(true);
    try {
      // Here we would normally make an API call to generate the checklist
      // For now, we'll simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setChecklist({
        regulatory: [
          { id: 1, title: 'Submit IND Application', status: 'pending', dueDate: '2024-04-15' },
          { id: 2, title: 'IRB Submission', status: 'pending', dueDate: '2024-04-20' },
          // Add more items...
        ],
        startup: [
          { id: 3, title: 'Site Selection', status: 'pending', dueDate: '2024-05-01' },
          { id: 4, title: 'Budget Negotiation', status: 'pending', dueDate: '2024-05-15' },
          // Add more items...
        ],
        // Add more categories...
      });

      toast({
        title: 'Checklist Generated',
        description: 'Your study startup checklist has been created successfully.',
      });
    } catch (error) {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
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
              <h1 className="text-3xl font-bold">Study Startup Checklist</h1>
              <p className="text-muted-foreground mt-1">
                Generate a comprehensive checklist for your study startup process
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-blue-600" />
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