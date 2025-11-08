// WIC Brand Colors - Sky Blue & White Theme
export const WIC_COLORS = {
  primary: '#0EA5E9',      // Sky blue - clean and modern
  secondary: '#38BDF8',    // Light sky blue - soft accent
  accent: '#60A5FA',       // Blue accent
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  white: '#FFFFFF',
  lightGray: '#F8FAFC',
};

export const DARK_THEME = {
  background: '#0F172A',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  border: '#334155',
  buttonBackground: WIC_COLORS.primary,
  buttonText: '#FFFFFF',
  cardBackground: '#1E293B',
  ...WIC_COLORS,
};

export const LIGHT_THEME = {
  background: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  buttonBackground: WIC_COLORS.primary,
  buttonText: '#FFFFFF',
  cardBackground: '#F8FAFC',
  ...WIC_COLORS,
};
