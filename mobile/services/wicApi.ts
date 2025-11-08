import api from './api';

export interface ScanResult {
  found: boolean;
  usdaProduct?: any;
  isWicApproved: boolean;
  wicCategory?: string;
  approvalNotes?: string;
  localProduct?: {
    id: string;
    name: string;
    brand: string;
    category: string;
    subcategory: string;
  };
}

export interface WicStore {
  id: string;
  name: string;
  chain: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  hoursJson: any;
  distance?: number;
}

export interface WicBenefit {
  id: string;
  wicCardNumber: string;
  firstName?: string;
  lastName?: string;
  category: string;
  totalAmount: number;
  remainingAmount: number;
  unit: string;
  monthPeriod: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  wicCardNumber: string;
  storeId?: string;
  transactionType: string;
  totalItems: number;
  totalValue: number;
  transactionDate: string;
  createdAt: string;
  store?: WicStore;
  items?: TransactionItem[];
}

export interface TransactionItem {
  id: string;
  transactionId: string;
  category: string;
  quantity: number;
  unit: string;
  productName: string;
}

export interface ShoppingListItem {
  id: string;
  userId: string;
  itemName: string;
  isChecked: boolean;
  category?: string;
  createdAt: string;
}

export interface ApprovedProduct {
  id: string;
  generalFoodId: string;
  wicCategory: string;
  isApproved: boolean;
  notes?: string;
  generalFood: {
    id: string;
    name: string;
    brand: string;
    category: string;
    subcategory: string;
    upcCode?: string;
    pluCode?: string;
    unitSize?: string;
    imageUrl?: string;
  };
}

// ===== SCANNING =====

export const scanProductByUPC = async (upc: string): Promise<ScanResult> => {
  const response = await api.get(`/api/scan/upc/${upc}`);
  return response.data;
};

export const scanProduceByPLU = async (plu: string): Promise<ScanResult> => {
  const response = await api.get(`/api/scan/plu/${plu}`);
  return response.data;
};

// ===== PRODUCTS =====

export const getAllApprovedProducts = async (): Promise<ApprovedProduct[]> => {
  const response = await api.get('/api/scan/approved');
  return response.data;
};

export const getApprovedProducts = async (category: string): Promise<ApprovedProduct[]> => {
  const response = await api.get(`/api/scan/category/${category}`);
  return response.data;
};

export const searchApprovedProducts = async (searchTerm: string): Promise<ApprovedProduct[]> => {
  const response = await api.get('/api/scan/search', {
    params: { q: searchTerm },
  });
  return response.data;
};

// ===== STORES =====

export const getNearbyStores = async (
  lat: number,
  lng: number,
  radius: number = 10
): Promise<WicStore[]> => {
  // Validate coordinates before making API call
  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    console.error('getNearbyStores: Invalid coordinates', { lat, lng });
    return []; // Return empty array instead of making invalid API call
  }

  const response = await api.get('/api/stores/nearby', {
    params: { lat, lng, radius },
  });
  return response.data;
};

// ===== USER BENEFITS =====

export const getUserBenefits = async (wicCardNumber: string): Promise<WicBenefit[]> => {
  const response = await api.get(`/api/users/${wicCardNumber}/benefits`);
  return response.data;
};

// ===== TRANSACTIONS =====

export const getUserTransactions = async (wicCardNumber: string): Promise<Transaction[]> => {
  const response = await api.get(`/api/users/${wicCardNumber}/transactions`);
  return response.data;
};

export const createTransaction = async (
  wicCardNumber: string,
  data: {
    storeId?: string;
    items: Array<{
      approvedFoodId?: string;
      category: string;
      quantity: number;
      unit: string;
      productName: string;
    }>;
  }
): Promise<Transaction> => {
  const response = await api.post(`/api/users/${wicCardNumber}/transactions`, data);
  return response.data;
};

// ===== SHOPPING LIST =====

export const getShoppingList = async (wicCardNumber: string): Promise<ShoppingListItem[]> => {
  const response = await api.get('/api/shopping-list', {
    params: { wicCardNumber },
  });
  return response.data;
};

export const addShoppingListItem = async (
  wicCardNumber: string,
  itemName: string,
  category?: string
): Promise<ShoppingListItem> => {
  const response = await api.post('/api/shopping-list', {
    wicCardNumber,
    itemName,
    category,
  });
  return response.data;
};

export const updateShoppingListItem = async (
  itemId: string,
  isChecked: boolean
): Promise<ShoppingListItem> => {
  const response = await api.patch(`/api/shopping-list/${itemId}`, {
    isChecked,
  });
  return response.data;
};

export const deleteShoppingListItem = async (itemId: string): Promise<void> => {
  await api.delete(`/api/shopping-list/${itemId}`);
};

// ===== HEALTH CHECK =====

export const checkHealth = async (): Promise<{ status: string; timestamp: string }> => {
  const response = await api.get('/health');
  return response.data;
};
