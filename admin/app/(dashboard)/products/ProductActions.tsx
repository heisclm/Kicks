'use client';
import { useState, useTransition, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Product } from '../../../features/products/product-types';
import { Brand } from '../../../features/brands/brand-repository';
import { Category } from '../../../features/categories/category-repository';
import { updateProductAction, deleteProductAction } from '../../../features/products/product-actions';
import { Loader2 } from 'lucide-react';

export function ProductActions({ product, brands, categories }: { product: Product, brands: Brand[], categories: Category[] }) {
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
    formData.append('id', product.id);
    startTransition(async () => {
      const result = await updateProductAction(formData);
      if (result.success) {
        setIsEditOpen(false);
      } else {
        setError(result.error || 'Failed to update product');
      }
    });
  };

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append('id', product.id);
      const result = await deleteProductAction(formData);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-card p-6 rounded-lg shadow-lg border border-border max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4 text-left">
              {error && <div className="text-sm text-destructive p-3 bg-destructive/10 rounded-md">{error}</div>}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={product.name} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={product.description} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand_id">Brand</Label>
                  <select id="brand_id" name="brand_id" defaultValue={product.brand_id} required className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <option value="">Select Brand</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="category_id">Category</Label>
                  <select id="category_id" name="category_id" defaultValue={product.category_id} required className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="base_price">Price</Label>
                  <Input id="base_price" name="base_price" type="number" step="0.01" defaultValue={product.price} required />
                </div>
                <div>
                  <Label htmlFor="is_active">Status</Label>
                  <select id="is_active" name="is_active" defaultValue={product.is_active ? "true" : "false"} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <option value="true">Active</option>
                    <option value="false">Draft</option>
                  </select>
                </div>
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
            <h2 className="text-lg font-bold mb-2">Delete Product</h2>
            <p className="text-sm text-muted-foreground mb-4">Are you sure you want to delete {product.name}? This action cannot be undone.</p>
            {error && <div className="text-sm text-destructive mb-4 p-3 bg-destructive/10 rounded-md">{error}</div>}
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
