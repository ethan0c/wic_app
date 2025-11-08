import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface WICBenefit {
  name: string;
  amount: number;
  unit: string;
  used: number;
  category: string;
  // Additional fields for scanning validation
  approvedBrands?: string[];
  approvedSizes?: string[];
  notes?: string;
}

interface WICContextType {
  benefits: WICBenefit[];
  monthPeriod: string;
  daysRemaining: number;
  updateBenefitUsage: (benefitName: string, amountUsed: number) => void;
  checkItemEligibility: (barcode: string) => {
    eligible: boolean;
    benefit?: WICBenefit;
    message: string;
    alternative?: string;
  };
}

const WICContext = createContext<WICContextType | undefined>(undefined);

// Real WIC benefits based on the provided image (11/1/2025 - 11/30/2025 period)
const initialBenefits: WICBenefit[] = [
  {
    name: 'Cheese',
    amount: 2,
    unit: 'Pound',
    used: 0,
    category: 'Dairy',
    approvedSizes: ['16oz', '1lb'],
  },
  {
    name: 'Eggs',
    amount: 2,
    unit: 'Dozen',
    used: 0,
    category: 'Protein',
    approvedSizes: ['12 count'],
  },
  {
    name: 'WIC Cereal',
    amount: 72,
    unit: 'Ounce',
    used: 0,
    category: 'Grains',
    notes: 'Approved packaging: 9.8oz to 36oz. Can combine but cannot exceed 72oz total.',
    approvedSizes: ['9.8oz', '12oz', '15oz', '18oz', '24oz', '36oz'],
  },
  {
    name: 'Peanut Butter',
    amount: 2,
    unit: 'Jar',
    used: 0,
    category: 'Protein',
    approvedSizes: ['16-18oz'],
    notes: '16-18 oz jars only',
  },
  {
    name: 'WIC Whole Grains',
    amount: 4,
    unit: 'Pound',
    used: 0,
    category: 'Grains',
    notes: 'Brown rice, whole wheat pasta, etc.',
  },
  {
    name: 'Fruit and Vegetables',
    amount: 52,
    unit: 'Cash Value Benefit',
    used: 0,
    category: 'Produce',
    notes: '$52 cash value for fresh fruits and vegetables',
  },
  {
    name: 'Yogurt - Low/Non-Fat',
    amount: 32,
    unit: 'Ounce',
    used: 0,
    category: 'Dairy',
    approvedSizes: ['4oz', '6oz', '8oz', '32oz'],
  },
  {
    name: 'Yogurt - Whole Fat',
    amount: 32,
    unit: 'Ounce',
    used: 0,
    category: 'Dairy',
    approvedSizes: ['4oz', '6oz', '8oz', '32oz'],
  },
  {
    name: 'Lactose Free Whole Milk',
    amount: 6,
    unit: 'Half Gallon',
    used: 0,
    category: 'Dairy',
    notes: 'Must be half gallon size. Gallon containers NOT covered.',
    approvedSizes: ['Half Gallon'],
  },
  {
    name: 'Lowfat Lactose Free Milk',
    amount: 6,
    unit: 'Half Gallon',
    used: 0,
    category: 'Dairy',
    notes: 'Must be half gallon size. Gallon containers NOT covered.',
    approvedSizes: ['Half Gallon'],
  },
  {
    name: 'Juice 64oz',
    amount: 4,
    unit: 'Can / Bottle',
    used: 0,
    category: 'Beverages',
    approvedSizes: ['64oz'],
    notes: '64oz bottles/cans only',
  },
];

export const WICProvider = ({ children }: { children: ReactNode }) => {
  const [benefits, setBenefits] = useState<WICBenefit[]>(initialBenefits);
  const monthPeriod = '11/1/2025 - 11/30/2025';
  
  // Calculate days remaining (November has 30 days)
  const today = new Date();
  const endOfMonth = new Date(2025, 10, 30); // November 30, 2025
  const daysRemaining = Math.max(0, Math.ceil((endOfMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  const updateBenefitUsage = (benefitName: string, amountUsed: number) => {
    setBenefits(prev =>
      prev.map(benefit =>
        benefit.name === benefitName
          ? { ...benefit, used: Math.min(benefit.used + amountUsed, benefit.amount) }
          : benefit
      )
    );
  };

  const checkItemEligibility = (barcode: string) => {
    // Mock barcode checker - in production this would call an API
    // For now, we'll simulate some scenarios based on common products
    
    // Simulate different products based on barcode patterns
    if (barcode.includes('milk') || barcode.includes('MILK')) {
      const milkBenefit = benefits.find(b => b.name.includes('Milk'));
      if (milkBenefit && milkBenefit.used < milkBenefit.amount) {
        return {
          eligible: true,
          benefit: milkBenefit,
          message: `✓ WIC Approved! ${milkBenefit.amount - milkBenefit.used} ${milkBenefit.unit} remaining this month.`,
        };
      }
      return {
        eligible: false,
        message: '✗ Gallon milk NOT covered. Try half gallon instead.',
        alternative: 'Half gallon milk is WIC approved',
      };
    }

    if (barcode.includes('cereal') || barcode.includes('CEREAL')) {
      const cerealBenefit = benefits.find(b => b.name === 'WIC Cereal');
      if (cerealBenefit && cerealBenefit.used < cerealBenefit.amount) {
        return {
          eligible: true,
          benefit: cerealBenefit,
          message: `✓ WIC Approved! ${cerealBenefit.amount - cerealBenefit.used}oz cereal remaining. Approved sizes: 9.8oz to 36oz.`,
        };
      }
    }

    if (barcode.includes('bread') || barcode.includes('BREAD')) {
      return {
        eligible: false,
        message: '✗ This bread size NOT covered. Only 16oz packages approved.',
        alternative: 'Look for 16-ounce bread packages',
      };
    }

    if (barcode.includes('egg') || barcode.includes('EGG')) {
      const eggBenefit = benefits.find(b => b.name === 'Eggs');
      if (eggBenefit && eggBenefit.used < eggBenefit.amount) {
        return {
          eligible: true,
          benefit: eggBenefit,
          message: `✓ WIC Approved! ${eggBenefit.amount - eggBenefit.used} dozen remaining.`,
        };
      }
    }

    // Default response
    return {
      eligible: false,
      message: '✗ Product not found in WIC database. Please check your approved items list.',
    };
  };

  return (
    <WICContext.Provider
      value={{
        benefits,
        monthPeriod,
        daysRemaining,
        updateBenefitUsage,
        checkItemEligibility,
      }}
    >
      {children}
    </WICContext.Provider>
  );
};

export const useWIC = () => {
  const context = useContext(WICContext);
  if (context === undefined) {
    throw new Error('useWIC must be used within a WICProvider');
  }
  return context;
};
