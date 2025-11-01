import React, { useEffect, useState } from 'react';
import { 
  Calculator, 
  CheckCircle, 
  Download, 
  FileSpreadsheet, 
  Search, 
  Eye, 
  Check, 
  X, 
  AlertCircle,
  Users,
  DollarSign,
  Clock,
  TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { usePayrollStore } from '@/store/payrollStore';
import { useToast } from '@/hooks/use-toast';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { PayrollBreakdownModal } from '@/components/PayrollBreakdown';
import { 
  getPayrollEntries, 
  getPayrollSummary, 
  calculatePayroll, 
  approvePayrollEntry, 
  rejectPayrollEntry,
  getPayrollBreakdown,
  exportPayroll,
  approveAllPayroll,
  updateReimbursements
} from '@/api/payroll';
import { formatCurrency, formatMonth, getMonthOptions } from '@/utils/payrollCalculations';
import type { PayrollBreakdown, PayrollStatus } from '@/types/payroll';
import { PAYROLL_STATUSES } from '@/types/payroll';

export function PayrollProcessing() {
  const {
    payrollEntries,
    summary,
    filters,
    loading,
    calculating,
    calculationProgress,
    selectedMonth,
    setPayrollEntries,
    setSummary,
    setFilters,
    setLoading,
    setCalculating,
    setCalculationProgress,
    setSelectedMonth,
    updatePayrollEntry,
    approvePayrollEntry: approveEntry,
    rejectPayrollEntry: rejectEntry,
    approveAllPayroll: approveAll,
    getFilteredPayrollEntries,
  } = usePayrollStore();

  const { toast } = useToast();
  const [breakdown, setBreakdown] = useState<PayrollBreakdown | null>(null);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingEntryId, setRejectingEntryId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [editingReimbursements, setEditingReimbursements] = useState<{ [key: string]: number }>({});

  const monthOptions = getMonthOptions();
  const filteredEntries = getFilteredPayrollEntries();

  useEffect(() => {
    loadPayrollData();
  }, [selectedMonth]);

  const loadPayrollData = async () => {
    try {
      setLoading(true);
      const [entries, summaryData] = await Promise.all([
        getPayrollEntries(selectedMonth),
        getPayrollSummary(selectedMonth),
      ]);
      setPayrollEntries(entries);
      setSummary(summaryData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payroll data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCalculatePayroll = async () => {
    try {
      setCalculating(true);
      setCalculationProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setCalculationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const result = await calculatePayroll({
        month: selectedMonth,
        recalculate: true,
      });

      clearInterval(progressInterval);
      setCalculationProgress(100);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        await loadPayrollData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to calculate payroll",
        variant: "destructive",
      });
    } finally {
      setCalculating(false);
      setCalculationProgress(0);
    }
  };

  const handleApproveAll = async () => {
    try {
      const result = await approveAllPayroll(selectedMonth, 'HR Admin');
      approveAll('HR Admin');
      
      toast({
        title: "Success",
        description: `Approved ${result.count} payroll entries`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve all payroll entries",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approvePayrollEntry(id, 'HR Admin');
      approveEntry(id, 'HR Admin');
      
      toast({
        title: "Success",
        description: "Payroll entry approved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve payroll entry",
        variant: "destructive",
      });
    }
  };

  const handleReject = (id: string) => {
    setRejectingEntryId(id);
    setIsRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!rejectingEntryId || !rejectionReason.trim()) return;

    try {
      await rejectPayrollEntry(rejectingEntryId, 'HR Admin', rejectionReason);
      rejectEntry(rejectingEntryId, 'HR Admin', rejectionReason);
      
      toast({
        title: "Success",
        description: "Payroll entry rejected",
      });
      
      setIsRejectModalOpen(false);
      setRejectingEntryId(null);
      setRejectionReason('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject payroll entry",
        variant: "destructive",
      });
    }
  };

  const handleViewBreakdown = async (id: string) => {
    try {
      const breakdownData = await getPayrollBreakdown(id);
      setBreakdown(breakdownData);
      setIsBreakdownOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payroll breakdown",
        variant: "destructive",
      });
    }
  };

  const handleExport = async (format: 'excel' | 'bank_file') => {
    try {
      const blob = await exportPayroll({
        month: selectedMonth,
        format,
        includeRejected: false,
      });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payroll-${selectedMonth}.${format === 'excel' ? 'xlsx' : 'txt'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: `${format === 'excel' ? 'Excel file' : 'Bank file'} downloaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export payroll data",
        variant: "destructive",
      });
    }
  };

  const handleReimbursementChange = (id: string, value: number) => {
    setEditingReimbursements(prev => ({ ...prev, [id]: value }));
  };

  const handleReimbursementSave = async (id: string) => {
    const newValue = editingReimbursements[id];
    if (newValue === undefined) return;

    try {
      await updateReimbursements(id, newValue);
      updatePayrollEntry(id, { reimbursements: newValue });
      
      // Remove from editing state
      setEditingReimbursements(prev => {
        const { [id]: _, ...rest } = prev;
        return rest;
      });

      toast({
        title: "Success",
        description: "Reimbursements updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reimbursements",
        variant: "destructive",
      });
    }
  };

  const getStatusBadgeColor = (status: PayrollStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payroll Processing</h1>
          <p className="text-gray-600 mt-1">Review and approve monthly payroll before disbursement</p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.totalEmployees}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Payroll</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalPayrollAmount)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-gray-900">{summary.pendingApprovals}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Incentive Adjustments</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalIncentiveAdjustments)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calculation Progress */}
        {calculating && (
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Calculating Payroll...</h3>
              <span className="text-sm text-gray-600">{calculationProgress}%</span>
            </div>
            <Progress value={calculationProgress} className="w-full" />
            <p className="text-sm text-gray-600 mt-2">
              Processing employee data and calculating salary components...
            </p>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border">
          {/* Month Selector */}
          <div className="flex-1">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleCalculatePayroll} 
              disabled={calculating}
              className="flex items-center gap-2"
            >
              <Calculator className="h-4 w-4" />
              Auto Calculate Payroll
            </Button>
            <Button 
              onClick={handleApproveAll}
              disabled={calculating || filteredEntries.filter(e => e.status === 'Pending').length === 0}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Approve All
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleExport('excel')}
              className="flex items-center gap-2"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Download Excel
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleExport('bank_file')}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Generate Bank File
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by employee name or ID..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="pl-10"
            />
          </div>
          <Select value={filters.status} onValueChange={(value) => setFilters({ status: value as PayrollStatus | '' })}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              {PAYROLL_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payroll Table */}
        <div className="bg-white rounded-lg border">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading payroll data...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>HRA</TableHead>
                    <TableHead>Allowances</TableHead>
                    <TableHead>Reimbursements</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Loss of Pay</TableHead>
                    <TableHead>Net Payable</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                        No payroll entries found for {formatMonth(selectedMonth)}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">{entry.employeeId}</TableCell>
                        <TableCell>{entry.employeeName}</TableCell>
                        <TableCell>{formatCurrency(entry.basicSalary)}</TableCell>
                        <TableCell>{formatCurrency(entry.hra)}</TableCell>
                        <TableCell>{formatCurrency(entry.allowances)}</TableCell>
                        <TableCell>
                          {editingReimbursements[entry.id] !== undefined ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={editingReimbursements[entry.id]}
                                onChange={(e) => handleReimbursementChange(entry.id, Number(e.target.value))}
                                className="w-20"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleReimbursementSave(entry.id)}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setEditingReimbursements(prev => ({ ...prev, [entry.id]: entry.reimbursements }))}
                              className="text-blue-600 hover:underline"
                            >
                              {formatCurrency(entry.reimbursements)}
                            </button>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(entry.deductions.pf + entry.deductions.esi + entry.deductions.pt + entry.deductions.tds)}
                        </TableCell>
                        <TableCell>{formatCurrency(entry.lossOfPay)}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(entry.netPayable)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(entry.status)}`}>
                            {entry.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewBreakdown(entry.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {entry.status === 'Pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleApprove(entry.id)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleReject(entry.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Payroll Breakdown Modal */}
        <PayrollBreakdownModal
          breakdown={breakdown}
          isOpen={isBreakdownOpen}
          onClose={() => setIsBreakdownOpen(false)}
        />

        {/* Reject Modal */}
        <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Reject Payroll Entry
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                Please provide a reason for rejecting this payroll entry:
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full p-3 border rounded-lg resize-none h-24"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={confirmReject}
                  disabled={!rejectionReason.trim()}
                >
                  Reject Entry
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

