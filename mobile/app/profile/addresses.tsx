import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, MapPin, Plus, CheckCircle } from 'lucide-react-native';
import { colors, spacing, typography, radius, shadows } from '../../src/theme';
import { IconButton } from '../../src/components/IconButton';
import { useToastStore } from '../../src/store/useToastStore';

const addresses = [
  { id: '1', name: 'Home', address: '123 Kicks Ave, Sneakerville, NY 10001', isDefault: true },
  { id: '2', name: 'Work', address: '456 Air St, Sole City, CA 90001', isDefault: false },
];

export default function ShippingAddressesScreen() {
    const { theme } = useStyles();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToastStore();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <IconButton 
          icon={<ChevronLeft color={theme.colors.textPrimary} size={24} strokeWidth={2.5} />} 
          onPress={() => router.back()} 
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Addresses</Text>
        <IconButton 
          icon={<Plus color={theme.colors.textPrimary} size={24} strokeWidth={2.5} />} 
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
                <MapPin color={addr.isDefault ? theme.colors.primary : theme.colors.textMuted} size={20} strokeWidth={2.5} />
                <Text style={styles.name}>{addr.name}</Text>
              </View>
              {addr.isDefault && <CheckCircle color={theme.colors.primary} size={20} strokeWidth={2.5} />}
            </View>
            <Text style={styles.address}>{addr.address}</Text>
            <Text style={styles.editLink}>Edit Address</Text>
          </Pressable>
        ))}
      </ScrollView>
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
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxxl,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xxl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...theme.shadows.soft,
  },
  cardActive: {
    borderColor: theme.colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  name: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
  },
  address: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  editLink: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  }
}));
