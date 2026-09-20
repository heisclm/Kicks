import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
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
  return <CreditCard color={theme.colors.textPrimary} size={20} strokeWidth={2} />;
}

export default function PaymentMethodsScreen() {
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
        <Text style={styles.headerTitle}>Payments</Text>
        <IconButton 
          icon={<Plus color={theme.colors.textPrimary} size={24} strokeWidth={2.5} />} 
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
              {method.isDefault && <CheckCircle color={theme.colors.primary} size={20} strokeWidth={2.5} />}
            </View>
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
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  }
}));
