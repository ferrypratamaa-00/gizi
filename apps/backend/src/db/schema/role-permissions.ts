import {
    index,
    pgTable,
    timestamp,
    unique,
    uniqueIndex,
    uuid,
} from "drizzle-orm/pg-core";
import { roles } from "./roles";
import { permissions } from "./permissions";

export const rolePermissions = pgTable(
    "role_permissions",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        roleId: uuid("role_id")
            .references(() => roles.id, { onDelete: "cascade" })
            .notNull(),
        permissionId: uuid("permission_id")
            .references(() => permissions.id, { onDelete: "cascade" })
            .notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => ({
        unique: uniqueIndex("role_permissions_unique").on(
            table.roleId,
            table.permissionId
        ),
        idxRolePermissionsRoleId: index("idx_role_permissions_role_id").on(
            table.roleId
        ),
        idxRolePermissionsPermissionId: index(
            "idx_role_permissions_permission_id"
        ).on(table.permissionId),
    })
);
