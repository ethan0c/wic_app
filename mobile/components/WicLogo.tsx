import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

// Map codes to static images. Paths must be static for React Native bundler.
// Codes can be country (e.g., 'US') or state abbreviations (e.g., 'AL', 'TX', 'MD').
const LOGO_MAP: Record<string, any> = {
  US: require('../assets/images/wic-logo.png'),
  AL: require('../assets/images/alabama.png'),
  AK: require('../assets/images/alaska.webp'),
  CA: require('../assets/images/california.png'),
  CO: require('../assets/images/colorado.svg'),
  CT: require('../assets/images/connecticut.jpeg'),
  FL: require('../assets/images/florida.png'),
  // HI: require('../assets/images/hawaii.jpg'), // Disabled: Invalid JPG file
  // ID: require('../assets/images/idaho.jpg'), // Disabled: Potential JPG issue
  IA: require('../assets/images/iowa.png'),
  MD: require('../assets/images/marylannd.png'), // Note: filename has typo
  // NE: require('../assets/images/nebraska.jpg'), // Disabled: Potential JPG issue
  PA: require('../assets/images/penn.png'),
  TX: require('../assets/images/texas.png'),
  // Special entities
  CHICKASAW: require('../assets/images/chicksaw.png'),
  INTERTRIBAL: require('../assets/images/intertribal.webp'),
};

function stateNameToCode(name?: string): string | undefined {
  if (!name) return undefined;
  const n = name.toLowerCase();
  const map: Record<string, string> = {
    alabama: 'AL',
    alaska: 'AK',
    california: 'CA',
    colorado: 'CO',
    connecticut: 'CT',
    florida: 'FL',
    // hawaii: 'HI', // Disabled: Invalid JPG file
    // idaho: 'ID', // Disabled: Potential JPG issue
    iowa: 'IA',
    maryland: 'MD',
    // nebraska: 'NE', // Disabled: Potential JPG issue
    pennsylvania: 'PA',
    texas: 'TX',
    // Special entities
    'chickasaw nation': 'CHICKASAW',
    'arizona': 'INTERTRIBAL', // Inter Tribal Council of Arizona
    'nevada - itc': 'INTERTRIBAL', // Inter-Tribal Council of Nevada
  };
  return map[n];
}

export type WicLogoProps = {
  code?: string; // country/state code like 'US', 'AL', 'TX'
  stateName?: string; // human readable state name
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
  fallbackToWic?: boolean; // default true
};

export default function WicLogo({ code, stateName, width = 160, height = 160, style, fallbackToWic = true }: WicLogoProps) {
  const resolvedCode = (code || stateNameToCode(stateName) || '').toUpperCase();
  const src = LOGO_MAP[resolvedCode] || (fallbackToWic ? LOGO_MAP.US : undefined);

  if (!src) return null;

  return <Image source={src} style={[{ width, height }, style]} resizeMode="contain" />;
}
