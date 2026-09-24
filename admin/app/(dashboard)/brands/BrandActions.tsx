'use client';
import { useState, useTransition } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Brand } from '../../../features/brands/brand-repository';
import { updateBrandAction, deleteBrandAction } from '../../../features/brands/brand-actions';

export function BrandActions({ brand }: { brand: Brand }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append('id', brand.id);
    startTransition(async () => {
      const result = await updateBrandAction(formData);
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
      formData.append('id', brand.id);
      const result = await deleteBrandAction(formData);
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

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card p-6 rounded-lg shadow-lg border border-border">
            <h2 className="text-lg font-bold mb-4">Edit Brand</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {error && <div className="text-sm text-destructive">{error}</div>}
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={brand.name} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={brand.description} />
              </div>
              <div>
                <Label htmlFor="image-edit">Brand Logo</Label>
                <div className="mt-1 border border-dashed border-border rounded-md p-4 text-center cursor-pointer hover:bg-muted/30 transition-colors relative">
                  <input 
                    type="file" 
                    id="image-edit"
                    name="image" 
                    accept="image/*" 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const img = document.getElementById(`edit-brand-preview-${brand.id}`) as HTMLImageElement;
                        if (img) img.src = URL.createObjectURL(file);
                        document.getElementById(`edit-brand-placeholder-${brand.id}`)?.classList.add('hidden');
                        img.classList.remove('hidden');
                      }
                    }}
                  />
                  <div id={`edit-brand-placeholder-${brand.id}`} className={brand.logo_url ? "hidden" : "text-xs text-muted-foreground pt-2"}>
                    <span className="block font-medium text-foreground mb-1">Upload New Logo</span>
                    Click to browse
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img id={`edit-brand-preview-${brand.id}`} src={brand.logo_url || ""} alt="Logo Preview" className={brand.logo_url ? "h-12 object-contain mx-auto" : "hidden h-12 object-contain mx-auto"} />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isPending}>{isPending ? 'Saving...' : 'Save'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card p-6 rounded-lg shadow-lg border border-border">
            <h2 className="text-lg font-bold mb-2">Delete Brand</h2>
            <p className="text-sm text-muted-foreground mb-4">Are you sure you want to delete {brand.name}? This action cannot be undone.</p>
            {error && <div className="text-sm text-destructive mb-4">{error}</div>}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>{isPending ? 'Deleting...' : 'Delete'}</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
