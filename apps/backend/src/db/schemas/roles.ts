import {
    integer,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull().unique(),
    displayName: varchar("display_name", { length: 255 }).notNull(),
    description: varchar("description", { length: 255 }),
    level: integer("level").notNull(), // Hierarchy level (1 = highest, 10 = lowest)
    category: varchar("category", { length: 50 }).notNull(), // PLATFORM | TENANT | UNIT | TERRITORY | PUBLIC
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
}).enableRLS();
