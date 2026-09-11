import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Plus, CheckCircle, CreditCard } from 'lucide-react-native';
import { colors, spacing, typography, radius, shadows } from '../../src/theme';
import { IconButton } from '../../src/components/IconButton';
import { useToastStore } from '../../src/store/useToastStore';

import { ApplePayLogo, MastercardLogo, VisaLogo, GooglePayLogo } from '../../src/components/PaymentLogos';

const methods = [
  { id: '1', type: 'Apple Pay', last4: null, isDefault: true, id_key: 'apple' },
  { id: '2', type: 'Mastercard', last4: '8821', isDefault: false, id_key: 'mastercard' },
  { id: '3', type: 'Visa', last4: '4242', isDefault: false, id_key: 'visa' },
  { id: '4', type: 'Google Pay', last4: null, isDefault: false, id_key: 'google' },
];

function renderLogo(id: string) {
  if (id === 'apple') return <ApplePayLogo size={36} />;
  if (id === 'google') return <GooglePayLogo size={36} />;
  if (id === 'mastercard') return <MastercardLogo size={36} />;
  if (id === 'visa') return <VisaLogo size={36} />;
  return <CreditCard color={colors.textPrimary} size={20} strokeWidth={2} />;
}

export default function PaymentMethodsScreen() {
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
        <Text style={styles.headerTitle}>Payments</Text>
        <IconButton 
          icon={<Plus color={colors.textPrimary} size={24} strokeWidth={2.5} />} 
          style={styles.backButton}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {methods.map((method) => (
          <Pressable 
            key={method.id} 
            style={[styles.card, method.isDefault && styles.cardActive]}
            onPress={() => showToast('Payment Method Selected', method.type, 'success')}
          >
            <View style={styles.cardHeader}>
              <View style={styles.titleRow}>
                <View style={styles.iconWrapper}>
                  {renderLogo(method.id_key)}
                </View>
                <View>
                  <Text style={styles.name}>{method.type}</Text>
                  {method.last4 && <Text style={styles.subtitle}>**** **** **** {method.last4}</Text>}
                </View>
              </View>
              {method.isDefault && <CheckCircle color={colors.primary} size={20} strokeWidth={2.5} />}
            </View>
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
    ...shadows.soft,
  },
  cardActive: {
    borderColor: colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  }
});
