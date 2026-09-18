import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Bell, Check, ShoppingCart, AlertTriangle, Star, UserPlus } from "lucide-react";

const MOCK_NOTIFICATIONS = [
  { id: 'notif-1', title: 'New Order Received', message: 'Order #ORD-8832 was just placed by Alexander Wright.', time: '2 mins ago', type: 'order', read: false },
  { id: 'notif-2', title: 'Low Stock Alert', message: 'Nike Air Max Pulse (US 9.5 / Black) has fallen below the 15 unit threshold.', time: '1 hour ago', type: 'alert', read: false },
  { id: 'notif-3', title: 'New 1-Star Review', message: 'A new 1-star review was left on "Nike Air Max Pulse". Review requires moderation.', time: '3 hours ago', type: 'review', read: true },
  { id: 'notif-4', title: 'New VIP Customer', message: 'David Kim has reached VIP tier status ($4,890 total spent).', time: 'Yesterday', type: 'customer', read: true },
  { id: 'notif-5', title: 'System Update', message: 'Scheduled maintenance will occur on Sunday at 2:00 AM EST.', time: '2 days ago', type: 'system', read: true },
];

export default function NotificationsPage() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart size={18} className="text-blue-500" />;
      case 'alert': return <AlertTriangle size={18} className="text-amber-500" />;
      case 'review': return <Star size={18} className="text-rose-500" />;
      case 'customer': return <UserPlus size={18} className="text-emerald-500" />;
      default: return <Bell size={18} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end gap-4 animate-fade-in-up" style={{ animationDelay: '0ms', opacity: 0 }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">Stay updated on system alerts and store activity.</p>
        </div>
        <Button variant="outline" size="sm" className="h-9 gap-2">
          <Check size={14} />
          Mark all as read
        </Button>
      </div>

      <Card className="animate-fade-in-up overflow-hidden" style={{ animationDelay: '100ms', opacity: 0 }}>
        <div className="divide-y divide-border/50">
          {MOCK_NOTIFICATIONS.map((notif, index) => (
            <div 
              key={notif.id} 
              className={`p-4 flex gap-4 transition-colors hover:bg-muted/20 animate-fade-in-up ${notif.read ? 'opacity-70' : 'bg-muted/10'}`}
              style={{ animationDelay: `${200 + (index * 50)}ms`, opacity: 0 }}
            >
              <div className="shrink-0 mt-0.5">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${notif.read ? 'bg-muted' : 'bg-background shadow-sm ring-1 ring-border/50'}`}>
                  {getIcon(notif.type)}
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className={`text-sm ${notif.read ? 'font-medium text-foreground/80' : 'font-bold text-foreground'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">{notif.time}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{notif.message}</p>
              </div>
              {!notif.read && (
                <div className="shrink-0 flex items-center">
                  <div className="h-2 w-2 rounded-full bg-brand-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
