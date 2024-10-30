import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building,
  ClipboardList,
  Users,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft,
  Download,
  Filter,
  SortAsc,
  BarChart,
  Share2,
  Plus,
  MoreVertical,
  Target,
  Flag,
  Link,
  MessageSquare,
  Paperclip,
} from 'lucide-react';
import { ChecklistCategory, ChecklistItem } from '@/lib/checklist-generators/startup-checklist';
import { TaskList } from './TaskList';
import { TimelineView } from './TimelineView';
import { RiskMatrix } from './RiskMatrix';
import { MetricsOverview } from './MetricsOverview';

interface ChecklistDashboardProps {
  checklist: Record<string, ChecklistCategory>;
  onReset: () => void;
  onItemUpdate?: (categoryId: string, itemId: string, updates: Partial<ChecklistItem>) => void;
}

export function ChecklistDashboard({ checklist, onReset, onItemUpdate }: ChecklistDashboardProps) {
  const [activeTab, setActiveTab] = useState('tasks');
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'status'>('dueDate');

  const calculateOverallProgress = () => {
    const categories = Object.values(checklist);
    if (categories.length === 0) return 0;
    return categories.reduce((sum, cat) => sum + cat.progress, 0) / categories.length;
  };

  const getCriticalTasks = () => {
    return Object.values(checklist).flatMap(category =>
      category.items.filter(item => item.priority === 'critical' && item.status !== 'completed')
    );
  };

  const getUpcomingMilestones = () => {
    return Object.values(checklist).flatMap(category =>
      category.items.filter(item => item.milestoneTask && item.dueDate)
    ).sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onReset}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Setup
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Overall Progress</h3>
            </div>
            <Badge variant="outline">{Math.round(calculateOverallProgress())}%</Badge>
          </div>
          <Progress value={calculateOverallProgress()} className="h-2" />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h3 className="font-semibold">Critical Tasks</h3>
            </div>
            <Badge variant="destructive">{getCriticalTasks().length}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {getCriticalTasks().length} tasks require immediate attention
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold">Upcoming Milestones</h3>
            </div>
            <Badge variant="outline">{getUpcomingMilestones().length}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            Next milestone in {getUpcomingMilestones()[0]?.dueDate || 'N/A'}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">Timeline Status</h3>
            </div>
            <Badge variant="outline">On Track</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            2 weeks ahead of schedule
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="risks">Risks</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>

          <TabsContent value="tasks">
            <TaskList 
              checklist={checklist}
              onItemUpdate={onItemUpdate}
              filterStatus={filterStatus}
              filterPriority={filterPriority}
              sortBy={sortBy}
            />
          </TabsContent>

          <TabsContent value="timeline">
            <TimelineView checklist={checklist} />
          </TabsContent>

          <TabsContent value="risks">
            <RiskMatrix checklist={checklist} />
          </TabsContent>

          <TabsContent value="metrics">
            <MetricsOverview checklist={checklist} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}