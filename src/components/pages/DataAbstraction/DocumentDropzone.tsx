import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, X } from 'lucide-react';

interface DocumentDropzoneProps {
  onFileDrop: (file: File) => void;
}

export function DocumentDropzone({ onFileDrop }: DocumentDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'text/plain')) {
      await processFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setIsProcessing(false);
    onFileDrop(file);
  };

  return (
    <Card className="p-6">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf,.txt"
          onChange={handleFileSelect}
        />

        <AnimatePresence>
          {!uploadedFile ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Drop patient document here
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse (PDF or TXT files only)
              </p>
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-sm text-primary hover:text-primary/80"
              >
                Select a file
              </label>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{uploadedFile.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              
              {isProcessing ? (
                <div className="w-32">
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}