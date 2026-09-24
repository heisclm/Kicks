'use client';

import { useState } from 'react';
import { 
  flexRender, 
  createCoreRowModel, 
  createFilteredRowModel, 
  createPaginatedRowModel, 
  createSortedRowModel, 
  useReactTable, 
  SortingState, 
  ColumnFiltersState 
} from '@tanstack/react-table';
import { Download, Search, Filter, ArrowUpDown, Eye } from 'lucide-react';
import Link from 'next/link';

import { Order, OrderStatus } from '../../../features/orders/order-types';
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

function getOrderStatusBadge(status: OrderStatus) {
  switch (status) {
    case 'delivered':
      return <Badge variant="success">Delivered</Badge>;
    case 'shipped':
      return <Badge className="bg-brand-secondary text-white dark:bg-brand-secondary/80">Shipped</Badge>;
    case 'processing':
      return <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">Processing</Badge>;
    case 'pending':
      return <Badge variant="warning">Pending</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  }).format(date);
}

const columns = [
  {
    accessorFn: (row: Order) => row.id.split('-')[0].toUpperCase(),
    id: 'id',
    header: 'Order ID',
    cell: (info: any) => (
      <span className="font-semibold text-foreground text-sm tracking-tight">
        {info.getValue()}
      </span>
    )
  },
  {
    accessorFn: (row: Order) => row.customer ? `${row.customer.first_name} ${row.customer.last_name}` : 'Unknown',
    id: 'customer',
    header: 'Customer',
    cell: (info: any) => {
      const name = info.getValue();
      const initials = name.split(' ').map((n: string) => n[0]).join('').substring(0, 2);
      // Access the original row data via info.row.original
      const email = info.row.original.customer?.email || 'N/A';
      return (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-[11px] font-bold shrink-0">
            {initials}
          </div>
          <div>
            <div className="font-medium text-sm text-foreground">{name}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{email}</div>
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'created_at',
    header: ({ column }: any) => (
      <div 
        className="flex items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Date
        <ArrowUpDown size={12} />
      </div>
    ),
    cell: (info: any) => (
      <span className="text-sm text-muted-foreground tabular-nums">
        {formatDate(info.getValue())}
      </span>
    )
  },
  {
    accessorKey: 'total_amount',
    header: () => <div className="text-right">Total</div>,
    cell: (info: any) => {
      const amount = info.getValue();
      const items = info.row.original.items?.length || 0;
      return (
        <div className="text-right font-medium text-sm tabular-nums text-foreground">
          ${amount.toFixed(2)}
          <div className="text-[10px] text-muted-foreground mt-0.5 font-normal tracking-wide uppercase">
            {items} {items === 1 ? 'item' : 'items'}
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: 'status',
    header: () => <div className="text-center">Status</div>,
    cell: (info: any) => (
      <div className="text-center">
        {getOrderStatusBadge(info.getValue())}
      </div>
    )
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: (info: any) => (
      <div className="text-right flex justify-end">
        <Link href={`/orders/${info.row.original.id}`}>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
            <Eye size={14} />
          </Button>
        </Link>
      </div>
    )
  }
];

export function OrdersClient({ data }: { data: Order[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: createCoreRowModel(),
    getFilteredRowModel: createFilteredRowModel(),
    getPaginationRowModel: createPaginatedRowModel(),
    getSortedRowModel: createSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      }
    }
  });

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track customer orders efficiently with TanStack.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none h-9 gap-1.5">
            <Download size={14} />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="p-3 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3 justify-between bg-card">
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="block w-full pl-8 pr-3 py-1.5 border border-border rounded-md text-xs bg-muted/50 placeholder-muted-foreground focus:outline-none focus:bg-card focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors"
              placeholder="Fuzzy search orders..."
            />
          </div>
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-foreground flex-1 sm:flex-none">
              <Filter size={12} />
              Filter
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="p-3 border-t border-border bg-card flex items-center justify-between text-xs text-muted-foreground">
          <div>
            Showing <span className="font-medium text-foreground tabular-nums">{table.getRowModel().rows.length > 0 ? table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1 : 0}</span> to <span className="font-medium text-foreground tabular-nums">{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}</span> of <span className="font-medium text-foreground tabular-nums">{table.getFilteredRowModel().rows.length}</span> orders
          </div>
          <div className="flex gap-1.5">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-7 text-[11px]"
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-7 text-[11px]"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
