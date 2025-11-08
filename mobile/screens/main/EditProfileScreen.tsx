import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { User, CreditCard, Bell, X } from 'lucide-react-native';
import Typography from '../../components/Typography';
import Button from '../../components/Button';
import SectionCard from '../../components/home/SectionCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  WIC_CARD_NUMBER: '@wic_card_number',
  FIRST_NAME: '@first_name',
  NOTIFICATIONS_ENABLED: '@notifications_enabled',
};

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  
  const [firstName, setFirstName] = useState('');
  const [wicCardNumber, setWicCardNumber] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [tempCardNumber, setTempCardNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Load stored data on mount
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [storedName, storedCard, storedNotifications] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.FIRST_NAME),
        AsyncStorage.getItem(STORAGE_KEYS.WIC_CARD_NUMBER),
        AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED),
      ]);

      if (storedName) setFirstName(storedName);
      if (storedCard) setWicCardNumber(storedCard);
      if (storedNotifications) setNotificationsEnabled(JSON.parse(storedNotifications));
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEYS.FIRST_NAME, firstName);
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, JSON.stringify(notificationsEnabled));

      // Update auth context if needed
      if (updateUser) {
        updateUser({ firstName });
      }

      Alert.alert(
        t('common.success') || 'Success',
        t('profile.profileUpdated') || 'Your profile has been updated',
        [{ text: t('common.ok') || 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert(
        t('common.error') || 'Error',
        t('profile.updateFailed') || 'Failed to update profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCard = async () => {
    if (!tempCardNumber.trim()) {
      Alert.alert(
        t('common.error') || 'Error',
        t('profile.enterCardNumber') || 'Please enter your WIC card number'
      );
      return;
    }

    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WIC_CARD_NUMBER, tempCardNumber);
      setWicCardNumber(tempCardNumber);
      setShowCardModal(false);
      setTempCardNumber('');
      
      Alert.alert(
        t('common.success') || 'Success',
        t('profile.cardUpdated') || 'WIC card number updated successfully'
      );
    } catch (error) {
      console.error('Error updating card:', error);
      Alert.alert(
        t('common.error') || 'Error',
        t('profile.cardUpdateFailed') || 'Failed to update card number'
      );
    }
  };

  const formatCardNumber = (card: string) => {
    // Format as XXXX-XXXX-XXXX (hide middle digits for privacy)
    if (card.length >= 12) {
      return `${card.slice(0, 4)}-****-${card.slice(-4)}`;
    }
    return card;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="largeTitle" weight="700">
            {t('profile.editProfile') || 'Edit Profile'}
          </Typography>
          <Typography variant="body" color="textSecondary" style={{ marginTop: 8 }}>
            {t('profile.updateInfo') || 'Update your personal information'}
          </Typography>
        </View>

        {/* First Name */}
        <SectionCard style={styles.section}>
          <View style={styles.fieldHeader}>
            <User size={20} color="#6B7280" />
            <Typography variant="subheading" weight="600" style={{ marginLeft: 12 }}>
              {t('profile.firstName') || 'First Name'}
            </Typography>
          </View>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder={t('profile.enterFirstName') || 'Enter your first name'}
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
          />
          <Typography variant="caption" color="textSecondary" style={{ marginTop: 8 }}>
            {t('profile.firstNameHelp') || 'This name will be displayed in the app'}
          </Typography>
        </SectionCard>

        {/* WIC Card Number */}
        <SectionCard style={styles.section}>
          <View style={styles.fieldHeader}>
            <CreditCard size={20} color="#6B7280" />
            <Typography variant="subheading" weight="600" style={{ marginLeft: 12 }}>
              {t('profile.wicCardNumber') || 'WIC Card Number'}
            </Typography>
          </View>
          
          {wicCardNumber ? (
            <View>
              <View style={styles.cardNumberDisplay}>
                <Typography variant="body" style={{ fontFamily: 'monospace' }}>
                  {formatCardNumber(wicCardNumber)}
                </Typography>
              </View>
              <Button
                variant="outline"
                size="small"
                onPress={() => {
                  setTempCardNumber(wicCardNumber);
                  setShowCardModal(true);
                }}
                style={{ marginTop: 12 }}
              >
                {t('profile.updateCard') || 'Update Card Number'}
              </Button>
            </View>
          ) : (
            <Button
              variant="secondary"
              onPress={() => setShowCardModal(true)}
              style={{ marginTop: 12 }}
            >
              {t('profile.addCard') || 'Add WIC Card Number'}
            </Button>
          )}
          
          <Typography variant="caption" color="textSecondary" style={{ marginTop: 8 }}>
            🔒 {t('profile.cardPrivacy') || 'Your card number is stored securely on your device only'}
          </Typography>
        </SectionCard>

        {/* Notifications */}
        <SectionCard style={styles.section}>
          <View style={styles.fieldHeader}>
            <Bell size={20} color="#6B7280" />
            <Typography variant="subheading" weight="600" style={{ marginLeft: 12, flex: 1 }}>
              {t('profile.notifications') || 'Notifications'}
            </Typography>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D1D5DB', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <Typography variant="caption" color="textSecondary" style={{ marginTop: 12 }}>
            {t('profile.notificationsHelp') || 'Get reminders about benefit expiration and WIC updates'}
          </Typography>
        </SectionCard>

        {/* Save Button */}
        <Button
          onPress={handleSaveProfile}
          loading={isLoading}
          style={styles.saveButton}
        >
          {t('common.save') || 'Save Changes'}
        </Button>
      </ScrollView>

      {/* Card Number Modal */}
      <Modal
        visible={showCardModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCardModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typography variant="heading" weight="700">
                {wicCardNumber ? t('profile.updateCard') : t('profile.addCard')}
              </Typography>
              <TouchableOpacity
                onPress={() => {
                  setShowCardModal(false);
                  setTempCardNumber('');
                }}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Typography variant="body" color="textSecondary" style={{ marginBottom: 20 }}>
              {t('profile.cardModalDesc') || 'Enter your WIC card number. This will be stored locally on your device.'}
            </Typography>

            <View style={styles.modalField}>
              <Typography variant="subheading" weight="600" style={{ marginBottom: 8 }}>
                {t('profile.cardNumber') || 'Card Number'}
              </Typography>
              <TextInput
                style={styles.modalInput}
                value={tempCardNumber}
                onChangeText={setTempCardNumber}
                placeholder="1234567890123456"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={16}
              />
            </View>

            <View style={styles.modalButtons}>
              <Button
                variant="outline"
                onPress={() => {
                  setShowCardModal(false);
                  setTempCardNumber('');
                }}
                style={{ flex: 1, marginRight: 8 }}
              >
                {t('common.cancel') || 'Cancel'}
              </Button>
              <Button
                onPress={handleUpdateCard}
                style={{ flex: 1, marginLeft: 8 }}
              >
                {t('common.save') || 'Save'}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    marginTop: 8,
  },
  section: {
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
  },
  cardNumberDisplay: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  saveButton: {
    marginTop: 24,
    marginBottom: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalField: {
    marginBottom: 24,
  },
  modalInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'monospace',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
});
