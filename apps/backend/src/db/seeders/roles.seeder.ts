import { db } from "../schema";
import { roles } from "../schemas";
import { ROLE_DEFINITIONS } from "../constants";

export async function seedRoles() {
    console.log("Seeding roles...");

    await db
        .insert(roles)
        .values([...ROLE_DEFINITIONS])
        .onConflictDoNothing();

    console.log("✅ Roles seeded successfully");
}
