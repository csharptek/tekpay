// Simple fetch mock for API endpoints
// In real app replace with actual API and remove this mock.
import type { Role } from '@/store/authStore';
import type { Employee } from '@/types/employee';
import type { PayrollEntry, PayrollSummary, PayrollBreakdown } from '@/types/payroll';
import { calculateSalaryBreakup } from '@/utils/salaryCalculations';
import { calculatePayrollEntry, calculatePayrollBreakdown } from '@/utils/payrollCalculations';

const originalFetch = window.fetch.bind(window);

// Helper function for simulating API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

// Mock payroll data storage
let mockPayrollEntries: PayrollEntry[] = [];

// Generate mock payroll data for current month
function generateMockPayrollData(month: string): PayrollEntry[] {
  return mockEmployees.map((employee, index) => {
    const presentDays = 24 - Math.floor(Math.random() * 3); // 22-24 present days
    const reimbursements = Math.floor(Math.random() * 5000); // 0-5000 reimbursements
    const incentiveAdjustment = employee.incentives?.includeHalfYearlyIncentive ? 
      Math.floor(Math.random() * 10000) : 0;

    return calculatePayrollEntry({
      employee,
      month,
      presentDays,
      reimbursements,
      incentiveAdjustment,
    });
  });
}

// Initialize payroll data for current month
const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM format
mockPayrollEntries = generateMockPayrollData(currentMonth);

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

  // Payroll endpoints
  if (url.startsWith('/api/payroll')) {
    // GET /api/payroll/{month}
    if (method === 'GET' && url.match(/^\/api\/payroll\/\d{4}-\d{2}$/)) {
      const month = url.split('/').pop()!;
      await delay(500);
      
      // Generate payroll data for the requested month if not exists
      const monthEntries = mockPayrollEntries.filter(entry => entry.month === month);
      if (monthEntries.length === 0) {
        const newEntries = generateMockPayrollData(month);
        mockPayrollEntries.push(...newEntries);
        return new Response(JSON.stringify(newEntries), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify(monthEntries), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // GET /api/payroll/{month}/summary
    if (method === 'GET' && url.match(/^\/api\/payroll\/\d{4}-\d{2}\/summary$/)) {
      const month = url.split('/')[3];
      await delay(300);
      
      const monthEntries = mockPayrollEntries.filter(entry => entry.month === month);
      const summary: PayrollSummary = {
        month,
        totalEmployees: monthEntries.length,
        processedEmployees: monthEntries.length,
        pendingApprovals: monthEntries.filter(e => e.status === 'Pending').length,
        approvedEmployees: monthEntries.filter(e => e.status === 'Approved').length,
        rejectedEmployees: monthEntries.filter(e => e.status === 'Rejected').length,
        totalPayrollAmount: monthEntries.reduce((sum, e) => sum + e.netPayable, 0),
        totalIncentiveAdjustments: monthEntries.reduce((sum, e) => sum + (e.incentiveAdjustment || 0), 0),
        totalDeductions: monthEntries.reduce((sum, e) => sum + e.deductions.pf + e.deductions.esi + e.deductions.pt + e.deductions.tds, 0),
        netPayrollAmount: monthEntries.reduce((sum, e) => sum + e.netPayable, 0),
      };
      
      return new Response(JSON.stringify(summary), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // POST /api/payroll/calculate
    if (method === 'POST' && url === '/api/payroll/calculate') {
      await delay(2000); // Simulate calculation time
      
      const body = JSON.parse(init?.body as string);
      const { month, recalculate } = body;
      
      // Regenerate payroll data for the month
      const newEntries = generateMockPayrollData(month);
      mockPayrollEntries = mockPayrollEntries.filter(entry => entry.month !== month);
      mockPayrollEntries.push(...newEntries);
      
      return new Response(JSON.stringify({
        success: true,
        message: `Payroll calculated successfully for ${newEntries.length} employees`,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // PUT /api/payroll/{id}/approve
    if (method === 'PUT' && url.match(/^\/api\/payroll\/[^\/]+\/approve$/)) {
      const id = url.split('/')[3];
      await delay(300);
      
      const entry = mockPayrollEntries.find(e => e.id === id);
      if (!entry) {
        return new Response(JSON.stringify({ error: 'Payroll entry not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      const body = JSON.parse(init?.body as string);
      entry.status = 'Approved';
      entry.approvedAt = new Date().toISOString();
      entry.approvedBy = body.approvedBy;
      
      return new Response(JSON.stringify(entry), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // PUT /api/payroll/{id}/reject
    if (method === 'PUT' && url.match(/^\/api\/payroll\/[^\/]+\/reject$/)) {
      const id = url.split('/')[3];
      await delay(300);
      
      const entry = mockPayrollEntries.find(e => e.id === id);
      if (!entry) {
        return new Response(JSON.stringify({ error: 'Payroll entry not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      const body = JSON.parse(init?.body as string);
      entry.status = 'Rejected';
      entry.rejectedAt = new Date().toISOString();
      entry.rejectedBy = body.rejectedBy;
      entry.rejectionReason = body.reason;
      
      return new Response(JSON.stringify(entry), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // GET /api/payroll/{id}/breakdown
    if (method === 'GET' && url.match(/^\/api\/payroll\/[^\/]+\/breakdown$/)) {
      const id = url.split('/')[3];
      await delay(300);
      
      const entry = mockPayrollEntries.find(e => e.id === id);
      if (!entry) {
        return new Response(JSON.stringify({ error: 'Payroll entry not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      const employee = mockEmployees.find(e => e.id === entry.employeeId);
      if (!employee) {
        return new Response(JSON.stringify({ error: 'Employee not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      const breakdown = calculatePayrollBreakdown(entry, employee);
      
      return new Response(JSON.stringify(breakdown), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // PUT /api/payroll/{month}/approve-all
    if (method === 'PUT' && url.match(/^\/api\/payroll\/\d{4}-\d{2}\/approve-all$/)) {
      const month = url.split('/')[3];
      await delay(500);
      
      const body = JSON.parse(init?.body as string);
      const pendingEntries = mockPayrollEntries.filter(e => e.month === month && e.status === 'Pending');
      
      pendingEntries.forEach(entry => {
        entry.status = 'Approved';
        entry.approvedAt = new Date().toISOString();
        entry.approvedBy = body.approvedBy;
      });
      
      return new Response(JSON.stringify({
        success: true,
        count: pendingEntries.length,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // PUT /api/payroll/{id}/reimbursements
    if (method === 'PUT' && url.match(/^\/api\/payroll\/[^\/]+\/reimbursements$/)) {
      const id = url.split('/')[3];
      await delay(300);
      
      const entry = mockPayrollEntries.find(e => e.id === id);
      if (!entry) {
        return new Response(JSON.stringify({ error: 'Payroll entry not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      
      const body = JSON.parse(init?.body as string);
      entry.reimbursements = body.reimbursements;
      
      // Recalculate net payable
      const grossSalary = entry.basicSalary + entry.hra + entry.allowances + entry.reimbursements + (entry.incentiveAdjustment || 0);
      const totalDeductions = entry.deductions.pf + entry.deductions.esi + entry.deductions.pt + entry.deductions.tds + entry.lossOfPay;
      entry.netPayable = grossSalary - totalDeductions + entry.roundOffAdjustment;
      
      return new Response(JSON.stringify(entry), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // GET /api/payroll/export/{month}
    if (method === 'GET' && url.match(/^\/api\/payroll\/export\/\d{4}-\d{2}/)) {
      const month = url.split('/')[4];
      await delay(1000);
      
      const urlParams = new URLSearchParams(url.split('?')[1] || '');
      const format = urlParams.get('format') || 'excel';
      
      // Mock file content
      const content = format === 'excel' ? 
        'Employee ID,Name,Net Payable\n' + mockPayrollEntries
          .filter(e => e.month === month)
          .map(e => `${e.employeeId},${e.employeeName},${e.netPayable}`)
          .join('\n') :
        mockPayrollEntries
          .filter(e => e.month === month && e.status === 'Approved')
          .map(e => `${e.employeeId}|${e.employeeName}|${e.netPayable}`)
          .join('\n');
      
      const blob = new Blob([content], { 
        type: format === 'excel' ? 'application/vnd.ms-excel' : 'text/plain' 
      });
      
      return new Response(blob, {
        status: 200,
        headers: { 
          'Content-Type': format === 'excel' ? 'application/vnd.ms-excel' : 'text/plain',
          'Content-Disposition': `attachment; filename="payroll-${month}.${format === 'excel' ? 'csv' : 'txt'}"`,
        },
      });
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
