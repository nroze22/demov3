import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Flag,
} from 'lucide-react';
import { AnalysisResult } from '@/lib/protocol-analyzer';

interface TimelineAnalysisProps {
  analysis: AnalysisResult;
}

export function TimelineAnalysis({ analysis }: TimelineAnalysisProps) {
  const phases = [
    { key: 'startup', name: 'Startup', icon: Flag },
    { key: 'enrollment', name: 'Enrollment', icon: Users },
    { key: 'treatment', name: 'Treatment', icon: Pill },
    { key: 'followup', name: 'Follow-up', icon: Clock },
    { key: 'closeout', name: 'Closeout', icon: CheckCircle }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Timeline Analysis</h2>
          <p className="text-muted-foreground">
            Estimated duration: {analysis.timeline.estimated}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {phases.map(phase => {
          const phaseData = analysis.timeline.phases[phase.key as keyof typeof analysis.timeline.phases];
          
          return (
            <Card key={phase.key} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <phase.icon className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">{phase.name}</h3>
                  <Badge variant="outline">{phaseData.duration}</Badge>
                </div>
                <Badge 
                  variant={phaseData.progress >= 80 ? "success" : "default"}
                >
                  {phaseData.progress}% Complete
                </Badge>
              </div>

              <Progress value={phaseData.progress} className="h-2 mb-4" />

              <div className="space-y-2">
                {phaseData.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <span>{milestone}</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}

        {analysis.timeline.potentialDelays.length > 0 && (
          <Card className="p-4 border-orange-200 bg-orange-50">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold">Potential Delays</h3>
            </div>
            <div className="space-y-2">
              {analysis.timeline.potentialDelays.map((delay, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>{delay}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="flex items-center gap-2 mb-2">
            <Flag className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Critical Path Items</h3>
          </div>
          <div className="space-y-2">
            {analysis.timeline.criticalPath.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <ChevronRight className="h-4 w-4 text-blue-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Card>
  );
}