import { Card } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Search, Plus, MoreHorizontal, Ticket } from "lucide-react";

const MOCK_PROMOTIONS = [
  { id: 'promo-1', code: 'WELCOME20', discount: '20% OFF', usage: 1450, limit: null, status: 'Active', expires: '2026-12-31' },
  { id: 'promo-2', code: 'SUMMER26', discount: '15% OFF', usage: 890, limit: 1000, status: 'Active', expires: '2026-09-30' },
  { id: 'promo-3', code: 'FLASH50', discount: '$50 OFF', usage: 50, limit: 50, status: 'Expired', expires: '2026-08-15' },
  { id: 'promo-4', code: 'VIPONLY', discount: 'Free Shipping', usage: 124, limit: null, status: 'Active', expires: 'No expiry' },
  { id: 'promo-5', code: 'WINTER26', discount: '25% OFF', usage: 0, limit: 500, status: 'Scheduled', expires: '2027-02-28' },
];

export default function PromotionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0ms', opacity: 0 }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Promotions</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage discount codes and marketing campaigns.</p>
        </div>
        <Button className="h-10 gap-2 bg-brand-primary text-white hover:bg-brand-primary-hover border-transparent w-full sm:w-auto">
          <Plus size={16} />
          Create Promotion
        </Button>
      </div>

      <Card className="animate-fade-in-up overflow-hidden" style={{ animationDelay: '100ms', opacity: 0 }}>
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search codes..." className="pl-9 h-10 bg-muted/40 border-transparent focus:bg-card" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead className="text-right">Usage</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_PROMOTIONS.map((promo, index) => (
                <TableRow key={promo.id} className="group cursor-pointer hover:bg-muted/30 transition-colors animate-fade-in-up" style={{ animationDelay: `${200 + (index * 50)}ms`, opacity: 0 }}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-muted text-muted-foreground">
                        <Ticket size={14} />
                      </div>
                      <span className="font-bold text-sm text-foreground tracking-tight">{promo.code}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{promo.discount}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    <span className="font-medium text-foreground">{promo.usage}</span>
                    {promo.limit ? ` / ${promo.limit}` : ' / ∞'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground tabular-nums">{promo.expires}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      promo.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 
                      promo.status === 'Scheduled' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' : 
                      'bg-muted text-muted-foreground'
                    }`}>
                      {promo.status}
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
