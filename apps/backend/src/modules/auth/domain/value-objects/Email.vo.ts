import { InvalidEmailError } from "../errors/AuthErrors";

export class Email {
    private readonly value: string;

    constructor(email: string) {
        this.value = this.validate(email);
    }

    private validate(email: string): string {
        const trimmed = email.trim().toLowerCase();

        //RFC 5322 simplified regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmed)) {
            throw new InvalidEmailError(email);
        }

        if (trimmed.length > 255) {
            throw new InvalidEmailError("Email too long (max 255 characters)");
        }

        return trimmed;
    }

    getValue(): string {
        return this.value;
    }

    equals(other: Email): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
