import { Card } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Search, Star } from "lucide-react";
import { ReviewRepository } from "../../../features/reviews/review-repository";
import { DeleteReviewButton } from "../../../components/ui/DeleteReviewButton";

export default async function ReviewsPage() {
  const reviews = await ReviewRepository.getReviews();

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0ms', opacity: 0 }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reviews</h1>
          <p className="text-sm text-muted-foreground mt-1">Moderate customer feedback and ratings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '50ms', opacity: 0 }}>
        <Card className="p-4 text-center">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Avg Rating</div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold tabular-nums">{avgRating}</span>
            <Star size={20} className="text-amber-400 fill-amber-400" />
          </div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Reviews</div>
          <div className="text-3xl font-bold tabular-nums">{totalReviews}</div>
        </Card>
      </div>

      <Card className="animate-fade-in-up overflow-hidden" style={{ animationDelay: '100ms', opacity: 0 }}>
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search reviews..." 
              className="w-full pl-9 pr-4 py-2 border border-border rounded-md text-sm bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="w-1/3">Comment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No reviews found.
                  </TableCell>
                </TableRow>
              ) : reviews.map((review) => (
                <TableRow key={review.id} className="group">
                  <TableCell className="font-medium text-foreground">
                    {review.product?.name || 'Unknown Product'}
                  </TableCell>
                  <TableCell>
                    {review.customer?.first_name} {review.customer?.last_name}
                  </TableCell>
                  <TableCell>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"} 
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground line-clamp-2" title={review.comment || ''}>
                      {review.comment || <span className="italic">No comment</span>}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(review.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DeleteReviewButton id={review.id} />
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
