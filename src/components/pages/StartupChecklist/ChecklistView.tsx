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
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChecklistItem, ChecklistCategory } from '@/lib/checklist-generators/startup-checklist';

interface ChecklistViewProps {
  checklist: Record<string, ChecklistCategory>;
  onReset: () => void;
  onItemUpdate?: (categoryId: string, itemId: string, updates: Partial<ChecklistItem>) => void;
}

export function ChecklistView({ checklist, onReset, onItemUpdate }: ChecklistViewProps) {
  const [activeTab, setActiveTab] = useState(Object.keys(checklist)[0] || '');
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'status'>('dueDate');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'in-progress':
        return 'text-blue-500';
      case 'blocked':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };

    return (
      <Badge variant="outline" className={`${colors[priority as keyof typeof colors]}`}>
        {priority}
      </Badge>
    );
  };

  const calculateProgress = (items: ChecklistItem[]) => {
    if (!items || items.length === 0) return 0;
    const completed = items.filter(item => item.status === 'completed').length;
    return (completed / items.length) * 100;
  };

  const filterItems = (items: ChecklistItem[] = []) => {
    let filtered = [...items];
    
    if (filterStatus.length > 0) {
      filtered = filtered.filter(item => filterStatus.includes(item.status));
    }
    
    if (filterPriority.length > 0) {
      filtered = filtered.filter(item => filterPriority.includes(item.priority));
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime();
        case 'priority':
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority as keyof typeof priorityOrder] - 
                 priorityOrder[b.priority as keyof typeof priorityOrder];
        case 'status':
          const statusOrder = { blocked: 0, pending: 1, 'in-progress': 2, completed: 3 };
          return statusOrder[a.status as keyof typeof statusOrder] - 
                 statusOrder[b.status as keyof typeof statusOrder];
        default:
          return 0;
      }
    });
  };

  // Ensure checklist exists and has categories
  if (!checklist || Object.keys(checklist).length === 0) {
    return (
      <div className="text-center p-8">
        <p>No checklist data available.</p>
        <Button onClick={onReset} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Setup
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={onReset}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Setup
        </Button>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              {['pending', 'in-progress', 'completed', 'blocked'].map(status => (
                <DropdownMenuItem key={status}>
                  <input
                    type="checkbox"
                    checked={filterStatus.includes(status)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilterStatus([...filterStatus, status]);
                      } else {
                        setFilterStatus(filterStatus.filter(s => s !== status));
                      }
                    }}
                    className="mr-2"
                  />
                  {status}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Priority</DropdownMenuLabel>
              {['critical', 'high', 'medium', 'low'].map(priority => (
                <DropdownMenuItem key={priority}>
                  <input
                    type="checkbox"
                    checked={filterPriority.includes(priority)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFilterPriority([...filterPriority, priority]);
                      } else {
                        setFilterPriority(filterPriority.filter(p => p !== priority));
                      }
                    }}
                    className="mr-2"
                  />
                  {priority}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('dueDate')}>
                Due Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('priority')}>
                Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('status')}>
                Status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline">
            <BarChart className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(checklist).map(([category, data]) => (
          <Card key={category} className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {category === 'regulatory' && <Building className="h-5 w-5 text-primary" />}
              {category === 'startup' && <ClipboardList className="h-5 w-5 text-primary" />}
              <h3 className="text-lg font-semibold capitalize">{category}</h3>
            </div>
            <Progress value={calculateProgress(data.items)} className="mb-4" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {data.items?.filter(item => item.status === 'completed').length || 0} of {data.items?.length || 0} tasks
              </span>
              <span>{Math.round(calculateProgress(data.items))}% complete</span>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            {Object.keys(checklist).map(category => (
              <TabsTrigger key={category} value={category} className="flex items-center gap-2">
                {category === 'regulatory' && <Building className="h-4 w-4" />}
                {category === 'startup' && <ClipboardList className="h-4 w-4" />}
                <span className="capitalize">{category}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(checklist).map(([category, data]) => (
            <TabsContent key={category} value={category}>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filterItems(data.items).map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={getStatusColor(item.status)}>
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-lg font-semibold flex items-center gap-2">
                                {item.title}
                                {item.regulatoryRequirement && (
                                  <Badge variant="outline" className="text-xs">
                                    Regulatory
                                  </Badge>
                                )}
                                {item.milestoneTask && (
                                  <Badge variant="outline" className="text-xs">
                                    Milestone
                                  </Badge>
                                )}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {item.description}
                              </p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Add Comment
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Paperclip className="h-4 w-4 mr-2" />
                                  Add Attachment
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link className="h-4 w-4 mr-2" />
                                  Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  Delete Task
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="flex flex-wrap gap-4 mt-4">
                            {item.dueDate && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">
                                  Due: {format(new Date(item.dueDate), 'MMM d, yyyy')}
                                </span>
                              </div>
                            )}
                            {item.assignee && (
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.assignee}`} />
                                  <AvatarFallback>{item.assignee[0]}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{item.assignee}</span>
                              </div>
                            )}
                            {getPriorityBadge(item.priority)}
                            {item.estimatedDuration && (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {item.estimatedDuration}
                              </Badge>
                            )}
                          </div>

                          {item.dependencies && item.dependencies.length > 0 && (
                            <div className="mt-4">
                              <h5 className="text-sm font-medium mb-2">Dependencies</h5>
                              <div className="flex flex-wrap gap-2">
                                {item.dependencies.map((dep, index) => (
                                  <Badge key={index} variant="outline">
                                    {dep}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {item.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </Card>
    </div>
  );
}