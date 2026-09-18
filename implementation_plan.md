# Inventory Management Implementation Plan

## Goal
Build a production-quality Variant-level Inventory Management system that operates on product_variants stock_quantity, records auditable movements, enforces transaction safety, and provides a robust Admin UI for authorized roles.

## Proposed Architecture
1. **Database Schema Update**
   - Create a new table inventory_movements to track stock adjustments.
   - Implement Supabase RLS on inventory_movements.
   - Create a PostgreSQL RPC function djust_inventory_stock to safely execute the UPDATE to product_variants and INSERT to inventory_movements in a single transaction.

2. **Backend Services (eatures/inventory)**
   - Types: InventoryItem, InventoryMovement, StockAdjustmentInput.
   - Validation: Zod schemas for adjustments.
   - Repository: Queries product_variants joined with products and rands.
   - Server Actions: Secure endpoints with equirePermission(['admin', 'owner', 'inventory_manager']).

3. **UI Components (dmin/app/(dashboard)/inventory)**
   - page.tsx: Server Component for data fetching and summary metrics.
   - InventoryTable.tsx: Client component for data presentation.
   - InventoryStatusBadge.tsx: Reusable status logic.
   - StockAdjustmentDialog.tsx: Professional UI for safe addition/subtraction.

## Security
- No SUPABASE_SERVICE_ROLE_KEY.
- Transactional integrity prevents race conditions.
- Server-side JWT role verification via equirePermission.

## Execution Steps
1. Create and push migration for inventory_movements + RPC.
2. Build domain models and backend repository.
3. Build the UI Dashboard.
4. Hook up actions and verify.
