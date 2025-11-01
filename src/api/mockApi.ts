// Simple fetch mock for API endpoints
// In real app replace with actual API and remove this mock.
import type { Role } from '@/store/authStore';

const originalFetch = window.fetch.bind(window);

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input.toString();
  const method = init?.method?.toUpperCase() || 'GET';

  // Mock dashboard summary endpoint
  if (url.endsWith('/api/dashboard/summary') && method === 'GET') {
    await new Promise((r) => setTimeout(r, 500));
    return new Response(
      JSON.stringify({
        totalEmployees: 247,
        pendingApprovals: 12,
        upcomingPayDay: '2024-11-15',
        monthlyPayout: 1250000,
        employeesOnLeave: 8,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Mock dashboard trends endpoint
  if (url.endsWith('/api/dashboard/trends') && method === 'GET') {
    await new Promise((r) => setTimeout(r, 600));
    return new Response(
      JSON.stringify([
        { month: 'Jun', amount: 1180000 },
        { month: 'Jul', amount: 1220000 },
        { month: 'Aug', amount: 1195000 },
        { month: 'Sep', amount: 1240000 },
        { month: 'Oct', amount: 1210000 },
        { month: 'Nov', amount: 1250000 },
      ]),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Mock dashboard activities endpoint
  if (url.endsWith('/api/dashboard/activities') && method === 'GET') {
    await new Promise((r) => setTimeout(r, 400));
    return new Response(
      JSON.stringify([
        {
          id: '1',
          date: '2024-11-01',
          activity: 'Payroll processed for October',
          performedBy: 'Sarah Johnson',
          remarks: 'All employees paid successfully',
        },
        {
          id: '2',
          date: '2024-10-30',
          activity: 'New employee onboarded',
          performedBy: 'Mike Chen',
          remarks: 'John Doe - Software Engineer',
        },
        {
          id: '3',
          date: '2024-10-28',
          activity: 'Bonus approved',
          performedBy: 'Sarah Johnson',
          remarks: 'Q3 performance bonus - $50,000',
        },
        {
          id: '4',
          date: '2024-10-25',
          activity: 'Leave request approved',
          performedBy: 'Mike Chen',
          remarks: 'Alice Smith - 5 days vacation',
        },
        {
          id: '5',
          date: '2024-10-22',
          activity: 'Salary adjustment',
          performedBy: 'Sarah Johnson',
          remarks: 'Bob Wilson - 8% increase',
        },
      ]),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  if (url.endsWith('/api/auth/login') && method === 'POST') {
    try {
      const bodyText = (init?.body as string) || '{}';
      const { email, password } = JSON.parse(bodyText);

      await new Promise((r) => setTimeout(r, 800)); // simulate latency

      if (!email || !password) {
        return new Response(
          JSON.stringify({ message: 'Email and password are required' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        );
      }

      // Very basic mock logic: emails containing 'hr' are HR, others Employee
      const role: Role = /(^|\W)hr(\W|$)/i.test(email) ? 'HR' : 'Employee';
      const token = `mock-jwt-token-${role.toLowerCase()}`;

      return new Response(
        JSON.stringify({ token, role }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    } catch (e: any) {
      return new Response(
        JSON.stringify({ message: 'Malformed request' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }
  }

  return originalFetch(input, init);
};
