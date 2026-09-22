import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { StyleSheet } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { Button } from './Button';
import { colors, spacing, radius, typography } from '../theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught rendering error:', error, errorInfo);
    // Future: Send to Sentry or Crashlytics here
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.iconContainer}>
              <AlertTriangle color={colors.error} size={48} strokeWidth={1.5} />
            </View>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>
              We encountered an unexpected error. Our team has been notified.
            </Text>
            
            {/* In development, show the error message */}
            {__DEV__ && this.state.error && (
              <View style={styles.devErrorBox}>
                <Text style={styles.devErrorText}>{this.state.error.message}</Text>
              </View>
            )}

            <Button 
              label="Restart App" 
              onPress={this.handleReset} 
              style={styles.button}
            />
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
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
  button: {
    minWidth: 200,
  },
  devErrorBox: {
    backgroundColor: '#FFEBEB',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.xxl,
    width: '100%',
  },
  devErrorText: {
    fontFamily: typography.families.regular,
    fontSize: 12,
    color: colors.error,
  },
});
