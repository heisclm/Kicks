'use client';
import { useState, useTransition } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { adjustInventoryAction } from '../../features/inventory/inventory-actions';
import { InventoryItem } from '../../features/inventory/inventory-types';
import { Textarea } from '../ui/textarea';

export function StockAdjustmentDialog({ item, onClose }: { item: InventoryItem, onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [adjustment, setAdjustment] = useState<number>(0);

  const handleAdjustmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setAdjustment(isNaN(val) ? 0 : val);
  };

  const newStock = item.stock_quantity + adjustment;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append('variant_id', item.variant_id);
    
    startTransition(async () => {
      const result = await adjustInventoryAction(formData);
      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Failed to adjust stock');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-card p-6 rounded-lg shadow-lg border border-border">
        <h2 className="text-lg font-bold mb-4">Adjust Stock</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Adjusting inventory for {item.product_name} - {item.color_name} (Size {item.size})
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm text-destructive p-3 bg-destructive/10 rounded-md">{error}</div>}
          
          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div className="bg-muted p-3 rounded-md">
              <div className="text-xs text-muted-foreground uppercase mb-1">Current</div>
              <div className="text-xl font-medium">{item.stock_quantity}</div>
            </div>
            <div className="p-3 flex items-center justify-center">
              <div className="text-xl text-muted-foreground">?</div>
            </div>
            <div className={`p-3 rounded-md border ${newStock < 0 ? 'bg-destructive/10 border-destructive text-destructive' : 'bg-emerald-100 border-emerald-500 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'}`}>
              <div className="text-xs uppercase mb-1 opacity-80">New</div>
              <div className="text-xl font-bold">{newStock}</div>
            </div>
          </div>

          <div>
            <Label htmlFor="quantity_change">Adjustment Quantity (+/-)</Label>
            <Input 
              id="quantity_change" 
              name="quantity_change" 
              type="number" 
              value={adjustment || ''} 
              onChange={handleAdjustmentChange} 
              required 
            />
          </div>

          <div>
            <Label htmlFor="reason">Reason</Label>
            <select id="reason" name="reason" required className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <option value="">Select reason</option>
              <option value="New shipment">New shipment</option>
              <option value="Restock">Restock</option>
              <option value="Damaged">Damaged</option>
              <option value="Lost">Lost</option>
              <option value="Returned">Returned</option>
              <option value="Manual correction">Manual correction</option>
              <option value="Inventory count">Inventory count</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <Label htmlFor="note">Optional Note</Label>
            <Textarea id="note" name="note" rows={2} />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>Cancel</Button>
            <Button type="submit" disabled={isPending || newStock < 0 || adjustment === 0}>
              {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adjusting...</> : 'Adjust Stock'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
