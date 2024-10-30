import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Target,
  Users,
  Percent,
  ArrowRight,
  Calculator,
} from 'lucide-react';
import { AnalysisResult } from '@/lib/protocol-analyzer';

interface StatisticalAnalysisProps {
  analysis: AnalysisResult;
}

export function StatisticalAnalysis({ analysis }: StatisticalAnalysisProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Statistical Analysis</h2>
          <p className="text-muted-foreground">
            Sample size and endpoint analysis
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Sample Size</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Participants</span>
                <span className="font-medium">{analysis.statistics.sampleSize.total}</span>
              </div>
              <div className="flex items-center gap-2">
                {analysis.statistics.sampleSize.perArm.map((size, index) => (
                  <div key={index} className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">
                      Arm {index + 1}
                    </div>
                    <Progress value={(size / analysis.statistics.sampleSize.total) * 100} className="h-2" />
                    <div className="text-xs font-medium mt-1">{size}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Power</div>
                <div className="font-medium">
                  {analysis.statistics.sampleSize.powerAnalysis.power}%
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Effect Size</div>
                <div className="font-medium">
                  {analysis.statistics.sampleSize.powerAnalysis.effectSize}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Significance</div>
                <div className="font-medium">
                  {analysis.statistics.sampleSize.powerAnalysis.significance}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Dropout Rate</div>
                <div className="font-medium">
                  {analysis.statistics.sampleSize.powerAnalysis.dropoutRate}%
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Endpoints</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Primary Endpoint</div>
              <Card className="p-3">
                <div className="text-sm font-medium">{analysis.statistics.endpoints.primary.name}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Type: {analysis.statistics.endpoints.primary.type}
                </div>
                <div className="text-sm text-muted-foreground">
                  Timing: {analysis.statistics.endpoints.primary.timing}
                </div>
                <div className="text-sm text-muted-foreground">
                  Analysis: {analysis.statistics.endpoints.primary.analysis}
                </div>
              </Card>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Secondary Endpoints</div>
              <div className="space-y-2">
                {analysis.statistics.endpoints.secondary.map((endpoint, index) => (
                  <Card key={index} className="p-3">
                    <div className="text-sm font-medium">{endpoint.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Type: {endpoint.type}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Timing: {endpoint.timing}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold">Analysis Populations</h3>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-medium mb-2">Intent-to-Treat (ITT)</div>
              <p className="text-sm text-muted-foreground">{analysis.statistics.populations.itt}</p>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Per Protocol (PP)</div>
              <p className="text-sm text-muted-foreground">{analysis.statistics.populations.pp}</p>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Safety Population</div>
              <p className="text-sm text-muted-foreground">{analysis.statistics.populations.safety}</p>
            </div>
          </div>
        </Card>
      </div>
    </Card>
  );
}