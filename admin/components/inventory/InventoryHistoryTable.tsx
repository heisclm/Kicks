'use client';

import { useState } from 'react';
import { InventoryMovementRecord } from '../../features/inventory/inventory-types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, SlidersHorizontal, ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/badge';

interface Props {
  initialData: InventoryMovementRecord[];
  totalCount: number;
}

export function InventoryHistoryTable({ initialData, totalCount }: Props) {
  const [data] = useState<InventoryMovementRecord[]>(initialData);
  const [search, setSearch] = useState('');
  
  const filteredData = data.filter(item => 
    item.product_name.toLowerCase().includes(search.toLowerCase()) || 
    item.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by SKU or product..." 
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" className="h-10 gap-2 w-full sm:w-auto">
          <SlidersHorizontal size={16} />
          Filters
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-x-auto bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead className="text-right">Change</TableHead>
              <TableHead className="text-right">Before</TableHead>
              <TableHead className="text-right">After</TableHead>
              <TableHead className="text-right">Performed By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  No inventory movements found.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => {
                const isPositive = item.quantity_change > 0;
                return (
                  <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(item.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{item.product_name}</div>
                      <div className="text-xs text-muted-foreground">Size {item.size} • {item.color_name}</div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-normal bg-background">
                        {item.reason}
                      </Badge>
                      {item.note && <div className="text-xs text-muted-foreground mt-1 max-w-[150px] truncate" title={item.note}>{item.note}</div>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={`inline-flex items-center justify-end font-medium tabular-nums ${isPositive ? 'text-success' : 'text-destructive'}`}>
                        {isPositive ? '+' : ''}{item.quantity_change}
                        {isPositive ? <ArrowUpRight className="ml-1 h-3 w-3" /> : <ArrowDownRight className="ml-1 h-3 w-3" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">{item.previous_quantity}</TableCell>
                    <TableCell className="text-right font-medium tabular-nums">{item.new_quantity}</TableCell>
                    <TableCell className="text-right text-xs">
                      {item.performed_by_name}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Showing {filteredData.length} of {totalCount} records
        </div>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" disabled>
            <ChevronLeft size={14} />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" disabled>
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
