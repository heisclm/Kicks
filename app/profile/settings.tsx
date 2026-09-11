import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, Bell, Moon, Globe, Shield, Smartphone } from 'lucide-react-native';
import { colors, spacing, typography, radius } from '../../src/theme';
import { IconButton } from '../../src/components/IconButton';
import { useToastStore } from '../../src/store/useToastStore';

function SettingToggle({ icon, title, subtitle, value, onValueChange }: any) {
  return (
    <View style={styles.settingItem}>
      <View style={styles.iconWrapper}>{icon}</View>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Switch 
        value={value} 
        onValueChange={onValueChange} 
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor="#fff"
      />
    </View>
  );
}

function SettingLink({ icon, title, value, onPress }: any) {
  return (
    <Pressable style={styles.settingItem} onPress={onPress}>
      <View style={styles.iconWrapper}>{icon}</View>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      {value && <Text style={styles.settingValue}>{value}</Text>}
      <ChevronRight color={colors.textMuted} size={20} strokeWidth={2} />
    </Pressable>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToastStore();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton 
          icon={<ChevronLeft color={colors.textPrimary} size={24} strokeWidth={2.5} />} 
          onPress={() => router.back()} 
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Preferences</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APP SETTINGS</Text>
          <View style={styles.card}>
            <SettingToggle 
              icon={<Bell color={colors.textPrimary} size={20} />} 
              title="Push Notifications" 
              subtitle="Order updates and drops"
              value={pushEnabled} 
              onValueChange={setPushEnabled} 
            />
            <View style={styles.divider} />
            <SettingToggle 
              icon={<Moon color={colors.textPrimary} size={20} />} 
              title="Dark Mode" 
              value={darkModeEnabled} 
              onValueChange={setDarkModeEnabled} 
            />
            <View style={styles.divider} />
            <SettingToggle 
              icon={<Shield color={colors.textPrimary} size={20} />} 
              title="Face ID / Touch ID" 
              subtitle="Secure login & checkout"
              value={biometricsEnabled} 
              onValueChange={setBiometricsEnabled} 
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>REGIONAL</Text>
          <View style={styles.card}>
            <SettingLink 
              icon={<Globe color={colors.textPrimary} size={20} />} 
              title="Language" 
              value="English (US)"
              onPress={() => showToast('Language Settings', 'Opening language options', 'info')}
            />
            <View style={styles.divider} />
            <SettingLink 
              icon={<Shield color={colors.textPrimary} size={20} />} 
              title="Currency" 
              value="USD ($)"
              onPress={() => showToast('Currency Settings', 'Opening currency options', 'info')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <View style={styles.card}>
            <SettingLink 
              icon={<Shield color={colors.textPrimary} size={20} />} 
              title="Privacy Policy" 
              onPress={() => showToast('Privacy Policy', 'Opening Privacy Policy', 'info')}
            />
            <View style={styles.divider} />
            <SettingLink 
              icon={<Smartphone color={colors.textPrimary} size={20} />} 
              title="App Version" 
              value="v1.0.0" 
              onPress={() => showToast('App Version', 'KICKS v1.0.0 is up to date', 'success')}
            />
          </View>
        </View>

        <View style={styles.footerInfo}>
          <Text style={styles.versionText}>KICKS App Version 1.0.0 (Build 57)</Text>
          <Text style={styles.versionText}>© 2026 KICKS, Inc.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
  },
  backButton: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  headerTitle: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.lg,
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxxl,
  },
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingTitle: {
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  settingSubtitle: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  settingValue: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    marginRight: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.backgroundLight,
    marginLeft: 70, // Align with text
  },
  footerInfo: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  versionText: {
    fontFamily: typography.families.regular,
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 4,
  }
});
