import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, typography } from '../theme';

interface SizeSelectorProps {
  size: number;
  isSelected: boolean;
  onPress: () => void;
}

export function SizeSelector({ size, isSelected, onPress }: SizeSelectorProps) {
  return (
    <Pressable 
      style={[styles.container, isSelected && styles.containerSelected]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={`Size ${size}`}
    >
      <Text style={[styles.text, isSelected && styles.textSelected]}>
        {size}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 45,
    height: 45,
    borderRadius: radius.round,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerSelected: {
    backgroundColor: '#7D4734', // Custom specific brown from the details screen design
    borderColor: '#7D4734',
  },
  text: {
    fontSize: typography.sizes.md,
    fontFamily: typography.families.semibold,
    color: colors.textPrimary,
  },
  textSelected: {
    color: colors.surface,
  }
});
