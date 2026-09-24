import { supabase } from '../api/supabase';
import { Address } from '../store/useCheckoutStore';
import { useAuthStore } from '../store/useAuthStore';

class AddressService {
  async getAddress(userId: string): Promise<Address | null> {
    
    const { data: address, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('profile_id', userId)
      .eq('is_default', true)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching address:', error);
      return null;
    }

    if (!address) {
      // Try getting the first address if no default is found
      const { data: firstAddress } = await supabase
        .from('addresses')
        .select('*')
        .eq('profile_id', userId)
        .limit(1)
        .maybeSingle();
        
      if (!firstAddress) return null;
      return this.mapToLocalAddress(firstAddress);
    }

    return this.mapToLocalAddress(address);
  }

  async saveAddress(userId: string, address: Address): Promise<boolean> {
    
    // Check if an address already exists to potentially upsert or just insert
    const { data: existing } = await supabase
      .from('addresses')
      .select('id')
      .eq('profile_id', userId)
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from('addresses')
        .update({
          street: address.street,
          city: address.city,
          zip: address.zipCode,
          state: 'N/A', // State is not collected in the UI currently
          is_default: true,
        })
        .eq('id', existing.id);
        
      return !error;
    } else {
      const { error } = await supabase
        .from('addresses')
        .insert({
          profile_id: userId,
          street: address.street,
          city: address.city,
          zip: address.zipCode,
          state: 'N/A',
          is_default: true,
        });

      return !error;
    }
  }

  private mapToLocalAddress(dbAddress: any): Address {
    const authState = useAuthStore.getState();
    const profile = authState.profile;
    const user = authState.user;
    
    let fullName = '';
    if (profile?.first_name || profile?.last_name) {
      fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    }

    return {
      fullName,
      email: user?.email || '',
      street: dbAddress.street,
      city: dbAddress.city,
      zipCode: dbAddress.zip,
    };
  }
}

export const addressService = new AddressService();
