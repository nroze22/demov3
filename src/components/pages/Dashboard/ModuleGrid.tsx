import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModuleCard } from './ModuleCard';
import {
  Building,
  ClipboardList,
  Users,
  FileText,
  Brain,
  Target,
  Flag,
  Sparkles,
  Bot,
  Search,
  Database
} from 'lucide-react';

interface ModuleGridProps {
  progress: {
    regulatory: number;
    startup: number;
    recruitment: number;
    training: number;
    marketing: number;
  };
}

export function ModuleGrid({ progress }: ModuleGridProps) {
  const navigate = useNavigate();

  const modules = [
    {
      id: 'patient-screening',
      title: 'AI Patient Screening',
      description: 'Smart patient screening and eligibility ranking',
      icon: <Search className="h-6 w-6" />,
      path: '/patient-screening',
      status: 'Active',
      badge: 'New',
      features: [
        'Bulk Document Processing',
        'Intelligent Patient Ranking',
        'Eligibility Analysis',
        'Source Verification'
      ]
    },
    {
      id: 'data-abstraction',
      title: 'AI Data Abstraction',
      description: 'Intelligent patient data extraction and management',
      icon: <Bot className="h-6 w-6" />,
      path: '/data-abstraction',
      status: 'Active',
      badge: 'Enhanced',
      features: [
        'Automated Data Extraction',
        'Real-time Processing',
        'Smart Form Population',
        'Accuracy Analytics'
      ]
    },
    {
      id: 'ecrf',
      title: 'eCRF Builder',
      description: 'Design and optimize electronic Case Report Forms',
      icon: <Database className="h-6 w-6" />,
      path: '/ecrf',
      progress: progress.startup,
      status: 'Active',
      badge: 'Enhanced'
    },
    {
      id: 'irb',
      title: 'IRB Materials',
      description: 'Generate comprehensive IRB submission documents',
      icon: <Building className="h-6 w-6" />,
      path: '/irb-materials',
      progress: progress.regulatory,
      status: 'In Progress',
      badge: 'Priority'
    },
    {
      id: 'marketing',
      title: 'Marketing Suite',
      description: 'Create professional recruitment materials',
      icon: <Sparkles className="h-6 w-6" />,
      path: '/marketing',
      progress: progress.marketing,
      status: 'Active',
      badge: 'Enhanced'
    },
    {
      id: 'recruitment',
      title: 'Recruitment Materials',
      description: 'Design and generate recruitment materials',
      icon: <Users className="h-6 w-6" />,
      path: '/recruitment-materials',
      progress: progress.recruitment,
      status: 'Active'
    },
    {
      id: 'training',
      title: 'Training Materials',
      description: 'Create study-specific training content',
      icon: <Brain className="h-6 w-6" />,
      path: '/training-materials',
      progress: progress.training,
      status: 'Active'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Study Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <ModuleCard
            key={module.id}
            {...module}
            onClick={() => navigate(module.path)}
          />
        ))}
      </div>
    </div>
  );
}