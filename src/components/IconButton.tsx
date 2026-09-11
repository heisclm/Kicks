import React from 'react';
import { Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, radius, shadows } from '../theme';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function IconButton({ icon, onPress, style, accessibilityLabel }: IconButtonProps) {
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
    ...shadows.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
