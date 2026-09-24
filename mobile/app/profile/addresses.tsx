import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, MapPin, Plus, CheckCircle, Package } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows } from '../../src/theme';
import { IconButton } from '../../src/components/IconButton';
import { useToastStore } from '../../src/store/useToastStore';
import { useCheckoutStore } from '../../src/store/useCheckoutStore';

export default function ShippingAddressesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToastStore();
  const savedAddress = useCheckoutStore(state => state.savedAddress);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <IconButton 
          icon={<ChevronLeft color={colors.textPrimary} size={24} strokeWidth={2.5} />} 
          onPress={() => router.back()} 
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Addresses</Text>
        <IconButton 
          icon={<Plus color={colors.textPrimary} size={24} strokeWidth={2.5} />} 
          onPress={() => router.push('/profile/add-address')} // For now, the only way to add/edit is via Checkout flow
          style={styles.backButton}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {savedAddress ? (
          <Pressable 
            style={[styles.card, styles.cardActive]} 
            onPress={() => showToast('Address Selected', 'Default Address', 'success')}
          >
            <View style={styles.cardHeader}>
              <View style={styles.titleRow}>
                <MapPin color={colors.primary} size={20} strokeWidth={2.5} />
                <Text style={styles.name}>Default Shipping</Text>
              </View>
              <CheckCircle color={colors.primary} size={20} strokeWidth={2.5} />
            </View>
            <Text style={styles.address}>
              {savedAddress.fullName}
{savedAddress.street}
{savedAddress.city}, {savedAddress.zipCode}
            </Text>
            <Text style={styles.editLink} onPress={() => router.push('/profile/add-address')}>Edit Address</Text>
          </Pressable>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrapper}>
              <Package color={colors.textInverse} size={40} strokeWidth={2} />
            </View>
            <Text style={styles.emptyTitle}>No Addresses Saved</Text>
            <Text style={styles.emptySubtitle}>You haven't saved any shipping addresses yet. Add one during your next checkout!</Text>
            <Pressable style={styles.addButton} onPress={() => router.push('/profile/add-address')}>
              <Text style={styles.addButtonText}>ADD ADDRESS</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
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
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.soft,
  },
  cardActive: {
    borderColor: colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  address: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  editLink: {
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.xs,
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl * 2,
    paddingHorizontal: spacing.xl,
  },
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    ...shadows.medium,
  },
  emptyTitle: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.xl,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xxl,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    borderRadius: radius.round,
  },
  addButtonText: {
    fontFamily: typography.families.bold,
    fontSize: typography.sizes.sm,
    color: colors.textInverse,
    letterSpacing: 1,
  }
});
