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
    findById(id: TenantId): Promise<Tenant | null>;
    findBySlug(slug: string): Promise<Tenant | null>;
    create(data: CreateTenantDTO): Promise<Tenant>;
    update(id: TenantId, data: UpdateTenantDTO): Promise<Tenant>;
    delete(id: TenantId): Promise<void>;
    list(page: number, limit: number): Promise<Tenant[]>;
}
