import React, { createContext, useContext, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, firstName: string, lastName?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@wic_user';
const USERS_KEY = '@wic_users';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load stored users (simulating a database)
  const getStoredUsers = async (): Promise<Record<string, any>> => {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      return usersJson ? JSON.parse(usersJson) : {};
    } catch {
      return {};
    }
  };

  // Save users
  const saveUsers = async (users: Record<string, any>) => {
    try {
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save users:', error);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const users = await getStoredUsers();
      const userKey = email.toLowerCase();
      const storedUser = users[userKey];

      if (!storedUser) {
        return { success: false, error: 'No account found with this email' };
      }

      if (storedUser.password !== password) {
        return { success: false, error: 'Incorrect password' };
      }

      const userData: User = {
        id: storedUser.id,
        email: storedUser.email,
        firstName: storedUser.firstName,
        lastName: storedUser.lastName,
      };

      setUser(userData);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred during sign in' };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const users = await getStoredUsers();
      const userKey = email.toLowerCase();

      if (users[userKey]) {
        return { success: false, error: 'An account with this email already exists' };
      }

      const newUser = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        password, // In a real app, this would be hashed
        firstName,
        lastName,
      };

      users[userKey] = newUser;
      await saveUsers(users);

      const userData: User = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      };

      setUser(userData);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred during sign up' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const users = await getStoredUsers();
      const userKey = email.toLowerCase();

      if (!users[userKey]) {
        return { success: false, error: 'No account found with this email' };
      }

      // In a real app, this would send a reset email
      // For prototype, we'll just return success
      return { success: true };
    } catch (error) {
      return { success: false, error: 'An error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
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
