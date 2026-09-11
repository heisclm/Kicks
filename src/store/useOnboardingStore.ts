import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingState {
  hasSeenOnboarding: boolean;
  isHydrated: boolean;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
  checkOnboardingStatus: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  hasSeenOnboarding: false,
  isHydrated: false,

  completeOnboarding: async () => {
    try {
      await AsyncStorage.setItem('@kicks_has_seen_onboarding', 'true');
      set({ hasSeenOnboarding: true });
    } catch (e) {
      console.error('Failed to save onboarding status', e);
    }
  },

  resetOnboarding: async () => {
    try {
      await AsyncStorage.removeItem('@kicks_has_seen_onboarding');
      set({ hasSeenOnboarding: false });
    } catch (e) {
      console.error('Failed to reset onboarding status', e);
    }
  },

  checkOnboardingStatus: async () => {
    try {
      const value = await AsyncStorage.getItem('@kicks_has_seen_onboarding');
      if (value === 'true') {
        set({ hasSeenOnboarding: true, isHydrated: true });
      } else {
        set({ hasSeenOnboarding: false, isHydrated: true });
      }
    } catch (e) {
      console.error('Failed to load onboarding status', e);
      set({ hasSeenOnboarding: false, isHydrated: true });
    }
  }
}));
