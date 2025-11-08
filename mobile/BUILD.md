# WicBuy - Build Instructions

## App Configuration
- **App Name:** WicBuy
- **Bundle ID (Android):** com.wicbuy.app
- **Bundle ID (iOS):** com.wicbuy.app
- **Logo:** `assets/images/logo/wic-buy.png`

## Prerequisites
✅ EAS CLI installed globally
✅ expo-camera installed
✅ App icons created from logo
✅ eas.json configuration file

## Build Steps

### 1. Login to Expo Account
```bash
eas login
```
Enter your Expo credentials (or create account at https://expo.dev/signup)

### 2. Link Project (First Time Only)
```bash
cd mobile
eas init
```
This will create a project ID and update app.json automatically.

### 3. Build Android APK (Development/Testing)
```bash
npm run build:android
```
Or directly:
```bash
eas build --platform android --profile preview
```

### 4. Build iOS (Requires Apple Developer Account)
```bash
npm run build:ios
```

### 5. Build Both Platforms
```bash
npm run build:all
```

## Build Profiles

### Development
- Includes development client
- For testing with hot reload
```bash
eas build --platform android --profile development
```

### Preview
- **Recommended for hackathon demo**
- Creates APK/IPA for direct installation
- No app store submission needed
```bash
eas build --platform android --profile preview
```

### Production
- Optimized build for app stores
- Requires signing certificates
```bash
eas build --platform android --profile production
```

## After Build Completes

1. **Download APK/IPA**
   - EAS will provide a download link
   - Or visit: https://expo.dev/accounts/[your-account]/projects/wicbuy/builds

2. **Install on Android Device**
   - Transfer APK to phone
   - Enable "Install from Unknown Sources"
   - Install APK
   - Grant camera permission when prompted

3. **Install on iOS Device** (TestFlight or direct)
   - Download TestFlight from App Store
   - Scan QR code from EAS build
   - Or install IPA directly (requires provisioning profile)

## Camera Permissions

The app will request camera permission for:
- **Android:** Barcode scanning via expo-camera
- **iOS:** Barcode scanning with usage description

Permission message:
> "Allow WicBuy to scan product barcodes to verify WIC eligibility."

## Testing the Scanner

Once installed:
1. Open WicBuy app
2. Navigate to Scanner tab
3. Tap "Scan Item" button
4. Point camera at product barcode
5. App will:
   - Check local APL database first
   - Fall back to backend USDA API
   - Display product image + WIC approval status
   - Show benefit calculations (before/after balance)
   - Suggest alternatives if not approved

## Demo Products (In APL Database)
- ✅ Great Value Whole Milk ½ gallon - `041303001806`
- ❌ Great Value Whole Milk 1 gallon - `041303001813`
- ✅ Cheerios 18oz - `016000275218`
- ❌ Wonder Bread 20oz - `072250015144`
- ✅ Wonder Bread 16oz - `072250015137`

## Troubleshooting

### Build Fails
- Check app.json is valid JSON
- Ensure all required assets exist (icon, splash, adaptive-icon)
- Run `npx expo-doctor` to check for issues

### Camera Not Working
- Grant camera permissions in device settings
- Check expo-camera plugin is in app.json
- Rebuild app after adding camera plugin

### Backend Connection Issues
- Update API_URL in mobile/.env
- Ensure backend is running on accessible network
- Use ngrok or similar for external access during demo

## Quick Start for Hackathon Demo

```bash
# 1. Login to Expo
eas login

# 2. Initialize project
cd mobile
eas init

# 3. Build preview APK (takes ~10-15 minutes)
npm run build:android

# 4. Download and install on Android phone

# 5. Test scanner with demo products!
```

## Files Created/Modified

- ✅ `app.json` - Updated with WicBuy branding and camera permissions
- ✅ `eas.json` - Build configuration for 3 profiles
- ✅ `package.json` - Added build scripts
- ✅ `assets/icon.png` - App icon (from wic-buy.png)
- ✅ `assets/splash.png` - Splash screen (from wic-buy.png)
- ✅ `assets/adaptive-icon.png` - Android adaptive icon
- ✅ `assets/favicon.png` - Web favicon

Ready to build! 🚀
