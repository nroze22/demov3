import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import {
  Brain,
  Clock,
  FileText,
  CheckCircle,
  Target,
} from 'lucide-react';

interface ExtractionStatsProps {
  stats: {
    fieldsPopulated: number;
    totalFields: number;
    wordsExtracted: number;
    accuracy: number;
    processingTime: number;
  };
}

export function ExtractionStats({ stats }: ExtractionStatsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <div className="grid grid-cols-5 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Fields Populated</h3>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {stats.fieldsPopulated}/{stats.totalFields}
              </div>
              <Progress
                value={(stats.fieldsPopulated / stats.totalFields) * 100}
                className="h-2"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Words Extracted</h3>
            </div>
            <div className="text-2xl font-bold">{stats.wordsExtracted}</div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Accuracy</h3>
            </div>
            <div className="text-2xl font-bold">{stats.accuracy}%</div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Processing Time</h3>
            </div>
            <div className="text-2xl font-bold">{stats.processingTime}s</div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              <h3 className="font-medium">Status</h3>
            </div>
            <div className="text-2xl font-bold text-green-500">Complete</div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}