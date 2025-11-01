import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { createEmployee, updateEmployee } from '@/api/employees';
import { DEPARTMENTS, EMPLOYEE_STATUSES } from '@/types/employee';
import { calculateSalaryBreakup, calculateIncentiveAmount, formatCurrency } from '@/utils/salaryCalculations';
import type { Employee } from '@/types/employee';

const employeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  contactNumber: z.string().min(10, 'Contact number must be at least 10 digits'),
  designation: z.string().min(1, 'Designation is required'),
  department: z.string().min(1, 'Department is required'),
  joinDate: z.string().min(1, 'Join date is required'),
  ctc: z.number().min(1, 'CTC must be greater than 0'),
  status: z.enum(['Active', 'On Notice', 'Resigned']),
  resignationDate: z.string().optional(),
  includeHalfYearlyIncentive: z.boolean(),
  incentivePercentage: z.number().min(0).max(100),
  joiningBonusEnabled: z.boolean(),
  joiningBonusAmount: z.number().min(0),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  employee?: Employee;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EmployeeForm({ employee, onSuccess, onCancel }: EmployeeFormProps) {
  const { toast } = useToast();
  const isEditing = !!employee;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: employee?.name || '',
      email: employee?.email || '',
      contactNumber: employee?.contactNumber || '',
      designation: employee?.designation || '',
      department: employee?.department || '',
      joinDate: employee?.joinDate ? employee.joinDate.split('T')[0] : '',
      ctc: employee?.ctc || 0,
      status: employee?.status || 'Active',
      resignationDate: employee?.resignationDate ? employee.resignationDate.split('T')[0] : '',
      includeHalfYearlyIncentive: employee?.incentives?.includeHalfYearlyIncentive || false,
      incentivePercentage: employee?.incentives?.incentivePercentage || 10,
      joiningBonusEnabled: employee?.joiningBonus?.enabled || false,
      joiningBonusAmount: employee?.joiningBonus?.amount || 0,
    },
  });

  const watchedValues = watch();
  const { ctc, includeHalfYearlyIncentive, incentivePercentage, status } = watchedValues;

  // Calculate salary breakup in real-time
  const salaryBreakup = ctc > 0 ? calculateSalaryBreakup({ ctc }) : null;
  const incentiveAmount = includeHalfYearlyIncentive ? calculateIncentiveAmount(ctc, incentivePercentage) : 0;

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      const salaryBreakup = calculateSalaryBreakup({ ctc: data.ctc });
      
      const employeeData = {
        name: data.name,
        email: data.email,
        contactNumber: data.contactNumber,
        designation: data.designation,
        department: data.department,
        joinDate: data.joinDate,
        ctc: data.ctc,
        status: data.status,
        resignationDate: data.status === 'Resigned' ? data.resignationDate : undefined,
        salaryBreakup,
        incentives: {
          includeHalfYearlyIncentive: data.includeHalfYearlyIncentive,
          incentivePercentage: data.incentivePercentage,
          incentiveAmount: calculateIncentiveAmount(data.ctc, data.incentivePercentage),
        },
        joiningBonus: {
          enabled: data.joiningBonusEnabled,
          amount: data.joiningBonusAmount,
        },
      };

      if (isEditing && employee) {
        await updateEmployee(employee.id, employeeData);
        toast({
          title: "Success",
          description: "Employee updated successfully",
        });
      } else {
        await createEmployee(employeeData);
        toast({
          title: "Success",
          description: "Employee added successfully",
        });
      }

      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: isEditing ? "Failed to update employee" : "Failed to add employee",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactNumber">Contact Number *</Label>
            <Input
              id="contactNumber"
              {...register('contactNumber')}
              placeholder="Enter contact number"
            />
            {errors.contactNumber && (
              <p className="text-sm text-red-600">{errors.contactNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation">Designation *</Label>
            <Input
              id="designation"
              {...register('designation')}
              placeholder="Enter designation"
            />
            {errors.designation && (
              <p className="text-sm text-red-600">{errors.designation.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select onValueChange={(value) => setValue('department', value)} defaultValue={watchedValues.department}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && (
              <p className="text-sm text-red-600">{errors.department.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="joinDate">Join Date *</Label>
            <Input
              id="joinDate"
              type="date"
              {...register('joinDate')}
            />
            {errors.joinDate && (
              <p className="text-sm text-red-600">{errors.joinDate.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* CTC & Salary Structure */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">CTC & Salary Structure</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ctc">CTC (Annual) *</Label>
            <Input
              id="ctc"
              type="number"
              {...register('ctc', { valueAsNumber: true })}
              placeholder="Enter annual CTC"
            />
            {errors.ctc && (
              <p className="text-sm text-red-600">{errors.ctc.message}</p>
            )}
          </div>
        </div>

        {/* Salary Breakup Display */}
        {salaryBreakup && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Salary Breakup</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Basic (40%):</span>
                <span className="ml-2 font-medium">{formatCurrency(salaryBreakup.basic)}</span>
              </div>
              <div>
                <span className="text-gray-600">HRA (20%):</span>
                <span className="ml-2 font-medium">{formatCurrency(salaryBreakup.hra)}</span>
              </div>
              <div>
                <span className="text-gray-600">Allowances (25%):</span>
                <span className="ml-2 font-medium">{formatCurrency(salaryBreakup.allowances)}</span>
              </div>
              <div>
                <span className="text-gray-600">PF (12% of Basic):</span>
                <span className="ml-2 font-medium">{formatCurrency(salaryBreakup.pf)}</span>
              </div>
              <div>
                <span className="text-gray-600">ESI:</span>
                <span className="ml-2 font-medium">{formatCurrency(salaryBreakup.esi)}</span>
              </div>
              <div className="font-semibold">
                <span className="text-gray-600">Monthly Salary:</span>
                <span className="ml-2">{formatCurrency(salaryBreakup.monthlySalary)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Incentive Configuration */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="includeHalfYearlyIncentive"
              checked={includeHalfYearlyIncentive}
              onCheckedChange={(checked) => setValue('includeHalfYearlyIncentive', checked)}
            />
            <Label htmlFor="includeHalfYearlyIncentive">Include Half-Yearly Incentive</Label>
          </div>

          {includeHalfYearlyIncentive && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="incentivePercentage">Incentive Percentage</Label>
                <Input
                  id="incentivePercentage"
                  type="number"
                  min="0"
                  max="100"
                  {...register('incentivePercentage', { valueAsNumber: true })}
                  placeholder="Enter incentive percentage"
                />
              </div>
              <div className="space-y-2">
                <Label>Incentive Amount</Label>
                <div className="p-2 bg-gray-50 rounded border text-sm font-medium">
                  {formatCurrency(incentiveAmount)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Joining Bonus */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="joiningBonusEnabled"
              checked={watchedValues.joiningBonusEnabled}
              onCheckedChange={(checked) => setValue('joiningBonusEnabled', checked)}
            />
            <Label htmlFor="joiningBonusEnabled">Include Joining Bonus</Label>
          </div>

          {watchedValues.joiningBonusEnabled && (
            <div className="space-y-2">
              <Label htmlFor="joiningBonusAmount">Joining Bonus Amount</Label>
              <Input
                id="joiningBonusAmount"
                type="number"
                min="0"
                {...register('joiningBonusAmount', { valueAsNumber: true })}
                placeholder="Enter joining bonus amount"
              />
            </div>
          )}
        </div>
      </div>

      {/* Employment Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Employment Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select onValueChange={(value) => setValue('status', value as any)} defaultValue={status}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYEE_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {status === 'Resigned' && (
            <div className="space-y-2">
              <Label htmlFor="resignationDate">Resignation Date</Label>
              <Input
                id="resignationDate"
                type="date"
                {...register('resignationDate')}
              />
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Employee' : 'Add Employee'}
        </Button>
      </div>
    </form>
  );
}

