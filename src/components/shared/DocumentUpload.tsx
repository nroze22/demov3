import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  isUploading?: boolean;
  acceptedFileTypes?: string;
  maxFileSize?: number;
}

export function DocumentUpload({
  onFileUpload,
  isUploading = false,
  acceptedFileTypes = '.pdf,.doc,.docx,.txt',
  maxFileSize = 10
}: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      if (file.size > maxFileSize * 1024 * 1024) {
        continue;
      }
      await handleFileProcess(file);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    for (const file of selectedFiles) {
      if (file.size > maxFileSize * 1024 * 1024) {
        continue;
      }
      await handleFileProcess(file);
    }
  };

  const handleFileProcess = async (file: File) => {
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
    } catch (error) {
      setFiles(prev =>
        prev.map(f =>
          f.id === newFile.id
            ? { ...f, status: 'error' }
            : f
        )
      );
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

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div
        className={`relative flex flex-col items-center justify-center w-full h-48 rounded-lg border-2 border-dashed transition-colors cursor-pointer
          ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
          hover:border-primary hover:bg-primary/5`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          className="hidden"
          multiple
          accept={acceptedFileTypes}
          onChange={handleFileSelect}
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center text-center p-6">
          <Upload className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-sm font-medium mb-1">
            Drag and drop your files here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supported files: {acceptedFileTypes} (max {maxFileSize}MB)
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center p-3 bg-card rounded-lg border shadow-sm"
            >
              <File className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
                {file.status === 'uploading' && (
                  <Progress value={file.progress} className="h-1 mt-2" />
                )}
              </div>
              {file.status === 'complete' ? (
                <CheckCircle className="h-5 w-5 text-green-500 ml-3 flex-shrink-0" />
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="ml-3"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}