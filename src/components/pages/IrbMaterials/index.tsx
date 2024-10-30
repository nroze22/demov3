import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { IrbForm } from './IrbForm';
import { DocumentEditor } from './DocumentEditor';
import { DocumentList } from './DocumentList';
import { useToast } from '@/lib/hooks/use-toast';
import { generateIrbDocuments } from '@/lib/document-generators/irb-materials';
import { IrbDocument } from '@/lib/document-generators/irb-materials';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

function IrbMaterials() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [documents, setDocuments] = useState<IrbDocument[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<IrbDocument | null>(null);
  const [studyData, setStudyData] = useState<any>(null);

  useEffect(() => {
    // Load study data from localStorage
    const savedStudyData = localStorage.getItem('studyData');
    if (savedStudyData) {
      setStudyData(JSON.parse(savedStudyData));
    }
  }, []);

  const handleGenerate = async (irbDetails: any) => {
    if (!studyData) {
      toast({
        title: 'Missing Study Information',
        description: 'Please complete study setup first',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const generatedDocs = await generateIrbDocuments(
        { ...studyData, ...irbDetails },
        (documentId: string, progress: number) => {
          setDocuments(prev =>
            prev.map(doc =>
              doc.id === documentId ? { ...doc, progress } : doc
            )
          );
        }
      );

      setDocuments(generatedDocs);
      setSelectedDocument(generatedDocs[0]);
      
      toast({
        title: 'Documents Generated',
        description: 'Your IRB materials are ready for review',
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate documents',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDocumentUpdate = (documentId: string, content: string) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === documentId
          ? {
              ...doc,
              content,
              lastModified: new Date(),
              versions: [
                {
                  id: `${doc.id}-v${doc.versions.length + 1}`,
                  version: doc.versions.length + 1,
                  createdAt: new Date(),
                  createdBy: {
                    name: 'John Smith',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
                  },
                  status: 'draft'
                },
                ...doc.versions
              ]
            }
          : doc
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
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
            <h1 className="text-3xl font-bold">IRB Materials Generator</h1>
            <p className="text-muted-foreground mt-1">
              Generate comprehensive IRB submission documents
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            {documents.length === 0 ? (
              <div className="bg-card rounded-lg border shadow-sm">
                <IrbForm onSubmit={handleGenerate} isSubmitting={isGenerating} />
              </div>
            ) : (
              <div className="bg-card rounded-lg border shadow-sm">
                <DocumentList
                  documents={documents}
                  selectedId={selectedDocument?.id}
                  onSelect={(doc) => setSelectedDocument(doc)}
                />
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-card rounded-lg border shadow-sm h-[calc(100vh-16rem)]">
              {selectedDocument ? (
                <DocumentEditor
                  document={selectedDocument}
                  onChange={(content) => handleDocumentUpdate(selectedDocument.id, content)}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  {documents.length === 0 ? (
                    <p>Enter IRB details to generate documents</p>
                  ) : (
                    <p>Select a document to view and edit</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export { IrbMaterials };