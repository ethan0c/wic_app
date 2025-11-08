import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Search, XCircle, Check, MapPin, HelpCircle } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
 
import SectionCard from '../../components/home/SectionCard';
import Typography from '../../components/Typography';
import Button from '../../components/Button';
import WicLogo from '../../components/WicLogo';
import StateCard from '../../components/StateCard';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const filteredStates = US_STATES_WITH_WIC.filter(state =>
    state.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    state.app.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStateSelect = (stateName: string) => {
    setSelectedState(stateName);
  };
  const handleContinue = () => selectedState && (navigation as any).navigate('CardScan', { selectedState });
  const handleStateNotFound = () => alert('Please contact your local WIC office for assistance.');

  return (
    <View style={[styles.container, { backgroundColor: '#F5F5F5' }]}>
      {/* Header Card - Fixed at top like Home */}
      <View style={styles.headerSection}>
        <Typography variant="heading" weight="500" style={{ fontSize: 20, marginBottom: 12 }}>
          Select Your State
        </Typography>
        <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Search size={20} color={theme.textSecondary} stroke={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search states..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <XCircle size={20} color={theme.textSecondary} stroke={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.stateList}>
          {filteredStates.map((state, index) => (
            <StateCard
              key={state.name}
              stateName={state.name}
              stateApp={state.app}
              isSelected={selectedState === state.name}
              onPress={() => handleStateSelect(state.name)}
            />
          ))}
        </View>

        {filteredStates.length === 0 && (
          <View style={styles.emptyState}>
            <MapPin size={64} color={theme.textSecondary} stroke={theme.textSecondary} />
            <Typography variant="body" align="center" color="textSecondary" style={{ marginTop: 16 }}>
              No states found matching "{searchQuery}"
            </Typography>
          </View>
        )}

        <TouchableOpacity style={styles.notFoundButton} onPress={handleStateNotFound}>
          <HelpCircle size={20} color="#EF4444" stroke="#EF4444" />
          <Text style={styles.notFoundText}>State not found? Get help</Text>
        </TouchableOpacity>
      </ScrollView>
      {selectedState && (
        <View style={[styles.footer, { backgroundColor: '#F5F5F5', borderTopColor: theme.border }]}>
          <View style={styles.selectedStateInfo}>
            <MapPin size={20} color={theme.primary} stroke={theme.primary} />
            <Text style={[styles.selectedStateText, { color: theme.text }]}>{selectedState}</Text>
          </View>
          <Button title="Continue" onPress={handleContinue} fullWidth size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerSection: { backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16 },
  scrollContainer: { flex: 1 },
  contentContainer: { paddingHorizontal: 16, paddingBottom: 160, paddingTop: 3 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 16, borderWidth: 1, gap: 12 },
  searchInput: { flex: 1, fontSize: 16, fontWeight: '300' },
  stateList: { gap: 0, paddingVertical: 4 },
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  notFoundButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 32, marginBottom: 20, padding: 16 },
  notFoundText: { fontSize: 16, fontWeight: '400', color: '#EF4444' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 32, borderTopWidth: 1 },
  selectedStateInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16, justifyContent: 'center' },
  selectedStateText: { fontSize: 16, fontWeight: '500' },
});
