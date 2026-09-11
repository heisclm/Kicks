import React from 'react';
import { Pressable, Text, StyleSheet, PressableProps, StyleProp, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, radius, spacing, typography } from '../theme';

export interface ButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  haptic?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  style,
  labelStyle,
  haptic = true,
  disabled,
  onPress,
  ...props
}: ButtonProps) {
  
  const handlePress = (e: any) => {
    if (disabled || isLoading) return;
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPress) onPress(e);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { bg: colors.secondary, text: colors.textPrimary, border: 'transparent' };
      case 'outline':
        return { bg: 'transparent', text: colors.textPrimary, border: colors.border };
      case 'ghost':
        return { bg: 'transparent', text: colors.primary, border: 'transparent' };
      case 'primary':
      default:
        return { bg: colors.primary, text: colors.textInverse, border: 'transparent' };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { py: spacing.sm, px: spacing.md, fontSize: typography.sizes.sm };
      case 'lg':
        return { py: spacing.lg, px: spacing.xxl, fontSize: typography.sizes.lg };
      case 'md':
      default:
        return { py: spacing.md, px: spacing.xl, fontSize: typography.sizes.md };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: vStyles.bg,
          borderColor: vStyles.border,
          borderWidth: variant === 'outline' ? 1 : 0,
          paddingVertical: sStyles.py,
          paddingHorizontal: sStyles.px,
          opacity: pressed || disabled || isLoading ? 0.7 : 1,
        },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={vStyles.text} size="small" />
      ) : (
        <>
          {leftIcon && leftIcon}
          <Text
            style={[
              styles.label,
              { color: vStyles.text, fontSize: sStyles.fontSize },
              labelStyle,
            ]}
          >
            {label}
          </Text>
          {rightIcon && rightIcon}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.xxxl,
    gap: spacing.sm,
  },
  label: {
    fontFamily: typography.families.semibold,
  },
});
