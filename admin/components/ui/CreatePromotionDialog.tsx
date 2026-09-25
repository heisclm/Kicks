"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { Plus } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Select } from "./select";
import { createPromotionAction } from "../../features/promotions/promotion-actions";

export function CreatePromotionDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function onSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await createPromotionAction(formData);
      if (result.success) {
        setIsOpen(false);
      } else {
        setError(result.error || "Failed to create promotion");
      }
    });
  }

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="h-10 gap-2 bg-brand-primary text-white hover:bg-brand-primary-hover border-transparent w-full sm:w-auto"
      >
        <Plus size={16} />
        Create Promotion
      </Button>
    );
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card w-full max-w-md rounded-lg p-6 shadow-xl relative">
        <h2 className="text-xl font-bold mb-4">Create Promotion</h2>
        {error && <div className="p-3 mb-4 text-sm text-red-500 bg-red-500/10 rounded-md">{error}</div>}
        
        <form action={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Code (e.g. SUMMER20)</label>
            <Input name="code" required minLength={3} className="mt-1" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Discount Type</label>
              <Select name="discount_type" required className="mt-1">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Value</label>
              <Input name="discount_value" type="number" step="0.01" required min={0.01} className="mt-1" />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Min Order Value (Optional)</label>
            <Input name="min_order_value" type="number" step="0.01" defaultValue={0} className="mt-1" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Start Date (Optional)</label>
              <Input name="start_date" type="datetime-local" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">End Date (Optional)</label>
              <Input name="end_date" type="datetime-local" className="mt-1" />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" name="is_active" id="is_active" defaultChecked className="rounded border-border" />
            <label htmlFor="is_active" className="text-sm font-medium">Active Immediately</label>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
