/**
 * Permission Definitions for Gizi Platform
 *
 * Define all available permissions with resource:action naming convention.
 * Format: "resource:action" (e.g., "users:create", "reports:export")
 */

export const PERMISSION_DEFINITIONS = [
    // ==========================================
    // Dashboard
    // ==========================================
    {
        name: "dashboard:view",
        resource: "dashboard",
        action: "view",
        description: "View dashboard analytics and statistics",
    },

    // ==========================================
    // User Management
    // ==========================================
    {
        name: "users:create",
        resource: "users",
        action: "create",
        description: "Create new users",
    },
    {
        name: "users:read",
        resource: "users",
        action: "read",
        description: "View user information",
    },
    {
        name: "users:update",
        resource: "users",
        action: "update",
        description: "Update user information",
    },
    {
        name: "users:delete",
        resource: "users",
        action: "delete",
        description: "Delete users",
    },

    // ==========================================
    // Tenant Management
    // ==========================================
    {
        name: "tenants:create",
        resource: "tenants",
        action: "create",
        description: "Create new tenants/organizations",
    },
    {
        name: "tenants:read",
        resource: "tenants",
        action: "read",
        description: "View tenant information",
    },
    {
        name: "tenants:update",
        resource: "tenants",
        action: "update",
        description: "Update tenant information",
    },
    {
        name: "tenants:delete",
        resource: "tenants",
        action: "delete",
        description: "Delete tenants",
    },

    // ==========================================
    // Role & Permission Management
    // ==========================================
    {
        name: "roles:create",
        resource: "roles",
        action: "create",
        description: "Create new roles",
    },
    {
        name: "roles:read",
        resource: "roles",
        action: "read",
        description: "View role information",
    },
    {
        name: "roles:update",
        resource: "roles",
        action: "update",
        description: "Update role information",
    },
    {
        name: "roles:delete",
        resource: "roles",
        action: "delete",
        description: "Delete roles",
    },
    {
        name: "permissions:assign",
        resource: "permissions",
        action: "assign",
        description: "Assign permissions to roles/users",
    },

    // ==========================================
    // Children Data Management (Core Feature)
    // ==========================================
    {
        name: "children:create",
        resource: "children",
        action: "create",
        description: "Register new children data",
    },
    {
        name: "children:read",
        resource: "children",
        action: "read",
        description: "View children data",
    },
    {
        name: "children:update",
        resource: "children",
        action: "update",
        description: "Update children data",
    },
    {
        name: "children:delete",
        resource: "children",
        action: "delete",
        description: "Delete children data",
    },

    // ==========================================
    // Measurement/Growth Monitoring
    // ==========================================
    {
        name: "measurements:create",
        resource: "measurements",
        action: "create",
        description: "Record growth measurements",
    },
    {
        name: "measurements:read",
        resource: "measurements",
        action: "read",
        description: "View measurement history",
    },
    {
        name: "measurements:update",
        resource: "measurements",
        action: "update",
        description: "Update measurement records",
    },

    // ==========================================
    // Reports
    // ==========================================
    {
        name: "reports:view",
        resource: "reports",
        action: "view",
        description: "View generated reports",
    },
    {
        name: "reports:export",
        resource: "reports",
        action: "export",
        description: "Export reports to PDF/Excel",
    },

    // ==========================================
    // Settings
    // ==========================================
    {
        name: "settings:manage",
        resource: "settings",
        action: "manage",
        description: "Manage system settings",
    },
] as const;

// Type export
export type PermissionName = (typeof PERMISSION_DEFINITIONS)[number]["name"];
