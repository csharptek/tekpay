import { create } from 'zustand';
import type { PayrollEntry, PayrollSummary, PayrollFilters, PayrollStatus } from '@/types/payroll';

interface PayrollStore {
  // State
  payrollEntries: PayrollEntry[];
  summary: PayrollSummary | null;
  filters: PayrollFilters;
  loading: boolean;
  calculating: boolean;
  calculationProgress: number;
  selectedMonth: string;

  // Actions
  setPayrollEntries: (entries: PayrollEntry[]) => void;
  setSummary: (summary: PayrollSummary) => void;
  setFilters: (filters: Partial<PayrollFilters>) => void;
  setLoading: (loading: boolean) => void;
  setCalculating: (calculating: boolean) => void;
  setCalculationProgress: (progress: number) => void;
  setSelectedMonth: (month: string) => void;
  updatePayrollEntry: (id: string, updates: Partial<PayrollEntry>) => void;
  approvePayrollEntry: (id: string, approvedBy: string) => void;
  rejectPayrollEntry: (id: string, rejectedBy: string, reason: string) => void;
  approveAllPayroll: (approvedBy: string) => void;
  getFilteredPayrollEntries: () => PayrollEntry[];
  getPayrollEntryById: (id: string) => PayrollEntry | undefined;
}

// Helper function to get current month in YYYY-MM format
const getCurrentMonth = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export const usePayrollStore = create<PayrollStore>((set, get) => ({
  // Initial state
  payrollEntries: [],
  summary: null,
  filters: {
    month: getCurrentMonth(),
    status: '',
    search: '',
  },
  loading: false,
  calculating: false,
  calculationProgress: 0,
  selectedMonth: getCurrentMonth(),

  // Actions
  setPayrollEntries: (entries) => set({ payrollEntries: entries }),

  setSummary: (summary) => set({ summary }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  setLoading: (loading) => set({ loading }),

  setCalculating: (calculating) => set({ calculating }),

  setCalculationProgress: (progress) => set({ calculationProgress: progress }),

  setSelectedMonth: (month) => set({ selectedMonth: month }),

  updatePayrollEntry: (id, updates) =>
    set((state) => ({
      payrollEntries: state.payrollEntries.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry
      ),
    })),

  approvePayrollEntry: (id, approvedBy) =>
    set((state) => ({
      payrollEntries: state.payrollEntries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              status: 'Approved' as PayrollStatus,
              approvedAt: new Date().toISOString(),
              approvedBy,
              rejectedAt: undefined,
              rejectedBy: undefined,
              rejectionReason: undefined,
            }
          : entry
      ),
    })),

  rejectPayrollEntry: (id, rejectedBy, reason) =>
    set((state) => ({
      payrollEntries: state.payrollEntries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              status: 'Rejected' as PayrollStatus,
              rejectedAt: new Date().toISOString(),
              rejectedBy,
              rejectionReason: reason,
              approvedAt: undefined,
              approvedBy: undefined,
            }
          : entry
      ),
    })),

  approveAllPayroll: (approvedBy) =>
    set((state) => ({
      payrollEntries: state.payrollEntries.map((entry) =>
        entry.status === 'Pending'
          ? {
              ...entry,
              status: 'Approved' as PayrollStatus,
              approvedAt: new Date().toISOString(),
              approvedBy,
            }
          : entry
      ),
    })),

  getFilteredPayrollEntries: () => {
    const { payrollEntries, filters } = get();
    
    return payrollEntries.filter((entry) => {
      // Filter by month
      if (filters.month && entry.month !== filters.month) {
        return false;
      }

      // Filter by status
      if (filters.status && entry.status !== filters.status) {
        return false;
      }

      // Filter by search (employee name or ID)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = entry.employeeName.toLowerCase().includes(searchLower);
        const matchesId = entry.employeeId.toLowerCase().includes(searchLower);
        if (!matchesName && !matchesId) {
          return false;
        }
      }

      return true;
    });
  },

  getPayrollEntryById: (id) => {
    const { payrollEntries } = get();
    return payrollEntries.find((entry) => entry.id === id);
  },
}));

