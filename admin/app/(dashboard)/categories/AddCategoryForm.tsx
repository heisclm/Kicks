'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';
import { createCategoryAction } from '../../../features/categories/category-actions';

export function AddCategoryForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    
    const result = await createCategoryAction(formData);
    
    if (result.success) {
      setIsOpen(false);
    } else {
      setError(result.error || 'Failed to create category');
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
        Add Category
      </Button>
    );
  }

  return (
    <Card className="p-4 border-brand-primary/50 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Add New Category</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
          <X size={16} />
        </Button>
      </div>
      
      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-500 text-sm rounded">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input 
            name="name" 
            placeholder="Category Name (e.g. Running)" 
            required 
            autoFocus
          />
        </div>
        <div className="flex-1">
          <Input 
            name="description" 
            placeholder="Description (optional)" 
          />
        </div>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-brand-primary text-white hover:bg-brand-primary-hover"
        >
          {isSubmitting ? 'Saving...' : 'Save Category'}
        </Button>
      </form>
    </Card>
  );
}
