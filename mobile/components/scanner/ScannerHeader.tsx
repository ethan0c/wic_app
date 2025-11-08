import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Volume2, VolumeX } from 'lucide-react-native';
import { useScannerSettings } from '../../context/ScannerSettingsContext';
import { useLanguage } from '../../context/LanguageContext';
import Typography from '../Typography';

export default function ScannerHeader() {
  const { settings, updateSettings } = useScannerSettings();
  const { language } = useLanguage();
  const [showTTSModal, setShowTTSModal] = useState(false);

  const toggleTTS = () => {
    updateSettings({ audioEnabled: !settings.audioEnabled });
  };

  const getLanguageName = () => {
    return language === 'ht' ? 'Haitian Creole' : 'English';
  };

  return (
    <>
      <View style={styles.headerWrapper}>
        <View style={styles.headerRow}>
          <View style={{ width: 24 }} />
          <Typography variant="heading" weight="500" style={{ fontSize: 20, textAlign: 'center', flex: 1 }}>
            Scan Product
          </Typography>
          <TouchableOpacity 
            activeOpacity={0.7} 
            accessibilityRole="button" 
            accessibilityLabel={settings.audioEnabled ? "Disable Text-to-Speech" : "Enable Text-to-Speech"}
            onPress={() => setShowTTSModal(true)}
          >
            {settings.audioEnabled ? (
              <Volume2 size={24} color="#10B981" strokeWidth={2} />
            ) : (
              <VolumeX size={24} color="#6B7280" strokeWidth={2} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Text-to-Speech Settings Modal */}
      <Modal
        visible={showTTSModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTTSModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setShowTTSModal(false)}
        >
          <TouchableOpacity 
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Typography variant="heading" weight="600" style={{ fontSize: 18 }}>
                  Text-to-Speech
                </Typography>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.optionRow}>
                  <View style={styles.optionLeft}>
                    {settings.audioEnabled ? (
                      <Volume2 size={24} color="#10B981" strokeWidth={2} />
                    ) : (
                      <VolumeX size={24} color="#6B7280" strokeWidth={2} />
                    )}
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Typography variant="body" weight="600">
                        Audio Feedback
                      </Typography>
                      <Typography variant="caption" color="textSecondary" style={{ marginTop: 2 }}>
                        {settings.audioEnabled 
                          ? `Scan results will be spoken in ${getLanguageName()}`
                          : 'Audio feedback is disabled'}
                      </Typography>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.toggle,
                      settings.audioEnabled && styles.toggleActive
                    ]}
                    onPress={toggleTTS}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.toggleThumb,
                      settings.audioEnabled && styles.toggleThumbActive
                    ]} />
                  </TouchableOpacity>
                </View>

                <View style={styles.infoBox}>
                  <Typography variant="caption" color="textSecondary" style={{ lineHeight: 18 }}>
                    When enabled, scan results will be announced in {getLanguageName()} with approval status and product details.
                  </Typography>
                </View>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTTSModal(false)}
                activeOpacity={0.7}
              >
                <Typography variant="body" weight="600" style={{ color: '#FFFFFF' }}>
                  Done
                </Typography>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    paddingHorizontal: 0,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: 340,
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#10B981',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    transform: [{ translateX: 22 }],
  },
  infoBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  closeButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 0,
    paddingVertical: 14,
    backgroundColor: '#10B981',
    borderRadius: 12,
    alignItems: 'center',
  },
});
