import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Utility functions for managing AsyncStorage data, especially during sign out
 */

// All known AsyncStorage keys used in the app
export const STORAGE_KEYS = {
  // User authentication and session
  USER: '@wic_user',
  USERS: '@wic_users', // Stored users for login (preserved on sign out)
  FIRST_NAME: '@first_name',
  
  // WIC card and profile data
  WIC_CARD_NUMBER: '@wic_card_number',
  NOTIFICATIONS_ENABLED: '@notifications_enabled',
  
  // Device-level preferences (preserved on sign out)
  LANGUAGE: '@wic_app_language',
  SCANNER_SETTINGS: 'scannerSettings',
  
  // User-specific cached data (cleared on sign out)
  USER_BENEFITS: '@user_benefits',
  USER_TRANSACTIONS: '@user_transactions', 
  SHOPPING_LIST: '@shopping_list',
  USER_PREFERENCES: '@user_preferences',
  WIC_BALANCE: '@wic_balance',
  PURCHASE_HISTORY: '@purchase_history',
  USER_PROFILE: '@user_profile',
} as const;

/**
 * Keys that should be cleared when a user signs out
 * (user-specific data, not device preferences)
 */
export const USER_SPECIFIC_KEYS = [
  STORAGE_KEYS.USER,
  STORAGE_KEYS.FIRST_NAME,
  STORAGE_KEYS.WIC_CARD_NUMBER,
  STORAGE_KEYS.NOTIFICATIONS_ENABLED,
  STORAGE_KEYS.USER_BENEFITS,
  STORAGE_KEYS.USER_TRANSACTIONS,
  STORAGE_KEYS.SHOPPING_LIST,
  STORAGE_KEYS.USER_PREFERENCES,
  STORAGE_KEYS.WIC_BALANCE,
  STORAGE_KEYS.PURCHASE_HISTORY,
  STORAGE_KEYS.USER_PROFILE,
] as const;

/**
 * Keys that should be preserved across sign outs
 * (device-level preferences and login data)
 */
export const PRESERVED_KEYS = [
  STORAGE_KEYS.USERS,           // Stored users for login functionality
  STORAGE_KEYS.LANGUAGE,        // Language preference is device-level
  STORAGE_KEYS.SCANNER_SETTINGS, // Scanner settings are device-level
] as const;

/**
 * Clears all user-specific data from AsyncStorage while preserving device-level preferences
 * @returns Promise that resolves when all clearing is complete
 */
export const clearUserData = async (): Promise<void> => {
  console.log('Clearing user data from AsyncStorage...');
  
  const clearPromises = USER_SPECIFIC_KEYS.map(key => 
    AsyncStorage.removeItem(key).catch(error => {
      console.warn(`Failed to clear storage key ${key}:`, error);
      // Don't throw - we want to continue clearing other keys
    })
  );
  
  await Promise.allSettled(clearPromises);
  console.log('User data clearing completed');
};

/**
 * Gets all AsyncStorage keys currently in use (for debugging)
 * @returns Promise with array of all stored keys
 */
export const getAllStorageKeys = async (): Promise<readonly string[]> => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Failed to get storage keys:', error);
    return [];
  }
};

/**
 * Completely clears ALL AsyncStorage data (use with extreme caution!)
 * This will remove all user data AND device preferences
 * @returns Promise that resolves when clearing is complete
 */
export const clearAllStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Failed to clear all storage:', error);
    throw error;
  }
};

/**
 * Development helper: Logs all current AsyncStorage contents
 * @returns Promise that resolves when logging is complete
 */
export const debugStorage = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log('=== AsyncStorage Debug ===');
    console.log(`Total keys: ${keys.length}`);
    
    for (const key of keys) {
      try {
        const value = await AsyncStorage.getItem(key);
        console.log(`${key}:`, value);
      } catch (error) {
        console.log(`${key}:`, 'Error reading value');
      }
    }
    console.log('=== End AsyncStorage Debug ===');
  } catch (error) {
    console.error('Failed to debug storage:', error);
  }
};