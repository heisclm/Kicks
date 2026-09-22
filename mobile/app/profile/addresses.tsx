import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, MapPin, Plus, CheckCircle } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../src/theme';
import { IconButton } from '../../src/components/IconButton';
import { useToastStore } from '../../src/store/useToastStore';

const addresses = [
  { id: '1', name: 'Home', address: '123 Kicks Ave, Sneakerville, NY 10001', isDefault: true },
  { id: '2', name: 'Work', address: '456 Air St, Sole City, CA 90001', isDefault: false },
];

export default function ShippingAddressesScreen() {
    const theme = { colors, spacing, radius, typography };
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToastStore();

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
          style={styles.backButton}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {addresses.map((addr) => (
          <Pressable 
            key={addr.id} 
            style={[styles.card, addr.isDefault && styles.cardActive]} 
            onPress={() => showToast('Address Selected', addr.name, 'success')}
          >
            <View style={styles.cardHeader}>
              <View style={styles.titleRow}>
                <MapPin color={addr.isDefault ? colors.primary : colors.textMuted} size={20} strokeWidth={2.5} />
                <Text style={styles.name}>{addr.name}</Text>
              </View>
              {addr.isDefault && <CheckCircle color={colors.primary} size={20} strokeWidth={2.5} />}
            </View>
            <Text style={styles.address}>{addr.address}</Text>
            <Text style={styles.editLink}>Edit Address</Text>
          </Pressable>
        ))}
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
    ...theme.shadows.soft,
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
  }
});
