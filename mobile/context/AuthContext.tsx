import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearUserData } from '../utils/storageUtils';

interface User {
  id: string;
  email?: string; // legacy prototype email
  firstName: string;
  lastName?: string;
  cardNumber?: string; // WIC EBT card number for card-only auth
  state?: string; // Selected state/program
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // Legacy email/password prototype auth
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, firstName: string, lastName?: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  // Card-based auth for WIC flow
  signInCard: (cardNumber: string, state: string) => Promise<{ success: boolean; error?: string }>;
  // Guest/skip sign in for prototype
  signInGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  // Update user profile
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = '@wic_user';
const USERS_KEY = '@wic_users';
const FIRST_NAME_KEY = '@first_name'; // Shared key with EditProfileScreen

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true to check stored session

  // Restore user session on app startup
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [storedUser, storedFirstName] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(FIRST_NAME_KEY),
        ]);
        
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          // Override with stored first name if available
          if (storedFirstName) {
            userData.firstName = storedFirstName;
          }
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

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

      // For prototyping: Allow any non-empty credentials
      if (!email || !password) {
        return { success: false, error: 'Please enter email and password' };
      }

      // Create a mock user from the provided email
      const userData: User = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        firstName: 'Ethan',
        lastName: 'Onyejesi',
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

  // Card-only sign in used in the WIC flow. Accepts any non-empty card number >= 8 chars.
  const signInCard = async (cardNumber: string, state: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 400)); // small simulated delay

      if (!cardNumber || cardNumber.trim().length < 8) {
        return { success: false, error: 'Card number must be at least 8 characters' };
      }
      if (!state) {
        return { success: false, error: 'Please select your state' };
      }

      const userData: User = {
        id: Date.now().toString(),
        firstName: 'Participant',
        cardNumber: cardNumber.trim(),
        state,
      };

      setUser(userData);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

      return { success: true };
    } catch (e) {
      return { success: false, error: 'An error occurred during card sign in' };
    } finally {
      setIsLoading(false);
    }
  };

  // Guest sign-in for skip flows
  const signInGuest = async (): Promise<void> => {
    try {
      const userData: User = {
        id: `guest-${Date.now()}`,
        firstName: 'Guest',
      };
      setUser(userData);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch (e) {
      // no-op for prototype
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
      // Clear user state first
      setUser(null);
      
      // Clear all user-specific AsyncStorage data using utility function
      await clearUserData();
      
      // Note: clearUserData preserves device-level preferences:
      // - '@wic_app_language' (language preference should persist across users)
      // - 'scannerSettings' (scanner audio/settings are device-level preferences)  
      // - '@wic_users' (stored users for login functionality)
      
    } catch (error) {
      console.error('Failed to sign out:', error);
      throw error; // Re-throw so UI can handle the error
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

  const updateUser = async (updates: Partial<User>) => {
    try {
      if (!user) return;
      
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      
      // Also save firstName separately for consistency with EditProfileScreen
      if (updates.firstName) {
        await AsyncStorage.setItem(FIRST_NAME_KEY, updates.firstName);
      }
    } catch (error) {
      console.error('Failed to update user:', error);
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
        signInCard,
        signInGuest,
        updateUser,
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
