import { Download, ArrowLeft } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { InventoryRepository } from "../../../../features/inventory/inventory-repository";
import { InventoryHistoryTable } from "../../../../components/inventory/InventoryHistoryTable";
import Link from "next/link";
import { requirePermission } from "../../../../lib/auth/guards";

export default async function InventoryHistoryPage() {
  // 1. Verify Authentication & Authorization
  await requirePermission('inventory.view');

  const { data, count } = await InventoryRepository.getInventoryHistory();

  return (
    <div className="space-y-6 pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0ms', opacity: 0 }}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/inventory" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft size={16} />
            </Link>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Back to Inventory</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventory History</h1>
          <p className="text-sm text-muted-foreground mt-1">Audit log of all stock adjustments and movements.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none h-10 gap-2">
            <Download size={16} />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="animate-fade-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
        <InventoryHistoryTable initialData={data} totalCount={count} />
      </div>
    </div>
  );
}
