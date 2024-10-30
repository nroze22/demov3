import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { PatientList } from './PatientList';
import { ECRFForm } from './ECRFForm';
import { DocumentViewer } from './DocumentViewer';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/lib/hooks/use-toast';
import { extractPatientData } from '@/lib/ai-extraction';

interface Patient {
  id: string;
  name: string;
  dob: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export function DataAbstraction() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [extractedData, setExtractedData] = useState<any>(null);
  const [sourceDocument, setSourceDocument] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const text = await file.text();
      const data = await extractPatientData(text);
      
      if (!data || Object.keys(data.confidence || {}).length === 0) {
        throw new Error('Failed to extract data from document');
      }

      const newPatient: Patient = {
        id: `patient-${Date.now()}`,
        name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Unknown Patient',
        dob: data.dateOfBirth || 'Unknown DOB',
        status: 'completed'
      };

      setPatients(prev => [...prev, newPatient]);
      setExtractedData(data);
      setSourceDocument(text);
      setSelectedPatient(newPatient.id);

      toast({
        title: 'Document Processed',
        description: 'Patient information extracted successfully',
      });
    } catch (error) {
      console.error('Failed to process document:', error);
      toast({
        title: 'Processing Failed',
        description: error instanceof Error ? error.message : 'Failed to process document',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatient(patientId);
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
              <h1 className="text-3xl font-bold">AI Data Abstraction</h1>
              <p className="text-muted-foreground mt-1">
                Automatically extract and populate patient information
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Patient List */}
          <div className="col-span-3">
            <div className="mb-4">
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <PatientList
              patients={patients}
              selectedId={selectedPatient}
              onSelect={handlePatientSelect}
              searchQuery={searchQuery}
            />
          </div>

          {/* eCRF Form */}
          <div className="col-span-5">
            <ECRFForm
              data={extractedData}
              onFileUpload={handleFileUpload}
              isProcessing={isProcessing}
            />
          </div>

          {/* Document Viewer */}
          <div className="col-span-4">
            <DocumentViewer
              content={sourceDocument}
              extractedData={extractedData}
            />
          </div>
        </div>
      </main>
    </div>
  );
}