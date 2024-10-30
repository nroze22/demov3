import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ECRFForm, ECRFField } from '@/lib/ecrf/types';
import {
  Save,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Info,
} from 'lucide-react';

interface FormPreviewProps {
  form: ECRFForm;
}

export function FormPreview({ form }: FormPreviewProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));

    // Clear validation error when field is modified
    if (validationErrors[fieldId]) {
      setValidationErrors(prev => {
        const { [fieldId]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateField = (field: ECRFField, value: any): string | null => {
    if (field.required && !value) {
      return 'This field is required';
    }

    if (field.validation) {
      const { min, max, pattern } = field.validation;

      if (typeof value === 'number') {
        if (min !== undefined && value < min) {
          return `Value must be at least ${min}`;
        }
        if (max !== undefined && value > max) {
          return `Value must be at most ${max}`;
        }
      }

      if (pattern && typeof value === 'string' && !new RegExp(pattern).test(value)) {
        return 'Invalid format';
      }
    }

    return null;
  };

  const validateSection = () => {
    const currentFields = form.sections[currentSection].fields;
    const errors: Record<string, string> = {};

    currentFields.forEach(field => {
      const value = formData[field.id];
      const error = validateField(field, value);
      if (error) {
        errors[field.id] = error;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateSection() && currentSection < form.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSave = () => {
    if (validateSection()) {
      // Save form data
      console.log('Form data:', formData);
    }
  };

  const renderField = (field: ECRFField) => {
    const error = validationErrors[field.id];

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={error ? 'border-red-500' : ''}
            />
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.id}
              value={formData[field.id] || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              className={error ? 'border-red-500' : ''}
            />
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              value={formData[field.id] || ''}
              onValueChange={(value) => handleFieldChange(field.id, value)}
            >
              <SelectTrigger id={field.id} className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {error}
              </p>
            )}
          </div>
        );

      // Add other field types...

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            Section {currentSection + 1} of {form.sections.length}
          </span>
          <Badge variant="outline">
            {form.sections[currentSection].title}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Preview Mode
          </span>
        </div>
      </div>

      {/* Form fields */}
      <Card className="p-6">
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {form.sections[currentSection].fields.map((field) => (
              <div key={field.id}>
                {renderField(field)}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentSection === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Progress
          </Button>
          {currentSection < form.sections.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSave}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Form
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}