import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/lib/hooks/use-toast';
import { processDocuments } from '@/lib/patient-screening/screening-service';
import { ScreeningCriteria, ExtractedPatient, ScreeningStats } from '@/lib/patient-screening/types';
import {
  Upload,
  FileText,
  File,
  X,
  CheckCircle,
  Loader2,
  FolderOpen,
  Brain,
} from 'lucide-react';

interface DocumentUploadProps {
  criteria: ScreeningCriteria;
  onProcessed: (patients: ExtractedPatient[], stats: ScreeningStats) => void;
}

interface UploadedFile {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'complete' | 'error';
  progress: number;
  error?: string;
}

export function DocumentUpload({ criteria, onProcessed }: DocumentUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    addFiles(selectedFiles);
  }, []);

  const addFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles.map(file => ({
      id: `file-${Date.now()}-${file.name}`,
      file,
      status: 'pending',
      progress: 0
    }));

    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const processFiles = async () => {
    if (files.length === 0) {
      toast({
        title: 'No Files',
        description: 'Please add files to process',
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await processDocuments(
        files.map(f => f.file),
        criteria,
        (processed, total) => {
          setProcessingProgress((processed / total) * 100);
        }
      );

      onProcessed(result.patients, result.stats);
      
      toast({
        title: 'Processing Complete',
        description: `Successfully processed ${files.length} documents`
      });
    } catch (error) {
      toast({
        title: 'Processing Failed',
        description: error instanceof Error ? error.message : 'Failed to process documents',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div
          className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
            files.length === 0 ? 'border-muted-foreground/25' : 'border-primary/50'
          }`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Upload className="h-10 w-10 text-primary" />
              </div>
            </motion.div>

            <h3 className="text-lg font-semibold mb-2">
              Drop patient documents here
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Upload medical records, lab reports, clinical notes, or any other relevant documents.
              We support PDF, DOC, DOCX, TXT, and image files.
            </p>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <FileText className="h-4 w-4 mr-2" />
                Select Files
              </Button>
              <Button
                variant="outline"
                onClick={() => document.getElementById('folder-upload')?.click()}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Select Folder
              </Button>
            </div>

            <input
              id="file-upload"
              type="file"
              className="hidden"
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
            />
            <input
              id="folder-upload"
              type="file"
              className="hidden"
              webkitdirectory=""
              onChange={handleFileSelect}
            />
          </div>
        </div>
      </Card>

      {files.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Uploaded Documents</h3>
            <Badge variant="secondary">
              {files.length} file{files.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          <ScrollArea className="h-[300px] mb-6">
            <div className="space-y-2">
              <AnimatePresence>
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center gap-4 p-3 rounded-lg border"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <File className="h-5 w-5 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{file.file.name}</p>
                        {!isProcessing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {file.status === 'processing' && (
                        <Progress value={file.progress} className="h-1 mt-2" />
                      )}
                    </div>

                    {file.status === 'complete' && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                Using AI-powered document analysis
              </span>
            </div>
            <Button
              onClick={processFiles}
              disabled={isProcessing}
              size="lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing Documents ({Math.round(processingProgress)}%)
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Process Documents
                </>
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}