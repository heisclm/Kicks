import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, Animated, Easing, Pressable } from 'react-native';
import { StyleSheet } from 'react-native';
import { CheckCircle, Package } from 'lucide-react-native';
import { colors, spacing, radius, typography, shadows } from '../theme';

interface OrderSuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

export function OrderSuccessModal({ visible, onClose }: OrderSuccessModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.modalContent, 
            { 
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }] 
            }
          ]}
        >
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <CheckCircle color={colors.primary} size={48} strokeWidth={2.5} />
            </View>
          </View>
          
          <Text style={styles.title}>Order Confirmed!</Text>
          <Text style={styles.message}>
            Your fresh KICKS are on the way. We'll send you tracking details as soon as they ship.
          </Text>

          <View style={styles.detailBox}>
            <Package color={colors.textPrimary} size={20} strokeWidth={2} />
            <Text style={styles.detailText}>Estimated delivery: 2-3 business days</Text>
          </View>

          <Pressable style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>CONTINUE SHOPPING</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxxl,
    padding: spacing.xxl,
    width: '100%',
    alignItems: 'center',
    ...shadows.medium,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.xl,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  detailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.xxxl,
    width: '100%',
    justifyContent: 'center',
    gap: 10,
  },
  detailText: {
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.textPrimary,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.round,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.md,
    color: colors.textInverse,
    letterSpacing: 1,
  }
});
