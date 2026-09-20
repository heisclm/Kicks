import { useRouter } from "expo-router";
import {
  Bell,
  ChevronRight,
  CircleHelp,
  CreditCard,
  LogOut,
  MapPin,
  Settings,
  ShoppingBag,
} from "lucide-react-native";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "../../src/components/IconButton";
import { colors, radius, spacing, typography } from "../../src/theme";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  isDestructive?: boolean;
}

function MenuItem({
  icon,
  title,
  subtitle,
  onPress,
  isDestructive,
}: MenuItemProps) {
    const { theme } = useStyles();
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
          style={[styles.menuTitle, isDestructive && { color: theme.colors.cardRed }]}
        >
          {title}
        </Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {!isDestructive && (
        <ChevronRight color={theme.colors.textMuted} size={20} strokeWidth={2} />
      )}
    </Pressable>
  );
}

import { useOnboardingStore } from "../../src/store/useOnboardingStore";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useStyles } from "react-native-unistyles";

export default function ProfileScreen() {
    const { theme } = useStyles();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { resetOnboarding } = useOnboardingStore();
  const { user, profile, signOut } = useAuthStore();

  const handleSignOut = async () => {
    if (user) {
      await signOut();
    } else {
      await resetOnboarding();
    }
    router.replace("/");
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerSubtitle}>MY ACCOUNT</Text>
        <Text style={styles.title}>Profile</Text>
      </View>
      <IconButton
        icon={<Settings color={theme.colors.textPrimary} size={24} strokeWidth={2} />}
        onPress={() => router.push("/profile/settings" as any)}
      />
    </View>
  );

  const renderUserInfo = () => {
    if (!user) {
      return (
        <Pressable 
          style={styles.guestBanner}
          onPress={() => router.push("/(auth)/login")}
        >
          <View style={styles.guestBannerIcon}>
            <ShoppingBag color={theme.colors.textPrimary} size={20} strokeWidth={2.5} />
          </View>
          <View style={styles.guestBannerTextContainer}>
            <Text style={styles.guestBannerTitle}>Join KICKS</Text>
            <Text style={styles.guestBannerSubtitle}>Unlock exclusive access and drops</Text>
          </View>
          <View style={styles.guestBannerAction}>
            <Text style={styles.guestBannerActionText}>SIGN IN</Text>
            <ChevronRight color={theme.colors.textPrimary} size={16} strokeWidth={3} />
          </View>
        </Pressable>
      );
    }

    const initial = profile?.first_name ? profile.first_name[0].toUpperCase() : 'U';
    const fullName = profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : user.email?.split('@')[0];

    return (
      <View style={styles.userInfoContainer}>
        <View style={styles.avatarWrapper}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{fullName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <Pressable
          style={styles.editButton}
          onPress={() => router.push("/profile/edit" as any)}
        >
          <Text style={styles.editButtonText}>EDIT</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + theme.spacing.md }]}
      contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
      showsVerticalScrollIndicator={false}
    >
      {renderHeader()}
      {renderUserInfo()}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ORDERS & ACCOUNT</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon={
              <ShoppingBag
                color={theme.colors.textPrimary}
                size={20}
                strokeWidth={2}
              />
            }
            title="My Orders"
            subtitle="View and track your orders"
            onPress={() => router.push("/orders" as any)}
          />
          <View style={styles.divider} />
          <MenuItem
            icon={
              <MapPin color={theme.colors.textPrimary} size={20} strokeWidth={2} />
            }
            title="Shipping Addresses"
            onPress={() => router.push("/profile/addresses" as any)}
          />
          <View style={styles.divider} />
          <MenuItem
            icon={
              <CreditCard
                color={theme.colors.textPrimary}
                size={20}
                strokeWidth={2}
              />
            }
            title="Payment Methods"
            onPress={() => router.push("/profile/payments" as any)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>APP SETTINGS</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon={<Bell color={theme.colors.textPrimary} size={20} strokeWidth={2} />}
            title="Notifications"
            onPress={() => router.push("/profile/notifications" as any)}
          />
          <View style={styles.divider} />
          <MenuItem
            icon={
              <Settings color={theme.colors.textPrimary} size={20} strokeWidth={2} />
            }
            title="Preferences"
            onPress={() => router.push("/profile/settings" as any)}
          />
          <View style={styles.divider} />
          <MenuItem
            icon={
              <CircleHelp
                color={theme.colors.textPrimary}
                size={20}
                strokeWidth={2}
              />
            }
            title="Help & Support"
            onPress={() => router.push("/profile/support" as any)}
          />
        </View>
      </View>

      <View style={[styles.section, { marginTop: theme.spacing.lg }]}>
        <View style={styles.menuCard}>
          <MenuItem
            icon={<LogOut color={theme.colors.cardRed} size={20} strokeWidth={2} />}
            title="Log Out"
            isDestructive
            onPress={handleSignOut}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerSubtitle: {
    fontFamily: theme.typography.families.semibold,
    fontSize: 11,
    color: theme.colors.textMuted,
    letterSpacing: 3,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 34,
    fontFamily: theme.typography.families.extrabold,
    color: theme.colors.textPrimary,
    letterSpacing: -1.5,
  },

  // User Info
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xxl,
    marginBottom: theme.spacing.xxl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.xl,
    marginBottom: theme.spacing.xxl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  guestBannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  guestBannerTextContainer: {
    flex: 1,
  },
  guestBannerTitle: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  guestBannerSubtitle: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
  },
  guestBannerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.round,
  },
  guestBannerActionText: {
    fontFamily: theme.typography.families.semibold,
    fontSize: 10,
    color: theme.colors.textPrimary,
    letterSpacing: 1,
    marginRight: 2,
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.xl,
    color: theme.colors.textInverse,
  },
  userDetails: {
    flex: 1,
    marginLeft: theme.spacing.lg,
  },
  userName: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textMuted,
  },
  editButton: {
    backgroundColor: theme.colors.backgroundLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.round,
  },
  editButtonText: {
    fontFamily: theme.typography.families.extrabold,
    fontSize: 10,
    color: theme.colors.textPrimary,
    letterSpacing: 1,
  },

  // Sections
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontFamily: theme.typography.families.semibold,
    fontSize: 10,
    color: theme.colors.textMuted,
    letterSpacing: 2,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  menuCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xxl,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  menuIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  menuTitle: {
    fontFamily: theme.typography.families.semibold,
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textPrimary,
  },
  menuSubtitle: {
    fontFamily: theme.typography.families.regular,
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.backgroundLight,
    marginLeft: 70, // Align with text
  },
}));
