import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParamList } from '../../navigation/MainNavigator';
import Typography from '../../components/Typography';

type ExploreScreenNavigationProp = StackNavigationProp<MainNavigatorParamList>;

interface ExploreCard {
  key: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  iconColor: string;
  action?: () => void;
}

export default function ExploreScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation<ExploreScreenNavigationProp>();

  const cards: ExploreCard[] = [
    { 
      key: 'benefits', 
      title: 'WIC Benefits', 
      icon: 'megaphone-outline', 
      backgroundColor: '#FFB5B5', 
      iconColor: '#1A1A1A',
      action: () => navigation.navigate('MainTabs', { screen: 'Benefits' } as any)
    },
    { 
      key: 'scanner', 
      title: 'Barcode Scanner', 
      icon: 'briefcase-outline', 
      backgroundColor: '#B5B5FF', 
      iconColor: '#1A1A1A',
      action: () => navigation.navigate('MainTabs', { screen: 'Scanner' } as any)
    },
    { 
      key: 'groceries', 
      title: 'WIC Foods', 
      icon: 'basket-outline', 
      backgroundColor: '#B5FFB5', 
      iconColor: '#1A1A1A',
      action: () => navigation.navigate('Categories')
    },
    { 
      key: 'stores', 
      title: 'Store Locator', 
      icon: 'location-outline', 
      backgroundColor: '#FFE5B5', 
      iconColor: '#1A1A1A'
    },
    { 
      key: 'recipes', 
      title: 'Healthy Recipes', 
      icon: 'restaurant-outline', 
      backgroundColor: '#B5E5FF', 
      iconColor: '#1A1A1A'
    },
    { 
      key: 'education', 
      title: 'Nutrition Tips', 
      icon: 'school-outline', 
      backgroundColor: '#E5B5FF', 
      iconColor: '#1A1A1A'
    },
  ];

  // Bottom row utility items
  const utilities = [
    { key: 'support', title: 'Support', icon: 'help-circle-outline' as keyof typeof Ionicons.glyphMap },
    { key: 'share', title: 'Share', icon: 'share-outline' as keyof typeof Ionicons.glyphMap },
    { key: 'account', title: 'Account', icon: 'person-circle-outline' as keyof typeof Ionicons.glyphMap },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="heading" weight="700" style={{ fontSize: 32 }}>
          More
        </Typography>
      </View>

      {/* Main Cards Grid */}
      <View style={styles.cardsContainer}>
        {cards.map(card => (
          <TouchableOpacity
            key={card.key}
            style={[styles.card, { backgroundColor: card.backgroundColor }]}
            onPress={() => card.action ? card.action() : null}
            activeOpacity={0.8}
          >
            <View style={styles.iconContainer}>
              <Ionicons 
                name={card.icon} 
                size={40} 
                color={card.iconColor} 
                style={styles.cardIcon}
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

      {/* Bottom Utilities */}
      <View style={styles.utilitiesContainer}>
        {utilities.map(util => (
          <TouchableOpacity
            key={util.key}
            style={styles.utilityItem}
            activeOpacity={0.6}
          >
            <View style={[styles.utilityIcon, { backgroundColor: theme.card }]}>
              <Ionicons 
                name={util.icon} 
                size={24} 
                color={theme.text} 
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
  header: { 
    paddingHorizontal: 24,
    paddingBottom: 32,
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
});
