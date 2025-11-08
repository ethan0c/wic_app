import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface WicCardContextType {
  cardNumber: string | null;
  setCardNumber: (cardNumber: string) => Promise<void>;
  clearCardNumber: () => Promise<void>;
  isLoading: boolean;
}

const WicCardContext = createContext<WicCardContextType | undefined>(undefined);

const WIC_CARD_KEY = '@wic_card_number';

export function WicCardProvider({ children }: { children: React.ReactNode }) {
  const [cardNumber, setCardNumberState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load card number on mount
  useEffect(() => {
    loadCardNumber();
  }, []);

  const loadCardNumber = async () => {
    try {
      const stored = await AsyncStorage.getItem(WIC_CARD_KEY);
      if (stored) {
        setCardNumberState(stored);
      }
    } catch (error) {
      console.error('Failed to load WIC card number:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setCardNumber = async (number: string) => {
    try {
      await AsyncStorage.setItem(WIC_CARD_KEY, number);
      setCardNumberState(number);
    } catch (error) {
      console.error('Failed to save WIC card number:', error);
      throw error;
    }
  };

  const clearCardNumber = async () => {
    try {
      await AsyncStorage.removeItem(WIC_CARD_KEY);
      setCardNumberState(null);
    } catch (error) {
      console.error('Failed to clear WIC card number:', error);
      throw error;
    }
  };

  return (
    <WicCardContext.Provider value={{ cardNumber, setCardNumber, clearCardNumber, isLoading }}>
      {children}
    </WicCardContext.Provider>
  );
}

export function useWicCard() {
  const context = useContext(WicCardContext);
  if (context === undefined) {
    throw new Error('useWicCard must be used within a WicCardProvider');
  }
  return context;
}
