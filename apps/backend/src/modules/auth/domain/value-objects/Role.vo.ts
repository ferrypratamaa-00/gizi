export class Role {
    private readonly value: string;

    constructor(role: string) {
        if (!role || role.trim().length === 0) {
            throw new Error("Role cannot be empty");
        }

        if (role.length > 255) {
            throw new Error("Role name too long (max 255 characters)");
        }

        // Store as uppercase for consistency
        this.value = role.trim().toUpperCase();
    }

    getValue(): string {
        return this.value;
    }

    equals(other: Role): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
