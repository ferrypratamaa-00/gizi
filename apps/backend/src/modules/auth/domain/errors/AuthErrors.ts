export class InvalidEmailError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidEmailError";
    }
}

export class WeakPasswordError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "WeakPasswordError";
    }
}

export class UserNotFoundError extends Error {
    constructor(identifier: string) {
        super(`User not found: ${identifier}`);
        this.name = "UserNotFoundError";
    }
}

export class InvalidCredentialsError extends Error {
    constructor() {
        super("Email or password is incorrect");
        this.name = "InvalidCredentialsError";
    }
}

export class TokenExpiredError extends Error {
    constructor() {
        super("Token has expired");
        this.name = "TokenExpiredError";
    }
}

export class UnauthorizedError extends Error {
    constructor(message = "Unauthorized access") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export class EmailAlreadyExistsError extends Error {
    constructor(email: string) {
        super(`Email already exists: ${email}`);
        this.name = "EmailAlreadyExistsError";
    }
}
