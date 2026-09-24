import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { secureStorage } from './secureStorage';

interface PreferencesState {
  // Notifications
  orderUpdates: boolean;
  promotions: boolean;
  priceDrops: boolean;
  newArrivals: boolean;
  setNotificationPreference: (key: 'orderUpdates' | 'promotions' | 'priceDrops' | 'newArrivals', value: boolean) => void;

  // Settings
  currency: string;
  language: string;
  location: string;
  setSetting: (key: 'currency' | 'language' | 'location', value: string) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      orderUpdates: true,
      promotions: false,
      priceDrops: true,
      newArrivals: true,
      setNotificationPreference: (key, value) => set({ [key]: value }),

      currency: 'USD',
      language: 'English',
      location: 'United States',
      setSetting: (key, value) => set({ [key]: value }),
    }),
    {
      name: 'preferences-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
