const fs = require('fs');
let file = 'mobile/app/profile/edit.tsx';

let content = `import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Camera } from 'lucide-react-native';
import { useToastStore } from '../../src/store/useToastStore';
import { colors, spacing, radius, typography } from '../../src/theme';
import { IconButton } from '../../src/components/IconButton';
import { useAuthStore } from '../../src/store/useAuthStore';
import * as Haptics from 'expo-haptics';

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { user, profile, updateProfile } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // Keep local since it's just UI placeholder for now
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) setEmail(user.email || '');
    if (profile) {
      const fullName = profile.first_name ? \`\${profile.first_name} \${profile.last_name || ''}\`.trim() : '';
      setName(fullName);
    }
  }, [user, profile]);

  const initial = profile?.first_name ? profile.first_name[0].toUpperCase() : 'U';

  const handleSave = async () => {
    if (isSaving) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSaving(true);
    
    // Parse name
    const parts = name.trim().split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ');

    const success = await updateProfile({
      first_name: firstName,
      last_name: lastName,
    });

    setIsSaving(false);

    if (success) {
      useToastStore.getState().showToast('Profile Updated', 'Your changes have been saved', 'success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } else {
      useToastStore.getState().showToast('Update Failed', 'Could not save profile changes.', 'error');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <IconButton 
          icon={<ChevronLeft color={colors.textPrimary} size={24} strokeWidth={2.5} />} 
          onPress={() => router.back()} 
          style={styles.backButton}
        />
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Text style={styles.avatarText}>{initial}</Text>
            <View style={styles.cameraIcon}>
              <Camera color={colors.textInverse} size={16} strokeWidth={2} />
            </View>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>FULL NAME</Text>
            <TextInput 
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL ADDRESS (READ ONLY)</Text>
            <TextInput 
              style={[styles.input, { opacity: 0.6 }]}
              value={email}
              editable={false}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PHONE NUMBER</Text>
            <TextInput 
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+1 (555) 123-4567"
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        <Pressable 
          style={[styles.saveButton, isSaving && { opacity: 0.7 }]} 
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>{isSaving ? 'SAVING...' : 'SAVE CHANGES'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
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
    paddingBottom: spacing.md,
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
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarText: {
    fontFamily: typography.families.extrabold,
    fontSize: 36,
    color: colors.textInverse,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.textPrimary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.backgroundLight,
  },
  form: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontFamily: typography.families.semibold,
    fontSize: 10,
    color: colors.textMuted,
    letterSpacing: 2,
    marginLeft: 4,
  },
  input: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: radius.xl,
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.lg,
    backgroundColor: colors.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: radius.xxxl,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.sm,
    color: colors.textInverse,
    letterSpacing: 1,
  }
});
`;
fs.writeFileSync(file, content, 'utf8');
