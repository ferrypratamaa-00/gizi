/**
 * Role Definitions for Gizi Platform
 *
 * Define all available roles with their hierarchy and categories here.
 */

export const ROLE_DEFINITIONS = [
    {
        name: "SUPER_ADMIN",
        displayName: "Super Administrator",
        level: 1,
        category: "PLATFORM" as const,
        description: "Full access to the entire platform",
    },
    {
        name: "SUPPORT_STAFF",
        displayName: "Support Staff",
        level: 2,
        category: "PLATFORM" as const,
        description: "Platform support operations",
    },
    {
        name: "TENANT_ADMIN",
        displayName: "Tenant Administrator",
        level: 3,
        category: "TENANT" as const,
        description: "Manage tenant organization",
    },
    {
        name: "TENANT_HEAD",
        displayName: "Head of Dinas",
        level: 4,
        category: "TENANT" as const,
        description: "Head of health department",
    },
    {
        name: "UNIT_ADMIN",
        displayName: "Unit Administrator (Bidan)",
        level: 5,
        category: "UNIT" as const,
        description: "Health worker for data entry",
    },
    {
        name: "UNIT_HEAD",
        displayName: "Unit Head (Kepala Puskesmas)",
        level: 6,
        category: "UNIT" as const,
        description: "Health center supervisor",
    },
    {
        name: "KADER",
        displayName: "Kader Posyandu",
        level: 7,
        category: "UNIT" as const,
        description: "Community health worker",
    },
    {
        name: "VILLAGE_HEAD",
        displayName: "Kepala Desa / Lurah",
        level: 8,
        category: "TERRITORY" as const,
        description: "Village/ward leader",
    },
    {
        name: "DISTRICT_HEAD",
        displayName: "Camat",
        level: 7,
        category: "TERRITORY" as const,
        description: "District leader",
    },
    {
        name: "PARENT",
        displayName: "Orang Tua",
        level: 9,
        category: "PUBLIC" as const,
        description: "Parent/guardian of children",
    },
] as const;

// Type exports
export type RoleName = (typeof ROLE_DEFINITIONS)[number]["name"];
export type RoleCategory =
    | "PLATFORM"
    | "TENANT"
    | "UNIT"
    | "TERRITORY"
    | "PUBLIC";
