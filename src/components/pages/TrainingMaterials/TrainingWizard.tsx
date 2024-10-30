import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/lib/hooks/use-toast';
import {
  GraduationCap,
  Users,
  Clock,
  Target,
  FileText,
  Presentation,
  BrainCircuit,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle,
} from 'lucide-react';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: WizardStep[] = [
  {
    id: 'type',
    title: 'Training Type',
    description: 'Select the type of training material to create',
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    id: 'audience',
    title: 'Target Audience',
    description: 'Define who will be taking this training',
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: 'objectives',
    title: 'Learning Objectives',
    description: 'Set clear learning goals and outcomes',
    icon: <Target className="h-5 w-5" />,
  },
  {
    id: 'format',
    title: 'Content Format',
    description: 'Choose how to present the material',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: 'details',
    title: 'Training Details',
    description: 'Specify duration and assessment options',
    icon: <Clock className="h-5 w-5" />,
  },
];

const trainingTypes = [
  {
    id: 'protocol',
    title: 'Protocol Training',
    description: 'Comprehensive overview of study protocol',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: 'safety',
    title: 'Safety Procedures',
    description: 'Safety monitoring and reporting requirements',
    icon: <Shield className="h-5 w-5" />,
  },
  {
    id: 'consent',
    title: 'Informed Consent',
    description: 'Consent process and documentation',
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: 'data',
    title: 'Data Collection',
    description: 'CRF completion and data entry procedures',
    icon: <Database className="h-5 w-5" />,
  },
  {
    id: 'regulatory',
    title: 'Regulatory Training',
    description: 'Compliance and regulatory requirements',
    icon: <Building className="h-5 w-5" />,
  },
];

const audienceTypes = [
  { id: 'investigators', label: 'Principal Investigators' },
  { id: 'coordinators', label: 'Study Coordinators' },
  { id: 'nurses', label: 'Research Nurses' },
  { id: 'monitors', label: 'Clinical Research Associates' },
  { id: 'pharmacists', label: 'Clinical Pharmacists' },
  { id: 'lab', label: 'Laboratory Personnel' },
  { id: 'data', label: 'Data Management Team' },
  { id: 'regulatory', label: 'Regulatory Staff' },
];

const contentFormats = [
  {
    id: 'presentation',
    title: 'Interactive Presentation',
    description: 'Engaging slides with speaker notes',
    icon: <Presentation className="h-5 w-5" />,
    features: ['Animations', 'Speaker Notes', 'Progress Tracking'],
  },
  {
    id: 'document',
    title: 'Training Document',
    description: 'Detailed written documentation',
    icon: <FileText className="h-5 w-5" />,
    features: ['Printable', 'Searchable', 'Reference Material'],
  },
  {
    id: 'quiz',
    title: 'Assessment Quiz',
    description: 'Knowledge verification test',
    icon: <BrainCircuit className="h-5 w-5" />,
    features: ['Scoring', 'Certificate', 'Results Tracking'],
  },
];

export function TrainingWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    type: '',
    audience: [] as string[],
    objectives: [] as string,
    format: '',
    details: {
      duration: '',
      passingScore: '',
      certificateRequired: false,
      trackCompletion: true,
    },
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // Call training generation service
      toast({
        title: 'Training Material Generated',
        description: 'Your training content is ready for review',
      });
    } catch (error) {
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate training material',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'type':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainingTypes.map((type) => (
              <Button
                key={type.id}
                variant={formData.type === type.id ? 'default' : 'outline'}
                className="h-auto p-4 justify-start"
                onClick={() => setFormData({ ...formData, type: type.id })}
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    {type.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{type.title}</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {type.description}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        );

      case 'audience':
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {audienceTypes.map((audience) => (
                <Button
                  key={audience.id}
                  variant={formData.audience.includes(audience.id) ? 'default' : 'outline'}
                  onClick={() => {
                    const newAudience = formData.audience.includes(audience.id)
                      ? formData.audience.filter(a => a !== audience.id)
                      : [...formData.audience, audience.id];
                    setFormData({ ...formData, audience: newAudience });
                  }}
                >
                  {audience.label}
                </Button>
              ))}
            </div>
            
            <div className="mt-4">
              <Label>Additional Audience Requirements</Label>
              <Textarea
                placeholder="Enter any specific requirements or prerequisites for the audience..."
                className="mt-2"
              />
            </div>
          </div>
        );

      case 'objectives':
        return (
          <div className="space-y-4">
            <div>
              <Label>Learning Objectives</Label>
              <div className="mt-2 space-y-2">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={objective}
                      onChange={(e) => {
                        const newObjectives = [...formData.objectives];
                        newObjectives[index] = e.target.value;
                        setFormData({ ...formData, objectives: newObjectives });
                      }}
                      placeholder={`Objective ${index + 1}`}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const newObjectives = formData.objectives.filter((_, i) => i !== index);
                        setFormData({ ...formData, objectives: newObjectives });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      objectives: [...formData.objectives, '']
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Objective
                </Button>
              </div>
            </div>

            <div>
              <Label>Success Criteria</Label>
              <Textarea
                placeholder="Define how learning objectives will be measured..."
                className="mt-2"
              />
            </div>
          </div>
        );

      case 'format':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contentFormats.map((format) => (
              <Card
                key={format.id}
                className={`p-4 cursor-pointer transition-all ${
                  formData.format === format.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setFormData({ ...formData, format: format.id })}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    {format.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{format.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format.description}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {format.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {feature}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        );

      case 'details':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={formData.details.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      details: { ...formData.details, duration: e.target.value }
                    })
                  }
                  placeholder="e.g., 30"
                />
              </div>
              <div>
                <Label>Passing Score (%)</Label>
                <Input
                  type="number"
                  value={formData.details.passingScore}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      details: { ...formData.details, passingScore: e.target.value }
                    })
                  }
                  placeholder="e.g., 80"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="certificate"
                  checked={formData.details.certificateRequired}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      details: {
                        ...formData.details,
                        certificateRequired: e.target.checked
                      }
                    })
                  }
                />
                <Label htmlFor="certificate">
                  Generate completion certificate
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="tracking"
                  checked={formData.details.trackCompletion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      details: {
                        ...formData.details,
                        trackCompletion: e.target.checked
                      }
                    })
                  }
                />
                <Label htmlFor="tracking">
                  Track completion and results
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center ${
              index < steps.length - 1 ? 'flex-1' : ''
            }`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                index <= currentStep
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-300 text-gray-300'
              }`}
            >
              {step.icon}
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-px mx-4 bg-gray-300" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
          <p className="text-muted-foreground">
            {steps[currentStep].description}
          </p>
        </div>

        {renderStepContent()}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : currentStep === steps.length - 1 ? (
              <>
                Generate Training
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}