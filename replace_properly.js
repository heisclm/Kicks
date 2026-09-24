const fs = require('fs');
let file = 'mobile/app/(tabs)/profile.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Replace handleSignOut securely
content = content.replace(/const handleSignOut = async \(\) => \{[\s\S]*?router\.replace\('\/\(auth\)\/login'\);\s*\};/m, `const handleSignOut = () => {
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
  };`);

// 2. Replace MenuItem securely
content = content.replace(/function MenuItem\(\{[\s\S]*?<\/Pressable>\n\s*\}/m, `function MenuItem({
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
        scale.value = withTiming(0.96, { duration: 100 });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: 150 });
      }}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (onPress) onPress();
      }}
    >
      <Animated.View style={[styles.menuItem, animatedStyle, isDestructive && { opacity: 0.95 }]}>
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
            style={[
              styles.menuTitle, 
              isDestructive && { color: colors.cardRed, fontFamily: typography.families.extrabold }
            ]}
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
}`);

fs.writeFileSync(file, content, 'utf8');
