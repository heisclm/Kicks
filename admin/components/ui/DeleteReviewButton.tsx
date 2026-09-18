"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "./button";
import { deleteReviewAction } from "../../features/reviews/review-actions";

export function DeleteReviewButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
      disabled={isPending}
      onClick={() => {
        if (confirm("Are you sure you want to delete this review?")) {
          startTransition(async () => {
            const result = await deleteReviewAction(id);
            if (!result.success) {
              alert(result.error);
            }
          });
        }
      }}
    >
      <Trash2 size={16} />
    </Button>
  );
}
