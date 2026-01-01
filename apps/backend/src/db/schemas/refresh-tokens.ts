import {
    boolean,
    index,
    pgTable,
    text,
    timestamp,
    uniqueIndex,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { sql } from "drizzle-orm";

export const refreshTokens = pgTable(
    "refresh_tokens",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        userId: uuid("user_id")
            .references(() => users.id, { onDelete: "cascade" })
            .notNull(),

        token: text("token").notNull().unique(),

        expiresAt: timestamp("expires_at").notNull(),
        revoked: boolean("revoked").notNull().default(false),

        ipAddress: varchar("ip_address", { length: 45 }),
        userAgent: text("user_agent"),

        createdAt: timestamp("created_at").notNull().defaultNow(),
        revokedAt: timestamp("revoked_at"),
    },
    (table) => [
        uniqueIndex("refresh_tokens_unique").on(table.token),
        index("idx_refresh_tokens_token").on(table.token),
        index("idx_refresh_tokens_user_id").on(table.userId),
        index("idx_refresh_tokens_not_revoked")
            .on(table.revoked)
            .where(sql`${table.revoked} = false`),
        index("idx_refresh_tokens_expires_at").on(table.expiresAt),
    ]
).enableRLS();
