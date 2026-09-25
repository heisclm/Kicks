'use client';
import { useState, useTransition, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Category } from '../../../features/categories/category-repository';
import { updateCategoryAction, deleteCategoryAction } from '../../../features/categories/category-actions';
import { Loader2 } from 'lucide-react';
import { Select } from '../../../components/ui/select'; // Just using native select wrapper since we don't have Radix components

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
        <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(true)}>Edit</Button>
        <Button variant="ghost" size="sm" onClick={() => setIsDeleteOpen(true)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">Delete</Button>
      </div>

      {isEditOpen && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card p-6 rounded-lg shadow-lg border border-border">
            <h2 className="text-lg font-bold mb-4">Edit Category</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {error && <div className="text-sm text-destructive">{error}</div>}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={category.name} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={category.description} />
              </div>
              <div>
                <Label htmlFor="parent_id">Parent Category (Optional)</Label>
                <select id="parent_id" name="parent_id" defaultValue={category.parent_id || ""} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="">None</option>
                  {allCategories.filter(c => c.id !== category.id).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)} disabled={isPending}>Cancel</Button>
                <Button type="submit" disabled={isPending}>{isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save'}</Button>
              </div>
            </form>
          </div>
        </div>
      , document.body)}

      {isDeleteOpen && mounted && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card p-6 rounded-lg shadow-lg border border-border">
            <h2 className="text-lg font-bold mb-2">Delete Category</h2>
            <p className="text-sm text-muted-foreground mb-4">Are you sure you want to delete {category.name}? This action cannot be undone.</p>
            {error && <div className="text-sm text-destructive mb-4">{error}</div>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>{isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : 'Delete'}</Button>
            </div>
          </div>
        </div>
      , document.body)}
    </>
  );
}
