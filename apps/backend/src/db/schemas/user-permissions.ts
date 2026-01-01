import {
    boolean,
    index,
    pgTable,
    timestamp,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { permissions } from "./permissions";

export const userPermissions = pgTable(
    "user_permissions",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        userId: uuid("user_id")
            .references(() => users.id, { onDelete: "cascade" })
            .notNull(),
        permissionId: uuid("permission_id")
            .references(() => permissions.id, { onDelete: "cascade" })
            .notNull(),
        granted: boolean("granted").notNull().default(false),
        grantedBy: uuid("granted_by")
            .references(() => users.id, { onDelete: "cascade" })
            .notNull(),
        grantedAt: timestamp("granted_at").notNull().defaultNow(),
    },
    (table) => [
        uniqueIndex("user_permissions_unique").on(
            table.userId,
            table.permissionId
        ),
        index("idx_user_permissions_user_id").on(table.userId),
        index("idx_user_permissions_permission_id").on(table.permissionId),
    ]
).enableRLS();
