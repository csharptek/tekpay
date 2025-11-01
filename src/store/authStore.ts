import { create } from 'zustand';

export type Role = 'HR' | 'Employee';

interface AuthState {
  token: string | null;
  role: Role | null;
  hydrated: boolean;
  setUser: (token: string, role: Role) => void;
  logout: () => void;
}

const TOKEN_KEY = 'tekpay_token';
const ROLE_KEY = 'tekpay_role';

export const useAuthStore = create<AuthState>((set) => {
  // Hydrate from localStorage when store is first used
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  const role = (typeof window !== 'undefined' ? (localStorage.getItem(ROLE_KEY) as Role | null) : null) || null;

  return {
    token,
    role,
    hydrated: true,
    setUser: (token: string, role: Role) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(ROLE_KEY, role);
      }
      set({ token, role });
    },
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ROLE_KEY);
      }
      set({ token: null, role: null });
    },
  };
});

