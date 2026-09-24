import React from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { WifiOff } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { colors, spacing, radius, typography } from '../theme';

export function OfflineBanner() {
  const netInfo = useNetInfo();
  const insets = useSafeAreaInsets();

  if (netInfo.isConnected !== false) {
    return null;
  }

  return (
    <Animated.View 
      entering={FadeInUp} 
      exiting={FadeOutUp} 
      style={[styles.container, { paddingTop: insets.top + spacing.xs }]}
    >
      <View style={styles.content}>
        <WifiOff color={colors.textInverse} size={16} style={styles.icon} />
        <Text style={styles.text}>No internet connection</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.error,
    zIndex: 999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.sm,
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    color: colors.textInverse,
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.sm,
  },
});
