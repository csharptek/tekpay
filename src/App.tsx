import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HRDashboard from './pages/Dashboard/HRDashboard';
import EmployeeDashboard from './pages/Dashboard/EmployeeDashboard';
import Employees from './pages/HR/Employees';
import PayrollProcessing from './pages/HR/PayrollProcessing';
import Incentives from './pages/HR/Incentives';
import Settings from './pages/HR/Settings';
import Reports from './pages/HR/Reports';
import { useAuthStore } from './store/authStore';

function RequireAuth({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function RequireRole({ children, role }: { children: JSX.Element; role: 'HR' | 'Employee' }) {
  const userRole = useAuthStore((s) => s.role);
  if (userRole !== role) {
    // If logged in but wrong role, send to their dashboard if possible
    if (userRole === 'HR') return <Navigate to="/dashboard/hr" replace />;
    if (userRole === 'Employee') return <Navigate to="/dashboard/employee" replace />;
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  // Hydrate auth state from localStorage on first mount
  useAuthStore((s) => s.hydrated);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard/hr"
        element={
          <RequireAuth>
            <RequireRole role="HR">
              <HRDashboard />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
        path="/dashboard/employee"
        element={
          <RequireAuth>
            <RequireRole role="Employee">
              <EmployeeDashboard />
            </RequireRole>
          </RequireAuth>
        }
      />
      
      {/* HR-specific routes */}
      <Route
        path="/hr/employees"
        element={
          <RequireAuth>
            <RequireRole role="HR">
              <Employees />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
        path="/hr/payroll"
        element={
          <RequireAuth>
            <RequireRole role="HR">
              <PayrollProcessing />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
        path="/hr/incentives"
        element={
          <RequireAuth>
            <RequireRole role="HR">
              <Incentives />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
        path="/hr/settings"
        element={
          <RequireAuth>
            <RequireRole role="HR">
              <Settings />
            </RequireRole>
          </RequireAuth>
        }
      />
      <Route
        path="/hr/reports"
        element={
          <RequireAuth>
            <RequireRole role="HR">
              <Reports />
            </RequireRole>
          </RequireAuth>
        }
      />
      
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
