'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';
import { createBrandAction } from '../../../features/brands/brand-actions';

export function AddBrandForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    
    const result = await createBrandAction(formData);
    
    if (result.success) {
      setIsOpen(false);
    } else {
      setError(result.error || 'Failed to create brand');
    }
    
    setIsSubmitting(false);
  }

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="h-10 gap-2 bg-brand-primary text-white hover:bg-brand-primary-hover border-transparent w-full sm:w-auto"
      >
        <Plus size={16} />
        Add Brand
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-xl p-6 shadow-2xl relative border border-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add New Brand</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <X size={16} />
          </Button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 text-red-500 text-sm rounded-md border border-red-500/20">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Brand Name</label>
            <Input name="name" placeholder="e.g. Nike" required autoFocus />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Description</label>
            <Input name="description" placeholder="Optional description" />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Brand Logo</label>
            <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 hover:border-brand-primary/50 transition-all relative group">
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const img = document.getElementById('new-brand-preview') as HTMLImageElement;
                    if (img) img.src = URL.createObjectURL(file);
                    document.getElementById('new-brand-placeholder')?.classList.add('hidden');
                    img.classList.remove('hidden');
                  }
                }}
              />
              <div id="new-brand-placeholder" className="text-sm text-muted-foreground flex flex-col items-center justify-center gap-2 group-hover:text-foreground transition-colors">
                <div className="p-3 rounded-full bg-muted group-hover:bg-brand-primary/10 group-hover:text-brand-primary">
                  <Plus size={24} />
                </div>
                <span>Click to upload logo</span>
              </div>
              <img id="new-brand-preview" alt="Logo Preview" className="hidden h-16 object-contain mx-auto" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="text-sm text-muted-foreground">Will be active immediately</label>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-brand-primary text-white hover:bg-brand-primary-hover min-w-[100px]">
                {isSubmitting ? 'Saving...' : 'Save Brand'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
