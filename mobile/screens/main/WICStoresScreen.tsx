import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { MapPin, Phone, Clock, Navigation, ExternalLink } from 'lucide-react-native';
import Typography from '../../components/Typography';

interface Store {
  id: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
  hours: string;
  isOpen: boolean;
}

export default function WICStoresScreen() {
  const stores: Store[] = [
    {
      id: '1',
      name: 'Walmart Supercenter',
      address: '123 Main Street, Boston, MA 02101',
      distance: '0.8 mi',
      phone: '(617) 555-0100',
      hours: 'Open until 11:00 PM',
      isOpen: true,
    },
    {
      id: '2',
      name: 'Target',
      address: '456 Commonwealth Ave, Boston, MA 02215',
      distance: '1.2 mi',
      phone: '(617) 555-0200',
      hours: 'Open until 10:00 PM',
      isOpen: true,
    },
    {
      id: '3',
      name: 'Stop & Shop',
      address: '789 Boylston Street, Boston, MA 02116',
      distance: '1.5 mi',
      phone: '(617) 555-0300',
      hours: 'Open until 9:00 PM',
      isOpen: true,
    },
    {
      id: '4',
      name: 'Market Basket',
      address: '321 Washington Street, Boston, MA 02108',
      distance: '2.1 mi',
      phone: '(617) 555-0400',
      hours: 'Closed • Opens at 7:00 AM',
      isOpen: false,
    },
    {
      id: '5',
      name: 'Whole Foods Market',
      address: '654 Beacon Street, Boston, MA 02215',
      distance: '2.3 mi',
      phone: '(617) 555-0500',
      hours: 'Open until 10:00 PM',
      isOpen: true,
    },
  ];

  const handleCallStore = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/[^0-9]/g, '')}`);
  };

  const handleGetDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
  };

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.headerInfo}>
        <MapPin size={24} color="#1A1A1A" strokeWidth={2} />
        <View style={styles.headerText}>
          <Typography variant="body" weight="600">
            {stores.length} WIC-Approved Stores Near You
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Sorted by distance
          </Typography>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {stores.map((store, index) => (
          <View key={store.id} style={styles.storeCard}>
            {/* Store Header */}
            <View style={styles.storeHeader}>
              <View style={styles.storeLeft}>
                <View style={styles.storeNumber}>
                  <Typography variant="caption" weight="700" style={{ color: 'white' }}>
                    {index + 1}
                  </Typography>
                </View>
                <View style={styles.storeInfo}>
                  <Typography variant="subheading" weight="700" style={styles.storeName}>
                    {store.name}
                  </Typography>
                  <View style={styles.distanceTag}>
                    <Navigation size={12} color="#10B981" strokeWidth={2.5} />
                    <Typography variant="caption" weight="600" style={{ color: '#10B981', marginLeft: 4 }}>
                      {store.distance}
                    </Typography>
                  </View>
                </View>
              </View>
            </View>

            {/* Address */}
            <View style={styles.detailRow}>
              <MapPin size={18} color="#666" strokeWidth={2} />
              <Typography variant="body" style={styles.detailText}>
                {store.address}
              </Typography>
            </View>

            {/* Phone */}
            <View style={styles.detailRow}>
              <Phone size={18} color="#666" strokeWidth={2} />
              <Typography variant="body" style={styles.detailText}>
                {store.phone}
              </Typography>
            </View>

            {/* Hours */}
            <View style={styles.detailRow}>
              <Clock size={18} color="#666" strokeWidth={2} />
              <View style={styles.hoursContainer}>
                <View style={[styles.statusDot, { backgroundColor: store.isOpen ? '#10B981' : '#EF4444' }]} />
                <Typography 
                  variant="body" 
                  weight="600"
                  style={[styles.detailText, { color: store.isOpen ? '#10B981' : '#EF4444', marginLeft: 8 }]}
                >
                  {store.hours}
                </Typography>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => handleGetDirections(store.address)}
                activeOpacity={0.7}
              >
                <Navigation size={18} color="white" strokeWidth={2.5} />
                <Typography variant="body" weight="600" style={{ color: 'white', marginLeft: 8 }}>
                  Directions
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => handleCallStore(store.phone)}
                activeOpacity={0.7}
              >
                <Phone size={18} color="#1A1A1A" strokeWidth={2} />
                <Typography variant="body" weight="600" style={{ marginLeft: 8 }}>
                  Call
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Typography variant="body" weight="600" style={{ marginBottom: 8 }}>
            💡 Shopping Tips
          </Typography>
          <Typography variant="body" style={{ color: '#666', lineHeight: 20 }}>
            Call ahead to confirm WIC items are in stock. Bring your WIC eCard and approved items list. 
            Ask customer service for help finding WIC-approved products.
          </Typography>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  storeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  storeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  storeNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 18,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  distanceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
  },
  primaryButton: {
    backgroundColor: '#1A1A1A',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoBox: {
    backgroundColor: '#FFF9E6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginTop: 8,
  },
});
