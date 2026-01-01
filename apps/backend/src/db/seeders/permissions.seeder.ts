import { db } from "../schema";
import { permissions } from "../schemas";
import { PERMISSION_DEFINITIONS } from "../constants";

export async function seedPermissions() {
    console.log("Seeding permissions...");

    await db
        .insert(permissions)
        .values([...PERMISSION_DEFINITIONS])
        .onConflictDoNothing();

    console.log("✅ Permissions seeded successfully");
}
