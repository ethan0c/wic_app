# WIC App MVP Feature Status

Here's the lean, no-nonsense MVP feature list to ship first:

## ✅ Completed Features

### Authentication & Onboarding
- ✅ **State selection screen** with search, rounded card UI, and animations
- ✅ **Card scan flow** with manual entry modal (improved UX - no collapse on typing)
- ✅ **Skip authentication** with guest mode support
- ✅ **Session persistence** via AsyncStorage
- ✅ **Navigation reset** to prevent back-to-auth after skip/login

### UI/UX Foundation
- ✅ **Icon system migration** to Lucide icons with stroke/fill control
- ✅ **Custom fonts** (Canela for headings, Inter for body)
- ✅ **Theme system** with light/dark mode support
- ✅ **Component library** (Typography, Button, SectionCard, StateCard, ManualEntryModal)
- ✅ **Fixed header + scrollable content** pattern across screens
- ✅ **Rounded card designs** with proper border radius and spacing
- ✅ **Color-coded info cards** with tinted backgrounds

### Home Dashboard
- ✅ **Benefit tiles** showing remaining amounts per category (milk, produce, grains, cereal)
- ✅ **Card display** component showing WIC EBT card
- ✅ **Quick action cards** (Scan, Shopping List, WIC Stores)
- ✅ **Smart picks** suggestions based on benefits
- ✅ **Bottom utilities** (Help, Share, Profile)

### Navigation
- ✅ **Bottom tab navigation** (Home, Scanner, Benefits, Explore)
- ✅ **Stack navigation** for detail screens
- ✅ **Custom transitions** and animations
- ✅ **Proper navigation flow** between auth and main app

## 🚧 In Progress

### 2) Live benefits view (this month)
- ⚠️ **Basic UI complete** - needs real WIC category rules integration
- ⚠️ **Static benefit data** - needs connection to actual WIC balance API
- ⚠️ **Reset date display** - partially implemented, needs finalization
- ❌ **"What this buys now" suggestions** - not yet implemented
- ❌ **No-rollover note** - missing

### 1) Scanner → Answer (single screen)
- ⚠️ **Scanner screen exists** - camera integration pending
- ❌ **Barcode/PLU scan** - placeholder only, needs react-native-camera integration
- ❌ **Approval/rejection logic** - rules engine not connected
- ❌ **Alternative suggestions** - not implemented
- ❌ **Reason display** (size/brand/flavor/limit) - not implemented

## ❌ Not Started

### 3) Rules engine (local + updatable)
- ❌ Container/size rules encoding
- ❌ Strict size validation (e.g., 16-oz bread)
- ❌ Mixable ounces logic (cereal)
- ❌ Brand/flavor limits
- ❌ Offline rules execution
- ❌ Background rule sync

### 4) Produce & variable-weight support
- ❌ PLU entry interface
- ❌ "lbs remaining" calculation
- ❌ Split purchase guidance

### 5) Language & literacy access
- ❌ Haitian-Creole support
- ❌ Spanish support (partial i18n structure exists)
- ❌ Tap-to-hear audio for messages
- ❌ Large icon mode
- ❌ Plain language simplification

### 6) Post-shop reconciliation
- ❌ Purchase confirmation flow
- ❌ Receipt photo stub
- ❌ Benefit balance updates

### 7) "Show cashier" summary
- ❌ Approved items list screen
- ❌ Quantities display
- ❌ Cashier-friendly format

### 8) Offline resilience
- ⚠️ **Basic offline support** via AsyncStorage for auth
- ❌ Offline scanning/matching
- ❌ Queued sync for balances
- ❌ Background rule updates
- ❌ Graceful degradation messaging

### 9) Data/update pipeline
- ❌ Config feed for approved items
- ❌ Dynamic rule updates (no app release)
- ❌ "Flag this item" reporting
- ❌ Error reporting system

### 10) Privacy & accounts
- ✅ **Guest mode** implemented
- ⚠️ **Minimal data collection** - session only, no analytics yet
- ❌ Consent flow for eWIC linking
- ❌ Privacy policy screen

### 11) Performance & reliability
- ❌ Scan performance benchmarking (target: ≤3 seconds)
- ❌ Stale data fallback messages
- ❌ Performance monitoring

### 12) Basic analytics (non-sensitive)
- ❌ Block reason tracking
- ❌ Rule fix prioritization data
- ❌ Alternative suggestion metrics

---

## 🎯 Next Priority Tasks

1. **Complete Scanner Integration**
   - Integrate react-native-camera or expo-camera
   - Implement barcode scanning
   - Add PLU manual entry

2. **Build Rules Engine**
   - Create local rules data structure
   - Implement category/size/brand validation
   - Add offline-first architecture

3. **Connect Real WIC Data**
   - Integrate with WIC API or create mock service
   - Dynamic benefit balance updates
   - Category-specific rules per state

4. **Add Multilingual Support**
   - i18n setup (react-i18next)
   - Translation files (EN, ES, HT)
   - Text-to-speech integration

5. **Implement Offline Sync**
   - Queue system for offline operations
   - Background sync on reconnect
   - Conflict resolution

---

*Last updated: November 8, 2025*
