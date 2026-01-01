import {
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
    jsonb,
    index,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { tenants } from "./tenants";

export const auditLogs = pgTable(
    "audit_logs",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id").references(() => tenants.id),
        userId: uuid("user_id").references(() => users.id),

        action: varchar("action", { length: 100 }).notNull(),
        resource: varchar("resource", { length: 50 }),
        resourceId: uuid("resource_id"),

        oldValue: jsonb("old_value"),
        newValue: jsonb("new_value"),

        ipAddress: varchar("ip_address", { length: 45 }),
        userAgent: text("user_agent"),

        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => ({
        idxAuditLogsTenantId: index("idx_audit_logs_tenant_id").on(
            table.tenantId
        ),
        idxAuditLogsUserId: index("idx_audit_logs_user_id").on(table.userId),
        idxAuditLogsAction: index("idx_audit_logs_action").on(table.action),
        idxAuditLogsResource: index("idx_audit_logs_resource").on(
            table.resource
        ),
        idxAuditLogsCreatedAt: index("idx_audit_logs_created_at").on(
            table.createdAt
        ),
    })
);
