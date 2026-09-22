import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, ChevronRight, Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

import { supabase } from "../../src/api/supabase";
import { useToastStore } from "../../src/store/useToastStore";
import { colors, spacing, radius, typography } from '../src/theme';
import { StyleSheet } from 'react-native';

export default function LoginScreen() {
    const theme = { colors, spacing, radius, typography };
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      useToastStore
        .getState()
        .showToast("Error", "Please enter both email and password", "error");
      return;
    }

    setLoading(true);

    if (process.env.EXPO_PUBLIC_USE_MOCK_DATA !== "false") {
      setTimeout(() => {
        setLoading(false);
        router.replace("/(tabs)");
      }, 1000);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      useToastStore
        .getState()
        .showToast("Login Failed", error.message, "error");
    } else {
      router.replace("/(tabs)");
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Premium Background Matches Onboarding */}
      <LinearGradient
        colors={["#1c1b19", "#3e2a22", "#1a100c"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Premium Glow Aura */}
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          <Defs>
            <RadialGradient id="glow" cx="50%" cy="30%" rx="60%" ry="50%">
              <Stop offset="0%" stopColor="#ff2a85" stopOpacity="0.15" />
              <Stop offset="50%" stopColor="#3b82f6" stopOpacity="0.05" />
              <Stop offset="100%" stopColor="#1a100c" stopOpacity="0" />
            </RadialGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#glow)" />
        </Svg>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + spacing.md,
              paddingBottom: insets.bottom + spacing.xl,
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <View style={styles.backIconWrapper}>
              <ArrowLeft color="#fff" size={24} />
            </View>
          </Pressable>

          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Unlock exclusive drops, track orders, and experience KICKS.
            </Text>
          </View>

          <View style={styles.form}>
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
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  keyboardAppearance="dark"
                />
              </View>
            </View>

            <View style={styles.forgotPasswordContainer}>
              <Pressable>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </Pressable>
            </View>

            <Pressable
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>SIGN IN</Text>
                  <ChevronRight color="#fff" size={20} />
                </>
              )}
            </Pressable>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Pressable onPress={() => router.push("/(auth)/register")}>
                <Text style={styles.footerLink}> JOIN KICKS</Text>
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
    backgroundColor: "#1a100c",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
  },
  backButton: {
    marginBottom: spacing.xxl,
    alignSelf: "flex-start",
  },
  backIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  header: {
    marginBottom: spacing.xxxl,
  },
  title: {
    fontFamily: typography.families.extrabold,
    fontSize: 40,
    lineHeight: 44,
    color: "#ffffff",
    marginBottom: spacing.sm,
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.md,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: spacing.xl,
  },
  label: {
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.xs,
    color: "rgba(255,255,255,0.6)",
    marginBottom: spacing.sm,
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 60,
  },
  input: {
    flex: 1,
    color: "#ffffff",
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.md,
    marginLeft: spacing.md,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: spacing.xxl,
    marginTop: -spacing.sm,
  },
  forgotPasswordText: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.sm,
    color: "rgba(255,255,255,0.6)",
  },
  loginButton: {
    flexDirection: "row",
    backgroundColor: colors.accent,
    height: 64,
    borderRadius: radius.round,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  loginButtonText: {
    fontFamily: typography.families.extrabold,
    fontSize: typography.sizes.md,
    color: "#ffffff",
    letterSpacing: 2,
    marginRight: spacing.xs,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xxxl,
  },
  footerText: {
    fontFamily: typography.families.regular,
    fontSize: typography.sizes.md,
    color: "rgba(255,255,255,0.6)",
  },
  footerLink: {
    fontFamily: typography.families.semibold,
    fontSize: typography.sizes.md,
    color: "#ffffff",
  },
});
