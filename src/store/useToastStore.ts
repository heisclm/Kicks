import { create } from 'zustand';

interface ToastState {
  visible: boolean;
  title: string;
  subtitle?: string;
  type: 'success' | 'info' | 'error';
  showToast: (title: string, subtitle?: string, type?: 'success' | 'info' | 'error') => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  title: '',
  subtitle: undefined,
  type: 'success',

  showToast: (title, subtitle, type = 'success') => {
    set({ visible: true, title, subtitle, type });
    // Auto hide after 3 seconds
    setTimeout(() => {
      set({ visible: false });
    }, 3000);
  },

  hideToast: () => set({ visible: false }),
}));
