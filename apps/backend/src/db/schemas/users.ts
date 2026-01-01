import {
    boolean,
    index,
    jsonb,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { tenants } from "./tenants";

export const users = pgTable(
    "users",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id").references(() => tenants.id),
        supabaseAuthId: uuid("supabase_auth_id").notNull().unique(),
        email: varchar("email", { length: 255 }).notNull().unique(),
        fullName: varchar("full_name", { length: 255 }),
        phoneNumber: varchar("phone_number", { length: 50 }),
        role: varchar("role", { length: 50 }).notNull(),
        scopeUnitId: uuid("scope_unit_id"),
        scopeRegionId: uuid("scope_region_id"),
        metadata: jsonb("metadata"),
        emailVerified: boolean("email_verified").default(false),
        isActive: boolean("is_active").default(true),
        lastLoginAt: timestamp("last_login_at"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
        deletedAt: timestamp("deleted_at"),
    },
    (table) => [
        uniqueIndex("email_tenant_unique").on(table.email, table.tenantId),
        index("idx_users_tenant_id").on(table.tenantId),
        index("idx_users_supabase_auth_id").on(table.supabaseAuthId),
        index("idx_users_email").on(table.email),
        index("idx_users_role").on(table.role),
        index("idx_users_scope_unit_id").on(table.scopeUnitId),
        index("idx_users_scope_region_id").on(table.scopeRegionId),
        index("idx_users_deleted_at").on(table.deletedAt),
    ]
).enableRLS();
