import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, Animated, Easing, Pressable } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { CheckCircle, Package } from 'lucide-react-native';
import { colors, spacing, typography, radius, shadows } from '../theme';

interface OrderSuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

export function OrderSuccessModal({ visible, onClose }: OrderSuccessModalProps) {
    const { theme } = useStyles();
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
              <CheckCircle color={theme.colors.primary} size={48} strokeWidth={2.5} />
            </View>
          </View>
          
          <Text style={styles.title}>Order Confirmed!</Text>
          <Text style={styles.message}>
            Your fresh KICKS are on the way. We'll send you tracking details as soon as they ship.
          </Text>

          <View style={styles.detailBox}>
            <Package color={theme.colors.textPrimary} size={20} strokeWidth={2} />
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

const styles = StyleSheet.create((theme) => ({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xxxl,
    padding: theme.spacing.xxl,
    width: '100%',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  iconContainer: {
    marginBottom: theme.spacing.xl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: `${theme.colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.sm,
  },
  detailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.xxxl,
    width: '100%',
    justifyContent: 'center',
    gap: 10,
  },
  detailText: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textPrimary,
  },
  button: {
    backgroundColor: theme.colors.textPrimary,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.round,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textInverse,
    letterSpacing: 1,
  }
}));
