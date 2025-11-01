import type { 
  PayrollEntry, 
  PayrollSummary, 
  PayrollBreakdown, 
  PayrollCalculationRequest,
  PayrollExportOptions 
} from '@/types/payroll';

export async function getPayrollEntries(month: string): Promise<PayrollEntry[]> {
  const response = await fetch(`/api/payroll/${month}`);
  if (!response.ok) {
    throw new Error('Failed to fetch payroll entries');
  }
  return response.json();
}

export async function getPayrollSummary(month: string): Promise<PayrollSummary> {
  const response = await fetch(`/api/payroll/${month}/summary`);
  if (!response.ok) {
    throw new Error('Failed to fetch payroll summary');
  }
  return response.json();
}

export async function calculatePayroll(request: PayrollCalculationRequest): Promise<{ success: boolean; message: string }> {
  const response = await fetch('/api/payroll/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    throw new Error('Failed to calculate payroll');
  }
  
  return response.json();
}

export async function approvePayrollEntry(id: string, approvedBy: string): Promise<PayrollEntry> {
  const response = await fetch(`/api/payroll/${id}/approve`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ approvedBy }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to approve payroll entry');
  }
  
  return response.json();
}

export async function rejectPayrollEntry(
  id: string, 
  rejectedBy: string, 
  reason: string
): Promise<PayrollEntry> {
  const response = await fetch(`/api/payroll/${id}/reject`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ rejectedBy, reason }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to reject payroll entry');
  }
  
  return response.json();
}

export async function getPayrollBreakdown(id: string): Promise<PayrollBreakdown> {
  const response = await fetch(`/api/payroll/${id}/breakdown`);
  if (!response.ok) {
    throw new Error('Failed to fetch payroll breakdown');
  }
  return response.json();
}

export async function exportPayroll(options: PayrollExportOptions): Promise<Blob> {
  const queryParams = new URLSearchParams({
    format: options.format,
    ...(options.includeRejected && { includeRejected: 'true' }),
  });

  const response = await fetch(`/api/payroll/export/${options.month}?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to export payroll');
  }
  
  return response.blob();
}

export async function approveAllPayroll(month: string, approvedBy: string): Promise<{ success: boolean; count: number }> {
  const response = await fetch(`/api/payroll/${month}/approve-all`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ approvedBy }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to approve all payroll entries');
  }
  
  return response.json();
}

export async function updateReimbursements(
  id: string, 
  reimbursements: number
): Promise<PayrollEntry> {
  const response = await fetch(`/api/payroll/${id}/reimbursements`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reimbursements }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update reimbursements');
  }
  
  return response.json();
}

