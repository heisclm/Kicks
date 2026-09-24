
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ToastOverlay } from "../src/components/ToastOverlay";
import { OfflineBanner } from "../src/components/OfflineBanner";
import { GlobalErrorBoundary } from "../src/components/GlobalErrorBoundary";
import { useAuthStore } from "../src/store/useAuthStore";
import { View } from "react-native";
import * as SystemUI from 'expo-system-ui';
import { StyleSheet } from 'react-native';
import { colors } from '../src/theme';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "font-regular": require("../assets/fonts/font-regular.ttf"),
    "font-semibold": require("../assets/fonts/font-semibold.ttf"),
    "font-extrabold": require("../assets/fonts/font-extrabold.ttf"),
  });

  const { initializeAuth } = useAuthStore();
  
  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    // Dynamic system UI background color based on theme
    SystemUI.setBackgroundColorAsync(colors.backgroundLight);
  }, [colors.backgroundLight]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundLight }}>
      <GlobalErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <StatusBar style={false ? 'light' : 'dark'} />
          <OfflineBanner />
        <Stack
          screenOptions={{ 
            headerShown: false, 
            animation: "slide_from_right",
            contentStyle: { backgroundColor: colors.backgroundLight } 
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="details/[id]" />
          <Stack.Screen name="search" />
          <Stack.Screen name="checkout/index" />
          <Stack.Screen name="orders/index" />
        </Stack>
        <ToastOverlay />
      </QueryClientProvider>
    </GlobalErrorBoundary>
    </View>
  );
}
