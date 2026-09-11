import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { secureStorage } from './secureStorage';
import { addressService } from '../services/AddressService';
import { useAuthStore } from './useAuthStore';

export interface Address {
  fullName: string;
  email: string;
  street: string;
  city: string;
  zipCode: string;
}

export interface PaymentMethod {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface CheckoutState {
  savedAddress: Address | null;
  savedPayment: PaymentMethod | null;
  isLoading: boolean;
  loadAddress: () => Promise<void>;
  setAddress: (address: Address) => Promise<void>;
  setPayment: (payment: PaymentMethod) => void;
  clearSavedData: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      savedAddress: null,
      savedPayment: null,
      isLoading: false,

      loadAddress: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set({ isLoading: true });
        const remoteAddress = await addressService.getAddress(user.id);
        
        if (remoteAddress) {
          set({ savedAddress: remoteAddress, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      },

      setAddress: async (address) => {
        // Optimistic UI Update
        set({ savedAddress: address });
        
        // Background sync
        const user = useAuthStore.getState().user;
        if (user) {
          await addressService.saveAddress(user.id, address);
        }
      },

      setPayment: (payment) => set({ savedPayment: payment }),
      clearSavedData: () => set({ savedAddress: null, savedPayment: null }),
    }),
    {
      name: 'checkout-secure-storage', // Key used in secure store
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
