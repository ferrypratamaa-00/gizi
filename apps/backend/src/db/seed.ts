import { seedRoles } from "./seeders/roles.seeder";
import { seedPermissions } from "./seeders/permissions.seeder";
import { seedRolePermissions } from "./seeders/role-permissions.seeder";
import { client } from "./schema";

async function seed() {
    console.info("🌱 Starting database seeding...\n");

    await seedRoles();
    await seedPermissions();
    await seedRolePermissions();

    console.info("\n✅ Database seeding completed!");
}

seed()
    .catch((error) => {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    })
    .finally(async () => {
        // Close database connection to allow process to exit
        await client.end();
        process.exit(0);
    });
