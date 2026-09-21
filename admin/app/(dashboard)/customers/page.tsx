import { Card } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Search, Download, Mail, MoreHorizontal, User } from "lucide-react";
import { CustomerRepository } from "../../../features/customers/customer-repository";

export default async function CustomersPage() {
  const customers = await CustomerRepository.getCustomers();

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0ms', opacity: 0 }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your customer relationships.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none h-10 gap-2">
            <Download size={16} />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden animate-fade-in-up" style={{ animationDelay: '50ms', opacity: 0 }}>
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between bg-card">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search customers by name or email..." 
              className="w-full pl-9 pr-4 py-2 border border-border rounded-md text-sm bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="h-9 w-full sm:w-auto">Filter by Tier</Button>
            <Button variant="outline" size="sm" className="h-9 w-full sm:w-auto">Sort by Spend</Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px]">Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : customers.map((customer, i) => (
                <TableRow key={customer.id} className="group cursor-pointer hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-semibold text-sm shrink-0">
                        {customer.first_name ? customer.first_name[0].toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{customer.first_name} {customer.last_name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <User size={10} />
                          Joined {new Date(customer.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail size={14} className="shrink-0" />
                      <span className="truncate max-w-[150px] sm:max-w-[200px]">{customer.email || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {customer.total_orders}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    ${customer.total_spent.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground bg-card">
          <div>Showing <span className="font-medium text-foreground">{customers.length > 0 ? 1 : 0}</span> to <span className="font-medium text-foreground">{customers.length}</span> of <span className="font-medium text-foreground">{customers.length}</span> results</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
