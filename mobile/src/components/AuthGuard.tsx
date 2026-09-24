import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';
import { useOnboardingStore } from '../store/useOnboardingStore';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuthStore();
  const { hasSeenOnboarding, isHydrated: isOnboardingHydrated } = useOnboardingStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized || !isOnboardingHydrated) return;

    const inAuthGroup = (segments[0] as string) === '(auth)';
    const isRoot = (segments.length as number) === 0 || (segments[0] as string) === 'index';

    if (!user) {
      if (!isRoot && !inAuthGroup) {
         // Guest trying to go to protected route -> route them based on onboarding
         router.replace(hasSeenOnboarding ? '/(auth)/login' : '/');
      } else if (isRoot && hasSeenOnboarding) {
         // Guest on root but already saw onboarding -> go to login
         router.replace('/(auth)/login');
      }
    } else if (user) {
      if (isRoot || inAuthGroup) {
         router.replace('/(tabs)');
      }
    }
  }, [user, isInitialized, isOnboardingHydrated, hasSeenOnboarding, segments]);

  return <>{children}</>;
}
