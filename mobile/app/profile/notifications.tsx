import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { StyleSheet } from 'react-native';
import { useToastStore } from '../../src/store/useToastStore';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Bell, Tag, Package, Sparkles } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../../src/theme';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../../src/hooks/useNotifications';
import { ActivityIndicator } from 'react-native';
import { IconButton } from '../../src/components/IconButton';
import { SneakerLoader } from '../../src/components/SneakerLoader';

function NotificationIcon({ type, isRead }: { type: string; isRead: boolean }) {
  const color = isRead ? colors.textMuted : colors.textInverse;
  switch(type) {
    case 'Order': return <Package color={color} size={20} strokeWidth={2} />;
    case 'Release': return <Sparkles color={color} size={20} strokeWidth={2} />;
    case 'Promo': return <Tag color={color} size={20} strokeWidth={2} />;
    default: return <Bell color={color} size={20} strokeWidth={2} />;
  }
}

function NotificationCard({ item }: { item: any }) {
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
          icon={<ChevronLeft color={colors.textPrimary} size={24} strokeWidth={2.5} />} 
          onPress={() => router.back()} 
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Notifications</Text>
        {hasUnread ? (
          <Pressable onPress={() => markAllAsRead()} disabled={isMarkingAll}>
            {isMarkingAll ? (
              <ActivityIndicator size="small" color={colors.primary} />
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
              <Bell color={colors.textMuted} size={48} strokeWidth={1.5} />
              <Text style={[styles.title, { marginTop: spacing.md, color: colors.textPrimary }]}>No Notifications</Text>
              <Text style={[styles.message, { marginTop: spacing.xs, textAlign: 'center' }]}>You're all caught up!</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  headerTitle: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.lg,
    color: colors.textPrimary,
  },
  listContent: {
    paddingBottom: spacing.xxxl,
  },
  card: {
    flexDirection: 'row',
    padding: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.backgroundLight,
  },
  cardUnread: {
    backgroundColor: '#fff', // Slightly brighter to pop
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  iconContainerUnread: {
    backgroundColor: colors.textPrimary, // Dark contrast for unread
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
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    flex: 1,
    marginRight: spacing.md,
  },
  titleUnread: {
    fontFamily: typography.families.extrabold,
    color: colors.textPrimary,
  },
  date: {
    fontFamily: typography.families.semibold,
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  message: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },
  emptyContainer: {
    padding: spacing.xl,
  },
  markAllText: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.sm,
    color: colors.primary,
  }
});
