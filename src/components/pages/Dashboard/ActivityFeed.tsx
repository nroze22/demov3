import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, ClipboardCheck, ArrowRight } from 'lucide-react';

export function ActivityFeed() {
  const recentActivities = [
    {
      id: 1,
      type: 'document',
      title: 'IRB Cover Letter Generated',
      timestamp: '2 hours ago',
      icon: <FileText className="h-4 w-4" />
    },
    {
      id: 2,
      type: 'milestone',
      title: 'Protocol Analysis Completed',
      timestamp: '4 hours ago',
      icon: <CheckCircle className="h-4 w-4" />
    },
    {
      id: 3,
      type: 'task',
      title: 'Site Initiation Checklist Updated',
      timestamp: '1 day ago',
      icon: <ClipboardCheck className="h-4 w-4" />
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Recent Activity</h2>
      <Card className="p-6">
        <ScrollArea className="h-[400px]">
          <div className="space-y-6">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 pb-6 border-b last:border-0"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {activity.icon}
                </div>
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-between">
            Generate New Document
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between">
            Update Study Timeline
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between">
            Review Pending Tasks
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}