import { create } from 'zustand';

export type Role = 'HR' | 'Employee';

interface AuthState {
  token: string | null;
  role: Role | null;
  userName: string | null;
  hydrated: boolean;
  setUser: (token: string, role: Role, userName?: string) => void;
  logout: () => void;
}

const TOKEN_KEY = 'tekpay_token';
const ROLE_KEY = 'tekpay_role';
const USERNAME_KEY = 'tekpay_username';

export const useAuthStore = create<AuthState>((set) => {
  // Hydrate from localStorage when store is first used
  const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  const role = (typeof window !== 'undefined' ? (localStorage.getItem(ROLE_KEY) as Role | null) : null) || null;
  const userName = typeof window !== 'undefined' ? localStorage.getItem(USERNAME_KEY) : null;

  return {
    token,
    role,
    userName,
    hydrated: true,
    setUser: (token: string, role: Role, userName?: string) => {
      const finalUserName = userName || (role === 'HR' ? 'HR Manager' : 'Employee');
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(ROLE_KEY, role);
        localStorage.setItem(USERNAME_KEY, finalUserName);
      }
      set({ token, role, userName: finalUserName });
    },
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(ROLE_KEY);
        localStorage.removeItem(USERNAME_KEY);
      }
      set({ token: null, role: null, userName: null });
    },
  };
});
