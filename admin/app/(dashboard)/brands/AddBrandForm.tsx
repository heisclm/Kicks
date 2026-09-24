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
    <Card className="p-4 border-brand-primary/50 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Add New Brand</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
          <X size={16} />
        </Button>
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-500 text-sm rounded">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 space-y-2">
            <Input name="name" placeholder="Brand Name (e.g. Nike)" required autoFocus />
            <Input name="description" placeholder="Description (optional)" />
          </div>
          <div className="flex-1">
            <div className="border border-dashed border-border rounded-md p-4 text-center cursor-pointer hover:bg-muted/30 transition-colors relative">
              <input 
                type="file" 
                name="image" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer"
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
              <div id="new-brand-placeholder" className="text-xs text-muted-foreground pt-3">
                <span className="block font-medium text-foreground mb-1">Brand Logo</span>
                Click to upload
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img id="new-brand-preview" src="" alt="Logo Preview" className="hidden h-12 object-contain mx-auto" />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="bg-brand-primary text-white hover:bg-brand-primary-hover">
            {isSubmitting ? 'Saving...' : 'Save Brand'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
