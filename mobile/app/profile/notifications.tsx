import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { useToastStore } from '../../src/store/useToastStore';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Bell, Tag, Package, Sparkles } from 'lucide-react-native';
import { colors, spacing, typography, radius } from '../../src/theme';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../../src/hooks/useNotifications';
import { ActivityIndicator } from 'react-native';
import { IconButton } from '../../src/components/IconButton';
import { SneakerLoader } from '../../src/components/SneakerLoader';

function NotificationIcon({ type, isRead }: { type: string; isRead: boolean }) {
    const { theme } = useStyles();
  const color = isRead ? theme.colors.textMuted : theme.colors.textInverse;
  switch(type) {
    case 'Order': return <Package color={color} size={20} strokeWidth={2} />;
    case 'Release': return <Sparkles color={color} size={20} strokeWidth={2} />;
    case 'Promo': return <Tag color={color} size={20} strokeWidth={2} />;
    default: return <Bell color={color} size={20} strokeWidth={2} />;
  }
}

function NotificationCard({ item }: { item: any }) {
    const { theme } = useStyles();
  const { mutate: markAsRead } = useMarkNotificationRead();
  
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  });

  const handlePress = () => {
    if (!item.isRead) {
      markAsRead(item.id);
    }
    useToastStore.getState().showToast('Notification', item.title, 'info');
  };

  return (
    <Pressable 
      style={[styles.card, !item.isRead && styles.cardUnread]} 
      onPress={handlePress}
    >
      <View style={[styles.iconContainer, !item.isRead && styles.iconContainerUnread]}>
        <NotificationIcon type={item.type} isRead={item.isRead} />
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, !item.isRead && styles.titleUnread]}>{item.title}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        <Text style={styles.message}>{item.message}</Text>
      </View>
    </Pressable>
  );
}

export default function NotificationsScreen() {
    const { theme } = useStyles();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const { data: notifications, isLoading, error } = useNotifications();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsRead();

  const hasUnread = notifications?.some(n => !n.isRead);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton 
          icon={<ChevronLeft color={theme.colors.textPrimary} size={24} strokeWidth={2.5} />} 
          onPress={() => router.back()} 
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Notifications</Text>
        {hasUnread ? (
          <Pressable onPress={() => markAllAsRead()} disabled={isMarkingAll}>
            {isMarkingAll ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Text style={styles.markAllText}>Mark all</Text>
            )}
          </Pressable>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>

      {isLoading ? (
        <View style={[styles.emptyContainer, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
          <SneakerLoader label="Loading notifications..." transparent />
        </View>
      ) : error ? (
        <View style={[styles.emptyContainer, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.title}>Error</Text>
          <Text style={styles.message}>Could not load notifications.</Text>
        </View>
      ) : (
        <FlatList
          data={notifications || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationCard item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={[styles.emptyContainer, { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }]}>
              <Bell color={theme.colors.textMuted} size={48} strokeWidth={1.5} />
              <Text style={[styles.title, { marginTop: theme.spacing.md, color: theme.colors.textPrimary }]}>No Notifications</Text>
              <Text style={[styles.message, { marginTop: theme.spacing.xs, textAlign: 'center' }]}>You're all caught up!</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  headerTitle: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.textPrimary,
  },
  listContent: {
    paddingBottom: theme.spacing.xxxl,
  },
  card: {
    flexDirection: 'row',
    padding: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.backgroundLight,
  },
  cardUnread: {
    backgroundColor: '#fff', // Slightly brighter to pop
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  iconContainerUnread: {
    backgroundColor: theme.colors.textPrimary, // Dark contrast for unread
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textMuted,
    flex: 1,
    marginRight: theme.spacing.md,
  },
  titleUnread: {
    fontFamily: theme.typography.families.extrabold,
    color: theme.colors.textPrimary,
  },
  date: {
    fontFamily: theme.typography.families.semibold,
    fontSize: 10,
    color: theme.colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  message: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    lineHeight: 20,
  },
  emptyContainer: {
    padding: theme.spacing.xl,
  },
  markAllText: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.primary,
  }
}));
