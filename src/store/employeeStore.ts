import { create } from 'zustand';
import type { Employee, EmployeeFilters } from '@/types/employee';

interface EmployeeState {
  employees: Employee[];
  filters: EmployeeFilters;
  loading: boolean;
  setEmployees: (employees: Employee[]) => void;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  setFilters: (filters: Partial<EmployeeFilters>) => void;
  setLoading: (loading: boolean) => void;
  getFilteredEmployees: () => Employee[];
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
  employees: [],
  filters: {
    search: '',
    department: '',
    status: '',
    joinedMonth: '',
  },
  loading: false,

  setEmployees: (employees) => set({ employees }),
  
  addEmployee: (employee) => 
    set((state) => ({ employees: [...state.employees, employee] })),
  
  updateEmployee: (id, updatedEmployee) =>
    set((state) => ({
      employees: state.employees.map((emp) =>
        emp.id === id ? { ...emp, ...updatedEmployee } : emp
      ),
    })),
  
  deleteEmployee: (id) =>
    set((state) => ({
      employees: state.employees.filter((emp) => emp.id !== id),
    })),
  
  setFilters: (newFilters) =>
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  
  setLoading: (loading) => set({ loading }),
  
  getFilteredEmployees: () => {
    const { employees, filters } = get();
    
    return employees.filter((employee) => {
      const matchesSearch = 
        employee.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        employee.department.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesDepartment = 
        !filters.department || employee.department === filters.department;
      
      const matchesStatus = 
        !filters.status || employee.status === filters.status;
      
      const matchesJoinedMonth = 
        !filters.joinedMonth || 
        new Date(employee.joinDate).toLocaleString('default', { month: 'long' }) === filters.joinedMonth;
      
      return matchesSearch && matchesDepartment && matchesStatus && matchesJoinedMonth;
    });
  },
}));

