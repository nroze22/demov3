import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { MetricCard } from './MetricCard';
import { ModuleCard } from './ModuleCard';
import { ActivityFeed } from './ActivityFeed';
import { ModuleGrid } from './ModuleGrid';
import {
  FileText,
  Building,
  Brain,
  Settings,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart,
} from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const [studyProgress] = useState({
    regulatory: 30,
    startup: 45,
    recruitment: 15,
    training: 60,
    marketing: 25
  });

  const studyData = JSON.parse(localStorage.getItem('studyData') || '{}');

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-24">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{studyData.title || 'Study Dashboard'}</h1>
              <p className="text-muted-foreground">
                Track your study progress and access key modules
              </p>
            </div>
            <Button
              onClick={() => navigate('/settings')}
              variant="outline"
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>

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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ModuleGrid progress={studyProgress} />
          </div>
          <ActivityFeed />
        </div>
      </main>
    </div>
  );
}

// Also export as default for compatibility
export default Dashboard;