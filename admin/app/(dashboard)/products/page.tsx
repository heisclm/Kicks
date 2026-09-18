import { BrandRepository } from '../../../features/brands/brand-repository';
import { CategoryRepository } from '../../../features/categories/category-repository';
import { ProductActions } from './ProductActions';
import { Plus, Search, Filter, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductRepository } from '../../../features/products/product-repository';
import { Product, ProductStatus } from '../../../features/products/product-types';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../../components/ui/table';

function getStatusBadge(status: ProductStatus) {
  switch (status) {
    case 'IN_STOCK':
      return <Badge variant="success">In Stock</Badge>;
    case 'LOW_STOCK':
      return <Badge variant="warning">Low Stock</Badge>;
    case 'OUT_OF_STOCK':
      return <Badge variant="destructive">Out of Stock</Badge>;
    case 'DRAFT':
      return <Badge variant="secondary">Draft</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default async function ProductsPage() {
  const products = await ProductRepository.getProducts();
  const brands = await BrandRepository.getBrands();
  const categories = await CategoryRepository.getCategories();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your sneaker catalog and inventory.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="hidden sm:flex h-8 text-xs">
            Export
          </Button>
          <Link href="/products/new">
            <Button className="h-8 gap-1.5 text-xs">
              <Plus size={14} />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-3 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3 justify-between bg-card">
          <div className="relative w-full max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="block w-full pl-8 pr-3 py-1.5 border border-border rounded-md text-xs bg-muted/50 placeholder-muted-foreground focus:outline-none focus:bg-card focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
              placeholder="Search products..."
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-foreground">
              <Filter size={12} />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-foreground">
              Status
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <div className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors">
                  Product Details
                  <ArrowUpDown size={12} />
                </div>
              </TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow 
                key={product.id} 
                className="group cursor-pointer animate-fade-in-up hover:bg-muted/30 transition-colors"
                style={{ animationDelay: `${index * 50}ms`, opacity: 0 }}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 relative rounded-md overflow-hidden bg-muted">
                      <Image 
                        src={product.image} 
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-foreground">{product.name}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{product.brand}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">SKU-{product.id.slice(0, 5)}</TableCell>
                <TableCell>
                  {getStatusBadge(product.status)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5 w-24">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{product.stock}</span>
                      <span className="text-[10px] text-muted-foreground">in stock</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${product.stock > 50 ? "bg-emerald-500" : product.stock > 10 ? "bg-amber-500" : "bg-rose-500"}`}
                        style={{ width: `${Math.min(100, (product.stock / 100) * 100)}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums text-foreground">
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity"><ProductActions product={product} brands={brands} categories={categories} /></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="p-3 border-t border-border bg-card flex items-center justify-between text-xs text-muted-foreground">
          <div>
            Showing <span className="font-medium text-foreground tabular-nums">1</span> to <span className="font-medium text-foreground tabular-nums">{products.length}</span> of <span className="font-medium text-foreground tabular-nums">{products.length}</span> results
          </div>
          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" disabled className="h-7 text-[11px]">Previous</Button>
            <Button variant="outline" size="sm" disabled className="h-7 text-[11px]">Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
