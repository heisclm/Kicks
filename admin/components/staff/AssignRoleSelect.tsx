"use client";

import { useTransition } from "react";
import { Select } from "../ui/select";
import { assignRoleAction } from "../../features/staff/staff-actions";

export function AssignRoleSelect({ userId, currentRole }: { userId: string, currentRole: string }) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newRole = e.target.value;
    if (confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      startTransition(async () => {
        const result = await assignRoleAction(userId, newRole);
        if (!result.success) {
          alert(result.error);
        }
      });
    } else {
      e.target.value = currentRole; // Reset
    }
  }

  return (
    <Select 
      defaultValue={currentRole} 
      onChange={handleChange}
      disabled={isPending}
      className="h-8 text-xs py-1"
    >
      <option value="owner">Owner</option>
      <option value="admin">Admin</option>
      <option value="order_manager">Order Manager</option>
      <option value="inventory_manager">Inventory Manager</option>
      <option value="support">Support</option>
      <option value="customer">Revoke (Customer)</option>
    </Select>
  );
}
