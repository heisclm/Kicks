import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { colors, typography, radius, spacing } from '../theme';

export interface InputFieldProps extends TextInputProps {
  label: string;
}

export function InputField({ label, ...props }: InputFieldProps) {
    const { theme } = useStyles();
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput 
        style={styles.input}
        placeholderTextColor={theme.colors.textMuted}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.families.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.backgroundLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.families.regular,
    color: theme.colors.textPrimary,
  },
}));
