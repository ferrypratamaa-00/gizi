export class PermissionDeniedError extends Error {
    constructor(permission: string) {
        super(`Permission denied: ${permission}`);
        this.name = "PermissionDeniedError";
    }
}

export class InvalidPermissionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidPermissionError";
    }
}

export class InvalidRoleError extends Error {
    constructor(role: string) {
        super(`Invalid role: ${role}`);
        this.name = "InvalidRoleError";
    }
}

export class InvalidScopeError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidScopeError";
    }
}
