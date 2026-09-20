export interface StoreSettings {
  store_name: string;
  contact_email: string;
  store_address: string;
  default_currency: string;
  timezone: string;
}

export interface StoreSettingRow {
  key: string;
  value: string;
}
