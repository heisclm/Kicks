'use client';
import { Brand } from '../../../../features/brands/brand-repository';
import { Category } from '../../../../features/categories/category-repository';

import Link from 'next/link';
import { ArrowLeft, Upload, X, Plus } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { Select } from '../../../../components/ui/select';
import { useState, useTransition } from 'react';
import { createProductAction } from '../../../../features/products/product-actions';
import { useRouter } from 'next/navigation';

export function ProductForm({ brands, categories }: { brands: Brand[], categories: Category[] }) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['US 9', 'US 10']);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await createProductAction(formData);
      if (result.success) {
        router.push('/products');
      } else {
        setError(result.error || 'Failed to create product');
      }
    });
  };
  const availableSizes = ['US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 12'];

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12 max-w-5xl mx-auto">`n{error && <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-md">{error}</div>}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <Link href="/products" className="p-2 border border-border rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0 mt-1 sm:mt-0">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">Add New Sneaker</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Create a new product listing in your catalog.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <Button variant="outline" className="flex-1 sm:flex-none h-9">
            Save Draft
          </Button>
          <Button className="flex-1 sm:flex-none h-9">
            {isPending ? 'Publishing...' : 'Publish Product'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" placeholder="e.g. Air Jordan 1 Retro High" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" name="description" 
                  placeholder="Describe the sneaker's history, materials, and design..."
                  className="min-h-[120px]" 
                />
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Media</CardTitle>
            </CardHeader>
            <CardContent>
              <label htmlFor="image-upload" className="block border-2 border-dashed border-border rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group relative overflow-hidden">
                <div className="h-12 w-12 rounded-full bg-brand-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="text-brand-primary" size={20} />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (max. 5MB)</p>
                <input 
                  type="file" 
                  id="image-upload" 
                  name="image" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const img = document.getElementById('image-preview') as HTMLImageElement;
                      if (img) img.src = URL.createObjectURL(file);
                      document.getElementById('preview-container')?.classList.remove('hidden');
                    }
                  }}
                />
              </label>
              
              <div id="preview-container" className="hidden mt-4 relative rounded-md overflow-hidden border border-border h-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img id="image-preview" src="" alt="Preview" className="w-full h-full object-cover" />
                <button type="button" className="absolute top-2 right-2 bg-background/80 p-1.5 rounded-full" onClick={() => {
                  (document.getElementById('image-upload') as HTMLInputElement).value = '';
                  document.getElementById('preview-container')?.classList.add('hidden');
                }}>
                  <X size={16} className="text-foreground" />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                    <Input id="price" name="base_price" type="number" step="0.01" required placeholder="0.00" className="pl-7 tabular-nums" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compare-price">Compare at price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                    <Input id="compare-price" type="number" placeholder="0.00" className="pl-7 tabular-nums" />
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="rounded border-border text-brand-primary focus:ring-brand-primary h-4 w-4" />
                  Charge tax on this product
                </label>
              </div>
            </CardContent>
          </Card>
          
          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                  <Input id="sku" placeholder="e.g. AJ1-RETRO-001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode (ISBN, UPC, GTIN, etc.)</Label>
                  <Input id="barcode" placeholder="0123456789012" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Available Quantity</Label>
                  <Input id="quantity" type="number" placeholder="0" className="tabular-nums" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6 mt-6 lg:mt-0">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Product Status</Label>
                <Select id="status" name="is_active">
                  <option className="bg-background text-foreground" value="false">Draft</option>
                  <option className="bg-background text-foreground" value="true">Active</option>
                  <option className="bg-background text-foreground" value="false">Archived</option>
                </Select>
              </div>
              <p className="text-[11px] text-muted-foreground">
                This product will be hidden from all sales channels until published.
              </p>
            </CardContent>
          </Card>

          {/* Organization */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-3 border-b border-border/50">
              <CardTitle className="text-base font-semibold text-foreground">Organization</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Select id="brand" name="brand_id" required>
                  <option className="bg-background text-foreground" value="">Select a brand...</option>
                  {brands.map((b) => (
                    <option key={b.id} className="bg-background text-foreground" value={b.id}>{b.name}</option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select id="category" name="category_id" required>
                  <option className="bg-background text-foreground" value="">Select a category...</option>
                  {categories.map((c) => (
                    <option key={c.id} className="bg-background text-foreground" value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select id="gender" name="gender">
                  <option className="bg-background text-foreground" value="Unisex">Unisex</option>
                  <option className="bg-background text-foreground" value="Men">Men</option>
                  <option className="bg-background text-foreground" value="Women">Women</option>
                  <option className="bg-background text-foreground" value="Kids">Kids</option>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Variants (Sizes) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Available Sizes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map(size => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1.5 text-[11px] font-semibold rounded-md border transition-colors ${
                          isSelected 
                            ? 'bg-brand-primary border-brand-primary text-white shadow-subtle' 
                            : 'bg-transparent border-border text-foreground hover:border-brand-primary/50'
                        }`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
                {selectedSizes.length > 0 && (
                  <p className="text-[11px] text-muted-foreground pt-2 border-t border-border/50">
                    {selectedSizes.length} sizes selected for this inventory.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
