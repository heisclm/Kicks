import { create } from 'zustand';
import { supabase } from '../api/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useWishlistStore } from './useWishlistStore';
import { useCartStore } from './useCartStore';
import { useCheckoutStore } from './useCheckoutStore';

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
  initializeAuth: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isInitialized: false,

  initializeAuth: async () => {
    // Prevent double initialization
    if (get().isInitialized) return;

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error.message);
        set({ isLoading: false, isInitialized: true });
        return;
      }

      set({ session, user: session?.user || null });

      if (session?.user) {
        await fetchProfile(session.user.id, set);
        useWishlistStore.getState().loadWishlist();
        useCartStore.getState().loadCart();
        useCheckoutStore.getState().loadAddress();
      } else {
        set({ isLoading: false, isInitialized: true });
        useWishlistStore.getState().clearWishlist();
        useCartStore.getState().clearCart();
        useCheckoutStore.getState().clearSavedData();
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (_event, newSession) => {
        set({ session: newSession, user: newSession?.user || null });
        if (newSession?.user) {
          await fetchProfile(newSession.user.id, set);
          useWishlistStore.getState().loadWishlist();
          useCartStore.getState().loadCart();
          useCheckoutStore.getState().loadAddress();
        } else {
          set({ profile: null, isLoading: false });
          useWishlistStore.getState().clearWishlist();
          useCartStore.getState().clearCart();
          useCheckoutStore.getState().clearSavedData();
        }
      });
    } catch (err) {
      console.error('Auth initialization error:', err);
      set({ isLoading: false, isInitialized: true });
    }
  },

  updateProfile: async (updates) => {
    const user = get().user;
    if (!user) return false;
    
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating profile:', error);
      set({ isLoading: false });
      return false;
    }
    
    set({ profile: data, isLoading: false });
    return true;
  },

  signOut: async () => {
    try {
      set({ isLoading: true });
      await supabase.auth.signOut();
      set({ session: null, user: null, profile: null, isLoading: false });
    } catch (error) {
      console.error('Error signing out:', error);
      set({ isLoading: false });
    }
  },
}));

// Helper to fetch profile
async function fetchProfile(userId: string, set: any) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
    }
    
    set({ profile: data || null, isLoading: false, isInitialized: true });
  } catch (err) {
    set({ isLoading: false, isInitialized: true });
  }
}
