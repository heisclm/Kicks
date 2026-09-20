import { createClient } from '../../utils/supabase/server';
import { StoreSettings, StoreSettingRow } from './settings-types';

export class SettingsRepository {
  static async getSettings(): Promise<StoreSettings> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('store_settings')
      .select('key, value');

    if (error) {
      console.error('Error fetching settings:', error);
      return {
        store_name: 'KICKS Official',
        contact_email: 'support@kicks.com',
        store_address: '123 Sneaker Avenue, NY 10012',
        default_currency: 'USD',
        timezone: 'EST'
      };
    }

    const settingsMap = (data as StoreSettingRow[]).reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {} as Record<string, string>);

    return {
      store_name: settingsMap.store_name || 'KICKS Official',
      contact_email: settingsMap.contact_email || 'support@kicks.com',
      store_address: settingsMap.store_address || '',
      default_currency: settingsMap.default_currency || 'USD',
      timezone: settingsMap.timezone || 'EST',
    };
  }

  static async updateSettings(settings: StoreSettings): Promise<void> {
    const supabase = await createClient();
    
    // We update row by row since it's a key-value store
    const entries = Object.entries(settings);
    
    for (const [key, value] of entries) {
      const { error } = await supabase
        .from('store_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key);
        
      if (error) throw new Error(`Failed to update ${key}: ${error.message}`);
    }
  }
}
