import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { createSharedStyles, SPACING, BORDER_RADIUS } from '../../../assets/styles/shared.styles';
import Typography from '../../../components/Typography';
import Button from '../../../components/Button';

const US_STATES_WITH_WIC = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia',
];

export default function StateProviderScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const sharedStyles = createSharedStyles(theme);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const filteredStates = US_STATES_WITH_WIC.filter(state =>
    state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
  };

  const handleContinue = () => {
    if (selectedState) {
      // Navigate to auth options screen
      navigation.navigate('AuthIndex' as never);
    }
  };

  const handleStateNotFound = () => {
    // In production, this would show a contact form or support info
    alert('Please contact your local WIC office for assistance.');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Typography variant="heading" align="center" style={{ marginBottom: 8 }}>
          Select Your State
        </Typography>
        
        <Typography variant="body" align="center" color="textSecondary" style={{ marginBottom: 32 }}>
          Choose your state to connect with your WIC provider
        </Typography>

        {/* Search Input */}
        <View style={[styles.searchContainer, { 
          backgroundColor: theme.card,
          borderColor: theme.border 
        }]}>
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search states..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* State List */}
        <View style={styles.stateList}>
          {filteredStates.map((state) => (
            <TouchableOpacity
              key={state}
              style={[
                styles.stateItem,
                { 
                  backgroundColor: theme.card,
                  borderColor: selectedState === state ? theme.primary : 'transparent',
                  borderWidth: 2,
                }
              ]}
              onPress={() => handleStateSelect(state)}
            >
              <View style={styles.stateContent}>
                <View style={styles.stateLeftContent}>
                  <Image 
                    source={require('../../../assets/images/wic_logo.png')}
                    style={styles.stateLogo}
                    resizeMode="contain"
                  />
                  <Text style={[styles.stateName, { color: theme.text }]}>
                    {state}
                  </Text>
                </View>
                {selectedState === state && (
                  <View style={[styles.checkmark, { backgroundColor: theme.primary }]}>
                    <Ionicons name="checkmark" size={20} color="white" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {filteredStates.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={64} color={theme.textSecondary} />
            <Typography variant="body" align="center" color="textSecondary" style={{ marginTop: 16 }}>
              No states found matching "{searchQuery}"
            </Typography>
          </View>
        )}

        {/* State Not Found Button */}
        <TouchableOpacity
          style={styles.notFoundButton}
          onPress={handleStateNotFound}
        >
          <Ionicons name="help-circle-outline" size={20} color="#EF4444" />
          <Text style={styles.notFoundText}>
            State not found? Get help
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Continue Button */}
      {selectedState && (
        <View style={[styles.footer, { 
          backgroundColor: theme.background,
          borderTopColor: theme.border 
        }]}>
          <View style={styles.selectedStateInfo}>
            <Ionicons name="location" size={20} color={theme.primary} />
            <Text style={[styles.selectedStateText, { color: theme.text }]}>
              {selectedState}
            </Text>
          </View>
          <Button
            title="Continue"
            onPress={handleContinue}
            fullWidth
            size="large"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 160,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    marginBottom: 24,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '300',
  },
  stateList: {
    gap: 14,
  },
  stateItem: {
    borderRadius: BORDER_RADIUS.md,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  stateContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stateLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  stateLogo: {
    width: 48,
    height: 48,
  },
  stateName: {
    fontSize: 18,
    fontWeight: '400',
    flex: 1,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  notFoundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
    marginBottom: 20,
    padding: 16,
  },
  notFoundText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#EF4444',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
  },
  selectedStateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  selectedStateText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
