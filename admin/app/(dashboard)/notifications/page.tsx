import { Card } from "../../../components/ui/card";
import { Bell, Check, ShoppingCart, AlertTriangle, Star, UserPlus, Users } from "lucide-react";
import { NotificationRepository } from "../../../features/notifications/notification-repository";
import { CreateNotificationDialog } from "../../../components/ui/CreateNotificationDialog";
import { DeleteNotificationButton } from "../../../components/ui/DeleteNotificationButton";
import { requirePermission } from "../../../lib/auth/guards";

export default async function NotificationsPage() {
  await requirePermission("notifications.send");
  const notifications = await NotificationRepository.getNotifications();

  const getIcon = () => {
    return <Bell size={18} className="text-brand-primary" />;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 animate-fade-in-up" style={{ animationDelay: '0ms', opacity: 0 }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">System Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage broadcasts and alerts sent to users.</p>
        </div>
        <CreateNotificationDialog />
      </div>

      <div className="animate-fade-in-up space-y-4" style={{ animationDelay: '100ms', opacity: 0 }}>
        {notifications.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground border-dashed">
            <Bell className="mx-auto h-8 w-8 mb-3 opacity-20" />
            <p>No notifications have been sent yet.</p>
          </Card>
        ) : (
          notifications.map((notif) => (
            <Card key={notif.id} className={`p-4 flex gap-4 ${notif.is_read ? 'opacity-70' : 'bg-card'}`}>
              <div className="mt-1 shrink-0">
                <div className={`p-2 rounded-full ${notif.user_id ? 'bg-amber-500/10 text-amber-500' : 'bg-brand-primary/10 text-brand-primary'}`}>
                  {notif.user_id ? <Bell size={18} /> : <Users size={18} />}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-medium ${!notif.is_read && 'text-foreground'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {new Date(notif.created_at).toLocaleDateString()} {new Date(notif.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {notif.message}
                </p>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
                  <div className="text-[11px] font-medium text-muted-foreground px-2 py-1 bg-muted rounded-md uppercase tracking-wide">
                    {notif.user_id ? `Targeted User: ${notif.user_id.substring(0,8)}...` : 'Broadcast to All'}
                  </div>
                  <div className="flex items-center gap-2">
                    <DeleteNotificationButton id={notif.id} />
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
