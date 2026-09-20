import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { AlertTriangle } from 'lucide-react-native';
import { Button } from './Button';
import { colors, spacing, typography } from '../theme';

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
              <AlertTriangle color={theme.colors.error} size={48} strokeWidth={1.5} />
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

const styles = StyleSheet.create((theme) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
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
  button: {
    minWidth: 200,
  },
  devErrorBox: {
    backgroundColor: '#FFEBEB',
    padding: theme.spacing.md,
    borderRadius: 8,
    marginBottom: theme.spacing.xxl,
    width: '100%',
  },
  devErrorText: {
    fontFamily: theme.typography.families.regular,
    fontSize: 12,
    color: theme.colors.error,
  },
}));
