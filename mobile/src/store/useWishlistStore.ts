import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { secureStorage } from './secureStorage';
import { wishlistService } from '../services/WishlistService';
import { useAuthStore } from './useAuthStore';

interface WishlistState {
  savedProductIds: string[];
  isLoading: boolean;
  loadWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      savedProductIds: [],
      isLoading: false,

      loadWishlist: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        set({ isLoading: true });
        const ids = await wishlistService.getWishlist(user.id);
        
        set(state => {
          // Merge local and remote
          const merged = new Set([...state.savedProductIds, ...ids]);
          return { savedProductIds: Array.from(merged), isLoading: false };
        });
      },
      
      toggleWishlist: async (productId) => {
        const user = useAuthStore.getState().user;
        const isCurrentlySaved = get().savedProductIds.includes(productId);

        // Optimistic UI Update
        set((state) => ({
          savedProductIds: isCurrentlySaved
            ? state.savedProductIds.filter(id => id !== productId)
            : [...state.savedProductIds, productId]
        }));

        // Background Sync if Logged In
        if (user) {
          let success = false;
          if (isCurrentlySaved) {
            success = await wishlistService.removeProduct(user.id, productId);
          } else {
            success = await wishlistService.addProduct(user.id, productId);
          }

          // Rollback on failure
          if (!success) {
            set((state) => ({
              savedProductIds: isCurrentlySaved
                ? [...state.savedProductIds, productId]
                : state.savedProductIds.filter(id => id !== productId)
            }));
          }
        }
      },

      isInWishlist: (productId) => {
        return get().savedProductIds.includes(productId);
      },

      clearWishlist: () => set({ savedProductIds: [] })
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
