import type { LoginRequest, LoginResponse } from '../types/auth';
import { UserRole } from '../types/auth';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Mock API call for now - replace with actual API call later
      const response = await this.mockLogin(credentials);
      return response;
      
      // Actual API call would be:
      // const response = await fetch(`${API_BASE_URL}/auth/login`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(credentials),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Login failed');
      // }
      
      // return await response.json();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  }

  // Mock login for development - remove when backend is ready
  private async mockLogin(credentials: LoginRequest): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock users for testing
    const mockUsers = [
      {
        id: 1,
        email: 'hr@csharptek.com',
        password: 'password123',
        firstName: 'HR',
        lastName: 'Manager',
        role: UserRole.HR,
        isActive: true,
      },
      {
        id: 2,
        email: 'employee@csharptek.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.Employee,
        isActive: true,
      },
    ];

    const user = mockUsers.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return {
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
      user: userWithoutPassword,
    };
  }

  logout(): void {
    // Clear any stored tokens or session data
    localStorage.removeItem('auth-storage');
  }

  getStoredToken(): string | null {
    try {
      const stored = localStorage.getItem('auth-storage');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.state?.token || null;
      }
    } catch (error) {
      console.error('Error reading stored token:', error);
    }
    return null;
  }
}

export const authService = new AuthService();
