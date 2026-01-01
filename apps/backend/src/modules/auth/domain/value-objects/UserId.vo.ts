import { generateUUID, isValidUUID } from "@/core/utils/uuid";

export class UserId {
    private readonly value: string;

    constructor(id: string) {
        if (!isValidUUID(id)) {
            throw new Error(`Invalid UserId: ${id}`);
        }
        this.value = id;
    }

    static generate(): UserId {
        return new UserId(generateUUID());
    }

    getValue(): string {
        return this.value;
    }

    equals(other: UserId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
