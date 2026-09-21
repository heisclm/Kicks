'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../utils/supabase/client';
import { toast } from 'sonner';

export function useRealtimeOrders() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('realtime:orders')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('New order received!', payload);
          toast.success('New Order Received!', {
            description: `Order #${payload.new.id.substring(0, 8)} was just placed.`,
            action: {
              label: 'View',
              onClick: () => router.push('/orders'),
            },
          });
          // Refresh the current route to fetch new data
          router.refresh();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to realtime orders');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);
}
