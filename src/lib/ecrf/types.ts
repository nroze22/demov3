export interface ECRFField {
  id: string;
  type: 'text' | 'number' | 'date' | 'select' | 'radio' | 'checkbox' | 'textarea';
  label: string;
  name: string;
  required: boolean;
  description?: string;
  placeholder?: string;
  options?: Array<{
    label: string;
    value: string;
  }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    customRule?: string;
  };
  conditional?: {
    field: string;
    operator: '==' | '!=' | '>' | '<' | '>=' | '<=';
    value: string;
  };
}

export interface ECRFSection {
  id: string;
  title: string;
  description?: string;
  fields: ECRFField[];
  repeatable?: boolean;
  conditional?: {
    field: string;
    operator: '==' | '!=' | '>' | '<' | '>=' | '<=';
    value: string;
  };
}

export interface ECRFForm {
  id: string;
  title: string;
  description: string;
  version: string;
  status: 'draft' | 'published' | 'archived';
  sections: ECRFSection[];
  validation: {
    rules: Array<{
      id: string;
      description: string;
      condition: string;
      severity: 'error' | 'warning' | 'info';
    }>;
  };
  metadata?: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}

export interface FormAnalysis {
  score: number;
  suggestions: Array<{
    id: string;
    type: 'error' | 'warning' | 'improvement';
    message: string;
    field?: string;
    section?: string;
    action?: {
      type: 'add' | 'remove' | 'modify';
      details: any;
    };
  }>;
  performance: {
    completionTime: number;
    errorRate: number;
    missingDataRate: number;
  };
  dataQuality: {
    consistency: number;
    completeness: number;
    accuracy: number;
  };
}