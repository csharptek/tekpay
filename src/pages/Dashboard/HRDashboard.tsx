import { useEffect, useState } from 'react';
import { Users, Clock, DollarSign, UserCheck, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import SummaryCard from '@/components/UI/SummaryCard';
import ChartContainer from '@/components/UI/ChartContainer';
import ActivityTable from '@/components/UI/ActivityTable';
import { getDashboardSummary, getDashboardTrends, getDashboardActivities } from '@/api/dashboard';
import type { DashboardSummary, TrendData, Activity } from '@/api/dashboard';

export default function HRDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryData, trendsData, activitiesData] = await Promise.all([
          getDashboardSummary(),
          getDashboardTrends(),
          getDashboardActivities(),
        ]);
        
        setSummary(summaryData);
        setTrends(trendsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">HR Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your team today.</p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <SummaryCard
              title="Total Employees"
              value={summary.totalEmployees}
              icon={Users}
              trend={{ value: 5.2, isPositive: true }}
              delay={0}
            />
            <SummaryCard
              title="Pending Approvals"
              value={summary.pendingApprovals}
              icon={Clock}
              delay={0.1}
            />
            <SummaryCard
              title="Upcoming Pay Day"
              value={new Date(summary.upcomingPayDay).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
              icon={Calendar}
              delay={0.2}
            />
            <SummaryCard
              title="Monthly Payout"
              value={`$${(summary.monthlyPayout / 1000).toFixed(0)}k`}
              icon={DollarSign}
              trend={{ value: 3.1, isPositive: true }}
              delay={0.3}
            />
            <SummaryCard
              title="On Leave"
              value={summary.employeesOnLeave}
              icon={UserCheck}
              delay={0.4}
            />
          </div>
        )}

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartContainer
            data={trends}
            title="📈 Payroll Trend (Last 6 Months)"
          />
          
          <ActivityTable activities={activities} />
        </div>
      </div>
    </DashboardLayout>
  );
}
