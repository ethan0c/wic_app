import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import Typography from '../../components/Typography';

const mockNotifications = [
  {
    id: 1,
    title: 'New WIC Benefits Available',
    message: 'Your monthly WIC benefits have been renewed. Check your balance and start shopping for approved foods.',
    date: '2 hours ago',
    type: 'benefits',
    isRead: false,
  },
  {
    id: 2,
    title: 'Store Hours Update',
    message: 'Some WIC-approved stores will have extended holiday hours. Find participating locations in the store finder.',
    date: '1 day ago',
    type: 'info',
    isRead: true,
  },
  {
    id: 3,
    title: 'New Approved Foods',
    message: 'Additional whole grain products have been added to your approved food list. Scan items to see if they qualify.',
    date: '3 days ago',
    type: 'benefits',
    isRead: true,
  },
  {
    id: 4,
    title: 'Appointment Reminder',
    message: 'Your next WIC appointment is scheduled for December 15th. Please bring required documents.',
    date: '1 week ago',
    type: 'appointment',
    isRead: false,
  },
];

export default function NotificationsScreen() {
  const { theme } = useTheme();

  const getIconName = (type: string) => {
    switch (type) {
      case 'benefits':
        return 'nutrition-outline';
      case 'appointment':
        return 'calendar-outline';
      case 'info':
        return 'information-circle-outline';
      default:
        return 'notifications-outline';
    }
  };

  const getIconColor = (type: string, isRead: boolean) => {
    if (isRead) return '#6B7280';
    
    switch (type) {
      case 'benefits':
        return '#10B981';
      case 'appointment':
        return '#3B82F6';
      case 'info':
        return '#F59E0B';
      default:
        return theme.primary;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#F5F5F5' }]} contentContainerStyle={styles.contentContainer}>
      <View style={styles.content}>
        {mockNotifications.map((notification) => (
          <View
            key={notification.id}
            style={[
              styles.notificationCard,
              !notification.isRead && styles.unreadCard,
            ]}
          >
            <View style={styles.notificationHeader}>
              <View style={styles.iconTitleRow}>
                <Ionicons
                  name={getIconName(notification.type) as keyof typeof Ionicons.glyphMap}
                  size={20}
                  color={getIconColor(notification.type, notification.isRead)}
                />
                <Typography
                  variant="title"
                  weight="600"
                  style={[
                    styles.notificationTitle,
                    { fontSize: 16 },
                    !notification.isRead && { color: '#1A1A1A' },
                  ]}
                >
                  {notification.title}
                </Typography>
              </View>
              {!notification.isRead && <View style={styles.unreadDot} />}
            </View>
            
            <Typography
              variant="body"
              style={[
                styles.notificationMessage,
                { color: notification.isRead ? '#6B7280' : '#374151' },
              ]}
            >
              {notification.message}
            </Typography>
            
            <Typography variant="caption" style={styles.notificationDate}>
              {notification.date}
            </Typography>
          </View>
        ))}
        
        {mockNotifications.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={48} color="#9CA3AF" />
            <Typography variant="title" style={{ marginTop: 16, color: '#6B7280' }}>
              No notifications yet
            </Typography>
            <Typography variant="body" style={{ marginTop: 8, color: '#9CA3AF', textAlign: 'center' }}>
              You'll see government announcements and WIC updates here
            </Typography>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 5,
  },
  content: {
    padding: 0,
  },
  notificationCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#1A1A1A',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationTitle: {
    marginLeft: 12,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1A1A1A',
    marginLeft: 8,
  },
  notificationMessage: {
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationDate: {
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
});