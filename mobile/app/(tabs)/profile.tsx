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
import { colors, spacing, radius, typography } from '../../src/theme';

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
    const theme = { colors, spacing, radius, typography };
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
}

import { useOnboardingStore } from "../../src/store/useOnboardingStore";
import { useAuthStore } from "../../src/store/useAuthStore";

export default function ProfileScreen() {
  return (
    <>
      <Head>
        <title>Profile - Kicks</title>
      </Head>
      <ProfileScreenContent />
    </>
  );
}

function ProfileScreenContent() {
    const theme = { colors, spacing, radius, typography };
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
        icon={<Settings color={colors.textPrimary} size={24} strokeWidth={2} />}
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
            <ShoppingBag color={colors.textPrimary} size={20} strokeWidth={2.5} />
          </View>
          <View style={styles.guestBannerTextContainer}>
            <Text style={styles.guestBannerTitle}>Join KICKS</Text>
            <Text style={styles.guestBannerSubtitle}>Unlock exclusive access and drops</Text>
          </View>
          <View style={styles.guestBannerAction}>
            <Text style={styles.guestBannerActionText}>SIGN IN</Text>
            <ChevronRight color={colors.textPrimary} size={16} strokeWidth={3} />
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
      style={[styles.container, { paddingTop: insets.top + spacing.md }]}
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
                color={colors.textPrimary}
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
              <MapPin color={colors.textPrimary} size={20} strokeWidth={2} />
            }
            title="Shipping Addresses"
            onPress={() => router.push("/profile/addresses" as any)}
          />
          <View style={styles.divider} />
          <MenuItem
            icon={
              <CreditCard
                color={colors.textPrimary}
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
            icon={<Bell color={colors.textPrimary} size={20} strokeWidth={2} />}
            title="Notifications"
            onPress={() => router.push("/profile/notifications" as any)}
          />
          <View style={styles.divider} />
          <MenuItem
            icon={
              <Settings color={colors.textPrimary} size={20} strokeWidth={2} />
            }
            title="Preferences"
            onPress={() => router.push("/profile/settings" as any)}
          />
          <View style={styles.divider} />
          <MenuItem
            icon={
              <CircleHelp
                color={colors.textPrimary}
                size={20}
                strokeWidth={2}
              />
            }
            title="Help & Support"
            onPress={() => router.push("/profile/support" as any)}
          />
        </View>
      </View>

      <View style={[styles.section, { marginTop: spacing.lg }]}>
        <View style={styles.menuCard}>
          <MenuItem
            icon={<LogOut color={colors.cardRed} size={20} strokeWidth={2} />}
            title="Log Out"
            isDestructive
            onPress={handleSignOut}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
  },
  header: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerSubtitle: {
    fontFamily: typography.families.semibold,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 3,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 34,
    fontFamily: typography.families.extrabold,
    color: colors.textPrimary,
    letterSpacing: -1.5,
  },

  // User Info
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.xxl,
    marginBottom: spacing.xxl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.xl,
    marginBottom: spacing.xxl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  guestBannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  guestBannerTextContainer: {
    flex: 1,
  },
  guestBannerTitle: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  guestBannerSubtitle: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  guestBannerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.round,
  },
  guestBannerActionText: {
    fontFamily: typography.families.semibold,
    fontSize: 10,
    color: colors.textPrimary,
    letterSpacing: 1,
    marginRight: 2,
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.xl,
    color: colors.textInverse,
  },
  userDetails: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  userName: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.lg,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
  },
  editButton: {
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.round,
  },
  editButtonText: {
    fontFamily: typography.families.extrabold,
    fontSize: 10,
    color: colors.textPrimary,
    letterSpacing: 1,
  },

  // Sections
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: typography.families.semibold,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 2,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
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
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  menuIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  menuTitle: {
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  menuSubtitle: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.backgroundLight,
    marginLeft: 70, // Align with text
  },
});
