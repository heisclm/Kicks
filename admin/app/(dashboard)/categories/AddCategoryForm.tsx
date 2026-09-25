'use client';
import { useState, useTransition, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, Loader2, Tag, Info } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { createCategoryAction } from '../../../features/categories/category-actions';

export function AddCategoryForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createCategoryAction(formData);
      if (result.success) {
        setIsOpen(false);
      } else {
        setError(result.error || 'Failed to create category');
      }
    });
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="h-10 gap-2 bg-brand-primary text-white hover:bg-brand-primary-hover border-transparent w-full sm:w-auto rounded-full px-6 shadow-md"
      >
        <Plus size={16} />
        Add Category
      </Button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <Tag className="text-brand-primary" size={20} />
                <h2 className="text-lg font-bold text-foreground">Add New Category</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                disabled={isPending}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg flex items-center gap-2">
                  <Info size={16} />
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category Name</Label>
                <Input 
                  id="name"
                  name="name" 
                  placeholder="e.g. Running Shoes" 
                  required 
                  autoFocus
                  className="h-11 bg-background"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description (Optional)</Label>
                <Textarea 
                  id="description"
                  name="description" 
                  placeholder="Briefly describe this category..." 
                  className="resize-none h-24 bg-background"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="rounded-full px-6"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-brand-primary text-white hover:bg-brand-primary-hover rounded-full px-6 shadow-md"
                >
                  {isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    'Save Category'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}
    </>
  );
}
