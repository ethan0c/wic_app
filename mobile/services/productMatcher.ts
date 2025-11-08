/**
 * Smart product matching logic
 * Compares scanned products against WIC-approved database
 * Suggests close alternatives based on category, size, and brand
 */

import aplData from '../data/apl.json';
import { USDAProduct, extractSizeInOunces, categorizeProduct } from './usdaApi';

interface MatchResult {
  isApproved: boolean;
  matchedProduct?: any;
  category: string;
  scannedSize: number | null;
  reasons: string[];
  alternatives: Array<{
    upc: string;
    suggestion: string;
    reason: string;
    imageUrl?: string;
    emoji?: string;
  }>;
}

/**
 * Match USDA product against WIC approved products database
 */
export const matchProduct = (usdaProduct: USDAProduct): MatchResult => {
  const category = categorizeProduct(usdaProduct);
  const scannedSize = extractSizeInOunces(usdaProduct);
  
  // Find exact match by UPC
  const exactMatch = aplData.products.find(
    p => p.upc === usdaProduct.gtinUpc
  );
  
  if (exactMatch) {
    return {
      isApproved: exactMatch.isApproved,
      matchedProduct: exactMatch,
      category,
      scannedSize,
      reasons: exactMatch.reasons || [],
      alternatives: exactMatch.alternatives || [],
    };
  }
  
  // No exact match - check if category is WIC-eligible
  if (category === 'unknown') {
    return {
      isApproved: false,
      category: 'unknown',
      scannedSize,
      reasons: ['product_not_in_wic_category'],
      alternatives: [],
    };
  }
  
  // Find alternatives by category and size
  const alternatives = findAlternatives(category, scannedSize);
  const reasons = determineRejectionReasons(category, scannedSize);
  
  return {
    isApproved: false,
    category,
    scannedSize,
    reasons,
    alternatives,
  };
};

/**
 * Determine why a product is not approved
 */
const determineRejectionReasons = (category: string, size: number | null): string[] => {
  const reasons: string[] = [];
  
  if (!size) {
    reasons.push('cannot_determine_size');
    return reasons;
  }
  
  // Check category-specific size rules
  const categoryRules = (aplData.rules as any)[category];
  
  if (category === 'milk') {
    if (size === 128) {
      reasons.push('package_size_not_allowed');
      reasons.push('milk_gallon_not_allowed');
    } else if (size !== 64) {
      reasons.push('package_size_not_allowed');
    }
  }
  
  if (category === 'bread') {
    if (size !== 16) {
      reasons.push('package_size_not_allowed');
    }
  }
  
  if (category === 'cereal') {
    if (categoryRules && size > categoryRules.max_ounces) {
      reasons.push('exceeds_monthly_limit');
    }
  }
  
  // Generic reason if no specific rule matched
  if (reasons.length === 0) {
    reasons.push('brand_or_product_not_approved');
  }
  
  return reasons;
};

/**
 * Find close alternatives from approved products
 */
const findAlternatives = (
  category: string,
  scannedSize: number | null
): Array<{
  upc: string;
  suggestion: string;
  reason: string;
  imageUrl?: string;
  emoji?: string;
}> => {
  const approvedProducts = aplData.products.filter(
    p => p.category === category && p.isApproved
  );
  
  if (approvedProducts.length === 0) {
    return [];
  }
  
  const alternatives: any[] = [];
  
  // Strategy 1: Find products with matching size
  if (scannedSize) {
    const sizeMatch = approvedProducts.find(p => p.size_oz === scannedSize);
    if (sizeMatch) {
      alternatives.push({
        upc: sizeMatch.upc,
        suggestion: `Try ${sizeMatch.brand} ${sizeMatch.name} (${sizeMatch.size_display})`,
        reason: `Same size, but from a WIC-approved brand`,
        imageUrl: sizeMatch.imageUrl,
        emoji: getCategoryEmoji(category),
      });
    }
  }
  
  // Strategy 2: Find closest approved size
  if (scannedSize && category === 'milk' && scannedSize === 128) {
    // Gallon → Half-gallon
    const halfGallon = approvedProducts.find(p => p.size_oz === 64);
    if (halfGallon && !alternatives.find(a => a.upc === halfGallon.upc)) {
      alternatives.push({
        upc: halfGallon.upc,
        suggestion: `Try ½ gallon instead`,
        reason: `WIC covers half-gallons, not gallons. Buy 2 half-gallons to get a full gallon.`,
        imageUrl: halfGallon.imageUrl,
        emoji: getCategoryEmoji(category),
      });
    }
  }
  
  if (category === 'bread' && scannedSize !== 16) {
    // Wrong bread size → 16oz
    const bread16oz = approvedProducts.find(p => p.size_oz === 16);
    if (bread16oz && !alternatives.find(a => a.upc === bread16oz.upc)) {
      alternatives.push({
        upc: bread16oz.upc,
        suggestion: `Try 16 oz loaf`,
        reason: `WIC only covers 16-ounce bread packages`,
        imageUrl: bread16oz.imageUrl,
        emoji: getCategoryEmoji(category),
      });
    }
  }
  
  if (category === 'cereal' && scannedSize) {
    // Find smaller cereal sizes that fit
    const rules = (aplData.rules as any).cereal;
    if (rules && scannedSize > rules.max_ounces) {
      const smallerOptions = approvedProducts
        .filter(p => p.size_oz <= rules.max_ounces)
        .sort((a, b) => b.size_oz - a.size_oz) // Largest first
        .slice(0, 2);
      
      smallerOptions.forEach(product => {
        if (!alternatives.find(a => a.upc === product.upc)) {
          alternatives.push({
            upc: product.upc,
            suggestion: `Try ${product.size_display} size instead`,
            reason: `Stays within your 72 oz monthly cereal allowance`,
            imageUrl: product.imageUrl,
            emoji: getCategoryEmoji(category),
          });
        }
      });
    }
  }
  
  // Strategy 3: Show most popular approved product in category (fallback)
  if (alternatives.length === 0 && approvedProducts.length > 0) {
    const firstApproved = approvedProducts[0];
    alternatives.push({
      upc: firstApproved.upc,
      suggestion: `Try ${firstApproved.brand} ${firstApproved.name} (${firstApproved.size_display})`,
      reason: `This is a WIC-approved alternative in the ${(aplData.categories as any)[category]?.name || category} category`,
      imageUrl: firstApproved.imageUrl,
      emoji: getCategoryEmoji(category),
    });
  }
  
  return alternatives.slice(0, 3); // Max 3 alternatives
};

/**
 * Get emoji for category
 */
const getCategoryEmoji = (category: string): string => {
  const emojiMap: { [key: string]: string } = {
    'milk': '🥛',
    'dairy': '🧀',
    'bread': '🍞',
    'cereal': '🥣',
    'eggs': '🥚',
    'produce': '🍎',
    'juice': '🧃',
    'peanut_butter': '🥜',
    'beans': '🫘',
    'infant_formula': '🍼',
    'baby_food': '👶',
  };
  return emojiMap[category] || '📦';
};
