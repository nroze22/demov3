import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  Shield,
  Clock,
  FileText,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { AnalysisResult } from '@/lib/protocol-analyzer';

interface RiskAssessmentProps {
  analysis: AnalysisResult;
}

export function RiskAssessment({ analysis }: RiskAssessmentProps) {
  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  const getRiskBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const calculateRiskScore = (probability: number, impact: number) => {
    return Math.round((probability * impact) / 10);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Risk Assessment</h2>
          <p className="text-muted-foreground">
            Identified risks and mitigation strategies
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {['operational', 'clinical', 'regulatory', 'timeline'].map(category => {
          const risks = analysis.risks.filter(r => r.category === category);
          if (risks.length === 0) return null;

          return (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-semibold capitalize">{category} Risks</h3>
              <div className="grid grid-cols-1 gap-4">
                {risks.map((risk, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 ${getRiskColor(risk.severity)}`}>
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{risk.description}</span>
                            <Badge 
                              variant="secondary"
                              className={getRiskBadgeColor(risk.severity)}
                            >
                              {risk.severity}
                            </Badge>
                          </div>
                          <div className="text-sm font-medium">
                            Risk Score: {calculateRiskScore(risk.probability, risk.impact)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <div className="text-sm font-medium mb-1">Mitigation Strategy</div>
                            <p className="text-sm text-muted-foreground">
                              {risk.mitigation}
                            </p>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">Contingency Plan</div>
                            <p className="text-sm text-muted-foreground">
                              {risk.contingency}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              Probability
                            </div>
                            <Progress value={risk.probability * 10} className="h-2" />
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              Impact
                            </div>
                            <Progress value={risk.impact * 10} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}