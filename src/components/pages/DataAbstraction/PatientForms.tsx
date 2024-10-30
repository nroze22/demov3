import { ScrollArea } from '@/components/ui/scroll-area';
import { DocumentDropzone } from './DocumentDropzone';
import { ExtractionStats } from './ExtractionStats';
import { Patient } from './index';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';

// Previous imports remain the same...

const formSections = [
  {
    id: 'demographics',
    title: 'Demographics',
    fields: [
      { id: 'firstName', label: 'First Name', type: 'text', required: true },
      { id: 'lastName', label: 'Last Name', type: 'text', required: true },
      { id: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
      { id: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other', 'Prefer not to say'], required: true },
      { id: 'ssn', label: 'Social Security Number', type: 'text', required: true },
      { id: 'maritalStatus', label: 'Marital Status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'], required: true },
      { id: 'ethnicity', label: 'Ethnicity', type: 'select', options: ['Hispanic or Latino', 'Not Hispanic or Latino'], required: true },
      { id: 'race', label: 'Race', type: 'select', options: ['White', 'Black or African American', 'Asian', 'American Indian or Alaska Native', 'Native Hawaiian or Other Pacific Islander'], required: true },
      { id: 'preferredLanguage', label: 'Preferred Language', type: 'select', options: ['English', 'Spanish', 'Other'], required: true },
      { id: 'occupation', label: 'Occupation', type: 'text', required: false },
      { id: 'employmentStatus', label: 'Employment Status', type: 'select', options: ['Full-time', 'Part-time', 'Unemployed', 'Retired', 'Student'], required: true }
    ]
  },
  {
    id: 'contact',
    title: 'Contact Information',
    fields: [
      { id: 'address1', label: 'Street Address', type: 'text', required: true },
      { id: 'address2', label: 'Apt/Suite', type: 'text', required: false },
      { id: 'city', label: 'City', type: 'text', required: true },
      { id: 'state', label: 'State', type: 'text', required: true },
      { id: 'zipCode', label: 'ZIP Code', type: 'text', required: true },
      { id: 'homePhone', label: 'Home Phone', type: 'text', required: false },
      { id: 'mobilePhone', label: 'Mobile Phone', type: 'text', required: true },
      { id: 'workPhone', label: 'Work Phone', type: 'text', required: false },
      { id: 'email', label: 'Email', type: 'text', required: true },
      { id: 'preferredContact', label: 'Preferred Contact Method', type: 'select', options: ['Home Phone', 'Mobile Phone', 'Work Phone', 'Email'], required: true }
    ]
  },
  {
    id: 'insurance',
    title: 'Insurance Information',
    fields: [
      { id: 'insuranceProvider', label: 'Insurance Provider', type: 'text', required: true },
      { id: 'insuranceNumber', label: 'Insurance Number', type: 'text', required: true },
      { id: 'groupNumber', label: 'Group Number', type: 'text', required: true },
      { id: 'policyHolder', label: 'Policy Holder Name', type: 'text', required: true },
      { id: 'relationship', label: 'Relationship to Patient', type: 'select', options: ['Self', 'Spouse', 'Child', 'Other'], required: true },
      { id: 'secondaryInsurance', label: 'Secondary Insurance Provider', type: 'text', required: false },
      { id: 'secondaryNumber', label: 'Secondary Insurance Number', type: 'text', required: false }
    ]
  }
];

export function PatientForms({ patient, onDocumentDrop, showStats, stats }: PatientFormsProps) {
  return (
    <ScrollArea className="h-[800px]">
      <div className="space-y-6 pr-4">
        {formSections.map((section) => (
          <Card key={section.id} className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <DocumentDropzone onFileDrop={onDocumentDrop} />
              
              {showStats && <ExtractionStats stats={stats} />}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <AnimatePresence>
                {section.fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: showStats && stats.fieldsPopulated > index ? [1, 1.05, 1] : 1
                    }}
                    transition={{ 
                      duration: 0.3,
                      delay: index * 0.1,
                      scale: { duration: 0.2 }
                    }}
                    className={`
                      ${showStats && stats.fieldsPopulated > index ? 
                        'ring-2 ring-primary ring-offset-2 animate-pulse' : ''
                      }
                      bg-background rounded-lg p-3
                    `}
                  >
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select className="w-full h-9 px-3 py-1.5 rounded-md border border-input bg-background text-sm text-foreground">
                        <option value="">Select {field.label}</option>
                        {field.options?.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        className="w-full h-9 px-3 py-1.5 rounded-md border border-input bg-background text-sm text-foreground"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}