import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle, Info, AlertCircle } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../theme';
import { useToastStore } from '../store/useToastStore';

export function ToastOverlay() {
    const theme = { colors, spacing, radius, typography };
  const insets = useSafeAreaInsets();
  const { visible, title, subtitle, type } = useToastStore();
  const translateY = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: insets.top + spacing.md,
        useNativeDriver: true,
        speed: 12,
        bounciness: 8,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: -150,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, insets.top]);

  let Icon;
  let iconColor;
  if (type === 'success') {
    Icon = CheckCircle;
    iconColor = colors.success;
  } else if (type === 'error') {
    Icon = AlertCircle;
    iconColor = colors.error;
  } else {
    Icon = Info;
    iconColor = colors.secondary;
  }

  return (
    <Animated.View 
      style={[
        styles.container, 
        { transform: [{ translateY }] }
      ]}
      pointerEvents="none"
    >
      <View style={styles.toast}>
        <Icon color={iconColor} size={24} strokeWidth={2.5} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: spacing.md,
    right: spacing.md,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.xxl,
    borderWidth: 2,
    borderColor: 'transparent', // Can color code if desired
    ...theme.shadows.medium,
  },
  textContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  title: {
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
