import { Tenant } from "../entities/Tenant.entity";
import { TenantId } from "../value-objects/TenantId.vo";

export interface CreateTenantDTO {
    name: string;
    slug: string;
    subscriptionPlan: string;
    maxUsers: number;
    config?: Record<string, any>;
    contactEmail?: string;
    contactPhone?: string;
}

export interface UpdateTenantDTO {
    name?: string;
    subscriptionPlan?: string;
    subscriptionStatus?: string;
    maxUsers?: number;
    config?: Record<string, any>;
}

export interface ITenantRepository {
    /**
     * Find tenant by id
     * @param id 
     */
    findById(id: TenantId): Promise<Tenant | null>;
    /**
     * Find tenant by slug
     * @param slug 
     */
    findBySlug(slug: string): Promise<Tenant | null>;
    /**
     * Create new tenant
     * @param data 
     */
    create(data: CreateTenantDTO): Promise<Tenant>;
    /**
     * Update tenant
     * @param id 
     * @param data 
     */
    update(id: TenantId, data: UpdateTenantDTO): Promise<Tenant>;
    /**
     * Delete tenant
     * @param id 
     */
    delete(id: TenantId): Promise<void>;
    /**
     * List tenants
     * @param page 
     * @param limit 
     */
    list(page: number, limit: number): Promise<Tenant[]>;
}
