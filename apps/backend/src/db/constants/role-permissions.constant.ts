/**
 * Role-Permission Mappings for Gizi Platform
 *
 * Define which permissions each role has access to.
 * Special wildcard "*" grants ALL permissions (use for SUPER_ADMIN only).
 */

export const ROLE_PERMISSION_MAPPINGS: Record<string, string[]> = {
    // ==========================================
    // SUPER_ADMIN: Full Platform Access
    // ==========================================
    SUPER_ADMIN: ["*"], // Wildcard - grants ALL permissions

    // ==========================================
    // SUPPORT_STAFF: Read-Only Support
    // ==========================================
    SUPPORT_STAFF: [
        "dashboard:view",
        "users:read",
        "tenants:read",
        "children:read",
        "measurements:read",
        "reports:view",
    ],

    // ==========================================
    // TENANT_ADMIN: Manage Tenant Organization
    // ==========================================
    TENANT_ADMIN: [
        "dashboard:view",
        // User Management
        "users:create",
        "users:read",
        "users:update",
        "users:delete",
        // Tenant Management
        "tenants:read",
        "tenants:update",
        // Role & Permission
        "roles:read",
        "permissions:assign",
        // Children Data
        "children:create",
        "children:read",
        "children:update",
        "children:delete",
        // Measurements
        "measurements:create",
        "measurements:read",
        "measurements:update",
        // Reports & Settings
        "reports:view",
        "reports:export",
        "settings:manage",
    ],

    // ==========================================
    // TENANT_HEAD: View & Reports Only
    // ==========================================
    TENANT_HEAD: [
        "dashboard:view",
        "users:read",
        "children:read",
        "measurements:read",
        "reports:view",
        "reports:export",
    ],

    // ==========================================
    // UNIT_ADMIN: Health Worker Data Entry
    // ==========================================
    UNIT_ADMIN: [
        "dashboard:view",
        "children:create",
        "children:read",
        "children:update",
        "measurements:create",
        "measurements:read",
        "measurements:update",
        "reports:view",
    ],

    // ==========================================
    // UNIT_HEAD: Supervisor View Access
    // ==========================================
    UNIT_HEAD: [
        "dashboard:view",
        "users:read",
        "children:read",
        "measurements:read",
        "reports:view",
        "reports:export",
    ],

    // ==========================================
    // KADER: Community Worker Limited Entry
    // ==========================================
    KADER: [
        "children:create",
        "children:read",
        "measurements:create",
        "measurements:read",
    ],

    // ==========================================
    // VILLAGE_HEAD: Territory View
    // ==========================================
    VILLAGE_HEAD: [
        "dashboard:view",
        "children:read",
        "measurements:read",
        "reports:view",
    ],

    // ==========================================
    // DISTRICT_HEAD: Territory View
    // ==========================================
    DISTRICT_HEAD: [
        "dashboard:view",
        "children:read",
        "measurements:read",
        "reports:view",
    ],

    // ==========================================
    // PARENT: View Own Children Only
    // ==========================================
    PARENT: ["children:read", "measurements:read"],
};
