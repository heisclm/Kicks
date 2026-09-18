"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "./button";
import { deleteNotificationAction } from "../../features/notifications/notification-actions";

export function DeleteNotificationButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (confirm("Are you sure you want to delete this notification?")) {
      startTransition(async () => {
        const result = await deleteNotificationAction(id);
        if (!result.success) {
          alert(result.error);
        }
      });
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
      onClick={handleDelete}
      disabled={isPending}
      title="Delete notification"
    >
      <Trash2 size={16} />
    </Button>
  );
}
