import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentUpload } from '@/components/shared/DocumentUpload';
import { Header } from '@/components/layout/Header';
import { useToast } from '@/lib/hooks/use-toast';
import { processDocument, mergeDocumentData } from '@/lib/document-processor';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  FileCheck,
  Building,
  Users,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info,
  ClipboardList,
  FileSearch,
  FileLock,
  Download,
  Upload,
  Sparkles,
} from 'lucide-react';

const therapeuticAreas = [
  'Oncology',
  'Cardiology',
  'Neurology',
  'Immunology',
  'Infectious Disease',
  'Endocrinology',
  'Gastroenterology',
  'Hematology',
  'Psychiatry',
  'Respiratory',
  'Rheumatology',
  'Dermatology',
  'Other'
];

interface StudyDocument {
  name: string;
  type: string;
  status: 'pending' | 'uploaded' | 'optional';
  description: string;
  icon: React.ReactNode;
  enhancesAccuracy?: boolean;
}

const supportedDocuments: StudyDocument[] = [
  {
    name: 'Study Protocol',
    type: 'protocol',
    status: 'optional',
    description: 'Helps generate more accurate IRB materials and training content',
    icon: <FileText className="h-4 w-4" />,
    enhancesAccuracy: true
  },
  {
    name: 'Case Report Forms',
    type: 'crf',
    status: 'optional',
    description: 'Improves data management and monitoring plans',
    icon: <ClipboardList className="h-4 w-4" />,
    enhancesAccuracy: true
  },
  {
    name: 'Informed Consent Forms',
    type: 'consent',
    status: 'optional',
    description: 'Enhances recruitment materials and patient-facing content',
    icon: <Users className="h-4 w-4" />,
    enhancesAccuracy: true
  },
  {
    name: 'Regulatory Documents',
    type: 'regulatory',
    status: 'optional',
    description: 'Helps tailor regulatory compliance requirements',
    icon: <Building className="h-4 w-4" />
  },
  {
    name: 'Monitoring Plan',
    type: 'monitoring',
    status: 'optional',
    description: 'Improves site management recommendations',
    icon: <FileSearch className="h-4 w-4" />
  },
  {
    name: 'Data Management Plan',
    type: 'data',
    status: 'optional',
    description: 'Enhances data handling procedures and requirements',
    icon: <FileLock className="h-4 w-4" />
  }
];

interface StudyData {
  title: string;
  phase: string;
  type: string;
  therapeuticArea: string;
  indication: string;
  patientCount: string;
  duration: string;
  documents: Array<{
    name: string;
    type: string;
  }>;
}

export function StudySetup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; type: string }>>([]);
  const [studyData, setStudyData] = useState<StudyData>({
    title: '',
    phase: '',
    type: '',
    therapeuticArea: '',
    indication: '',
    patientCount: '',
    duration: '',
    documents: []
  });

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const doc = await processDocument(file);
      
      setStudyData(prev => ({
        ...prev,
        ...mergeDocumentData(prev, doc.extractedData),
        documents: [...prev.documents, { name: file.name, type: file.type }]
      }));

      setUploadedFiles(prev => [...prev, { name: file.name, type: file.type }]);
      
      toast({
        title: 'File Processed',
        description: `${file.name} has been processed and data extracted successfully.`,
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Failed to process document. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getDocumentStatus = (type: string) => {
    return uploadedFiles.some(file => file.type.includes(type))
      ? 'uploaded'
      : 'pending';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Upload className="h-4 w-4 text-muted-foreground" />;
      case 'optional':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const calculateProgress = () => {
    const uploadedCount = uploadedFiles.length;
    const totalCount = supportedDocuments.length;
    return (uploadedCount / totalCount) * 100;
  };

  const handleSubmit = () => {
    if (!studyData.title || !studyData.phase || !studyData.type || !studyData.patientCount || !studyData.duration) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    localStorage.setItem('studyData', JSON.stringify(studyData));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Study Setup</h1>
              <p className="text-muted-foreground">
                Let's gather information about your study and required documentation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>Cancel</Button>
              <Button onClick={handleSubmit}>
                Complete Setup
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Study Information */}
            <Card className="p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-8">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Study Information</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="study-title" className="text-sm font-medium">
                    Study Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="study-title"
                    value={studyData.title}
                    onChange={(e) => setStudyData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter the full title of your study"
                    className="h-11 bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="study-phase" className="text-sm font-medium">
                      Study Phase <span className="text-red-500">*</span>
                    </Label>
                    <Select value={studyData.phase} onValueChange={(value) => setStudyData(prev => ({ ...prev, phase: value }))}>
                      <SelectTrigger id="study-phase" className="h-11 bg-background">
                        <SelectValue placeholder="Select phase" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="I">Phase I</SelectItem>
                        <SelectItem value="II">Phase II</SelectItem>
                        <SelectItem value="III">Phase III</SelectItem>
                        <SelectItem value="IV">Phase IV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="study-type" className="text-sm font-medium">
                      Study Type <span className="text-red-500">*</span>
                    </Label>
                    <Select value={studyData.type} onValueChange={(value) => setStudyData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger id="study-type" className="h-11 bg-background">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interventional">Interventional</SelectItem>
                        <SelectItem value="observational">Observational</SelectItem>
                        <SelectItem value="expanded-access">Expanded Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="therapeutic-area" className="text-sm font-medium">
                    Therapeutic Area <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={studyData.therapeuticArea} 
                    onValueChange={(value) => setStudyData(prev => ({ ...prev, therapeuticArea: value }))}
                  >
                    <SelectTrigger id="therapeutic-area" className="h-11 bg-background">
                      <SelectValue placeholder="Select therapeutic area" />
                    </SelectTrigger>
                    <SelectContent>
                      {therapeuticAreas.map(area => (
                        <SelectItem key={area} value={area.toLowerCase()}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="indication" className="text-sm font-medium">
                    Primary Indication <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="indication"
                    value={studyData.indication}
                    onChange={(e) => setStudyData(prev => ({ ...prev, indication: e.target.value }))}
                    placeholder="Primary indication"
                    className="h-11 bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="patient-count" className="text-sm font-medium">
                      Number of Patients <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="patient-count"
                      type="number"
                      min="1"
                      value={studyData.patientCount}
                      onChange={(e) => setStudyData(prev => ({ ...prev, patientCount: e.target.value }))}
                      placeholder="Enter target enrollment"
                      className="h-11 bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="study-duration" className="text-sm font-medium">
                      Study Duration (months) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="study-duration"
                      type="number"
                      min="1"
                      value={studyData.duration}
                      onChange={(e) => setStudyData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="Enter duration"
                      className="h-11 bg-background"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Document Upload */}
            <Card className="p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold">Study Documents</h2>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {uploadedFiles.length} documents uploaded
                  </div>
                )}
              </div>

              <div className="bg-primary/5 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-medium mb-2">Enhance Your Setup</h3>
                    <p className="text-sm text-muted-foreground">
                      To provide the most accurate and comprehensive study startup materials, 
                      you can upload any of the following documents. Our AI will analyze them 
                      to tailor the generated content specifically to your study.
                    </p>
                  </div>
                </div>
              </div>

              <DocumentUpload
                onFileUpload={handleFileUpload}
                isUploading={isUploading}
                acceptedFileTypes=".pdf,.doc,.docx,.txt"
                maxFileSize={10}
              />

              <div className="mt-8">
                <h3 className="text-sm font-medium mb-4">Supported Documents</h3>
                <div className="space-y-3">
                  {supportedDocuments.map((doc) => (
                    <div key={doc.type} className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        {doc.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{doc.name}</h4>
                          {getStatusIcon(getDocumentStatus(doc.type))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {doc.description}
                        </p>
                      </div>
                      {getDocumentStatus(doc.type) === 'uploaded' && (
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}