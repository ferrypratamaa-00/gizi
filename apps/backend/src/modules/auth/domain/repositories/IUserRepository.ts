import { User } from "../entities/User.entity";
import { Email } from "../value-objects/Email.vo";
import { UserId } from "../value-objects/UserId.vo";
import { TenantId } from "../value-objects/TenantId.vo";

export interface CreateUserDTO {
    tenantId: TenantId | null;
    supabaseAuthId: string;
    email: Email;
    fullName: string;
    role: string;
    scopeUnitId?: string;
    scopeRegionId?: string;
    metadata?: Record<string, any>;
}

export interface UpdateUserDTO {
    fullName?: string;
    role?: string;
    scopeUnitId?: string;
    scopeRegionId?: string;
    isActive?: boolean;
    metadata?: Record<string, any>;
}

export interface IUserRepository {
    /**
     * Find user by ID
     */
    findById(id: UserId): Promise<User | null>;

    /**
     * Find user by email (scoped by tenant)
     */
    findByEmail(email: Email, tenantId: TenantId): Promise<User | null>;

    /**
     * Find user by Supabase Auth ID
     */
    findBySupabaseAuthId(supabaseAuthId: string): Promise<User | null>;

    /**
     * Create new user
     */
    create(data: CreateUserDTO): Promise<User>;

    /**
     * Update user
     */
    update(id: UserId, data: UpdateUserDTO): Promise<User>;

    /**
     * Soft delete user
     */
    delete(id: UserId): Promise<void>;

    /**
     * Count users by tenant (for checking limit)
     */
    countByTenant(tenantId: TenantId): Promise<number>;

    /**
     * List users by tenant (paginated)
     */
    listByTenant(
        tenantId: TenantId,
        page: number,
        limit: number
    ): Promise<User[]>;
}
