import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Megaphone, Briefcase, ShoppingBasket, MapPin, ChefHat, GraduationCap, 
         HelpCircle, Share2, UserCircle, User, UserPen, ChevronRight, 
         Settings, Info, LogOut } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParamList } from '../../navigation/MainNavigator';
import Typography from '../../components/Typography';
import SectionCard from '../../components/home/SectionCard';

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
  const navigation = useNavigation<ExploreScreenNavigationProp>();

  const cards: ExploreCard[] = [
    { 
      key: 'benefits', 
      title: 'WIC Benefits', 
      icon: Megaphone, 
      backgroundColor: '#FFB5B5', 
      iconColor: '#1A1A1A',
      action: () => navigation.navigate('MainTabs', { screen: 'Benefits' } as any)
    },
    { 
      key: 'scanner', 
      title: 'Barcode Scanner', 
      icon: Briefcase, 
      backgroundColor: '#B5B5FF', 
      iconColor: '#1A1A1A',
      action: () => navigation.navigate('MainTabs', { screen: 'Scanner' } as any)
    },
    { 
      key: 'groceries', 
      title: 'WIC Foods', 
      icon: ShoppingBasket, 
      backgroundColor: '#B5FFB5', 
      iconColor: '#1A1A1A',
      action: () => navigation.navigate('Categories')
    },
    { 
      key: 'stores', 
      title: 'Store Locator', 
      icon: MapPin, 
      backgroundColor: '#FFE5B5', 
      iconColor: '#1A1A1A'
    },
    { 
      key: 'recipes', 
      title: 'Healthy Recipes', 
      icon: ChefHat, 
      backgroundColor: '#B5E5FF', 
      iconColor: '#1A1A1A'
    },
    { 
      key: 'education', 
      title: 'Nutrition Tips', 
      icon: GraduationCap, 
      backgroundColor: '#E5B5FF', 
      iconColor: '#1A1A1A'
    },
  ];

  // Bottom row utility items
  const utilities = [
    { key: 'support', title: 'Support', icon: HelpCircle },
    { key: 'share', title: 'Share', icon: Share2 },
    { key: 'account', title: 'Account', icon: UserCircle },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Main Cards Grid */}
      <View style={styles.sectionNoPad}>
        <SectionCard title="Quick Access">
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
                    size={40} 
                    color={card.iconColor}
                    stroke={card.iconColor}
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
        <SectionCard title="Account">
          {/* User Info */}
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <User size={32} color="#1A1A1A" stroke="#1A1A1A" />
            </View>
            <View style={styles.userDetails}>
              <Typography variant="subheading" weight="600">
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body" color="textSecondary">
                WIC Participant
              </Typography>
            </View>
          </View>

          {/* Account Options */}
          <View style={styles.accountOptions}>
            <TouchableOpacity style={styles.accountOption}>
              <UserPen size={20} color="#6B7280" stroke="#6B7280" />
              <Typography variant="body" style={{ marginLeft: 12, flex: 1 }}>
                Edit Profile
              </Typography>
              <ChevronRight size={20} color="#6B7280" stroke="#6B7280" />
            </TouchableOpacity>

            <View style={styles.optionDivider} />

            <TouchableOpacity 
              style={styles.accountOption}
              onPress={() => navigation.navigate('ScannerSettings')}
            >
              <Settings size={20} color="#6B7280" stroke="#6B7280" />
              <Typography variant="body" style={{ marginLeft: 12, flex: 1 }}>
                Scanner Settings
              </Typography>
              <ChevronRight size={20} color="#6B7280" stroke="#6B7280" />
            </TouchableOpacity>

            <View style={styles.optionDivider} />

            <TouchableOpacity style={styles.accountOption}>
              <HelpCircle size={20} color="#6B7280" stroke="#6B7280" />
              <Typography variant="body" style={{ marginLeft: 12, flex: 1 }}>
                Help & Support
              </Typography>
              <ChevronRight size={20} color="#6B7280" stroke="#6B7280" />
            </TouchableOpacity>

            <View style={styles.optionDivider} />

            <TouchableOpacity style={styles.accountOption}>
              <Info size={20} color="#6B7280" stroke="#6B7280" />
              <Typography variant="body" style={{ marginLeft: 12, flex: 1 }}>
                About WIC
              </Typography>
              <ChevronRight size={20} color="#6B7280" stroke="#6B7280" />
            </TouchableOpacity>

            <View style={styles.optionDivider} />

            <TouchableOpacity 
              style={styles.accountOption}
              onPress={signOut}
            >
              <LogOut size={20} color="#EF4444" stroke="#EF4444" />
              <Typography variant="body" style={{ marginLeft: 12, flex: 1, color: '#EF4444' }}>
                Sign Out
              </Typography>
            </TouchableOpacity>
          </View>
        </SectionCard>
      </View>

      {/* Bottom Utilities */}
      <View style={styles.sectionNoPad}>
        <SectionCard title="Help & Support">
          <View style={styles.utilitiesContainer}>
            {utilities.map(util => (
              <TouchableOpacity
                key={util.key}
                style={styles.utilityItem}
                activeOpacity={0.6}
              >
                <View style={[styles.utilityIcon, { backgroundColor: theme.card }]}>
                  <util.icon 
                    size={24} 
                    color={theme.text}
                    stroke={theme.text}
                  />
                </View>
                <Typography 
                  variant="body" 
                  weight="500" 
                  style={[styles.utilityText, { color: theme.text }]}
                >
                  {util.title}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>
      </View>

      {/* Bottom Spacing */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  contentContainer: {
    paddingTop: 20,
  },
  sectionNoPad: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  headerSection: { 
    paddingHorizontal: 16,
    marginBottom: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSpacer: {
    width: 20,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    height: 120,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    alignSelf: 'flex-start',
  },
  cardIcon: {
    // Icon styling handled by Ionicons
  },
  cardTitle: {
    fontSize: 18,
    marginTop: 8,
  },
  utilitiesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    paddingVertical: 32,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    marginTop: 40,
  },
  utilityItem: {
    alignItems: 'center',
    flex: 1,
  },
  utilityIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  utilityText: {
    fontSize: 14,
    textAlign: 'center',
  },
  accountSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
