export class TenantNotFoundError extends Error {
    constructor(identifier: string) {
        super(`Tenant not found: ${identifier}`);
        this.name = "TenantNotFoundError";
    }
}

export class TenantInactiveError extends Error {
    constructor(tenantId: string) {
        super(`Tenant is inactive: ${tenantId}`);
        this.name = "TenantInactiveError";
    }
}

export class UserLimitExceededError extends Error {
    constructor(tenantId: string, limit: number) {
        super(`Tenant ${tenantId} has reached user limit: ${limit}`);
        this.name = "UserLimitExceededError";
    }
}

export class InvalidTenantIdError extends Error {
    constructor(id: string) {
        super(`Invalid tenant ID format: ${id}`);
        this.name = "InvalidTenantIdError";
    }
}
