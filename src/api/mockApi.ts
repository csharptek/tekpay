// Simple fetch mock for /api/auth/login
// In real app replace with actual API and remove this mock.
import type { Role } from '@/store/authStore';

const originalFetch = window.fetch.bind(window);

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input.toString();
  const method = init?.method?.toUpperCase() || 'GET';

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

  return originalFetch(input, init);
};

