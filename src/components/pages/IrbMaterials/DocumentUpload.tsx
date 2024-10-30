import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/lib/hooks/use-toast';
import { Upload, File, X, CheckCircle } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
}

interface DocumentUploadProps {
  onFileUpload: (file: File) => Promise<void>;
}

export function DocumentUpload({ onFileUpload }: DocumentUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    for (const file of selectedFiles) {
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'uploading',
      };

      setFiles(prev => [...prev, newFile]);

      try {
        await onFileUpload(file);
        setFiles(prev =>
          prev.map(f =>
            f.id === newFile.id
              ? { ...f, progress: 100, status: 'complete' }
              : f
          )
        );

        toast({
          title: 'File Uploaded',
          description: `${file.name} has been uploaded successfully.`,
        });
      } catch (error) {
        setFiles(prev =>
          prev.map(f =>
            f.id === newFile.id
              ? { ...f, status: 'error' }
              : f
          )
        );

        toast({
          title: 'Upload Failed',
          description: `Failed to upload ${file.name}.`,
          variant: 'destructive',
        });
      }
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF, DOC, DOCX (MAX. 10MB)
              </p>
            </div>
            <input
              id="dropzone-file"
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              multiple
            />
          </label>
        </div>

        {files.length > 0 && (
          <div className="space-y-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center p-4 border rounded-lg"
              >
                <File className="h-8 w-8 text-blue-500 mr-3" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                  {file.status === 'uploading' && (
                    <Progress value={file.progress} className="h-1 mt-2" />
                  )}
                </div>
                {file.status === 'complete' ? (
                  <CheckCircle className="h-5 w-5 text-green-500 ml-3" />
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="ml-3"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}