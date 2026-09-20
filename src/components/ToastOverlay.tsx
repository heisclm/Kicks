import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle, Info, AlertCircle } from 'lucide-react-native';
import { colors, spacing, typography, radius, shadows } from '../theme';
import { useToastStore } from '../store/useToastStore';

export function ToastOverlay() {
    const { theme } = useStyles();
  const insets = useSafeAreaInsets();
  const { visible, title, subtitle, type } = useToastStore();
  const translateY = useRef(new Animated.Value(-150)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: insets.top + theme.spacing.md,
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
    iconColor = theme.colors.success;
  } else if (type === 'error') {
    Icon = AlertCircle;
    iconColor = theme.colors.error;
  } else {
    Icon = Info;
    iconColor = theme.colors.secondary;
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

const styles = StyleSheet.create((theme) => ({
  container: {
    position: 'absolute',
    top: 0,
    left: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 9999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xxl,
    borderWidth: 2,
    borderColor: 'transparent', // Can color code if desired
    ...theme.shadows.medium,
  },
  textContainer: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  title: {
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
