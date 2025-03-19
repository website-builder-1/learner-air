
import { User, Permission, UserRole } from '../context/AuthContext';
import { toast } from "sonner";

// User with password for storage
interface UserWithPassword extends User {
  password: string;
}

export interface UserCreationData {
  username: string;
  password: string;
  fullName: string;
  role: UserRole;
  permissions: Permission[];
  yearGroup?: string;
  class?: string;
}

class UserService {
  private getUsers(): UserWithPassword[] {
    const usersJson = localStorage.getItem('users');
    if (!usersJson) return [];
    
    try {
      return JSON.parse(usersJson);
    } catch (error) {
      console.error('Error parsing users from localStorage:', error);
      return [];
    }
  }

  private saveUsers(users: UserWithPassword[]): void {
    try {
      localStorage.setItem('users', JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
      toast.error('Failed to save user data');
    }
  }

  getAllUsers(): Omit<UserWithPassword, 'password'>[] {
    const users = this.getUsers();
    return users.map(({ password, ...user }) => user);
  }

  getUserById(id: string): Omit<UserWithPassword, 'password'> | null {
    const users = this.getUsers();
    const user = users.find(u => u.id === id);
    
    if (!user) return null;
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  createUser(userData: UserCreationData): boolean {
    try {
      const users = this.getUsers();
      
      // Check if username already exists
      if (users.some(user => user.username.toLowerCase() === userData.username.toLowerCase())) {
        toast.error('Username already exists');
        return false;
      }
      
      // Create new user with ID
      const newUser: UserWithPassword = {
        id: Date.now().toString(),
        ...userData
      };
      
      // Add user to storage
      this.saveUsers([...users, newUser]);
      toast.success(`User ${userData.fullName} created successfully`);
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
      return false;
    }
  }

  updateUser(id: string, userData: Partial<UserCreationData>): boolean {
    try {
      const users = this.getUsers();
      const userIndex = users.findIndex(u => u.id === id);
      
      if (userIndex === -1) {
        toast.error('User not found');
        return false;
      }
      
      // Update user
      users[userIndex] = { ...users[userIndex], ...userData };
      this.saveUsers(users);
      
      // Update current user session if this is the logged in user
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        try {
          const parsedUser = JSON.parse(currentUser);
          if (parsedUser.id === id) {
            const { password, ...userWithoutPassword } = users[userIndex];
            localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
          }
        } catch (error) {
          console.error('Error updating current user:', error);
        }
      }
      
      toast.success('User updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
      return false;
    }
  }

  deleteUser(id: string): boolean {
    try {
      const users = this.getUsers();
      const filteredUsers = users.filter(u => u.id !== id);
      
      if (filteredUsers.length === users.length) {
        toast.error('User not found');
        return false;
      }
      
      this.saveUsers(filteredUsers);
      toast.success('User deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
      return false;
    }
  }

  // Get basic credentials for users - only available to users with view_user_credentials permission
  getUserCredentials(): { id: string; username: string; password: string; fullName: string }[] {
    try {
      const users = this.getUsers();
      return users.map(({ id, username, password, fullName }) => ({
        id,
        username,
        password,
        fullName
      }));
    } catch (error) {
      console.error('Error getting user credentials:', error);
      return [];
    }
  }
}

export const userService = new UserService();
