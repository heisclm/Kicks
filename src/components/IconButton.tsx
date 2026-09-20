import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { colors, radius, shadows } from '../theme';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function IconButton({ icon, onPress, style, accessibilityLabel }: IconButtonProps) {
    const { theme } = useStyles();
  return (
    <Pressable 
      style={[styles.container, style]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || 'Icon Button'}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.round,
    ...theme.shadows.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
