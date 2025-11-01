// Simple fetch mock for API endpoints
// In real app replace with actual API and remove this mock.
import type { Role } from '@/store/authStore';
import type { Employee } from '@/types/employee';
import { calculateSalaryBreakup } from '@/utils/salaryCalculations';

const originalFetch = window.fetch.bind(window);

// Mock employee data storage
let mockEmployees: Employee[] = [
  {
    id: 'EMP001',
    name: 'John Doe',
    email: 'john.doe@tekpay.com',
    contactNumber: '+91-9876543210',
    designation: 'Senior Software Engineer',
    department: 'Engineering',
    joinDate: '2023-01-15',
    ctc: 1200000,
    status: 'Active',
    salaryBreakup: calculateSalaryBreakup({ ctc: 1200000 }),
    incentives: {
      includeHalfYearlyIncentive: true,
      incentivePercentage: 10,
      incentiveAmount: 120000,
    },
    joiningBonus: {
      enabled: true,
      amount: 50000,
    },
  },
  {
    id: 'EMP002',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@tekpay.com',
    contactNumber: '+91-9876543211',
    designation: 'HR Manager',
    department: 'Human Resources',
    joinDate: '2022-06-10',
    ctc: 900000,
    status: 'Active',
    salaryBreakup: calculateSalaryBreakup({ ctc: 900000 }),
    incentives: {
      includeHalfYearlyIncentive: true,
      incentivePercentage: 12,
      incentiveAmount: 108000,
    },
    joiningBonus: {
      enabled: false,
      amount: 0,
    },
  },
  {
    id: 'EMP003',
    name: 'Mike Chen',
    email: 'mike.chen@tekpay.com',
    contactNumber: '+91-9876543212',
    designation: 'Product Manager',
    department: 'Product',
    joinDate: '2023-03-20',
    ctc: 1500000,
    status: 'Active',
    salaryBreakup: calculateSalaryBreakup({ ctc: 1500000 }),
    incentives: {
      includeHalfYearlyIncentive: true,
      incentivePercentage: 15,
      incentiveAmount: 225000,
    },
    joiningBonus: {
      enabled: true,
      amount: 75000,
    },
  },
  {
    id: 'EMP004',
    name: 'Alice Smith',
    email: 'alice.smith@tekpay.com',
    contactNumber: '+91-9876543213',
    designation: 'UI/UX Designer',
    department: 'Design',
    joinDate: '2023-08-01',
    ctc: 800000,
    status: 'On Notice',
    resignationDate: '2024-12-01',
    salaryBreakup: calculateSalaryBreakup({ ctc: 800000 }),
    incentives: {
      includeHalfYearlyIncentive: false,
      incentivePercentage: 0,
      incentiveAmount: 0,
    },
    joiningBonus: {
      enabled: false,
      amount: 0,
    },
  },
  {
    id: 'EMP005',
    name: 'Bob Wilson',
    email: 'bob.wilson@tekpay.com',
    contactNumber: '+91-9876543214',
    designation: 'Finance Analyst',
    department: 'Finance',
    joinDate: '2022-11-15',
    ctc: 700000,
    status: 'Resigned',
    resignationDate: '2024-10-31',
    salaryBreakup: calculateSalaryBreakup({ ctc: 700000 }),
    incentives: {
      includeHalfYearlyIncentive: false,
      incentivePercentage: 0,
      incentiveAmount: 0,
      monthsToRecover: [9, 10], // September and October
    },
    joiningBonus: {
      enabled: false,
      amount: 0,
    },
  },
];

let nextEmployeeId = 6;

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

  // Mock employees endpoints
  if (url.endsWith('/api/employees') && method === 'GET') {
    await new Promise((r) => setTimeout(r, 500));
    return new Response(
      JSON.stringify(mockEmployees),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  if (url.endsWith('/api/employees') && method === 'POST') {
    try {
      const bodyText = (init?.body as string) || '{}';
      const employeeData = JSON.parse(bodyText);

      await new Promise((r) => setTimeout(r, 800));

      const newEmployee: Employee = {
        ...employeeData,
        id: `EMP${String(nextEmployeeId).padStart(3, '0')}`,
      };

      mockEmployees.push(newEmployee);
      nextEmployeeId++;

      return new Response(
        JSON.stringify(newEmployee),
        { status: 201, headers: { 'Content-Type': 'application/json' } },
      );
    } catch (e: any) {
      return new Response(
        JSON.stringify({ message: 'Invalid employee data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }
  }

  // Update employee endpoint
  if (url.match(/\/api\/employees\/[^/]+$/) && method === 'PUT') {
    try {
      const employeeId = url.split('/').pop();
      const bodyText = (init?.body as string) || '{}';
      const updateData = JSON.parse(bodyText);

      await new Promise((r) => setTimeout(r, 600));

      const employeeIndex = mockEmployees.findIndex(emp => emp.id === employeeId);
      if (employeeIndex === -1) {
        return new Response(
          JSON.stringify({ message: 'Employee not found' }),
          { status: 404, headers: { 'Content-Type': 'application/json' } },
        );
      }

      mockEmployees[employeeIndex] = { ...mockEmployees[employeeIndex], ...updateData };

      return new Response(
        JSON.stringify(mockEmployees[employeeIndex]),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    } catch (e: any) {
      return new Response(
        JSON.stringify({ message: 'Invalid update data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }
  }

  // Delete employee endpoint
  if (url.match(/\/api\/employees\/[^/]+$/) && method === 'DELETE') {
    const employeeId = url.split('/').pop();

    await new Promise((r) => setTimeout(r, 400));

    const employeeIndex = mockEmployees.findIndex(emp => emp.id === employeeId);
    if (employeeIndex === -1) {
      return new Response(
        JSON.stringify({ message: 'Employee not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } },
      );
    }

    mockEmployees.splice(employeeIndex, 1);

    return new Response(
      JSON.stringify({ message: 'Employee deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return originalFetch(input, init);
};
