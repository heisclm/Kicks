import { Card } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Search, Star, MoreHorizontal, CheckCircle, XCircle } from "lucide-react";

const MOCK_REVIEWS = [
  { id: 'rev-1', product: 'Nike Air Zoom Pegasus', customer: 'Alexander W.', rating: 5, comment: 'Most comfortable running shoes I have ever owned. Perfect fit.', status: 'Published', date: '2 days ago' },
  { id: 'rev-2', product: 'Yeezy Boost 350 V2', customer: 'Sophia C.', rating: 4, comment: 'Love the colorway, but they run a half size small.', status: 'Published', date: '4 days ago' },
  { id: 'rev-3', product: 'Nike Air Max Pulse', customer: 'Marcus J.', rating: 1, comment: 'Box came completely destroyed and the shoes had a scuff.', status: 'Pending', date: '1 week ago' },
  { id: 'rev-4', product: 'New Balance 990v6', customer: 'David K.', rating: 5, comment: 'Classic look, amazing build quality. 10/10.', status: 'Published', date: '2 weeks ago' },
  { id: 'rev-5', product: 'KICKS Origin Unveil', customer: 'Aisha P.', rating: 2, comment: 'Spam link: http://buycheapsneakers.com', status: 'Flagged', date: '1 month ago' },
];

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0ms', opacity: 0 }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reviews</h1>
          <p className="text-sm text-muted-foreground mt-1">Moderate customer feedback and ratings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '100ms', opacity: 0 }}>
        <Card className="p-4 text-center">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Avg Rating</div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold tabular-nums">4.8</span>
            <Star size={20} className="text-amber-400 fill-amber-400" />
          </div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Reviews</div>
          <div className="text-3xl font-bold tabular-nums">1,284</div>
        </Card>
        <Card className="p-4 text-center border-amber-500/20 bg-amber-500/5">
          <div className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-2">Pending</div>
          <div className="text-3xl font-bold tabular-nums text-amber-600 dark:text-amber-500">12</div>
        </Card>
        <Card className="p-4 text-center border-rose-500/20 bg-rose-500/5">
          <div className="text-[10px] font-bold text-rose-600 dark:text-rose-500 uppercase tracking-wider mb-2">Flagged</div>
          <div className="text-3xl font-bold tabular-nums text-rose-600 dark:text-rose-500">3</div>
        </Card>
      </div>

      <Card className="animate-fade-in-up overflow-hidden" style={{ animationDelay: '200ms', opacity: 0 }}>
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search reviews..." className="pl-9 h-10 bg-muted/40 border-transparent focus:bg-card" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-10 text-foreground">Pending</Button>
            <Button variant="outline" size="sm" className="h-10 text-foreground">Flagged</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Rating</TableHead>
                <TableHead className="w-[300px]">Comment</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_REVIEWS.map((review, index) => (
                <TableRow key={review.id} className="group hover:bg-muted/30 transition-colors animate-fade-in-up" style={{ animationDelay: `${300 + (index * 50)}ms`, opacity: 0 }}>
                  <TableCell>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-muted"} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm text-foreground line-clamp-2">{review.comment}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{review.date}</div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{review.customer}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{review.product}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      review.status === 'Published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 
                      review.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' : 
                      'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
                    }`}>
                      {review.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {review.status !== 'Published' && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700">
                          <CheckCircle size={14} />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                        <XCircle size={14} />
                      </Button>
                    </div>
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
