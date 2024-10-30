export interface ScreeningCriteria {
  inclusion: Array<{
    id: string;
    description: string;
    type: 'age' | 'gender' | 'condition' | 'lab_value' | 'medication' | 'performance_status' | 'biomarker' | 'other';
    value?: string | number;
    unit?: string;
    operator?: 'greater_than' | 'less_than' | 'equal' | 'between' | 'includes' | 'excludes';
    required: boolean;
    category?: 'demographics' | 'medical' | 'laboratory' | 'treatment' | 'other';
  }>;
  exclusion: Array<{
    id: string;
    description: string;
    type: 'condition' | 'medication' | 'lab_value' | 'biomarker' | 'other';
    value?: string | number;
    unit?: string;
    operator?: 'greater_than' | 'less_than' | 'equal' | 'includes' | 'excludes';
    category?: 'medical' | 'laboratory' | 'treatment' | 'other';
  }>;
  demographics?: {
    age?: {
      min?: number;
      max?: number;
      unit: 'years';
    };
    gender?: string[];
    ethnicity?: string[];
    race?: string[];
    language?: string[];
  };
}

export interface ExtractedPatient {
  id: string;
  sourceDocuments: Array<{
    id: string;
    name: string;
    type: string;
    content: string;
    extractedFields: Array<{
      field: string;
      value: string;
      confidence: number;
      sourceText: string;
      location: {
        start: number;
        end: number;
      };
    }>;
  }>;
  matchScore: number;
  criteriaMatches: Array<{
    criteriaId: string;
    matched: boolean;
    confidence: number;
    sourceEvidence: Array<{
      text: string;
      location: {
        documentId: string;
        start: number;
        end: number;
      };
      confidence: number;
    }>;
  }>;
  demographics: {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    age?: number;
    ethnicity?: string;
    race?: string;
    language?: string;
    maritalStatus?: string;
  };
  conditions: Array<{
    name: string;
    date?: string;
    status?: 'active' | 'resolved' | 'chronic';
    severity?: string;
    confidence: number;
    source: {
      documentId: string;
      location: {
        start: number;
        end: number;
      };
    };
  }>;
  medications: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
    route?: string;
    startDate?: string;
    endDate?: string;
    indication?: string;
    confidence: number;
    source: {
      documentId: string;
      location: {
        start: number;
        end: number;
      };
    };
  }>;
  labValues: Array<{
    name: string;
    value: number;
    unit: string;
    date: string;
    referenceRange?: {
      low?: number;
      high?: number;
      unit: string;
    };
    abnormal?: boolean;
    confidence: number;
    source: {
      documentId: string;
      location: {
        start: number;
        end: number;
      };
    };
  }>;
  biomarkers: Array<{
    name: string;
    value: string | number;
    unit?: string;
    date: string;
    interpretation?: string;
    confidence: number;
    source: {
      documentId: string;
      location: {
        start: number;
        end: number;
      };
    };
  }>;
  performanceStatus: Array<{
    scale: 'ECOG' | 'Karnofsky';
    value: string | number;
    date: string;
    confidence: number;
    source: {
      documentId: string;
      location: {
        start: number;
        end: number;
      };
    };
  }>;
  procedures: Array<{
    name: string;
    date: string;
    type?: string;
    outcome?: string;
    confidence: number;
    source: {
      documentId: string;
      location: {
        start: number;
        end: number;
      };
    };
  }>;
}

export interface ScreeningStats {
  totalDocuments: number;
  totalPatients: number;
  processedDocuments: number;
  eligiblePatients: number;
  partiallyEligible: number;
  ineligible: number;
  averageMatchScore: number;
  processingTime: number;
  criteriaMatchRates: {
    [criteriaId: string]: {
      matched: number;
      total: number;
      rate: number;
      confidence: number;
    };
  };
  documentTypes: {
    [type: string]: number;
  };
  extractionQuality: {
    accuracy: number;
    completeness: number;
    confidence: number;
  };
  demographicBreakdown: {
    gender?: { [key: string]: number };
    ageRanges?: { [range: string]: number };
    ethnicity?: { [key: string]: number };
  };
  commonReasons: {
    inclusion: Array<{
      criteriaId: string;
      description: string;
      failureCount: number;
    }>;
    exclusion: Array<{
      criteriaId: string;
      description: string;
      matchCount: number;
    }>;
  };
}

export interface ProcessingOptions {
  confidenceThreshold?: number;
  maxDocumentsPerBatch?: number;
  extractionPriority?: Array<'demographics' | 'conditions' | 'labs' | 'medications' | 'biomarkers'>;
  requireSourceEvidence?: boolean;
  includeFullText?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  ocr?: {
    enabled: boolean;
    quality: 'fast' | 'balanced' | 'accurate';
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
  warnings: Array<{
    field: string;
    message: string;
  }>;
  suggestions: Array<{
    field: string;
    message: string;
    action?: string;
  }>;
}

export interface MatchEvidence {
  criteriaId: string;
  matched: boolean;
  confidence: number;
  evidence: Array<{
    text: string;
    source: {
      documentId: string;
      location: {
        start: number;
        end: number;
      };
    };
    field: string;
    value: any;
    confidence: number;
  }>;
  reasoning: string;
}

export interface ProcessingResult {
  patient: ExtractedPatient;
  stats: {
    processingTime: number;
    documentsProcessed: number;
    fieldsExtracted: number;
    confidence: number;
  };
  validation: ValidationResult;
  evidence: MatchEvidence[];
}</content></file>
</boltArtifact>

Let me know if you need me to implement any other files or make any adjustments to improve the patient screening functionality. I can help make it more comprehensive and polished.Let me fix the issue with the blank page. The problem is that we need to properly handle the step transitions and initial state in the PatientScreening component.

<boltArtifact id="fix-patient-screening" title="Fix Patient Screening Component">
<boltAction type="file" filePath="src/components/pages/PatientScreening/index.tsx">
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