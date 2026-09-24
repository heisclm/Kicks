const fs = require('fs');
let file = 'mobile/src/store/useAuthStore.ts';
let content = fs.readFileSync(file, 'utf8');

// 1. Add updateProfile to AuthState interface
content = content.replace(/signOut: \(\) => Promise<void>;/, "signOut: () => Promise<void>;\n  updateProfile: (updates: Partial<Profile>) => Promise<boolean>;");

// 2. Add updateProfile implementation
const oldSignOut = `  signOut: async () => {`;
const newMethod = `  updateProfile: async (updates) => {
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

  signOut: async () => {`;

content = content.replace(oldSignOut, newMethod);

fs.writeFileSync(file, content, 'utf8');
