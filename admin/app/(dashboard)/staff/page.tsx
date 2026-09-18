import { Card } from "../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Plus, MoreHorizontal, ShieldCheck, User } from "lucide-react";
import { requirePermission } from "../../../lib/auth/guards";
import { StaffRepository } from "../../../features/staff/staff-repository";
import { AssignRoleSelect } from "../../../components/staff/AssignRoleSelect";

export default async function StaffPage() {
  await requirePermission("staff.manage");
  
  const staff = await StaffRepository.getStaff();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
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
                <TableHead>Staff Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    No staff found.
                  </TableCell>
                </TableRow>
              ) : staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-semibold text-xs shrink-0">
                        {member.first_name ? member.first_name[0].toUpperCase() : <User size={14} />}
                      </div>
                      {member.first_name} {member.last_name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <AssignRoleSelect userId={member.id} currentRole={member.role} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {member.email}
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
