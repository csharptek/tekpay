export interface DashboardSummary {
  totalEmployees: number;
  pendingApprovals: number;
  upcomingPayDay: string;
  monthlyPayout: number;
  employeesOnLeave: number;
}

export interface TrendData {
  month: string;
  amount: number;
}

export interface Activity {
  id: string;
  date: string;
  activity: string;
  performedBy: string;
  remarks: string;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await fetch('/api/dashboard/summary');
  if (!res.ok) {
    throw new Error('Failed to fetch dashboard summary');
  }
  return res.json();
}

export async function getDashboardTrends(): Promise<TrendData[]> {
  const res = await fetch('/api/dashboard/trends');
  if (!res.ok) {
    throw new Error('Failed to fetch dashboard trends');
  }
  return res.json();
}

export async function getDashboardActivities(): Promise<Activity[]> {
  const res = await fetch('/api/dashboard/activities');
  if (!res.ok) {
    throw new Error('Failed to fetch dashboard activities');
  }
  return res.json();
}

