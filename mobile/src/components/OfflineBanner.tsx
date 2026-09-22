import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import { useNetInfo } from '@react-native-community/netinfo';
import { WifiOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { colors, typography, spacing } from '../theme';

export function OfflineBanner() {
    const { theme } = useStyles();
  const netInfo = useNetInfo();
  const insets = useSafeAreaInsets();

  if (netInfo.isConnected !== false) {
    return null;
  }

  return (
    <Animated.View 
      entering={FadeInUp} 
      exiting={FadeOutUp} 
      style={[styles.container, { paddingTop: insets.top + theme.spacing.xs }]}
    >
      <View style={styles.content}>
        <WifiOff color={theme.colors.textInverse} size={16} style={styles.icon} />
        <Text style={styles.text}>No internet connection</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.error,
    zIndex: 999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: theme.spacing.sm,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  text: {
    color: theme.colors.textInverse,
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.sm,
  },
}));
