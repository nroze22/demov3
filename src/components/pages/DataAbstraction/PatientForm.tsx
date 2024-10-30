import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Patient } from './index';
import { motion, AnimatePresence } from 'framer-motion';

interface PatientFormProps {
  patient: Patient | null;
  stats: {
    fieldsPopulated: number;
    totalFields: number;
    wordsExtracted: number;
    accuracy: number;
    processingTime: number;
  };
  showAnimations: boolean;
}

interface FormField {
  id: string;
  label: string;
  value: string;
  type: 'text' | 'select' | 'date';
  options?: string[];
  required?: boolean;
}

export function PatientForm({ patient, stats, showAnimations }: PatientFormProps) {
  const formRef = useRef<HTMLDivElement>(null);

  const fields: FormField[] = [
    { id: 'firstName', label: 'First Name', value: patient?.firstName || '', type: 'text', required: true },
    { id: 'lastName', label: 'Last Name', value: patient?.lastName || '', type: 'text', required: true },
    { id: 'dateOfBirth', label: 'Date of Birth', value: patient?.dateOfBirth || '', type: 'date', required: true },
    { 
      id: 'gender', 
      label: 'Gender', 
      value: patient?.gender || '', 
      type: 'select',
      options: ['Male', 'Female', 'Other', 'Prefer not to say'],
      required: true 
    },
    { id: 'address', label: 'Address', value: patient?.address || '', type: 'text', required: true },
    { id: 'phone', label: 'Phone', value: patient?.phone || '', type: 'text', required: true },
    { id: 'email', label: 'Email', value: patient?.email || '', type: 'text', required: true },
    { id: 'insuranceProvider', label: 'Insurance Provider', value: patient?.insuranceProvider || '', type: 'text', required: true },
    { id: 'insuranceNumber', label: 'Insurance Number', value: patient?.insuranceNumber || '', type: 'text', required: true }
  ];

  const renderField = (field: FormField) => {
    const baseProps = {
      id: field.id,
      value: field.value,
      onChange: () => {},
      className: "w-full",
      required: field.required
    };

    switch (field.type) {
      case 'select':
        return (
          <Select value={field.value} onValueChange={() => {}}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'date':
        return <Input type="date" {...baseProps} />;
      default:
        return <Input type="text" {...baseProps} />;
    }
  };

  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 gap-6">
        <AnimatePresence>
          {fields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={showAnimations ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={showAnimations && stats.fieldsPopulated > index ? 'ring-2 ring-primary ring-offset-2' : ''}
            >
              <Label htmlFor={field.id} className="block text-sm font-medium mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {renderField(field)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}