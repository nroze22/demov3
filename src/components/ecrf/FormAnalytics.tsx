import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ECRFForm, FormAnalysis } from '@/lib/ecrf/types';
import { analyzeFormPerformance, simulateFormData } from '@/lib/ecrf/generators';
import {
  BarChart,
  Clock,
  AlertTriangle,
  CheckCircle,
  Brain,
  Loader2,
  ArrowRight,
  Target,
  Users,
  FileText,
} from 'lucide-react';

interface FormAnalyticsProps {
  form: ECRFForm;
}

export function FormAnalytics({ form }: FormAnalyticsProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FormAnalysis | null>(null);
  const [simulatedData, setSimulatedData] = useState<any[]>([]);

  useEffect(() => {
    analyzeForm();
  }, [form]);

  const analyzeForm = async () => {
    setIsAnalyzing(true);
    try {
      // First, generate simulated data
      const data = await simulateFormData(form, 100);
      setSimulatedData(data);

      // Then analyze the form with the simulated data
      const result = await analyzeFormPerformance(form, data);
      setAnalysis(result);
    } catch (error) {
      console.error('Failed to analyze form:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
        <p className="text-lg font-medium">Analyzing Form Design</p>
        <p className="text-sm text-muted-foreground">
          This may take a few moments...
        </p>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Form Score</h3>
            <Badge variant={analysis.score >= 80 ? 'default' : 'secondary'}>
              {analysis.score}/100
            </Badge>
          </div>
          <Progress value={analysis.score} className="h-2" />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Completion Time</h3>
            <Badge variant="outline">
              {analysis.performance.completionTime}min
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Average time to complete
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Error Rate</h3>
            <Badge 
              variant={analysis.performance.errorRate < 5 ? 'default' : 'destructive'}
            >
              {analysis.performance.errorRate}%
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Data entry errors
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Missing Data</h3>
            <Badge 
              variant={analysis.performance.missingDataRate < 5 ? 'default' : 'destructive'}
            >
              {analysis.performance.missingDataRate}%
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Incomplete fields
          </p>
        </Card>
      </div>

      {/* Suggestions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Optimization Suggestions</h3>
        <ScrollArea className="h-[300px]">
          <div className="space-y-4">
            {analysis.suggestions.map((suggestion, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-3">
                  {suggestion.type === 'error' ? (
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  ) : suggestion.type === 'warning' ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  ) : (
                    <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{suggestion.message}</p>
                    {suggestion.field && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Field: {suggestion.field}
                      </p>
                    )}
                    {suggestion.action && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        Apply Fix
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Data Quality Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Data Quality Analysis</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <h4 className="text-sm font-medium mb-2">Data Consistency</h4>
            <Progress 
              value={analysis.dataQuality.consistency} 
              className="h-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {analysis.dataQuality.consistency}% consistent
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Data Completeness</h4>
            <Progress 
              value={analysis.dataQuality.completeness} 
              className="h-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {analysis.dataQuality.completeness}% complete
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Data Accuracy</h4>
            <Progress 
              value={analysis.dataQuality.accuracy} 
              className="h-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {analysis.dataQuality.accuracy}% accurate
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}