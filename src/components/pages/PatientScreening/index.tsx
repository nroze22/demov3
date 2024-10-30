import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { CriteriaSetup } from './CriteriaSetup';
import { DocumentUpload } from './DocumentUpload';
import { PatientRanking } from './PatientRanking';
import { ScreeningCriteria, ExtractedPatient, ScreeningStats } from '@/lib/patient-screening/types';

type ScreeningStep = 'criteria' | 'upload' | 'results';

const initialCriteria: ScreeningCriteria = {
  inclusion: [],
  exclusion: []
};

export function PatientScreening() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<ScreeningStep>('criteria');
  const [criteria, setCriteria] = useState<ScreeningCriteria>(initialCriteria);
  const [patients, setPatients] = useState<ExtractedPatient[]>([]);
  const [stats, setStats] = useState<ScreeningStats | null>(null);

  const handleCriteriaSubmit = (newCriteria: ScreeningCriteria) => {
    setCriteria(newCriteria);
    setCurrentStep('upload');
  };

  const handleDocumentsProcessed = (
    processedPatients: ExtractedPatient[],
    processedStats: ScreeningStats
  ) => {
    setPatients(processedPatients);
    setStats(processedStats);
    setCurrentStep('results');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'criteria':
        return <CriteriaSetup onSubmit={handleCriteriaSubmit} />;
      case 'upload':
        return (
          <DocumentUpload
            criteria={criteria}
            onProcessed={handleDocumentsProcessed}
          />
        );
      case 'results':
        return stats ? (
          <PatientRanking
            patients={patients}
            criteria={criteria}
            stats={stats}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 pt-28 pb-12">
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
              <h1 className="text-3xl font-bold">AI Patient Screening</h1>
              <p className="text-muted-foreground mt-1">
                Intelligent patient screening and eligibility ranking
              </p>
            </div>
          </div>
        </div>

        {renderStep()}
      </main>
    </div>
  );
}