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
  { name: 'Alabama', app: 'ALABAMA WIC' },
  { name: 'Alaska', app: 'ALASKA WIC' },
  { name: 'Arizona', app: 'ITCA WIC - Inter Tribal Council of Arizona' },
  { name: 'Arkansas', app: 'ARKANSAS WIC' },
  { name: 'California', app: 'California WIC' },
  { name: 'Chickasaw Nation', app: 'Chickasaw WIC' },
  { name: 'Colorado', app: 'COLORADO WIC' },
  { name: 'Connecticut', app: 'CONNECTICUT' },
  { name: 'Delaware', app: 'DELAWARE' },
  { name: 'District of Columbia', app: 'DC WIC' },
  { name: 'Florida', app: 'FL WIC' },
  { name: 'Georgia', app: 'Georgia WIC' },
  { name: 'Hawaii', app: 'HAWAII WIC' },
  { name: 'Idaho', app: 'IDAHO WIC' },
  { name: 'Illinois', app: 'Illinois WIC' },
  { name: 'Indiana', app: 'INDIANA' },
  { name: 'Iowa', app: 'Iowa WIC' },
  { name: 'Kansas', app: 'KANSAS' },
  { name: 'Kentucky', app: 'KENTUCKY' },
  { name: 'Louisiana', app: 'LOUISIANA WIC' },
  { name: 'Maine', app: 'MAINE' },
  { name: 'Massachusetts', app: 'MA WIC' },
  { name: 'Michigan', app: 'MICHIGAN' },
  { name: 'Minnesota', app: 'Minnesota WIC' },
  { name: 'Mississippi', app: 'MISSISSIPPI' },
  { name: 'Missouri', app: 'MISSOURI WIC' },
  { name: 'Montana', app: 'MONTANA' },
  { name: 'Nebraska', app: 'NEBRASKA WIC' },
  { name: 'Nevada', app: 'NEVADA' },
  { name: 'Nevada - ITC', app: 'ITCN - Inter-Tribal Council of Nevada' },
  { name: 'New Hampshire', app: 'NEW HAMPSHIRE' },
  { name: 'New Jersey', app: 'NEW JERSEY' },
  { name: 'New Mexico', app: 'NEW MEXICO' },
  { name: 'New York', app: 'New York WIC' },
  { name: 'North Carolina', app: 'North Carolina WIC' },
  { name: 'North Dakota', app: 'NORTH DAKOTA' },
  { name: 'Ohio', app: 'Ohio WIC' },
  { name: 'Oklahoma', app: 'OKLAHOMA' },
  { name: 'Oregon', app: 'Oregon WIC' },
  { name: 'Passamaquoddy Reservation', app: 'PASSAMAQUODDY - Pleasant Point' },
  { name: 'Pennsylvania', app: 'PA WIC' },
  { name: 'Puerto Rico', app: 'PUERTO RICO WIC' },
  { name: 'Rhode Island', app: 'Rhode Island WIC' },
  { name: 'South Carolina', app: 'South Carolina WIC' },
  { name: 'South Dakota', app: 'South Dakota WIC' },
  { name: 'Tennessee', app: 'TENNESSEE WIC' },
  { name: 'Texas', app: 'Texas WIC' },
  { name: 'Utah', app: 'UTAH WIC' },
  { name: 'Vermont', app: 'Vermont WIC' },
  { name: 'Virginia', app: 'VIRGINIA' },
  { name: 'Washington', app: 'WASHINGTON WIC' },
  { name: 'West Virginia', app: 'WV WIC' },
  { name: 'Wisconsin', app: 'Wisconsin WIC' },
  { name: 'Wyoming', app: 'WYOMING' },
];

export default function StateProviderScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const sharedStyles = createSharedStyles(theme);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const filteredStates = US_STATES_WITH_WIC.filter(state =>
    state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    state.app.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStateSelect = (stateName: string) => {
    setSelectedState(stateName);
  };

  const handleContinue = () => {
    if (selectedState) {
      // Navigate to card scan screen
      (navigation as any).navigate('CardScan', { selectedState });
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
        <Typography variant="heading" style={{ marginTop: 20 }}>
          Select Your State
        </Typography>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
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
              key={state.name}
              style={[
                styles.stateItem,
                { 
                  backgroundColor: theme.card,
                  borderColor: selectedState === state.name ? theme.primary : 'transparent',
                  borderWidth: 2,
                }
              ]}
              onPress={() => handleStateSelect(state.name)}
            >
              <View style={styles.stateContent}>
                <View style={styles.stateLeftContent}>
                  <Image 
                    source={require('../../../assets/images/wic_logo.png')}
                    style={styles.stateLogo}
                    resizeMode="contain"
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.stateName, { color: theme.text }]}>
                      {state.name}
                    </Text>
                    <Text style={[styles.stateApp, { color: theme.textSecondary }]}>
                      {state.app}
                    </Text>
                  </View>
                </View>
                {selectedState === state.name && (
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
    paddingBottom: 8,
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
  stateApp: {
    fontSize: 13,
    fontWeight: '300',
    marginTop: 2,
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
