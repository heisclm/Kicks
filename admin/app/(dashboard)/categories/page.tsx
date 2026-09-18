import { CategoryActions } from './CategoryActions';
import { Card } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Search, MoreHorizontal } from "lucide-react";
import { CategoryRepository, Category } from "../../../features/categories/category-repository";
import { AddCategoryForm } from "./AddCategoryForm";

export default async function CategoriesPage() {
  const categories = await CategoryRepository.getCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0ms', opacity: 0 }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Organize your products into collections.</p>
        </div>
        <AddCategoryForm />
      </div>

      <Card className="animate-fade-in-up overflow-hidden" style={{ animationDelay: '100ms', opacity: 0 }}>
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search categories..." className="pl-9 h-10 bg-muted/40 border-transparent focus:bg-card" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead className="text-right">Products</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No categories found. Add your first category above.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((cat: Category, index: number) => (
                  <TableRow key={cat.id} className="group cursor-pointer hover:bg-muted/30 transition-colors animate-fade-in-up" style={{ animationDelay: `${200 + (index * 50)}ms`, opacity: 0 }}>
                    <TableCell className="font-medium text-sm text-foreground">{cat.name}</TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">-</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${cat.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-muted text-muted-foreground'}`}>
                        {cat.is_active ? 'Active' : 'Draft'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity"><CategoryActions category={cat} allCategories={categories} /></div>
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
