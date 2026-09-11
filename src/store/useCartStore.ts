import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { secureStorage } from './secureStorage';
import { CartItem } from '../types';
import { cartService } from '../services/CartService';
import { useAuthStore } from './useAuthStore';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  loadCart: () => Promise<void>;
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeFromCart: (productId: string, size: number) => Promise<void>;
  increaseQuantity: (productId: string, size: number) => Promise<void>;
  decreaseQuantity: (productId: string, size: number) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Computed values
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

const DELIVERY_FEE = 15;

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const discount = 0; // Future promo code logic
  const total = subtotal + deliveryFee - discount;
  return { subtotal, deliveryFee, discount, total };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      subtotal: 0,
      deliveryFee: 0,
      discount: 0,
      total: 0,

      loadCart: async () => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        set({ isLoading: true });
        const remoteItems = await cartService.getCart(user.id);
        
        // For simplicity, we overwrite local cart with remote cart on login.
        // In a complex app, you'd merge guest cart with remote cart.
        set({ 
          items: remoteItems, 
          isLoading: false,
          ...calculateTotals(remoteItems) 
        });
      },

      addToCart: async (itemData) => {
        const user = useAuthStore.getState().user;
        
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (i) => i.productId === itemData.productId && i.size === itemData.size
          );

          let newItems = [...state.items];
          if (existingItemIndex > -1) {
            newItems[existingItemIndex].quantity += itemData.quantity;
          } else {
            newItems.push({
              ...itemData,
              id: `${itemData.productId}-${itemData.size}`, // Optimistic ID
            });
          }

          return {
            items: newItems,
            ...calculateTotals(newItems)
          };
        });

        // Background sync
        if (user) {
          const state = get();
          const currentItem = state.items.find(i => i.productId === itemData.productId && i.size === itemData.size);
          if (currentItem) {
            const remoteId = await cartService.syncCartItem(user.id, itemData.productId, itemData.size, currentItem.quantity);
            if (remoteId) {
              set((s) => {
                const updatedItems = s.items.map(i => 
                  (i.productId === itemData.productId && i.size === itemData.size) ? { ...i, id: remoteId } : i
                );
                return { items: updatedItems, ...calculateTotals(updatedItems) };
              });
            }
          }
        }
      },

      removeFromCart: async (productId, size) => {
        const user = useAuthStore.getState().user;
        const state = get();
        const itemToRemove = state.items.find(i => i.productId === productId && i.size === size);
        
        set((state) => {
          const newItems = state.items.filter(
            (i) => !(i.productId === productId && i.size === size)
          );
          return {
            items: newItems,
            ...calculateTotals(newItems)
          };
        });

        if (user && itemToRemove) {
           await cartService.removeCartItemByVariant(user.id, productId, size);
        }
      },

      increaseQuantity: async (productId, size) => {
        const user = useAuthStore.getState().user;
        let newQuantity = 0;
        
        set((state) => {
          const newItems = state.items.map((i) => {
            if (i.productId === productId && i.size === size) {
              newQuantity = i.quantity + 1;
              return { ...i, quantity: newQuantity };
            }
            return i;
          });
          return { items: newItems, ...calculateTotals(newItems) };
        });

        if (user && newQuantity > 0) {
          await cartService.syncCartItem(user.id, productId, size, newQuantity);
        }
      },

      decreaseQuantity: async (productId, size) => {
        const user = useAuthStore.getState().user;
        let newQuantity = 0;
        
        set((state) => {
          const newItems = state.items.map((i) => {
            if (i.productId === productId && i.size === size && i.quantity > 1) {
              newQuantity = i.quantity - 1;
              return { ...i, quantity: newQuantity };
            }
            return i;
          });
          return { items: newItems, ...calculateTotals(newItems) };
        });

        if (user && newQuantity > 0) {
          await cartService.syncCartItem(user.id, productId, size, newQuantity);
        }
      },

      clearCart: async () => {
        const user = useAuthStore.getState().user;
        set({ items: [], subtotal: 0, deliveryFee: 0, discount: 0, total: 0 });
        if (user) {
          await cartService.clearCart(user.id);
        }
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
