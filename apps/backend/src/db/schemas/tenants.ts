import {
    pgTable,
    uuid,
    varchar,
    jsonb,
    timestamp,
    integer,
    index,
} from "drizzle-orm/pg-core";

export const tenants = pgTable(
    "tenants",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        name: varchar("name", { length: 255 }).notNull(),
        slug: varchar("slug", { length: 100 }).notNull().unique(),
        subscriptionPlan: varchar("subscription_plan", { length: 50 })
            .notNull()
            .default("BASIC"),
        subscriptionStatus: varchar("subscription_status", { length: 50 })
            .notNull()
            .default("ACTIVE"),
        subscriptionExpiresAt: timestamp("subscription_expires_at"),
        maxUsers: integer("max_users").default(100),
        config: jsonb("config"),
        contactEmail: varchar("contact_email", { length: 255 }),
        contactPhone: varchar("contact_phone", { length: 50 }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
        deletedAt: timestamp("deleted_at"),
    },
    (table) => [
        index("idx_tenants_slug").on(table.slug),
        index("idx_tenants_subscription_status").on(table.subscriptionStatus),
        index("idx_tenants_deleted_at").on(table.deletedAt),
    ]
).enableRLS();
