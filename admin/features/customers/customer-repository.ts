import { createClient } from '../../utils/supabase/server';
import { CustomerSummary, CustomerFilters } from './customer-types';

export class CustomerRepository {
  static async getCustomers(filters?: CustomerFilters): Promise<CustomerSummary[]> {
    const supabase = await createClient();

    const { data, error } = await supabase.rpc('admin_get_customers');

    if (error) {
      console.error('Error fetching customers:', error.message);
      return [];
    }

    let customers = data as CustomerSummary[];

    if (filters?.search) {
      const s = filters.search.toLowerCase();
      customers = customers.filter(c => 
        (c.first_name && c.first_name.toLowerCase().includes(s)) ||
        (c.last_name && c.last_name.toLowerCase().includes(s)) ||
        (c.email && c.email.toLowerCase().includes(s))
      );
    }

    return customers;
  }
}
