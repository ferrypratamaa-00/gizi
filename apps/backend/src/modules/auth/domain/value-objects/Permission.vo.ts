export class Permission {
    private readonly resource: string;
    private readonly action: string;

    constructor(permission: string) {
        const parts = permission.split(":");

        if (parts.length !== 2) {
            throw new InvalidPermissionError(
                `Permission harus format 'resource:action', dapat: ${permission}`
            );
        }

        this.resource = parts[0];
        this.action = parts[1];
    }

    getResource(): string {
        return this.resource;
    }

    getAction(): string {
        return this.action;
    }

    getValue(): string {
        return `${this.resource}:${this.action}`;
    }

    equals(other: Permission): boolean {
        return this.getValue() === other.getValue();
    }

    toString(): string {
        return this.getValue();
    }

    // Helper untuk check action
    isRead(): boolean {
        return this.action === "read";
    }

    isWrite(): boolean {
        return this.action === "write";
    }

    isDelete(): boolean {
        return this.action === "delete";
    }
}
