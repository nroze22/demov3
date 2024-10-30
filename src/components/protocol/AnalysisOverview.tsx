import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Brain,
  Shield,
  Building,
  FileText,
} from 'lucide-react';
import { AnalysisResult } from '@/lib/protocol-analyzer';

interface AnalysisOverviewProps {
  analysis: AnalysisResult;
}

export function AnalysisOverview({ analysis }: AnalysisOverviewProps) {
  const categories = [
    { 
      name: 'Design', 
      score: analysis.score.categories.design,
      icon: <Brain className="h-5 w-5 text-blue-500" />
    },
    { 
      name: 'Feasibility', 
      score: analysis.score.categories.feasibility,
      icon: <Target className="h-5 w-5 text-green-500" />
    },
    { 
      name: 'Safety', 
      score: analysis.score.categories.safety,
      icon: <Shield className="h-5 w-5 text-red-500" />
    },
    { 
      name: 'Operational', 
      score: analysis.score.categories.operational,
      icon: <Building className="h-5 w-5 text-purple-500" />
    },
    { 
      name: 'Regulatory', 
      score: analysis.score.categories.regulatory,
      icon: <FileText className="h-5 w-5 text-orange-500" />
    }
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Protocol Analysis Score</h2>
          <p className="text-muted-foreground">
            Overall assessment of protocol quality and readiness
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-4xl font-bold text-blue-600">
            {analysis.score.overall}
          </div>
          <div className="text-sm text-muted-foreground">/100</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {categories.map((category) => (
          <Card key={category.name} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {category.icon}
                <span className="font-medium">{category.name}</span>
              </div>
              <Badge variant={category.score >= 80 ? "success" : "warning"}>
                {category.score}%
              </Badge>
            </div>
            <Progress 
              value={category.score} 
              className="h-2"
              indicatorClassName={
                category.score >= 80 ? "bg-green-500" : 
                category.score >= 60 ? "bg-yellow-500" : "bg-red-500"
              }
            />
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold">Critical Findings</h3>
          </div>
          <div className="space-y-2">
            {analysis.suggestions
              .filter(s => s.priority === 'critical')
              .map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <span>{suggestion.issue}</span>
                </div>
              ))}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Timeline Impact</h3>
          </div>
          <div className="space-y-2">
            <div className="text-sm">
              Estimated Duration: <span className="font-medium">{analysis.timeline.estimated}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {analysis.timeline.potentialDelays[0]}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Key Strengths</h3>
          </div>
          <div className="space-y-2">
            {analysis.suggestions
              .filter(s => s.priority === 'low' && s.category === 'design')
              .slice(0, 2)
              .map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span>{suggestion.recommendation}</span>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </Card>
  );
}