
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

// Define user roles
export type UserRole = 'headteacher' | 'teacher' | 'student';

// Define user permission types
export type Permission = 
  | 'add_users'
  | 'view_all_users' 
  | 'manage_permissions' 
  | 'set_homework'
  | 'view_user_credentials'
  | 'set_sanctions'
  | 'set_rewards'
  | 'make_announcements';

// Define user interface
export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  permissions: Permission[];
  yearGroup?: string;
  class?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample headteacher account
const HEADTEACHER_ACCOUNT = {
  id: '1',
  username: 'Learnerair',
  password: 'LEARNERAIR',
  fullName: 'Head Teacher',
  role: 'headteacher' as UserRole,
  permissions: [
    'add_users',
    'view_all_users',
    'manage_permissions',
    'set_homework',
    'view_user_credentials',
    'set_sanctions',
    'set_rewards',
    'make_announcements'
  ] as Permission[]
};

// Initial user data for demonstration purposes
const INITIAL_USERS = [
  HEADTEACHER_ACCOUNT,
  {
    id: '2',
    username: 'teacher1',
    password: 'password123',
    fullName: 'John Smith',
    role: 'teacher' as UserRole,
    permissions: ['set_homework', 'set_sanctions', 'set_rewards', 'make_announcements'] as Permission[]
  },
  {
    id: '3',
    username: 'student1',
    password: 'student123',
    fullName: 'Emma Johnson',
    role: 'student' as UserRole,
    yearGroup: '10',
    class: '10A',
    permissions: [] as Permission[]
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Initialize users in localStorage if they don't exist
  useEffect(() => {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify(INITIAL_USERS));
    }
    
    // Check for existing session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find(
        (u: any) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
      );
      
      if (foundUser) {
        // Create user session without password
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        
        toast.success(`Welcome back, ${foundUser.fullName}`);
        navigate('/dashboard');
      } else {
        toast.error('Invalid username or password');
      }
    } catch (error) {
      toast.error('An error occurred during login');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
