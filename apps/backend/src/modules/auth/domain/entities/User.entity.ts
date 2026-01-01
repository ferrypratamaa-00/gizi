import { UserId } from "../value-objects/UserId.vo";
import { TenantId } from "../value-objects/TenantId.vo";
import { Email } from "../value-objects/Email.vo";
import { Role } from "../value-objects/Role.vo";
import { Permission } from "../value-objects/Permission.vo";

export interface UserProps {
    id: UserId;
    tenantId: TenantId | null; // Null untuk SUPER_ADMIN
    supabaseAuthId: string;
    email: Email;
    fullName: string;
    role: Role;
    roleCategory: string; // PLATFORM | TENANT | UNIT | TERRITORY | PUBLIC (from DB)
    roleLevel: number; // 1-9, lower = higher privilege (from DB)
    permissions: Permission[]; // Effective permissions (role default + user override)
    scopeUnitId?: string | null;
    scopeRegionId?: string | null;
    isActive: boolean;
    emailVerified: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export class User {
    private props: UserProps;

    constructor(props: UserProps) {
        this.props = props;
    }

    // Getters
    get id(): UserId {
        return this.props.id;
    }

    get tenantId(): TenantId | null {
        return this.props.tenantId;
    }

    get email(): Email {
        return this.props.email;
    }

    get fullName(): string {
        return this.props.fullName;
    }

    get role(): Role {
        return this.props.role;
    }

    get roleCategory(): string {
        return this.props.roleCategory;
    }

    get roleLevel(): number {
        return this.props.roleLevel;
    }

    get permissions(): Permission[] {
        return this.props.permissions;
    }

    get scopeUnitId(): string | null | undefined {
        return this.props.scopeUnitId;
    }

    get scopeRegionId(): string | null | undefined {
        return this.props.scopeRegionId;
    }

    get isActive(): boolean {
        return this.props.isActive;
    }

    get emailVerified(): boolean {
        return this.props.emailVerified;
    }

    // Business Methods

    /**
     * Check if user can access specific tenant
     */
    canAccessTenant(tenantId: TenantId): boolean {
        // Platform admin can access all tenants
        if (this.roleCategory === "PLATFORM") {
            return true;
        }

        // Tenant admin can only access their own tenant
        return this.tenantId?.equals(tenantId) ?? false;
    }

    /**
     * Check if user has specific permission
     */
    hasPermission(permission: Permission): boolean {
        // Super admin has all permissions
        if (this.isSuperAdmin()) {
            return true;
        }

        return this.permissions.some((p) => p.equals(permission));
    }

    /**
     * Check if resource is within user's unit scope
     */
    isInUnitScope(unitId: string): boolean {
        // No scope = can access all units (tenant admin)
        if (!this.scopeUnitId) {
            return true;
        }

        return this.scopeUnitId === unitId;
    }

    /**
     * Check if resource is within user's region scope
     */
    isInRegionScope(regionId: string): boolean {
        // No scope = can access all regions (tenant admin)
        if (!this.scopeRegionId) {
            return true;
        }

        return this.scopeRegionId === regionId;
    }

    /**
     * Check if user is super admin
     */
    isSuperAdmin(): boolean {
        return this.role.getValue() === "SUPER_ADMIN";
    }

    /**
     * Check if user is at platform level
     */
    isPlatformLevel(): boolean {
        return this.roleCategory === "PLATFORM";
    }

    /**
     * Check if user is at tenant level
     */
    isTenantLevel(): boolean {
        return this.roleCategory === "TENANT";
    }

    /**
     * Check if user is at unit level
     */
    isUnitLevel(): boolean {
        return this.roleCategory === "UNIT";
    }

    /**
     * Check if user can assign role to another user
     * Based on hierarchy: user can only assign role with lower level
     */
    canAssignRole(
        targetRoleLevel: number,
        targetRoleCategory: string
    ): boolean {
        // Super admin can assign any role
        if (this.isSuperAdmin()) {
            return true;
        }

        // Tenant admin can only assign role at UNIT and TERRITORY level
        if (this.role.getValue() === "TENANT_ADMIN") {
            return ["UNIT", "TERRITORY", "PUBLIC"].includes(targetRoleCategory);
        }

        // User can only assign role with lower level (higher number)
        return this.roleLevel < targetRoleLevel;
    }

    /**
     * Activate user
     */
    activate(): void {
        this.props.isActive = true;
        this.props.updatedAt = new Date();
    }

    /**
     * Deactivate user
     */
    deactivate(): void {
        this.props.isActive = false;
        this.props.updatedAt = new Date();
    }

    /**
     * Change role (also update category and level)
     */
    changeRole(newRole: Role, newCategory: string, newLevel: number): void {
        this.props.role = newRole;
        this.props.roleCategory = newCategory;
        this.props.roleLevel = newLevel;
        this.props.updatedAt = new Date();
    }

    /**
     * Update permissions
     */
    updatePermissions(permissions: Permission[]): void {
        this.props.permissions = permissions;
        this.props.updatedAt = new Date();
    }

    /**
     * Verify email
     */
    verifyEmail(): void {
        this.props.emailVerified = true;
        this.props.updatedAt = new Date();
    }

    /**
     * Convert to plain object (untuk serialization)
     */
    toObject() {
        return {
            id: this.id.getValue(),
            tenantId: this.tenantId?.getValue() ?? null,
            supabaseAuthId: this.props.supabaseAuthId,
            email: this.email.getValue(),
            fullName: this.fullName,
            role: this.role.getValue(),
            roleCategory: this.roleCategory,
            roleLevel: this.roleLevel,
            permissions: this.permissions.map((p) => p.getValue()),
            scopeUnitId: this.scopeUnitId,
            scopeRegionId: this.scopeRegionId,
            isActive: this.isActive,
            emailVerified: this.emailVerified,
            metadata: this.props.metadata,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}
