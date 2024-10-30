import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress?: number;
  status: string;
  badge?: string;
  onClick: () => void;
}

export function ModuleCard({
  title,
  description,
  icon,
  progress,
  status,
  badge,
  onClick
}: ModuleCardProps) {
  return (
    <Card
      className="p-6 hover:shadow-lg transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{title}</h3>
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
      </div>
      {progress !== undefined && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">{status}</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      )}
    </Card>
  );
}