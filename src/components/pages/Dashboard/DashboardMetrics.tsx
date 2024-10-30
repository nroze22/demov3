import { MetricCard } from './MetricCard';
import { BarChart, Calendar, FileText, AlertCircle } from 'lucide-react';

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Overall Progress"
        value="45%"
        icon={<BarChart className="h-5 w-5 text-blue-500" />}
        trend="+5% this week"
        trendUp={true}
      />
      <MetricCard
        title="Days Since Start"
        value="32"
        icon={<Calendar className="h-5 w-5 text-purple-500" />}
        subtitle="Target: 365 days"
      />
      <MetricCard
        title="Documents Generated"
        value="12"
        icon={<FileText className="h-5 w-5 text-green-500" />}
        trend="+3 today"
        trendUp={true}
      />
      <MetricCard
        title="Pending Tasks"
        value="8"
        icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
        trend="2 due today"
      />
    </div>
  );
}