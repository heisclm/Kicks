'use client';
import { useState, useTransition, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const editModalContent = isEditOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-xl p-6 shadow-2xl relative border border-border">
        <h2 className="text-xl font-bold mb-6">Edit Brand</h2>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {error && <div className="mb-4 p-3 bg-red-500/10 text-red-500 text-sm rounded-md border border-red-500/20">{error}</div>}
          <div>
            <Label htmlFor="name" className="mb-1 block">Brand Name</Label>
            <Input id="name" name="name" defaultValue={brand.name} required />
          </div>
          <div>
            <Label htmlFor="description" className="mb-1 block">Description</Label>
            <Textarea id="description" name="description" defaultValue={brand.description} className="min-h-[80px]" />
          </div>
          <div>
            <Label htmlFor="image-edit" className="mb-1 block">Brand Logo</Label>
            <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 hover:border-brand-primary/50 transition-all relative group">
              <input 
                type="file" 
                id="image-edit"
                name="image" 
                accept="image/*" 
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
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
              <div id={`edit-brand-placeholder-${brand.id}`} className={brand.logo_url ? "hidden" : "text-sm text-muted-foreground flex flex-col items-center justify-center gap-2 group-hover:text-foreground transition-colors"}>
                <span className="block font-medium mb-1">Upload New Logo</span>
                Click to browse
              </div>
              <img id={`edit-brand-preview-${brand.id}`} src={brand.logo_url || undefined} alt="Logo Preview" className={brand.logo_url ? "h-16 object-contain mx-auto" : "hidden h-16 object-contain mx-auto"} />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2 pb-2">
            <input type="checkbox" name="is_active" id={`is_active_${brand.id}`} defaultChecked={brand.is_active} className="rounded border-border accent-brand-primary h-4 w-4" />
            <Label htmlFor={`is_active_${brand.id}`} className="font-medium cursor-pointer">Active Brand</Label>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-brand-primary text-white hover:bg-brand-primary-hover min-w-[100px]">{isPending ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </div>
    </div>
  );

  const deleteModalContent = isDeleteOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card p-6 rounded-xl shadow-2xl relative border border-border">
        <h2 className="text-xl font-bold mb-2">Delete Brand</h2>
        <p className="text-sm text-muted-foreground mb-6">Are you sure you want to delete <strong className="text-foreground">{brand.name}</strong>? This action cannot be undone.</p>
        {error && <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-md mb-4">{error}</div>}
        <div className="flex justify-end gap-2 pt-2 border-t border-border mt-2">
          <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isPending}>{isPending ? 'Deleting...' : 'Delete'}</Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={() => setIsEditOpen(true)}>Edit</Button>
        <Button variant="ghost" size="sm" onClick={() => setIsDeleteOpen(true)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">Delete</Button>
      </div>

      {mounted && editModalContent && createPortal(editModalContent, document.body)}
      {mounted && deleteModalContent && createPortal(deleteModalContent, document.body)}
    </>
  );
}
