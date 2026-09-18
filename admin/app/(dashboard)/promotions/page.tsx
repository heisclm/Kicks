import { Card } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { MoreHorizontal, Ticket } from "lucide-react";
import { PromotionRepository } from "../../../features/promotions/promotion-repository";
import { CreatePromotionDialog } from "../../../components/ui/CreatePromotionDialog";

export default async function PromotionsPage() {
  const promotions = await PromotionRepository.getPromotions();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0ms', opacity: 0 }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Promotions</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage discount codes and marketing campaigns.</p>
        </div>
        <CreatePromotionDialog />
      </div>

      <Card className="animate-fade-in-up overflow-hidden" style={{ animationDelay: '100ms', opacity: 0 }}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No promotions found.
                  </TableCell>
                </TableRow>
              ) : promotions.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Ticket size={16} className="text-brand-primary" />
                      {promo.code}
                    </div>
                  </TableCell>
                  <TableCell>
                    {promo.discount_type === 'percentage' 
                      ? `${promo.discount_value}% OFF` 
                      : `$${promo.discount_value} OFF`}
                  </TableCell>
                  <TableCell>
                    {promo.is_active ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {promo.end_date ? new Date(promo.end_date).toLocaleDateString() : 'No expiry'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
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
