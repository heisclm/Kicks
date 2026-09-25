import { BrandActions } from './BrandActions';
import { Card } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Search, MoreHorizontal, TrendingUp } from "lucide-react";
import { BrandRepository, Brand } from "../../../features/brands/brand-repository";
import { AddBrandForm } from "./AddBrandForm";

export default async function BrandsPage() {
  const brands = await BrandRepository.getBrands();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0ms', opacity: 0 }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Brands</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage product brands and partnerships.</p>
        </div>
        <AddBrandForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
        <Card className="p-5">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Active Brands</div>
          <div className="text-3xl font-bold tabular-nums">{brands.length}</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Top Performer</div>
          <div className="text-3xl font-bold">{brands.length > 0 ? brands[0].name : '-'}</div>
          <div className="text-xs text-emerald-500 mt-2 font-medium flex items-center gap-1"><TrendingUp size={12}/> Based on inventory</div>
        </Card>
        <Card className="p-5">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Products</div>
          <div className="text-3xl font-bold tabular-nums">-</div>
        </Card>
      </div>

      <Card className="animate-fade-in-up overflow-hidden" style={{ animationDelay: '200ms', opacity: 0 }}>
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search brands..." className="pl-9 h-10 bg-muted/40 border-transparent focus:bg-card" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand Name</TableHead>
                <TableHead className="text-right">Products</TableHead>
                <TableHead className="text-right">Description</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No brands found. Add your first brand above.
                  </TableCell>
                </TableRow>
              ) : (
                brands.map((brand: Brand, index: number) => (
                  <TableRow key={brand.id} className="group cursor-pointer hover:bg-muted/30 transition-colors animate-fade-in-up" style={{ animationDelay: `${300 + (index * 50)}ms`, opacity: 0 }}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {brand.logo_url ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={brand.logo_url} alt={brand.name} className="h-10 w-10 rounded-xl object-contain border border-border bg-white shrink-0 p-1" />
                        ) : (
                          <div className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center font-bold text-lg text-foreground shrink-0 uppercase">
                            {brand.name[0]}
                          </div>
                        )}
                        <span className="font-medium text-sm text-foreground">{brand.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">-</TableCell>
                    <TableCell className="text-right tabular-nums font-medium text-foreground truncate max-w-[200px]">
                      {brand.description || '-'}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${brand.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                        {brand.is_active ? 'Active' : 'Draft'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity"><BrandActions brand={brand} /></div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
