import { generateUUID, isValidUUID } from "@/core/utils/uuid";

export class TenantId {
    private readonly value: string;

    constructor(id: string) {
        if (!isValidUUID(id)) {
            throw new InvalidTenantIdError(id);
        }
        this.value = id;
    }

    static generate(): TenantId {
        return new TenantId(generateUUID());
    }

    getValue(): string {
        return this.value;
    }

    equals(other: TenantId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
