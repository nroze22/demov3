import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Loader2, FileText } from 'lucide-react';

interface ECRFFormProps {
  data: any;
  onFileUpload: (file: File) => Promise<void>;
  isProcessing: boolean;
}

export function ECRFForm({ data, onFileUpload, isProcessing }: ECRFFormProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await onFileUpload(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await onFileUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card
        className={`p-6 ${dragActive ? 'border-primary' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileSelect}
            accept=".txt,.doc,.docx,.pdf"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer"
          >
            <div className="flex flex-col items-center">
              <Upload className="h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">
                Drop patient document here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse
              </p>
            </div>
          </label>
        </div>
      </Card>

      {/* Processing Indicator */}
      {isProcessing && (
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-medium">Processing document...</span>
          </div>
          <Progress value={undefined} className="h-2" />
        </Card>
      )}

      {/* Form Fields */}
      <AnimatePresence>
        {data && (
          <Card className="p-6">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={data.firstName || ''}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={data.lastName || ''}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    value={data.dateOfBirth || ''}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    value={data.gender || ''}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={data.phone || ''}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={data.email || ''}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={data.address || ''}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance">Insurance Provider</Label>
                  <Input
                    id="insurance"
                    value={data.insuranceProvider || ''}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceNumber">Insurance Number</Label>
                  <Input
                    id="insuranceNumber"
                    value={data.insuranceNumber || ''}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </motion.div>
            </div>
          </Card>
        )}
      </AnimatePresence>
    </div>
  );
}