/**
 * Auto-translation utility using Google Translate API
 * This is a development utility to help translate English strings to Haitian Creole
 */

const translate = require('@vitalets/google-translate-api');

/**
 * Translates text from English to Haitian Creole
 * @param text - English text to translate
 * @returns Promise with translated Haitian Creole text
 */
export async function translateToCreole(text: string): Promise<string> {
  try {
    const result = await translate(text, { from: 'en', to: 'ht' });
    return result.text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
}

/**
 * Translates an object of English strings to Haitian Creole
 * Maintains the same structure
 */
export async function translateObject(obj: any): Promise<any> {
  const translated: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      translated[key] = await translateToCreole(value);
    } else if (typeof value === 'object' && value !== null) {
      translated[key] = await translateObject(value);
    } else {
      translated[key] = value;
    }
  }
  
  return translated;
}

/**
 * Example usage:
 * 
 * const english = {
 *   home: {
 *     welcome: 'Welcome back',
 *     benefits: 'Your WIC Benefits'
 *   }
 * };
 * 
 * const haitian = await translateObject(english);
 * console.log(haitian);
 * // Output: { home: { welcome: 'Byenvini tounen', benefits: 'Benefis WIC ou' } }
 */
