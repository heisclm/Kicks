import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function IconButton({ icon, onPress, style, accessibilityLabel }: IconButtonProps) {
    const theme = { colors, spacing, radius, typography };
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

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.round,
    ...theme.shadows.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
