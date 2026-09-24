import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Lock, User, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

import { supabase } from '../../src/api/supabase';
import { colors, spacing, radius, typography } from '../../src/theme';
import { useToastStore } from '../../src/store/useToastStore';

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email || !password || !firstName || !lastName) {
      useToastStore.getState().showToast('Error', 'Please fill in all fields', 'error');
      return;
    }

    setLoading(true);

    if (process.env.EXPO_PUBLIC_USE_MOCK_DATA !== 'false') {
      setTimeout(() => {
        setLoading(false);
        useToastStore.getState().showToast('Success', 'Mock registration successful! Please log in.', 'success');
        router.back();
      }, 1000);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });

    setLoading(false);

    if (error) {
      useToastStore.getState().showToast('Registration Failed', error.message, 'error');
    } else {
      useToastStore.getState().showToast('Success', 'Account created! Please log in.', 'success');
      router.back();
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Premium Background */}
      <LinearGradient
        colors={["#1c1b19", "#3e2a22", "#1a100c"]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Premium Glow Aura */}
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          <Defs>
            <RadialGradient id="glow" cx="50%" cy="20%" rx="60%" ry="60%">
              <Stop offset="0%" stopColor="#ff2a85" stopOpacity="0.15" />
              <Stop offset="40%" stopColor="#3b82f6" stopOpacity="0.05" />
              <Stop offset="100%" stopColor="#1a100c" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#glow)" />
        </Svg>
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xl }]}
          showsVerticalScrollIndicator={false}
        >
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <View style={styles.backIconWrapper}>
              <ArrowLeft color="#fff" size={24} />
            </View>
          </Pressable>

          <View style={styles.header}>
            <Text style={styles.title}>Join KICKS</Text>
            <Text style={styles.subtitle}>Create an account to track your orders, save favorites, and checkout faster.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: spacing.md }]}>
                <Text style={styles.label}>FIRST NAME</Text>
                <View style={styles.inputContainer}>
                  <User color="rgba(255,255,255,0.5)" size={20} />
                  <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={firstName}
                    onChangeText={setFirstName}
                    keyboardAppearance="dark"
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>LAST NAME</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, { marginLeft: 0 }]}
                    placeholder="Last Name"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={lastName}
                    onChangeText={setLastName}
                    keyboardAppearance="dark"
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <View style={styles.inputContainer}>
                <Mail color="rgba(255,255,255,0.5)" size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  keyboardAppearance="dark"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.inputContainer}>
                <Lock color="rgba(255,255,255,0.5)" size={20} />
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  keyboardAppearance="dark"
                />
              </View>
            </View>

            <Pressable 
              style={[styles.loginButton, loading && styles.loginButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>CREATE ACCOUNT</Text>
                  <ChevronRight color="#fff" size={20} />
                </>
              )}
            </Pressable>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <Pressable onPress={() => router.back()}>
                <Text style={styles.footerLink}> SIGN IN</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a100c',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
  },
  backButton: {
    marginBottom: spacing.xxl,
    alignSelf: 'flex-start',
  },
  backIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  header: {
    marginBottom: spacing.xxxl,
  },
  title: {
    fontFamily: typography.families.extrabold,
    fontSize: 40,
    lineHeight: 44,
    color: '#ffffff',
    marginBottom: spacing.sm,
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.md,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  inputGroup: {
    marginBottom: spacing.xl,
  },
  label: {
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.xs,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 60,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.md,
    marginLeft: spacing.md,
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    height: 64,
    borderRadius: radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    marginTop: spacing.md,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.md,
    color: '#ffffff',
    letterSpacing: 2,
    marginRight: spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xxxl,
  },
  footerText: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.md,
    color: 'rgba(255,255,255,0.6)',
  },
  footerLink: {
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.md,
    color: '#ffffff',
  },
});
