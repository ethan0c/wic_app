import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator, Alert } from 'react-native';
import { MapPin, Phone, Clock, Navigation, ExternalLink, Locate } from 'lucide-react-native';
import { useLanguage } from '../../context/LanguageContext';
import Typography from '../../components/Typography';
import * as Location from 'expo-location';
import { getNearbyStores, type WicStore } from '../../services/wicApi';

export default function WICStoresScreen() {
  const { t } = useLanguage();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [stores, setStores] = useState<WicStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<string>('');

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);
      
      if (status === 'granted') {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
        // Load nearby stores with real location
        await loadNearbyStores(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );
      } else {
        setLoading(false);
        Alert.alert(
          'Location Permission',
          'Enable location access to find WIC stores near you.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Location error:', error);
      setLoading(false);
    }
  };

  // Fetch nearby stores from backend API
  const loadNearbyStores = async (latitude: number, longitude: number) => {
    try {
      // Validate coordinates
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        console.error('Invalid coordinates:', { latitude, longitude });
        setLoading(false);
        return;
      }

      setLoading(true);
      console.log('Fetching stores for location:', { latitude, longitude });
      const nearbyStores = await getNearbyStores(latitude, longitude, 10); // 10 mile radius
      setStores(nearbyStores);
    } catch (error) {
      console.error('Error loading nearby stores:', error);
      // Don't show alert, just log error and show empty state
      setStores([]); // Clear stores on error
    } finally {
      setLoading(false);
    }
  };

  // Helper to format store hours and check if open
  const getStoreHoursInfo = (hoursJson: any): { displayText: string; isOpen: boolean } => {
    if (!hoursJson) {
      return { displayText: t('stores.hoursNotAvailable'), isOpen: false };
    }

    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = dayNames[now.getDay()];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const todayHours = hoursJson[today];
    if (!todayHours || todayHours.closed) {
      return { displayText: t('stores.closedToday'), isOpen: false };
    }

    // Parse open/close times (format: "HH:MM")
    const [openHour, openMin] = todayHours.open.split(':').map(Number);
    const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
    
    const currentTime = currentHour * 60 + currentMinute;
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;
    
    const isOpen = currentTime >= openTime && currentTime < closeTime;
    
    // Format display time (convert to 12-hour format)
    const formatTime = (hour: number, min: number) => {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      return `${displayHour}:${min.toString().padStart(2, '0')} ${period}`;
    };

    if (isOpen) {
      return { 
        displayText: `${t('stores.openUntil')} ${formatTime(closeHour, closeMin)}`, 
        isOpen: true 
      };
    } else if (currentTime < openTime) {
      return { 
        displayText: `${t('stores.opensAt')} ${formatTime(openHour, openMin)}`, 
        isOpen: false 
      };
    } else {
      return { 
        displayText: `${t('stores.closed')} • ${t('stores.opensAt')} ${formatTime(openHour, openMin)}`, 
        isOpen: false 
      };
    }
  };

  const handleCallStore = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/[^0-9]/g, '')}`);
  };

  const handleGetDirections = (store: WicStore) => {
    if (store.latitude && store.longitude) {
      // Use actual coordinates for directions
      Linking.openURL(
        `https://maps.google.com/?daddr=${store.latitude},${store.longitude}`
      );
    } else {
      // Fallback to address search
      const encodedAddress = encodeURIComponent(store.address);
      Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Location Status */}
      <View style={styles.locationStatus}>
        {loading ? (
          <View style={styles.locationLoading}>
            <ActivityIndicator size="small" color="#10B981" />
            <Typography variant="body" style={{ marginLeft: 12, color: '#6B7280' }}>
              {t('stores.gettingLocation')}
            </Typography>
          </View>
        ) : location ? (
          <View style={styles.locationSuccess}>
            <Locate size={20} color="#10B981" strokeWidth={2} />
            <Typography variant="body" style={{ marginLeft: 8, color: '#047857' }}>
              {t('stores.showingNearYou')}
            </Typography>
          </View>
        ) : (
          <View style={styles.locationError}>
            <MapPin size={20} color="#F59E0B" strokeWidth={2} />
            <Typography variant="caption" style={{ marginLeft: 8, color: '#92400E', flex: 1 }}>
              {t('stores.locationUnavailable')}
            </Typography>
            <TouchableOpacity onPress={requestLocationPermission} style={styles.retryButton}>
              <Typography variant="caption" weight="600" style={{ color: '#10B981' }}>
                {t('stores.retry')}
              </Typography>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Header Info */}
      <View style={styles.headerInfo}>
        <MapPin size={24} color="#1A1A1A" strokeWidth={2} />
        <View style={styles.headerText}>
          <Typography variant="body" weight="600">
            {stores.length} {t('stores.nearbyCount')}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {t('stores.sortedByDistance')}
          </Typography>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {stores.map((store, index) => {
          const hoursInfo = getStoreHoursInfo(store.hoursJson);
          return (
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
                      {store.distance ? `${store.distance.toFixed(1)} mi` : 'N/A'}
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
                {store.phone || t('stores.phoneNotAvailable')}
              </Typography>
            </View>

            {/* Hours */}
            <View style={styles.detailRow}>
              <Clock size={18} color="#666" strokeWidth={2} />
              <View style={styles.hoursContainer}>
                <View style={[styles.statusDot, { backgroundColor: hoursInfo.isOpen ? '#10B981' : '#EF4444' }]} />
                <Typography 
                  variant="body" 
                  weight="600"
                  style={[styles.detailText, { color: hoursInfo.isOpen ? '#10B981' : '#EF4444', marginLeft: 8 }]}
                >
                  {hoursInfo.displayText}
                </Typography>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.primaryButton]}
                onPress={() => handleGetDirections(store)}
                activeOpacity={0.7}
              >
                <Navigation size={18} color="white" strokeWidth={2.5} />
                <Typography variant="body" weight="600" style={{ color: 'white', marginLeft: 8 }}>
                  {t('stores.getDirections')}
                </Typography>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.secondaryButton]}
                onPress={() => handleCallStore(store.phone)}
                activeOpacity={0.7}
              >
                <Phone size={18} color="#1A1A1A" strokeWidth={2} />
                <Typography variant="body" weight="600" style={{ marginLeft: 8 }}>
                  {t('stores.call')}
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        );
        })}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Typography variant="body" weight="600" style={{ marginBottom: 8 }}>
            💡 {t('stores.shoppingTips')}
          </Typography>
          <Typography variant="body" style={{ color: '#666', lineHeight: 20 }}>
            {t('stores.tipsMessage')}
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
  locationStatus: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  locationLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    padding: 8,
    borderRadius: 8,
  },
  locationError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    padding: 8,
    borderRadius: 8,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#F0FDF4',
    borderRadius: 6,
  },
});
