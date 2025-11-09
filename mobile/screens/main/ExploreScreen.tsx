import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Megaphone, Briefcase, ShoppingBasket, MapPin, ChefHat, GraduationCap, 
         HelpCircle, Share2, UserCircle, User, UserPen, ChevronRight, 
         Settings, Info, LogOut, Languages } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParamList } from '../../navigation/MainNavigator';
import Typography from '../../components/Typography';
import SectionCard from '../../components/home/SectionCard';
import LanguageToggle from '../../components/LanguageToggle';
import ExploreHeader from '../../components/explore/ExploreHeader';

type ExploreScreenNavigationProp = StackNavigationProp<MainNavigatorParamList>;

interface ExploreCard {
  key: string;
  title: string;
  icon: React.ComponentType<any>;
  backgroundColor: string;
  iconColor: string;
  action?: () => void;
}

export default function ExploreScreen() {
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const navigation = useNavigation<ExploreScreenNavigationProp>();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Sign out successful - AuthContext will handle navigation
    } catch (error) {
      console.error('Sign out failed:', error);
      // Could show an alert or toast here if needed
      // For now, we'll just log the error since signOut is critical functionality
    }
  };

  const cards: ExploreCard[] = [
    { 
      key: 'benefits', 
      title: t('explore.wicBenefits'), 
      icon: Megaphone, 
      backgroundColor: '#FFB5B5', 
      iconColor: '#1A1A1A',
      action: () => navigation.navigate('MainTabs', { screen: 'Benefits' } as any)
    },
    { 
      key: 'scanner', 
      title: t('explore.barcodeScanner'), 
      icon: Briefcase, 
      backgroundColor: '#B5B5FF', 
      iconColor: '#1A1A1A',
      action: () => navigation.navigate('MainTabs', { screen: 'Scanner' } as any)
    },
    { 
      key: 'groceries', 
      title: t('explore.wicFoods'), 
      icon: ShoppingBasket, 
      backgroundColor: '#B5FFB5', 
      iconColor: '#1A1A1A',
      action: () => navigation.navigate('Categories')
    },
    { 
      key: 'stores', 
      title: t('explore.storeLocator'), 
      icon: MapPin, 
      backgroundColor: '#FFE5B5', 
      iconColor: '#1A1A1A'
    },
    { 
      key: 'recipes', 
      title: t('explore.healthyRecipes'), 
      icon: ChefHat, 
      backgroundColor: '#B5E5FF', 
      iconColor: '#1A1A1A'
    },
    { 
      key: 'education', 
      title: t('explore.nutritionTips'), 
      icon: GraduationCap, 
      backgroundColor: '#E5B5FF', 
      iconColor: '#1A1A1A'
    },
  ];

  // Bottom row utility items
  const utilities = [
    { key: 'support', title: t('explore.support'), icon: HelpCircle },
    { key: 'share', title: t('explore.share'), icon: Share2 },
    { key: 'account', title: t('explore.account'), icon: UserCircle },
  ];

  return (
    <View style={[styles.container, { backgroundColor: '#F5F5F5' }]}>
      <View style={styles.headerSection}>
        <ExploreHeader />
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
      >
      {/* Main Cards Grid */}
      <View style={styles.sectionNoPad}>
        <SectionCard title={t('explore.quickAccess')}>
          <View style={styles.cardsContainer}>
            {cards.map(card => (
              <TouchableOpacity
                key={card.key}
                style={[styles.card, { backgroundColor: card.backgroundColor }]}
                onPress={() => card.action ? card.action() : null}
                activeOpacity={0.8}
              >
                <View style={styles.iconContainer}>
                  <card.icon 
                    size={36}
                    color="#1A1A1A"
                    stroke="#1A1A1A"
                    fill="#FFFFFF"
                  />
                </View>
                <Typography 
                  variant="title" 
                  weight="600" 
                  style={[styles.cardTitle, { color: card.iconColor }]}
                >
                  {card.title}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>
      </View>

      {/* Account Section */}
      <View style={styles.sectionNoPad}>
        <SectionCard title={t('explore.account')}>
          {/* User Info */}
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <User size={32} color="#1A1A1A" stroke="#1A1A1A" />
            </View>
            <View style={styles.userDetails}>
              <Typography variant="subheading" weight="600">
                {user?.firstName || t('explore.guest')}
              </Typography>
              <Typography variant="body" color="textSecondary">
                {t('explore.wicParticipant')}
              </Typography>
            </View>
          </View>

          {/* Account Options */}
          <View style={styles.accountOptions}>
            <TouchableOpacity 
              style={styles.accountOption}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <UserPen size={20} color="#6B7280" stroke="#6B7280" />
              <Typography variant="body" style={{ marginLeft: 12, flex: 1 }}>
                {t('profile.editProfile')}
              </Typography>
              <ChevronRight size={20} color="#6B7280" stroke="#6B7280" />
            </TouchableOpacity>

            <View style={styles.optionDivider} />

            {/* Language Toggle - Inline */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
              <LanguageToggle />
            </View>

            <View style={styles.optionDivider} />

            <TouchableOpacity 
              style={styles.accountOption}
              onPress={() => navigation.navigate('ScannerSettings')}
            >
              <Settings size={20} color="#6B7280" stroke="#6B7280" />
              <Typography variant="body" style={{ marginLeft: 12, flex: 1 }}>
                {t('explore.scannerSettings')}
              </Typography>
              <ChevronRight size={20} color="#6B7280" stroke="#6B7280" />
            </TouchableOpacity>

            <View style={styles.optionDivider} />

            <TouchableOpacity style={styles.accountOption}>
              <HelpCircle size={20} color="#6B7280" stroke="#6B7280" />
              <Typography variant="body" style={{ marginLeft: 12, flex: 1 }}>
                {t('explore.helpSupport')}
              </Typography>
              <ChevronRight size={20} color="#6B7280" stroke="#6B7280" />
            </TouchableOpacity>

            <View style={styles.optionDivider} />

            <TouchableOpacity style={styles.accountOption}>
              <Info size={20} color="#6B7280" stroke="#6B7280" />
              <Typography variant="body" style={{ marginLeft: 12, flex: 1 }}>
                {t('explore.aboutWic')}
              </Typography>
              <ChevronRight size={20} color="#6B7280" stroke="#6B7280" />
            </TouchableOpacity>

            <View style={styles.optionDivider} />

            <TouchableOpacity 
              style={styles.accountOption}
              onPress={handleSignOut}
            >
              <LogOut size={20} color="#EF4444" stroke="#EF4444" />
              <Typography variant="body" style={{ marginLeft: 12, flex: 1, color: '#EF4444' }}>
                {t('explore.signOut')}
              </Typography>
            </TouchableOpacity>
          </View>
        </SectionCard>
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  headerSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 0,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 0,
  },
  sectionNoPad: {
    marginBottom: 3,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  card: {
    width: '48%',
    height: 120,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  iconContainer: {
    alignSelf: 'flex-start',
  },
  cardTitle: {
    fontSize: 15,
    marginTop: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  accountOptions: {
    marginTop: 8,
  },
  accountOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  optionDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: 32,
  },
});
