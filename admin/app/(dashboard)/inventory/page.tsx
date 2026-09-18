import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Search, Download, Plus, MoreHorizontal, ArrowUpDown, RefreshCw, AlertTriangle } from "lucide-react";
import Image from "next/image";

// Mock inventory data
const MOCK_INVENTORY = [
  { id: 'inv-1', name: 'Nike Air Zoom Pegasus', sku: 'AJ1-H-CHI-10', variant: 'US 10 / Red', location: 'Warehouse A', stock: 45, threshold: 20, status: 'Healthy', image: '/images/shoe-air-zoom.png' },
  { id: 'inv-2', name: 'Nike Air Max Pulse', sku: 'YZY-350-95', variant: 'US 9.5 / Black', location: 'Warehouse B', stock: 8, threshold: 15, status: 'Low Stock', image: '/images/shoe-air-max.png' },
  { id: 'inv-3', name: 'KICKS Origin Unveil', sku: 'KCK-ORG-11', variant: 'US 11 / White', location: 'Warehouse A', stock: 0, threshold: 25, status: 'Out of Stock', image: '/images/shoe-unveil.png' },
  { id: 'inv-4', name: 'Nike Air Force 1', sku: 'AF1-W-08', variant: 'US 8 / White', location: 'Retail Store 1', stock: 124, threshold: 20, status: 'Healthy', image: '/images/shoe-air-max.png' },
  { id: 'inv-5', name: 'Yeezy Boost 350 V2', sku: 'YZY-350-10', variant: 'US 10 / Bone', location: 'Warehouse B', stock: 12, threshold: 15, status: 'Low Stock', image: '/images/shoe-air-zoom.png' },
  { id: 'inv-6', name: 'New Balance 990v6', sku: 'NB-990-09', variant: 'US 9 / Grey', location: 'Warehouse A', stock: 56, threshold: 15, status: 'Healthy', image: '/images/shoe-unveil.png' },
];

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      {/* Header section with staggered animation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0ms', opacity: 0 }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventory</h1>
          <p className="text-sm text-muted-foreground mt-1">Track stock levels across warehouses and stores.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none h-10 gap-2">
            <Download size={16} />
            Export
          </Button>
          <Button className="flex-1 sm:flex-none h-10 gap-2 bg-brand-primary text-white hover:bg-brand-primary-hover border-transparent">
            <RefreshCw size={16} />
            Receive Stock
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-brand-primary/10 text-brand-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Total Items</div>
            <div className="text-2xl font-bold tabular-nums">24,592</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Low Stock</div>
            <div className="text-2xl font-bold tabular-nums">48</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Out of Stock</div>
            <div className="text-2xl font-bold tabular-nums">12</div>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
            <RefreshCw size={24} />
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-0.5">Incoming</div>
            <div className="text-2xl font-bold tabular-nums">1,250</div>
          </div>
        </Card>
      </div>

      <Card className="animate-fade-in-up overflow-hidden" style={{ animationDelay: '200ms', opacity: 0 }}>
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by SKU or name..." className="pl-9 h-10 bg-muted/40 border-transparent focus:bg-card" />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <Button variant="outline" size="sm" className="h-10 text-foreground whitespace-nowrap">All Locations</Button>
            <Button variant="outline" size="sm" className="h-10 text-foreground whitespace-nowrap">Low Stock</Button>
            <Button variant="outline" size="sm" className="h-10 text-foreground whitespace-nowrap">Out of Stock</Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Product & Variant</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_INVENTORY.map((item, index) => (
                <TableRow 
                  key={item.id}
                  className="group cursor-pointer hover:bg-muted/30 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${300 + (index * 50)}ms`, opacity: 0 }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 relative rounded-md overflow-hidden bg-muted flex items-center justify-center text-muted-foreground shrink-0 border border-border/50">
                        {/* Fake image placeholder using CSS since we might not have the actual images downloaded in this path */}
                        <div className="absolute inset-0 bg-gradient-to-br from-muted to-background" />
                        <svg className="relative z-10 opacity-20" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">{item.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{item.variant}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium tabular-nums">{item.sku}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.location}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5 w-32">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">{item.stock} <span className="text-muted-foreground font-normal">/ {Math.max(item.stock, item.threshold * 2)}</span></span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${item.stock > item.threshold ? "bg-emerald-500" : item.stock > 0 ? "bg-amber-500" : "bg-rose-500"}`}
                          style={{ width: `${Math.min(100, (item.stock / (item.threshold * 2)) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.status === 'Healthy' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                      item.status === 'Low Stock' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                      'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
