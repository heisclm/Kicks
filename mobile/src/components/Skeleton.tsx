import React, { useEffect } from 'react';
import { View, ViewStyle, DimensionValue } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withSequence, 
  withTiming, 
  withDelay
} from 'react-native-reanimated';
import { colors, radius } from '../theme';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
  delay?: number;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = theme.radius.md, style, delay = 0 }: SkeletonProps) {
    const { theme } = useStyles();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.7, { duration: 800 }),
          withTiming(0.3, { duration: 800 })
        ),
        -1,
        true
      )
    );
  }, [delay, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={[
        styles.skeleton, 
        { width, height, borderRadius }, 
        style, 
        animatedStyle
      ]} 
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  skeleton: {
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
  },
}));
