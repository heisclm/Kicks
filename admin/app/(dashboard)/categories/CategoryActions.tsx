'use client';
import { useState, useTransition, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, Edit3, Trash2, X, AlertTriangle, Info, Tag } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Category } from '../../../features/categories/category-repository';
import { updateCategoryAction, deleteCategoryAction } from '../../../features/categories/category-actions';

export function CategoryActions({ category, allCategories }: { category: Category, allCategories: Category[] }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append('id', category.id);
    startTransition(async () => {
      const result = await updateCategoryAction(formData);
      if (result.success) {
        setIsEditOpen(false);
      } else {
        setError(result.error || 'Failed to update');
      }
    });
  };

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append('id', category.id);
      const result = await deleteCategoryAction(formData);
      if (result.success) {
        setIsDeleteOpen(false);
      } else {
        setError(result.error || 'Failed to delete');
      }
    });
  };

  return (
    <>
      <div className="flex gap-2 justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsEditOpen(true)}
          className="h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <Edit3 size={16} />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsDeleteOpen(true)} 
          className="h-8 px-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 size={16} />
        </Button>
      </div>

      {isEditOpen && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <Tag className="text-brand-primary" size={20} />
                <h2 className="text-lg font-bold text-foreground">Edit Category</h2>
              </div>
              <button 
                onClick={() => setIsEditOpen(false)} 
                disabled={isPending}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
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
                  defaultValue={category.name} 
                  required 
                  className="h-11 bg-background"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  defaultValue={category.description || ''} 
                  className="resize-none h-24 bg-background"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="parent_id" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Parent Category (Optional)</Label>
                <select 
                  id="parent_id" 
                  name="parent_id" 
                  defaultValue={category.parent_id || ""} 
                  className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">None</option>
                  {allCategories.filter(c => c.id !== category.id).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsEditOpen(false)} 
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
                  {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}

      {isDeleteOpen && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="text-destructive w-8 h-8" />
              </div>
              
              <h2 className="text-xl font-bold text-foreground">Delete Category</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Are you sure you want to delete <span className="font-semibold text-foreground">"{category.name}"</span>? 
                This action cannot be undone and may affect products linked to this category.
              </p>
              
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg flex items-center justify-center gap-2 mt-4">
                  <Info size={16} />
                  {error}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 p-6 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDeleteOpen(false)} 
                disabled={isPending}
                className="flex-1 rounded-full h-11"
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete} 
                disabled={isPending}
                className="flex-1 rounded-full h-11 shadow-md"
              >
                {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : 'Yes, Delete'}
              </Button>
            </div>
            
          </div>
        </div>
      , document.body)}
    </>
  );
}
