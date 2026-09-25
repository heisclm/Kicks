'use client';
import { Brand } from '../../../../features/brands/brand-repository';
import { Category } from '../../../../features/categories/category-repository';

import Link from 'next/link';
import { ArrowLeft, Upload, X, Tag, Info, Image as ImageIcon, DollarSign, Package, Settings, Sparkles, Loader2 } from 'lucide-react';
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
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

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

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const availableSizes = [
    'US 7', 'US 7.5', 'US 8', 'US 8.5', 'US 9', 'US 9.5', 'US 10', 'US 10.5', 'US 11', 'US 11.5', 'US 12', 'US 13', 'US 14'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12 max-w-5xl mx-auto">
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg flex items-center gap-3 shadow-sm">
          <Info size={18} />
          {error}
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Link href="/products" className="p-2.5 border border-border rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground shrink-0 shadow-sm bg-card">
            <ArrowLeft size={20} strokeWidth={2.5} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Add New Sneaker</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold uppercase tracking-wider">New</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Create a stunning new product listing in your catalog.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none h-10 px-6 rounded-full font-medium" type="button" disabled={isPending}>
            Save as Draft
          </Button>
          <Button className="flex-1 sm:flex-none h-10 px-6 rounded-full font-medium shadow-md hover:shadow-lg transition-all" disabled={isPending}>
            {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</> : 'Publish Product'}
            {!isPending && <Sparkles size={16} className="ml-2" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Details) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* General Information */}
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Info className="text-brand-primary" size={18} />
                <CardTitle className="text-base font-semibold">General Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product Name</Label>
                <Input id="name" name="name" required placeholder="e.g. Air Jordan 1 Retro High OG" className="h-11 bg-background text-base" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  required 
                  placeholder="Describe the sneaker's history, materials, and design features..." 
                  className="min-h-[140px] bg-background resize-y text-base p-3" 
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Media */}
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="text-brand-primary" size={18} />
                <CardTitle className="text-base font-semibold">Media & Gallery</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <label htmlFor="image-upload" className="block border-2 border-dashed border-border/60 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-muted/10 hover:bg-muted/30 hover:border-brand-primary/50 transition-all cursor-pointer group relative overflow-hidden">
                <div className="h-16 w-16 rounded-full bg-brand-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Upload className="text-brand-primary" size={24} />
                </div>
                <p className="text-base font-semibold text-foreground mb-1">Click to upload image</p>
                <p className="text-sm text-muted-foreground">or drag and drop here</p>
                <p className="text-[11px] text-muted-foreground mt-4 uppercase tracking-wider font-medium">SVG, PNG, JPG or GIF (max. 5MB)</p>
                <input 
                  id="image-upload" 
                  name="image" 
                  type="file" 
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const preview = document.getElementById('image-preview') as HTMLImageElement;
                        const container = document.getElementById('preview-container');
                        if (preview && container && ev.target?.result) {
                          preview.src = ev.target.result as string;
                          container.classList.remove('hidden');
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              
              <div id="preview-container" className="hidden mt-6 relative rounded-xl overflow-hidden border border-border h-64 shadow-inner">
                <img id="image-preview" alt="Preview" className="w-full h-full object-cover" />
                <button type="button" className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-destructive hover:text-white transition-colors" onClick={() => {
                  const input = document.getElementById('image-upload') as HTMLInputElement;
                  const container = document.getElementById('preview-container');
                  if (input) input.value = '';
                  if (container) container.classList.add('hidden');
                }}>
                  <X size={16} />
                </button>
              </div>
            </CardContent>
          </Card>
          
          {/* Pricing */}
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="text-brand-primary" size={18} />
                <CardTitle className="text-base font-semibold">Pricing</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                    <Input id="price" name="base_price" type="number" step="0.01" required placeholder="0.00" className="pl-8 h-11 bg-background text-base tabular-nums" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compare-price" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Compare at price</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                    <Input id="compare-price" type="number" placeholder="0.00" className="pl-8 h-11 bg-background text-base tabular-nums line-through text-muted-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Inventory */}
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Package className="text-brand-primary" size={18} />
                <CardTitle className="text-base font-semibold">Inventory Tracking</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">SKU (Stock Keeping Unit)</Label>
                  <Input id="sku" placeholder="e.g. AJ1-RETRO-001" className="h-11 bg-background uppercase placeholder:normal-case font-mono text-sm" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Barcode (UPC, GTIN)</Label>
                  <Input id="barcode" placeholder="0123456789012" className="h-11 bg-background font-mono text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Available Quantity</Label>
                  <Input id="quantity" type="number" placeholder="0" className="h-11 bg-background text-base tabular-nums" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          
          {/* Status */}
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Settings className="text-brand-primary" size={18} />
                <CardTitle className="text-base font-semibold">Visibility Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <Label htmlFor="status" className="sr-only">Product Status</Label>
                <Select id="status" name="is_active" className="h-11 text-base font-medium">
                  <option className="bg-background text-foreground" value="false">?? Draft (Hidden)</option>
                  <option className="bg-background text-foreground" value="true">?? Active (Published)</option>
                  <option className="bg-background text-foreground" value="false">? Archived</option>
                </Select>
              </div>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Draft products are hidden from your sales channels until you manually publish them.
              </p>
            </CardContent>
          </Card>

          {/* Organization */}
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Tag className="text-brand-primary" size={18} />
                <CardTitle className="text-base font-semibold">Organization</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Brand</Label>
                <Select id="brand" name="brand_id" required className="h-11">
                  <option className="bg-background text-muted-foreground" value="">Select a brand...</option>
                  {brands.map((b) => (
                    <option key={b.id} className="bg-background text-foreground" value={b.id}>{b.name}</option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</Label>
                <Select id="category" name="category_id" required className="h-11">
                  <option className="bg-background text-muted-foreground" value="">Select a category...</option>
                  {categories.map((c) => (
                    <option key={c.id} className="bg-background text-foreground" value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gender</Label>
                <Select id="gender" name="gender" className="h-11">
                  <option className="bg-background text-foreground" value="Unisex">Unisex</option>
                  <option className="bg-background text-foreground" value="Men">Men</option>
                  <option className="bg-background text-foreground" value="Women">Women</option>
                  <option className="bg-background text-foreground" value="Kids">Kids</option>
                </Select>
              </div>

              <div className="space-y-3 pt-4 border-t border-border/50">
                <Label htmlFor="tags" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags</Label>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <div key={tag} className="flex items-center gap-1.5 bg-muted/50 border border-border px-3 py-1.5 rounded-full text-sm font-medium">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-muted-foreground hover:text-destructive transition-colors bg-background rounded-full p-0.5">
                          <X size={12} strokeWidth={3} />
                        </button>
                        <input type="hidden" name="tags" value={tag} />
                      </div>
                    ))}
                  </div>
                  <Input 
                    id="tags" 
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={addTag}
                    placeholder="Type a tag and press Enter..." 
                    className="h-11 bg-background"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Variants (Sizes) */}
          <Card className="border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-semibold">Shoe Sizes</CardTitle>
                </div>
                {selectedSizes.length > 0 && (
                  <span className="bg-brand-primary/10 text-brand-primary text-xs font-bold px-2 py-0.5 rounded-full">
                    {selectedSizes.length} Selected
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2.5">
                  {availableSizes.map(size => {
                    const isSelected = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${
                          isSelected 
                            ? 'bg-brand-primary border-brand-primary text-white shadow-md' 
                            : 'bg-background border-border text-foreground hover:border-brand-primary/50 hover:bg-muted/30'
                        }`}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
