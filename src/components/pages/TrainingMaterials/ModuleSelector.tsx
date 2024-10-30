import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  Shield,
  Users,
  FileText,
  Database,
  Brain,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { TrainingModule } from '@/lib/document-generators/training-materials';

interface ModuleSelectorProps {
  onSelect: (moduleType: string) => void;
  isGenerating: boolean;
  modules: TrainingModule[];
  selectedModuleId?: string;
  onModuleSelect: (moduleId: string) => void;
}

const moduleTypes = [
  {
    id: 'protocol',
    title: 'Protocol Overview',
    description: 'Comprehensive protocol training',
    icon: <GraduationCap className="h-5 w-5" />,
    badge: 'Essential',
  },
  {
    id: 'safety',
    title: 'Safety Reporting',
    description: 'Safety monitoring and reporting procedures',
    icon: <Shield className="h-5 w-5" />,
    badge: 'Required',
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
    description: 'CRF completion and data entry',
    icon: <Database className="h-5 w-5" />,
  },
  {
    id: 'assessment',
    title: 'Knowledge Assessment',
    description: 'Comprehension evaluation',
    icon: <Brain className="h-5 w-5" />,
    badge: 'Interactive',
  },
];

export function ModuleSelector({
  onSelect,
  isGenerating,
  modules,
  selectedModuleId,
  onModuleSelect,
}: ModuleSelectorProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Create New Module</h2>
        <div className="space-y-2">
          {moduleTypes.map((type) => (
            <Button
              key={type.id}
              variant="outline"
              className="w-full justify-start h-auto py-3"
              onClick={() => onSelect(type.id)}
              disabled={isGenerating}
            >
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  {type.icon}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{type.title}</span>
                    {type.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {type.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {type.description}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </Card>

      {modules.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Existing Modules</h2>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {modules.map((module) => (
                <Button
                  key={module.id}
                  variant={selectedModuleId === module.id ? 'secondary' : 'outline'}
                  className="w-full justify-start h-auto py-3"
                  onClick={() => onModuleSelect(module.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{module.title}</span>
                        <Badge variant="outline" className="ml-2">
                          {module.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {module.duration}min
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {module.targetAudience.length} roles
                        </div>
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}