// Translations for English and Haitian Creole
export const translations = {
  en: {
    // Common
    common: {
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      cancel: 'Cancel',
      close: 'Close',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success!',
    },
    
    // Scanner
    scanner: {
      title: 'Scan Item',
      tapToScan: 'Tap to Scan',
      scanning: 'Scanning...',
      approved: 'WIC Approved!',
      notApproved: 'Not Covered',
      scanAnother: 'Scan Another Item',
      addToList: 'Add to Shopping List',
      
      // Results
      thisItemIsCovered: 'This item is covered by WIC',
      thisItemNotCovered: 'This item is NOT covered by WIC',
      reasonWhy: 'Why?',
      alternative: 'Try Instead',
      byBrand: 'by',
      isApproved: 'is WIC approved!',
      notCovered: 'is not covered by WIC',
      
      // Product messages
      productNotFound: 'This product was not found in our WIC database. Please check the barcode or try a different product.',
      milkSizeRule: 'WIC only covers half-gallon milk containers, not full gallons.',
      breadSizeRule: 'WIC only covers 16-ounce bread loaves.',
      cerealSizeRule: 'May exceed your monthly cereal allowance. Check if this fits within your 72-ounce monthly limit.',
      
      // Reasons
      wrongSize: 'Wrong size',
      wrongBrand: 'Wrong brand',
      wrongFlavor: 'Wrong flavor',
      notWicApproved: 'Not WIC approved',
      exceedsLimit: 'Would exceed monthly limit',
      
      // Suggestions
      trySmallerSize: 'Try smaller size',
      tryLargerSize: 'Try larger size',
      tryDifferentBrand: 'Try different brand',
      checkApprovedList: 'Check approved brands list',
      
      // Demo examples
      demoExamples: 'Try Demo Examples',
      demoGallonMilk: 'Gallon Milk',
      demoHalfGallonMilk: '½ Gallon Milk',
      demo20ozBread: '20oz Bread',
      demo16ozBread: '16oz Bread',
    },
    
    // Home
    home: {
      welcome: 'Welcome',
      welcomeBack: 'Welcome back',
      yourBenefits: 'Your WIC Benefits',
      quickActions: 'Quick Actions',
      recentTransactions: 'Recent Transactions',
      addPurchase: 'Add Purchase',
      benefitReset: 'Benefit Reset',
      expiresIn: 'Expires in',
      days: 'days',
      shoppingList: 'Shopping List',
      wicStores: 'WIC Stores',
      showCashier: 'Show Cashier',
      leftThisMonth: 'Left This Month',
      // Benefit tiles
      milk: 'Milk',
      fruitsVeg: 'Fruits & Veg',
      wholeGrains: 'Whole Grains',
      cereal: 'Cereal',
      gallons: 'gallons',
      dollars: 'dollars',
      packages: 'packages',
      ounces: 'ounces',
    },
    
    // Categories
    categories: {
      milk: 'Milk & Dairy',
      dairy: 'Dairy',
      produce: 'Fruits & Vegetables',
      grains: 'Bread & Grains',
      protein: 'Protein',
      vegetables: 'Vegetables',
      fruits: 'Fruits',
      cereal: 'Breakfast Cereal',
      juice: 'Juice',
      eggs: 'Eggs',
      peanutButter: 'Peanut Butter',
      beans: 'Beans',
    },
    
    // Shopping List
    shoppingList: {
      title: 'Shopping List',
      addItem: 'Add Item',
      addItemToList: 'Add Item to List',
      enterItemName: 'Enter item name...',
      add: 'Add',
      toBuy: 'To Buy',
      checkedOff: 'Checked Off',
      noItems: 'No items yet',
      emptyTitle: 'Your shopping list is empty',
      emptyMessage: 'Add items you need to buy on your next trip',
      startAdding: 'Start adding items to your shopping list',
      itemsLeft: 'items left',
      itemChecked: 'Item checked',
      itemDeleted: 'Item removed',
      clearChecked: 'Clear Checked Item',
      clearCheckedPlural: 'Clear Checked Items',
    },
    
    // Stores
    stores: {
      title: 'WIC Stores',
      nearby: 'Nearby Stores',
      nearbyCount: 'WIC-Approved Stores Near You',
      sortedByDistance: 'Sorted by distance',
      open: 'Open',
      closed: 'Closed',
      closedToday: 'Closed today',
      opensAt: 'Opens at',
      openUntil: 'Open until',
      getDirections: 'Directions',
      call: 'Call',
      milesAway: 'mi away',
      phoneNotAvailable: 'Phone not available',
      hoursNotAvailable: 'Hours not available',
      gettingLocation: 'Getting your location...',
      showingNearYou: 'Showing stores near you',
      locationUnavailable: 'Location unavailable • Showing sample stores',
      retry: 'Retry',
      shoppingTips: 'Shopping Tips',
      tipsMessage: 'Call ahead to confirm WIC items are in stock. Bring your WIC eCard and approved items list. Ask customer service for help finding WIC-approved products.',
    },
    
    // Profile
    profile: {
      title: 'Profile',
      language: 'Language',
      firstName: 'First Name',
      editProfile: 'Edit Profile',
      settings: 'Settings',
      updateInfo: 'Update your personal information',
      enterFirstName: 'Enter your first name',
      firstNameHelp: 'This name will be displayed in the app',
      wicCardNumber: 'WIC Card Number',
      updateCard: 'Update Card Number',
      addCard: 'Add WIC Card Number',
      cardPrivacy: 'Your card number is stored securely on your device only',
      notifications: 'Notifications',
      notificationsHelp: 'Get reminders about benefit expiration and WIC updates',
      profileUpdated: 'Your profile has been updated',
      updateFailed: 'Failed to update profile. Please try again.',
      enterCardNumber: 'Please enter your WIC card number',
      cardUpdated: 'WIC card number updated successfully',
      cardUpdateFailed: 'Failed to update card number',
      cardModalDesc: 'Enter your WIC card number. This will be stored locally on your device.',
      cardNumber: 'Card Number',
    },
    
    // Explore
    explore: {
      quickAccess: 'Quick Access',
      account: 'Account',
      wicParticipant: 'WIC Participant',
      guest: 'Guest',
      scannerSettings: 'Scanner Settings',
      helpSupport: 'Help & Support',
      aboutWic: 'About WIC',
      signOut: 'Sign Out',
      wicBenefits: 'WIC Benefits',
      barcodeScanner: 'Barcode Scanner',
      wicFoods: 'WIC Foods',
      storeLocator: 'Store Locator',
      healthyRecipes: 'Healthy Recipes',
      nutritionTips: 'Nutrition Tips',
      support: 'Support',
      share: 'Share',
    },
    
    // Benefits Screen
    benefits: {
      current: 'Current',
      future: 'Future',
      expiresMessage: 'Benefits expire in {days} days • Reset: {date}',
      nextBenefitsMessage: 'Next benefits available: {date}',
      items: 'items',
      used: 'used',
      itemsAvailable: 'items available',
      remaining: 'remaining',
      of: 'of',
    },
    
    // Benefit Detail Modal
    benefitDetail: {
      smartPicks: 'Smart Picks for You',
      yourBenefits: 'Your Benefits',
    },
  },
  
  ht: { // Haitian Creole
    // Common
    common: {
      yes: 'Wi',
      no: 'Non',
      ok: 'OK',
      cancel: 'Anile',
      close: 'Fèmen',
      save: 'Sove',
      delete: 'Efase',
      edit: 'Modifye',
      loading: 'Ap chaje...',
      error: 'Erè',
      success: 'Siksè!',
    },
    
    // Scanner
    scanner: {
      title: 'Eskane Pwodwi',
      tapToScan: 'Tape pou Eskane',
      scanning: 'Ap eskane...',
      approved: 'WIC Apwouve!',
      notApproved: 'Pa Kouvri',
      scanAnother: 'Eskane yon lòt pwodwi',
      addToList: 'Mete nan lis',
      
      // Results
      thisItemIsCovered: 'Pwodwi sa a kouvri pa WIC',
      thisItemNotCovered: 'Pwodwi sa a PA kouvri pa WIC',
      reasonWhy: 'Poukisa?',
      alternative: 'Eseye sa olye',
      byBrand: 'pa',
      isApproved: 'WIC apwouve li!',
      notCovered: 'WIC pa kouvri li',
      
      // Product messages
      productNotFound: 'Nou pa jwenn pwodwi sa a nan baz done WIC nou an. Tanpri verifye kòd la oswa eseye yon lòt pwodwi.',
      milkSizeRule: 'WIC sèlman kouvri demi-galon lèt, pa galon konple.',
      breadSizeRule: 'WIC sèlman kouvri pen 16 ons.',
      cerealSizeRule: 'Sa ka depase limit sereyal chak mwa ou. Verifye si sa kab antre nan limit 72 ons chak mwa ou.',
      
      // Reasons
      wrongSize: 'Move gwosè',
      wrongBrand: 'Move mak',
      wrongFlavor: 'Move gou',
      notWicApproved: 'WIC pa apwouve',
      exceedsLimit: 'Ta depase limit chak mwa',
      
      // Suggestions
      trySmallerSize: 'Eseye yon ti gwosè',
      tryLargerSize: 'Eseye yon pi gwo gwosè',
      tryDifferentBrand: 'Eseye yon lòt mak',
      checkApprovedList: 'Gade lis mak ki apwouve yo',
      
      // Demo examples
      demoExamples: 'Eseye Egzanp',
      demoGallonMilk: 'Galon Lèt',
      demoHalfGallonMilk: '½ Galon Lèt',
      demo20ozBread: 'Pen 20oz',
      demo16ozBread: 'Pen 16oz',
    },
    
    // Home
    home: {
      welcome: 'Byenvini',
      yourBenefits: 'Benefis WIC ou',
      quickActions: 'Aksyon Rapid',
      recentTransactions: 'Dènye Achá',
      addPurchase: 'Ajoute Achá',
      benefitReset: 'Benefis Renouvle',
      expiresIn: 'Ekspire nan',
      days: 'jou',
      shoppingList: 'Lis Achá',
      wicStores: 'Magazen WIC',
      showCashier: 'Montre Kesye',
    },
    
    // Categories
    categories: {
      milk: 'Lèt ak Pwodwi Lèt',
      produce: 'Fwi ak Legim',
      grains: 'Pen ak Sereyal',
      cereal: 'Sereyal Manje Maten',
      juice: 'Ji',
      eggs: 'Ze',
      peanutButter: 'Manba',
      beans: 'Pwa',
    },
    
    // Shopping List
    shoppingList: {
      title: 'Lis Achá',
      addItem: 'Ajoute Pwodwi',
      noItems: 'Poko gen pwodwi',
      startAdding: 'Kòmanse ajoute pwodwi nan lis achá ou',
      itemsLeft: 'pwodwi ki rete',
      itemChecked: 'Pwodwi make',
      itemDeleted: 'Pwodwi efase',
    },
    
    // Stores
    stores: {
      title: 'Magazen WIC',
      nearby: 'Magazen Toupre',
      open: 'Louvri',
      closed: 'Fèmen',
      opensAt: 'Louvri a',
      openUntil: 'Louvri jiska',
      getDirections: 'Direksyon',
      call: 'Rele',
      milesAway: 'mil lwen',
    },
    
    // Profile
    profile: {
      title: 'Profil',
      language: 'Lang',
      firstName: 'Premye Non',
      editProfile: 'Modifye Profil',
      settings: 'Paramèt',
      updateInfo: 'Mete ajou enfòmasyon pèsonèl ou',
      enterFirstName: 'Antre premye non ou',
      firstNameHelp: 'Non sa a ap parèt nan aplikasyon an',
      wicCardNumber: 'Nimewo Kat WIC',
      updateCard: 'Mete ajou nimewo kat',
      addCard: 'Ajoute nimewo kat WIC',
      cardPrivacy: 'Nimewo kat ou an sèlman sou aparèy ou an',
      notifications: 'Notifikasyon',
      notificationsHelp: 'Resevwa rapèl sou ekspirasyon benefis ak mizajou WIC',
      profileUpdated: 'Profil ou mete ajou',
      updateFailed: 'Nou pa te kapab mete ajou profil la. Tanpri eseye ankò.',
      enterCardNumber: 'Tanpri antre nimewo kat WIC ou',
      cardUpdated: 'Nimewo kat WIC mete ajou',
      cardUpdateFailed: 'Nou pa te kapab mete ajou nimewo kat la',
      cardModalDesc: 'Antre nimewo kat WIC ou. Li ap sere sou aparèy ou an sèlman.',
      cardNumber: 'Nimewo Kat',
    },
    
    // Explore
    explore: {
      quickAccess: 'Aksè Rapid',
      account: 'Kont',
      wicParticipant: 'Patisipan WIC',
      guest: 'Envite',
      scannerSettings: 'Paramèt Eskane',
      helpSupport: 'Èd & Sipò',
      aboutWic: 'Konsènan WIC',
      signOut: 'Dekonekte',
      wicBenefits: 'Benefis WIC',
      barcodeScanner: 'Eskane Kòd Ba',
      wicFoods: 'Manje WIC',
      storeLocator: 'Jwenn Magazen',
      healthyRecipes: 'Resèt Sante',
      nutritionTips: 'Konsèy Nitrisyon',
      support: 'Sipò',
      share: 'Pataje',
    },
  },
};

export type Language = 'en' | 'ht';
export type TranslationKey = typeof translations.en;
