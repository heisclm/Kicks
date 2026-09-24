import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Plus, CheckCircle, CreditCard } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows } from '../../src/theme';
import { IconButton } from '../../src/components/IconButton';
import { useToastStore } from '../../src/store/useToastStore';
import { useCheckoutStore } from '../../src/store/useCheckoutStore';

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
  const savedPayment = useCheckoutStore(state => state.savedPayment);

  const getCardType = (cardNumber: string) => {
    if (cardNumber.startsWith('4')) return 'visa';
    if (cardNumber.startsWith('5')) return 'mastercard';
    return 'card';
  };

  const getCardName = (cardNumber: string) => {
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5')) return 'Mastercard';
    return 'Credit Card';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <IconButton 
          icon={<ChevronLeft color={colors.textPrimary} size={24} strokeWidth={2.5} />} 
          onPress={() => router.back()} style={styles.backButton} />
        <Text style={styles.headerTitle}>Payments</Text>
        <IconButton 
          icon={<Plus color={colors.textPrimary} size={24} strokeWidth={2.5} />} 
          style={styles.backButton}
          onPress={() => router.push('/profile/add-payment')}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {savedPayment ? (
          <Pressable 
            style={[styles.card, styles.cardActive]}
            onPress={() => showToast('Payment Method Selected', 'Default Payment', 'success')}
          >
            <View style={styles.cardHeader}>
              <View style={styles.titleRow}>
                <View style={styles.iconWrapper}>
                  {renderLogo(getCardType(savedPayment.cardNumber))}
                </View>
                <View>
                  <Text style={styles.name}>{getCardName(savedPayment.cardNumber)}</Text>
                  <Text style={styles.subtitle}>**** **** **** {savedPayment.cardNumber.slice(-4)}</Text>
                </View>
              </View>
              <CheckCircle color={colors.primary} size={20} strokeWidth={2.5} />
            </View>
          </Pressable>
        ) : (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ fontFamily: typography.families.medium, color: colors.textMuted }}>No saved payment methods</Text>
            <Text style={{ fontFamily: typography.families.regular, color: colors.textMuted, fontSize: 12, marginTop: 8 }}>Add one during your next checkout</Text>
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
