const fs = require('fs');

let content = `import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, CreditCard } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows } from '../../src/theme';
import { IconButton } from '../../src/components/IconButton';
import { Button } from '../../src/components/Button';
import { useCheckoutStore } from '../../src/store/useCheckoutStore';
import { useToastStore } from '../../src/store/useToastStore';
import { FormInput } from '../../src/components/FormInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const paymentSchema = z.object({
  cardNumber: z.string().min(15, "Invalid card number").max(19),
  expiryDate: z.string().min(5, "MM/YY required").max(5),
  cvv: z.string().min(3, "CVV required").max(4),
  cardholderName: z.string().min(2, "Name required"),
});

export default function AddPaymentScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setPayment } = useCheckoutStore();
  const { showToast } = useToastStore();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
    },
  });

  const handleSave = async (data: any) => {
    setIsSaving(true);
    // Simulate network delay for tokenization
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setPayment({
      id: Math.random().toString(36).substr(2, 9),
      type: 'card',
      cardNumber: data.cardNumber,
      expiryDate: data.expiryDate,
      cardholderName: data.cardholderName,
    });
    
    setIsSaving(false);
    showToast('Success', 'Payment method securely added', 'success');
    router.back();
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { paddingTop: insets.top }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <IconButton 
          icon={<ChevronLeft color={colors.textPrimary} size={24} strokeWidth={2.5} />} 
          onPress={() => router.back()} 
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Add Card</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.cardPreview}>
          <CreditCard color={colors.textMuted} size={48} strokeWidth={1.5} style={{ marginBottom: spacing.md }} />
          <Text style={styles.previewText}>Your card details are securely encrypted.</Text>
        </View>

        <FormInput 
          control={form.control} 
          name="cardholderName" 
          label="Cardholder Name" 
          placeholder="John Doe" 
        />
        
        <FormInput 
          control={form.control} 
          name="cardNumber" 
          label="Card Number" 
          placeholder="0000 0000 0000 0000" 
          keyboardType="numeric"
        />
        
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: spacing.sm }}>
            <FormInput 
              control={form.control} 
              name="expiryDate" 
              label="Expiry Date" 
              placeholder="MM/YY" 
            />
          </View>
          <View style={{ flex: 1 }}>
            <FormInput 
              control={form.control} 
              name="cvv" 
              label="CVV" 
              placeholder="123" 
              keyboardType="numeric"
              secureTextEntry
            />
          </View>
        </View>

        <Button 
          label="SAVE PAYMENT METHOD" 
          onPress={form.handleSubmit(handleSave)}
          isLoading={isSaving}
          style={{ marginTop: spacing.xl }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  cardPreview: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewText: {
    fontFamily: typography.families.medium,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
`;

fs.writeFileSync('mobile/app/profile/add-payment.tsx', content, 'utf8');
