import { Card } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  subtitle?: string;
}

export function MetricCard({ title, value, icon, trend, trendUp, subtitle }: MetricCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-muted-foreground">{title}</span>
        {icon}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold">{value}</span>
        {trend && (
          <span className={`text-sm ${trendUp ? 'text-green-500' : 'text-muted-foreground'}`}>
            {trend}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      )}
    </Card>
  );
}