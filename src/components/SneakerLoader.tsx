import React, { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { StyleSheet, useStyles } from 'react-native-unistyles';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  withDelay,
} from 'react-native-reanimated';
import { Image as ExpoImage } from 'expo-image';
import { colors, typography, spacing } from '../theme';

interface SneakerLoaderProps {
  label?: string;
  transparent?: boolean;
}

const { width } = Dimensions.get('window');

export function SneakerLoader({ label = "Lacing up...", transparent = false }: SneakerLoaderProps) {
    const { theme } = useStyles();
  const floatAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(0.8);
  const glowAnim = useSharedValue(0.5);

  useEffect(() => {
    // Float up and down
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(-15, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Shadow pulsing
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8, { duration: 1000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Glow pulsing
    glowAnim.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const sneakerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim.value }, { rotate: '-5deg' }],
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    opacity: pulseAnim.value,
    transform: [{ scaleX: pulseAnim.value * 1.5 }, { scaleY: pulseAnim.value * 0.8 }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowAnim.value,
    transform: [{ scale: glowAnim.value * 1.2 }],
  }));

  return (
    <View style={[styles.container, !transparent && styles.containerSolid]}>
      <View style={styles.animationContainer}>
        {/* Shimmer/Glow Behind */}
        <Animated.View style={[styles.glow, glowStyle]} />
        
        {/* Floating Sneaker */}
        <Animated.View style={[styles.sneakerWrapper, sneakerStyle]}>
          <ExpoImage 
            source={require('../../assets/shoe-air-zoom.png')} 
            style={styles.sneakerImage} 
            contentFit="contain" 
            priority="high"
          />
        </Animated.View>

        {/* Dynamic Shadow */}
        <Animated.View style={[styles.shadow, shadowStyle]} />
      </View>
      
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerSolid: {
    backgroundColor: theme.colors.backgroundLight,
  },
  animationContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primary,
    opacity: 0.15,
    filter: 'blur(20px)', // Web/New Arch
  },
  sneakerWrapper: {
    width: 180,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  sneakerImage: {
    width: '100%',
    height: '100%',
  },
  shadow: {
    width: 80,
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 6,
    position: 'absolute',
    bottom: 20,
    zIndex: 1,
  },
  label: {
    fontFamily: theme.typography.families.semibold,
    fontSize: 16,
    color: theme.colors.textSecondary,
    letterSpacing: 2,
    marginTop: 20,
    textTransform: 'uppercase',
  },
}));
