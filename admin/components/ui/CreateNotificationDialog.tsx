"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { createNotificationAction } from "../../features/notifications/notification-actions";
import { Textarea } from "./textarea";

export function CreateNotificationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const result = await createNotificationAction(formData);
      if (result.success) {
        setIsOpen(false);
      } else {
        setError(result.error || "Failed to send notification");
      }
    });
  }

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="h-10 gap-2 bg-brand-primary text-white hover:bg-brand-primary-hover border-transparent w-full sm:w-auto"
      >
        <Plus size={16} />
        Send Notification
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card w-full max-w-md rounded-lg p-6 shadow-xl relative">
        <h2 className="text-xl font-bold mb-4">Send System Notification</h2>
        {error && <div className="p-3 mb-4 text-sm text-red-500 bg-red-500/10 rounded-md">{error}</div>}
        
        <form action={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Target User ID (Optional)</label>
            <Input name="user_id" placeholder="Leave blank to broadcast to all" className="mt-1" />
          </div>
          
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input name="title" required minLength={3} maxLength={100} placeholder="e.g. Flash Sale Live!" className="mt-1" />
          </div>

          <div>
            <label className="text-sm font-medium">Message</label>
            <Textarea name="message" required minLength={3} maxLength={500} placeholder="Enter notification content..." className="mt-1" />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Sending...' : 'Send'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
