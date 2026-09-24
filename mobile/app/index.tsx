import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChevronUp } from "lucide-react-native";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing, radius, typography } from '../src/theme';

const { width, height } = Dimensions.get("window");

import Svg, {
  Defs,
  RadialGradient,
  Rect,
  Stop
} from "react-native-svg";

import { useOnboardingStore } from "../src/store/useOnboardingStore";

export default function OnboardingScreen() {
    const theme = { colors, spacing, radius, typography };
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const {
    hasSeenOnboarding,
    isHydrated,
    checkOnboardingStatus,
    completeOnboarding,
  } = useOnboardingStore();

  const bounceAnim = useRef(new Animated.Value(0)).current;
  const shoeHoverAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (isHydrated && hasSeenOnboarding) {
      router.replace("/(tabs)" as any);
    }
  }, [isHydrated, hasSeenOnboarding]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(shoeHoverAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(shoeHoverAnim, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [bounceAnim, shoeHoverAnim]);

  const shoeTranslateY = shoeHoverAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const shoeRotate = shoeHoverAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-25deg", "-15deg"],
  });

  if (!isHydrated || hasSeenOnboarding) {
    return (
      <View
        style={[styles.container, { backgroundColor: colors.backgroundDark }]}
      />
    );
  }

  const handleGetStarted = async () => {
    await completeOnboarding();
    router.replace("/(tabs)" as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#1c1b19", "#3e2a22", "#1a100c"]}
        style={styles.background}
      />

      {/* Premium Glow Aura Behind Shoe */}
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          <Defs>
            <RadialGradient id="glow" cx="50%" cy="40%" rx="60%" ry="50%">
              <Stop offset="0%" stopColor="#ff2a85" stopOpacity="0.25" />
              <Stop offset="40%" stopColor="#3b82f6" stopOpacity="0.08" />
              <Stop offset="100%" stopColor="#1a100c" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#glow)" />
        </Svg>
      </View>

      {/* Main Shoe Image */}
      <View style={styles.imageContainer}>
        <Animated.Image
          source={require("../assets/shoe-onboarding.png")}
          style={[
            styles.shoeImage,
            {
              transform: [
                { translateY: shoeTranslateY },
                { rotate: shoeRotate },
              ],
            },
          ]}
          resizeMode="contain"
        />
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Try On Styles{"\n"}Virtually With Ease</Text>
        <Text style={styles.subtitle}>
          Experience the convenience of a virtual{"\n"}shoe closet tailored just
          for you!
        </Text>
      </View>

      {/* Get Started Button */}
      <Pressable
        style={[
          styles.buttonContainer,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}
        onPress={handleGetStarted}
      >
        <Animated.View
          style={{
            transform: [{ translateY: bounceAnim }],
            alignItems: "center",
          }}
        >
          <ChevronUp color="white" size={24} style={{ marginBottom: -8 }} />
          <ChevronUp color="white" size={24} />
        </Animated.View>
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
  },
  background: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  backgroundTextContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  imageContainer: {
    flex: 0.55,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    marginTop: -20,
  },
  shoeImage: {
    width: width * 1.2,
    height: width * 1.2,
  },
  contentContainer: {
    flex: 0.3,
    alignItems: "center",
    paddingHorizontal: spacing.xxxl,
  },
  title: {
    fontSize: typography.sizes.huge,
    fontFamily: typography.families.extrabold,
    color: colors.textInverse,
    textAlign: "center",
    lineHeight: 40,
    marginBottom: spacing.lg,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 22,
  },
  buttonContainer: {
    flex: 0.15,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: typography.sizes.md,
    fontFamily: typography.families.semibold,
    marginTop: spacing.sm,
  },
});
