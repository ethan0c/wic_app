import { ImageSourcePropType } from 'react-native';

// Map of image filenames to require statements
// This allows us to bundle images with the app instead of loading from URLs
const imageMap: Record<string, ImageSourcePropType> = {
  // Dairy - Milk
  'milk_half_gallon.avif': require('../assets/images/products/milk_half_gallon.avif'),
  'milk_gallon.avif': require('../assets/images/products/milk_gallon.avif'),
  'milk_2percent_gallon.avif': require('../assets/images/products/milk_2percent_gallon.avif'),
  'milk_2percent_half.avif': require('../assets/images/products/milk_2percent_half.avif'),
  
  // Dairy - Cheese
  'cheese_cheddar_16oz.avif': require('../assets/images/products/cheese_cheddar_16oz.avif'),
  'cheddar_cheese_8oz.avif': require('../assets/images/products/cheddar_cheese_8oz.avif'),
  
  // Protein - Eggs
  'eggs_dozen_carton.avif': require('../assets/images/products/eggs_dozen_carton.avif'),
  'eggs_half_dozen.jpg': require('../assets/images/products/eggs_half_dozen.jpg'),
  
  // Grains - Cereal
  'cheerios_18oz.avif': require('../assets/images/products/cheerios_18oz.avif'),
  'cheerios_36oz.jpeg': require('../assets/images/products/cheerios_36oz.jpeg'),
  'cheerios_48oz.avif': require('../assets/images/products/cheerios_48oz.avif'),
  'corn_flakes_18oz.avif': require('../assets/images/products/corn_flakes_18oz.avif'),
  'rice_krispies_12oz.avif': require('../assets/images/products/rice_krispies_12oz.avif'),
  'oatmeal_instant_packets.avif': require('../assets/images/products/oatmeal_instant_packets.avif'),
  
  // Grains - Bread
  'wonder_20oz.avif': require('../assets/images/products/wonder_20oz.avif'),
  'wonder_16oz.webp': require('../assets/images/products/wonder_16oz.webp'),
  'bread_generic_16oz.avif': require('../assets/images/products/bread_generic_16oz.avif'),
  'bread_whole_wheat_16oz.avif': require('../assets/images/products/bread_whole_wheat_16oz.avif'),
  
  // Fruits & Vegetables
  'fresh_apples.jpg': require('../assets/images/products/fresh_apples.jpg'),
  'fresh_bananas.avif': require('../assets/images/products/fresh_bananas.avif'),
  'fresh_broccoli.avif': require('../assets/images/products/fresh_broccoli.avif'),
  'fresh_carrots.webp': require('../assets/images/products/fresh_carrots.webp'),
  'fresh_spinach.webp': require('../assets/images/products/fresh_spinach.webp'),
};

/**
 * Get the local image source for a given filename
 * @param filename - The image filename (e.g., 'cheerios_18oz.avif')
 * @returns ImageSourcePropType or null if image not found
 */
export const getLocalImageSource = (filename?: string): ImageSourcePropType | null => {
  if (!filename) return null;
  
  // Remove any path prefixes and get just the filename
  const cleanFilename = filename.split('/').pop() || filename;
  
  return imageMap[cleanFilename] || null;
};

/**
 * Check if a local image exists for the given filename
 * @param filename - The image filename to check
 * @returns boolean indicating if image exists locally
 */
export const hasLocalImage = (filename?: string): boolean => {
  if (!filename) return false;
  
  const cleanFilename = filename.split('/').pop() || filename;
  return cleanFilename in imageMap;
};

/**
 * Get a fallback image URL if no local image is available
 * @param filename - The original filename
 * @param fallbackUrl - Optional fallback URL
 * @returns The fallback URL or null
 */
export const getFallbackImageUrl = (filename?: string, fallbackUrl?: string): string | null => {
  return fallbackUrl || null;
};

/**
 * Get the appropriate image source - local first, then fallback URL
 * @param filename - The image filename
 * @param fallbackUrl - Optional fallback URL
 * @returns Object with source type and value
 */
export const getImageSource = (filename?: string, fallbackUrl?: string): {
  type: 'local' | 'uri' | null;
  source: ImageSourcePropType | { uri: string } | null;
} => {
  // Try local image first
  const localSource = getLocalImageSource(filename);
  if (localSource) {
    return {
      type: 'local',
      source: localSource
    };
  }
  
  // Fall back to URL if provided
  if (fallbackUrl) {
    return {
      type: 'uri',
      source: { uri: fallbackUrl }
    };
  }
  
  return {
    type: null,
    source: null
  };
};

export default {
  getLocalImageSource,
  hasLocalImage,
  getFallbackImageUrl,
  getImageSource,
};