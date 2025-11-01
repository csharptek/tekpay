import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@/api/auth';
import { useAuthStore } from '@/store/authStore';
import Logo from '@/shared/Logo';

function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export default function LoginPage() {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const role = useAuthStore((s) => s.role);
  const token = useAuthStore((s) => s.token);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to their dashboard
  useMemo(() => {
    if (token && role) {
      navigate(role === 'HR' ? '/dashboard/hr' : '/dashboard/employee', { replace: true });
    }
  }, [token, role, navigate]);

  const canSubmit = email && password && validateEmail(email) && !loading;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email, password });
      setUser(res.token, res.role);
      navigate(res.role === 'HR' ? '/dashboard/hr' : '/dashboard/employee', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Logo className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Sign in to TekPay</h2>
          <p className="mt-2 text-sm text-gray-600">Payroll Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-6 rounded-xl shadow">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring-brand"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="#" className="font-medium text-brand hover:text-brand-dark">
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={!canSubmit}
              className="group relative flex w-full justify-center rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-500 text-center">Tip: use an email containing “hr” to sign in as HR.</p>
      </div>
    </div>
  );
}

