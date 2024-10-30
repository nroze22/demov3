import { Card } from '@/components/ui/card';
import { FileText, Globe, MessageSquare, Mail } from 'lucide-react';

interface MaterialType {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

interface MaterialTypeSelectorProps {
  selectedType: string;
  onSelect: (type: string) => void;
}

const materialTypes: MaterialType[] = [
  {
    id: 'print',
    title: 'Print Materials',
    icon: <FileText className="h-5 w-5" />,
    description: 'Flyers, brochures, and posters',
  },
  {
    id: 'digital',
    title: 'Digital Content',
    icon: <Globe className="h-5 w-5" />,
    description: 'Website content and digital ads',
  },
  {
    id: 'social',
    title: 'Social Media',
    icon: <MessageSquare className="h-5 w-5" />,
    description: 'Social media posts and campaigns',
  },
  {
    id: 'email',
    title: 'Email Templates',
    icon: <Mail className="h-5 w-5" />,
    description: 'Email outreach templates',
  },
];

export function MaterialTypeSelector({
  selectedType,
  onSelect,
}: MaterialTypeSelectorProps) {
  return (
    <div className="space-y-2">
      {materialTypes.map((type) => (
        <button
          key={type.id}
          onClick={() => onSelect(type.id)}
          className={`w-full text-left ${
            selectedType === type.id
              ? 'bg-primary/5 border-primary'
              : 'hover:bg-muted'
          } border rounded-lg p-3 transition-colors`}
        >
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              {type.icon}
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium">{type.title}</h4>
              <p className="text-xs text-muted-foreground">
                {type.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}