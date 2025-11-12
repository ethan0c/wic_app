import React from 'react';
import { 
  Modal, 
  View, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  Text 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ImageViewerModalProps {
  visible: boolean;
  imageUri?: string;
  productName?: string;
  onClose: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ImageViewerModal({ 
  visible, 
  imageUri, 
  productName, 
  onClose 
}: ImageViewerModalProps) {
  if (!imageUri) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Close Button */}
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <MaterialCommunityIcons name="close" size={24} color="white" />
        </TouchableOpacity>

        {/* Product Name */}
        {productName && (
          <View style={styles.nameContainer}>
            <Text style={styles.productName}>
              {productName}
            </Text>
          </View>
        )}

        {/* Large Product Image */}
        <TouchableOpacity 
          style={styles.imageContainer}
          activeOpacity={1}
          onPress={onClose}
        >
          <Image 
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Tap to close hint */}
        <View style={styles.hintContainer}>
          <Text style={styles.hint}>
            Tap anywhere to close
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  nameContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 80,
    zIndex: 1,
  },
  productName: {
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  imageContainer: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  hintContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  hint: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});