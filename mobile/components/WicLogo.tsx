import React, { useMemo } from 'react';
import { Image, ImageStyle, StyleProp, ImageProps } from 'react-native';

/**
 * IMPORTANT
 * - React Native requires static paths for `require`.
 * - For any state where you don’t have a real file yet, we point to the generic WIC logo
 *   so the bundler never crashes. Replace those with real files as you add them.
 *
 * Asset naming convention (recommended):
 *   /assets/images/wic/US.png
 *   /assets/images/wic/AL.png
 *   /assets/images/wic/AK.png
 *   ...
 *   /assets/images/wic/DC.png
 *
 * If your files use full names (e.g., "alabama.png"), you can keep those paths below.
 */

// Generic fallback (must exist!)
const GENERIC_WIC = require('../assets/images/wic-logo.png');

/** Static logo map. Replace GENERIC_WIC with real files as you add them. */
const LOGO_MAP: Record<string, any> = {
  // Country
  US: GENERIC_WIC,

  // 50 states + DC
  AL: require('../assets/images/alabama.png'),
  AK: require('../assets/images/alaska.webp'),
  AZ: require('../assets/images/arizona.jpeg'),
  AR: require('../assets/images/arkansas.png'),
  CA: require('../assets/images/california.png'),
  CO: require('../assets/images/colorado.png'),
  CT: require('../assets/images/connecticut.jpeg'),
  DE: require('../assets/images/delaware.png'),
  DC: require('../assets/images/dc.jpeg'),
  FL: require('../assets/images/florida.png'),
  GA: require('../assets/images/georgia.png'),
  HI: require('../assets/images/hawaii.png'), 
  ID: require('../assets/images/idaho.jpg'),
  IL: require('../assets/images/illinois.png'),
  IN: require('../assets/images/indiana.jpg'),
  IA: require('../assets/images/iowa.png'),
  KS: require('../assets/images/kansas.jpg'),
  KY: require('../assets/images/kentucky.webp'),
  LA: require('../assets/images/louisiana.png'),
  ME: require('../assets/images/maine.png'),
  MD: require('../assets/images/maryland.png'), 
  MA: require('../assets/images/massachusetts.jpg'),
  MI: require('../assets/images/michigan.webp'),
  MN: require('../assets/images/minnesota.png'),
  MS: require('../assets/images/mississippi.webp'),
  MO: require('../assets/images/missouri.png'),
  MT: require('../assets/images/montana.png'),
  NE: require('../assets/images/nebraska.jpg'),
  NV: require('../assets/images/nevada.png'),
  NH: require('../assets/images/new-hampshire.png'),
  NJ: require('../assets/images/new-jersey.webp'),
  NM: require('../assets/images/new-mexico.webp'),
  NY: require('../assets/images/new-york.jpg'),
  NC: require('../assets/images/north-carolina.png'),
  ND: require('../assets/images/north-dakota.webp'),
  OH: require('../assets/images/ohio.jpg'),
  OK: require('../assets/images/oklahoma.png'),
  OR: require('../assets/images/oregon.jpg'),
  PA: require('../assets/images/penn.png'),
  RI: require('../assets/images/rhode-island.webp'),
  SC: require('../assets/images/south-carolina.png'),
  SD: require('../assets/images/south-dakota.webp'),
  TN: require('../assets/images/tennessee.webp'),
  TX: require('../assets/images/texas.png'),
  UT: require('../assets/images/utah.webp'),
  VT: require('../assets/images/vermont.jpg'),
  VA: require('../assets/images/virginia.png'),
  WA: require('../assets/images/washington.jpeg'),
  WV: require('../assets/images/west-virginia.avif'),
  WI: require('../assets/images/wisconsin.png'),
  WY: require('../assets/images/wyoming.jpeg'),

  // Optional tribal/consortia & territories (leave if you support them)
  CHICKASAW: require('../assets/images/chicksaw.png'), // Chickasaw Nation WIC
  INTERTRIBAL: require('../assets/images/intertribal.webp'), // ITC (e.g., AZ/NV councils)

  // Territories (WIC operates in some)
  PR: GENERIC_WIC, // Puerto Rico
  GU: GENERIC_WIC, // Guam
  VI: GENERIC_WIC, // U.S. Virgin Islands
  MP: GENERIC_WIC, // Northern Mariana Islands
  AS: GENERIC_WIC, // American Samoa
};

/** Robust name → code resolver with many aliases. */
const STATE_NAME_TO_CODE: Record<string, string> = {
  // States
  alabama: 'AL',
  alaska: 'AK',
  arizona: 'AZ',
  arkansas: 'AR',
  california: 'CA',
  colorado: 'CO',
  connecticut: 'CT',
  delaware: 'DE',
  'district of columbia': 'DC',
  'washington dc': 'DC',
  'washington, dc': 'DC',
  'd.c.': 'DC',
  dc: 'DC',
  florida: 'FL',
  georgia: 'GA',
  hawaii: 'HI',
  idaho: 'ID',
  illinois: 'IL',
  indiana: 'IN',
  iowa: 'IA',
  kansas: 'KS',
  kentucky: 'KY',
  louisiana: 'LA',
  maine: 'ME',
  maryland: 'MD',
  massachusetts: 'MA',
  michigan: 'MI',
  minnesota: 'MN',
  mississippi: 'MS',
  missouri: 'MO',
  montana: 'MT',
  nebraska: 'NE',
  nevada: 'NV',
  'new hampshire': 'NH',
  'new jersey': 'NJ',
  'new mexico': 'NM',
  'new york': 'NY',
  'north carolina': 'NC',
  'north dakota': 'ND',
  ohio: 'OH',
  oklahoma: 'OK',
  oregon: 'OR',
  pennsylvania: 'PA',
  'rhode island': 'RI',
  'south carolina': 'SC',
  'south dakota': 'SD',
  tennessee: 'TN',
  texas: 'TX',
  utah: 'UT',
  vermont: 'VT',
  virginia: 'VA',
  washington: 'WA',
  'west virginia': 'WV',
  wisconsin: 'WI',
  wyoming: 'WY',

  // Territories / tribal (optional)
  'chickasaw nation': 'CHICKASAW',
  'inter tribal council of arizona': 'INTERTRIBAL',
  'inter-tribal council of arizona': 'INTERTRIBAL',
  'inter-tribal council of nevada': 'INTERTRIBAL',
  arizona_itc: 'INTERTRIBAL',
  nevada_itc: 'INTERTRIBAL',
  'puerto rico': 'PR',
  guam: 'GU',
  'u.s. virgin islands': 'VI',
  'us virgin islands': 'VI',
  'virgin islands': 'VI',
  'northern mariana islands': 'MP',
  'american samoa': 'AS',
};

function normalizeStateName(name?: string): string | undefined {
  if (!name) return undefined;
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

function stateNameToCode(name?: string): string | undefined {
  const key = normalizeStateName(name);
  return key ? STATE_NAME_TO_CODE[key] : undefined;
}

export type WicLogoProps = {
  /** State/region code like 'US', 'AL', 'TX', 'DC', etc. */
  code?: string;
  /** Human-readable name like 'Texas', 'District of Columbia', etc. */
  stateName?: string;
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
  /** If true, show generic WIC logo when a specific asset is missing. Default: true */
  fallbackToWic?: boolean;
  /** Optional accessibility label override */
  accessibilityLabel?: ImageProps['accessibilityLabel'];
};

export default function WicLogo({
  code,
  stateName,
  width = 160,
  height = 160,
  style,
  fallbackToWic = true,
  accessibilityLabel,
}: WicLogoProps) {
  const resolvedCode = useMemo(() => {
    const c = (code ?? stateNameToCode(stateName) ?? 'US').toUpperCase();
    return c;
  }, [code, stateName]);

  const src = LOGO_MAP[resolvedCode] ?? (fallbackToWic ? GENERIC_WIC : undefined);

  if (!src) return null;

  return (
    <Image
      source={src}
      style={[{ width, height }, style]}
      resizeMode="contain"
      accessible
      accessibilityLabel={accessibilityLabel ?? `${resolvedCode} WIC logo`}
    />
  );
}

/**
 * DEV HELPERS (optional): log which codes still point at the generic fallback
 * Call in a dev screen to see which assets you still need to add.
 */
export const missingLogoCodes = Object.entries(LOGO_MAP)
  .filter(([, v]) => v === GENERIC_WIC)
  .map(([k]) => k);
