import { Download, Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { InventoryRepository } from "../../../features/inventory/inventory-repository";
import { InventoryTable } from "../../../components/inventory/InventoryTable";

export default async function InventoryPage() {
  const inventory = await InventoryRepository.getInventory();

  // Summary metrics
  const totalVariants = inventory.length;
  const inStockVariants = inventory.filter(i => i.status === 'IN_STOCK').length;
  const lowStockVariants = inventory.filter(i => i.status === 'LOW_STOCK').length;
  const outOfStockVariants = inventory.filter(i => i.status === 'OUT_OF_STOCK').length;
  const totalUnits = inventory.reduce((sum, item) => sum + item.stock_quantity, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0ms', opacity: 0 }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventory</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage sneaker stock, variants, and availability across the catalog.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none h-10 gap-2">
            <Download size={16} />
            Export
          </Button>
          <Button className="flex-1 sm:flex-none h-10 gap-2 bg-foreground text-background hover:bg-foreground/90">
            <Plus size={16} />
            Receive Stock
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
          <div className="text-sm text-muted-foreground mb-1">Total Units</div>
          <div className="text-2xl font-bold tabular-nums">{totalUnits}</div>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
          <div className="text-sm text-muted-foreground mb-1">In Stock (SKUs)</div>
          <div className="text-2xl font-bold tabular-nums text-success">{inStockVariants}</div>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
          <div className="text-sm text-muted-foreground mb-1">Low Stock (SKUs)</div>
          <div className="text-2xl font-bold tabular-nums text-warning">{lowStockVariants}</div>
        </div>
        <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
          <div className="text-sm text-muted-foreground mb-1">Out of Stock (SKUs)</div>
          <div className="text-2xl font-bold tabular-nums text-destructive">{outOfStockVariants}</div>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms', opacity: 0 }}>
        <InventoryTable initialData={inventory} />
      </div>
    </div>
  );
}
