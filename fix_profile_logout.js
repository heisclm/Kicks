const fs = require('fs');
let file = 'mobile/app/(tabs)/profile.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add Alert import if missing
if (!content.includes('Alert,')) {
    content = content.replace(/import\s*\{\s*Pressable,/, "import {\n  Alert,\n  Pressable,");
}

// Add Haptics if missing
if (!content.includes('expo-haptics')) {
    content = content.replace(/import React from "react";/, "import React from 'react';\nimport * as Haptics from 'expo-haptics';\nimport Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';");
}

// Replace MenuItem
const oldMenuItem = `function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
  isDestructive,
}: MenuItemProps) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View
        style={[
          styles.menuIconWrapper,
          isDestructive && { backgroundColor: "rgba(224, 74, 58, 0.1)" },
        ]}
      >
        {icon}
      </View>
      <View style={styles.menuTextContainer}>
        <Text
          style={[styles.menuTitle, isDestructive && { color: colors.cardRed }]}
        >
          {title}
        </Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {!isDestructive && (
        <ChevronRight color={colors.textMuted} size={20} strokeWidth={2} />
      )}
    </Pressable>
  );
}`;

const newMenuItem = `function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
  isDestructive,
}: MenuItemProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <Pressable 
      onPressIn={() => {
        scale.value = withTiming(0.98, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 150 });
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (onPress) onPress();
      }}
    >
      <Animated.View style={[styles.menuItem, animatedStyle, isDestructive && { opacity: 0.9 }]}>
        <View
          style={[
            styles.menuIconWrapper,
            isDestructive && { backgroundColor: "rgba(224, 74, 58, 0.08)" },
          ]}
        >
          {icon}
        </View>
        <View style={styles.menuTextContainer}>
          <Text
            style={[styles.menuTitle, isDestructive && { color: colors.cardRed, fontFamily: typography.families.bold }]}
          >
            {title}
          </Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
        {!isDestructive && (
          <ChevronRight color={colors.textMuted} size={20} strokeWidth={2} />
        )}
      </Animated.View>
    </Pressable>
  );
}`;

content = content.replace(oldMenuItem, newMenuItem);

// Replace handleSignOut
const oldHandleSignOut = `const handleSignOut = async () => {
    if (user) {
      await signOut();
    } else {
      await resetOnboarding();
    }
    router.replace('/(auth)/login');
  };`;

const newHandleSignOut = `const handleSignOut = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            if (user) {
              await signOut();
            } else {
              await resetOnboarding();
            }
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };`;

content = content.replace(oldHandleSignOut, newHandleSignOut);

fs.writeFileSync(file, content, 'utf8');
