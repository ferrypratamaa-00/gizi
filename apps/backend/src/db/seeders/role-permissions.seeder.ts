import { db } from "../schema";
import { roles, permissions, rolePermissions } from "../schemas";
import { ROLE_PERMISSION_MAPPINGS } from "../constants";

export async function seedRolePermissions() {
    console.log("Seeding role-permissions mappings...");

    // Fetch all roles and permissions from database
    const allRoles = await db.select().from(roles);
    const allPermissions = await db.select().from(permissions);

    // Build mappings array
    const mappings: Array<{ roleId: string; permissionId: string }> = [];

    // Iterate through each role and assign permissions
    for (const role of allRoles) {
        const permissionNames = ROLE_PERMISSION_MAPPINGS[role.name];

        if (!permissionNames) {
            console.warn(`⚠️  No permissions defined for role: ${role.name}`);
            continue;
        }

        // Special case: "*" means ALL permissions (for SUPER_ADMIN)
        if (permissionNames.includes("*")) {
            allPermissions.forEach((perm) => {
                mappings.push({
                    roleId: role.id,
                    permissionId: perm.id,
                });
            });
            continue;
        }

        // Map specific permissions
        permissionNames.forEach((permName) => {
            const permission = allPermissions.find((p) => p.name === permName);

            if (!permission) {
                console.warn(
                    `⚠️  Permission "${permName}" not found for role "${role.name}"`
                );
                return;
            }

            mappings.push({
                roleId: role.id,
                permissionId: permission.id,
            });
        });
    }

    // Insert all mappings in batch
    if (mappings.length > 0) {
        await db.insert(rolePermissions).values(mappings).onConflictDoNothing();
    }

    console.log(
        `✅ Role-permissions seeded successfully (${mappings.length} mappings)`
    );
}
