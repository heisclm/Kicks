import React from 'react';
import { Pressable, Text } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { colors, radius, typography } from '../theme';

interface SizeSelectorProps {
  size: number;
  isSelected: boolean;
  onPress: () => void;
}

export function SizeSelector({ size, isSelected, onPress }: SizeSelectorProps) {
    const { theme } = useStyles();
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

const styles = StyleSheet.create((theme) => ({
  container: {
    width: 45,
    height: 45,
    borderRadius: theme.radius.round,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  containerSelected: {
    backgroundColor: '#7D4734', // Custom specific brown from the details screen design
    borderColor: '#7D4734',
  },
  text: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.families.semibold,
    color: theme.colors.textPrimary,
  },
  textSelected: {
    color: theme.colors.surface,
  }
}));
