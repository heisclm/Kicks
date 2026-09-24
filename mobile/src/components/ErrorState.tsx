import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { Button } from './Button';
import { colors, spacing, radius, typography } from '../theme';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ 
  title = "Couldn't load data", 
  message = "Please check your connection and try again.", 
  onRetry 
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <AlertCircle color={colors.error} size={48} strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Button 
          label="Try Again" 
          onPress={onRetry} 
          variant="outline" 
          style={styles.retryButton} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.errorLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.xl,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.md,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    lineHeight: 24,
  },
  retryButton: {
    minWidth: 160,
  },
});
