import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { AlertCircle } from 'lucide-react-native';
import { Button } from './Button';
import { colors, spacing, typography, radius } from '../theme';

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
    const { theme } = useStyles();
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <AlertCircle color={theme.colors.error} size={48} strokeWidth={1.5} />
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

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xxl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.errorLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
    lineHeight: 24,
  },
  retryButton: {
    minWidth: 160,
  },
}));
