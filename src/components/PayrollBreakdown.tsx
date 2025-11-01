import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { PayrollBreakdown } from '@/types/payroll';
import { formatCurrency } from '@/utils/payrollCalculations';

interface PayrollBreakdownProps {
  breakdown: PayrollBreakdown | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PayrollBreakdownModal({ breakdown, isOpen, onClose }: PayrollBreakdownProps) {
  if (!breakdown) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Payroll Breakdown - {breakdown.employeeName}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee & Period Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">Employee Details</h3>
              <p className="text-sm text-gray-600">ID: {breakdown.employeeId}</p>
              <p className="text-sm text-gray-600">Name: {breakdown.employeeName}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Salary Period</h3>
              <p className="text-sm text-gray-600">
                {breakdown.salaryPeriod.from} to {breakdown.salaryPeriod.to}
              </p>
              <p className="text-sm text-gray-600">Month: {breakdown.month}</p>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Attendance Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{breakdown.attendance.workingDays}</p>
                <p className="text-sm text-gray-600">Working Days</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{breakdown.attendance.presentDays}</p>
                <p className="text-sm text-gray-600">Present Days</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{breakdown.attendance.absentDays}</p>
                <p className="text-sm text-gray-600">Absent Days</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{breakdown.attendance.lopDays}</p>
                <p className="text-sm text-gray-600">LOP Days</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings */}
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Earnings</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Basic Salary</span>
                  <span className="font-medium">{formatCurrency(breakdown.earnings.basicSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">HRA</span>
                  <span className="font-medium">{formatCurrency(breakdown.earnings.hra)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Allowances</span>
                  <span className="font-medium">{formatCurrency(breakdown.earnings.allowances)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reimbursements</span>
                  <span className="font-medium">{formatCurrency(breakdown.earnings.reimbursements)}</span>
                </div>
                {breakdown.earnings.incentiveAdjustment !== 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Incentive Adjustment</span>
                    <span className={`font-medium ${breakdown.earnings.incentiveAdjustment > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(breakdown.earnings.incentiveAdjustment)}
                    </span>
                  </div>
                )}
                <hr className="border-gray-300" />
                <div className="flex justify-between font-semibold text-green-700">
                  <span>Total Earnings</span>
                  <span>{formatCurrency(breakdown.earnings.totalEarnings)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="p-4 bg-red-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Deductions</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">PF (12%)</span>
                  <span className="font-medium">{formatCurrency(breakdown.deductions.pf)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ESI (0.75%)</span>
                  <span className="font-medium">{formatCurrency(breakdown.deductions.esi)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Professional Tax</span>
                  <span className="font-medium">{formatCurrency(breakdown.deductions.pt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TDS (10%)</span>
                  <span className="font-medium">{formatCurrency(breakdown.deductions.tds)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loss of Pay</span>
                  <span className="font-medium">{formatCurrency(breakdown.deductions.lossOfPay)}</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between font-semibold text-red-700">
                  <span>Total Deductions</span>
                  <span>{formatCurrency(breakdown.deductions.totalDeductions)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Payable Summary */}
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="space-y-3">
              <div className="flex justify-between text-lg">
                <span className="font-medium">Net Payable</span>
                <span className="font-semibold">{formatCurrency(breakdown.netPayable)}</span>
              </div>
              {breakdown.roundOffAdjustment !== 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Round Off Adjustment</span>
                  <span>{formatCurrency(breakdown.roundOffAdjustment)}</span>
                </div>
              )}
              <hr className="border-gray-400" />
              <div className="flex justify-between text-xl font-bold text-blue-600">
                <span>Final Amount</span>
                <span>{formatCurrency(breakdown.finalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Calculation Notes */}
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Calculation Notes</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Salary calculated for period: {breakdown.salaryPeriod.from} to {breakdown.salaryPeriod.to}</li>
              <li>• Pro-rata calculation based on present days vs working days</li>
              <li>• PF calculated at 12% of basic salary</li>
              <li>• ESI applicable for monthly salary below ₹21,000</li>
              <li>• Professional Tax applicable for monthly salary above ₹21,000</li>
              <li>• TDS applicable for monthly salary above ₹50,000</li>
              <li>• Final amount rounded to nearest ₹10</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

