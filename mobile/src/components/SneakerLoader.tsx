import React, { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Image as ExpoImage } from 'expo-image';
import { colors, spacing, radius, typography } from '../theme';

interface SneakerLoaderProps {
  label?: string;
  transparent?: boolean;
}

const { width } = Dimensions.get('window');

export function SneakerLoader({ label = "Loading...", transparent = false }: SneakerLoaderProps) {
  const floatAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(1);
  const pulseAnim = useSharedValue(0.8);
  const glowAnim = useSharedValue(0.3);
  const rotateAnim = useSharedValue(0);

  useEffect(() => {
    // Very subtle float
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Soft breathing scale
    scaleAnim.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Subtle premium rotation (sway)
    rotateAnim.value = withRepeat(
      withSequence(
        withTiming(3, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(-3, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Shadow pulsing matches float
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.8, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Soft glow pulsing
    glowAnim.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.2, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const sneakerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatAnim.value },
      { scale: scaleAnim.value },
      { rotate: `${rotateAnim.value}deg` }
    ],
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    opacity: pulseAnim.value,
    transform: [{ scaleX: pulseAnim.value * 1.2 }, { scaleY: pulseAnim.value * 0.8 }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowAnim.value,
    transform: [{ scale: glowAnim.value * 1.5 }],
  }));

  return (
    <View style={[styles.container, !transparent && styles.containerSolid]}>
      <View style={styles.animationContainer}>
        {/* Shimmer/Glow Behind */}
        <Animated.View style={[styles.glow, glowStyle]} />
        
        {/* Premium Small Sneaker Logo */}
        <Animated.View style={[styles.sneakerWrapper, sneakerStyle]}>
          <ExpoImage 
            source={require('../../assets/images/icon.png')} 
            style={styles.sneakerImage} 
            contentFit="contain" 
            priority="high"
          />
        </Animated.View>

        {/* Dynamic Shadow */}
        <Animated.View style={[styles.shadow, shadowStyle]} />
      </View>
      
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerSolid: {
    backgroundColor: colors.backgroundLight,
  },
  animationContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    opacity: 0.1,
    filter: 'blur(25px)', // Web/New Arch
  },
  sneakerWrapper: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  sneakerImage: {
    width: '100%',
    height: '100%',
  },
  shadow: {
    width: 50,
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    position: 'absolute',
    bottom: 25,
    zIndex: 1,
  },
  label: {
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    letterSpacing: 2,
    marginTop: 20,
    textTransform: 'uppercase',
  },
});
