import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { Control, Controller } from 'react-hook-form';
import { InputField, InputFieldProps } from './InputField';
import { colors, spacing, radius, typography } from '../theme';

interface FormInputProps extends Omit<InputFieldProps, 'value' | 'onChangeText'> {
  name: string;
  control: any;
}

export function FormInput({ name, control, ...props }: FormInputProps) {
    const theme = { colors, spacing, radius, typography };
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={styles.container}>
          <InputField
            {...props}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
          />
          {error && (
            <Text style={styles.errorText}>{error.message}</Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xs,
  },
  errorText: {
    color: colors.primary, // Using red/primary for error
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.regular,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
});
