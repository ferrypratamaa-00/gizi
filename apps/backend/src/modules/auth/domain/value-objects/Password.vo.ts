export class Password {
    private readonly value: string;

    constructor(password: string) {
        this.value = this.validate(password);
    }

    private validate(password: string): string {
        if (password.length < 8) {
            throw new WeakPasswordError("Password minimal 8 karakter");
        }

        if (password.length > 128) {
            throw new WeakPasswordError(
                "Password terlalu panjang (maks 128 karakter)"
            );
        }

        // Harus ada uppercase
        if (!/[A-Z]/.test(password)) {
            throw new WeakPasswordError("Password harus ada huruf besar");
        }

        // Harus ada lowercase
        if (!/[a-z]/.test(password)) {
            throw new WeakPasswordError("Password harus ada huruf kecil");
        }

        // Harus ada angka
        if (!/[0-9]/.test(password)) {
            throw new WeakPasswordError("Password harus ada angka");
        }

        // Optional: harus ada simbol
        if (!/[!@#$%^&*]/.test(password)) {
            throw new WeakPasswordError("Password harus ada simbol");
        }

        return password;
    }

    getValue(): string {
        return this.value;
    }

    toString(): string {
        return "***";
    }
}
