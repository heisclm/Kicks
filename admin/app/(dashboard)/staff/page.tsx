import { Card } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Plus, MoreHorizontal, ShieldCheck, ShieldAlert } from "lucide-react";
import { requirePermission } from "../../../lib/auth/guards";

const MOCK_STAFF = [
  { id: 'usr-1', name: 'Chris Miller', email: 'chris@kicks.com', role: 'Super Admin', mfa: true, lastActive: 'Active now' },
  { id: 'usr-2', name: 'Sarah Jenkins', email: 'sarah@kicks.com', role: 'Store Manager', mfa: true, lastActive: '2 hours ago' },
  { id: 'usr-3', name: 'Marcus Doe', email: 'marcus@kicks.com', role: 'Inventory Editor', mfa: false, lastActive: '1 day ago' },
  { id: 'usr-4', name: 'Elena Gilbert', email: 'elena@kicks.com', role: 'Customer Support', mfa: true, lastActive: '3 mins ago' },
];

export default async function StaffPage() {
  await requirePermission("staff.manage");
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0ms', opacity: 0 }}>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Staff & Roles</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage admin access and security permissions.</p>
        </div>
        <Button className="h-10 gap-2 bg-brand-primary text-white hover:bg-brand-primary-hover border-transparent w-full sm:w-auto">
          <Plus size={16} />
          Invite Staff
        </Button>
      </div>

      <Card className="animate-fade-in-up overflow-hidden" style={{ animationDelay: '100ms', opacity: 0 }}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-center">2FA Security</TableHead>
                <TableHead className="text-right">Last Active</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_STAFF.map((staff, index) => (
                <TableRow key={staff.id} className="group hover:bg-muted/30 transition-colors animate-fade-in-up" style={{ animationDelay: `${200 + (index * 50)}ms`, opacity: 0 }}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm shrink-0">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">{staff.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{staff.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded bg-muted text-foreground text-[11px] font-medium">
                      {staff.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      {staff.mfa ? (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-500">
                          <ShieldCheck size={14} /> Enabled
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-500">
                          <ShieldAlert size={14} /> Disabled
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{staff.lastActive}</TableCell>
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
