export interface SessionProps {
    id: string;
    userId: string;
    token: string; // Hashed refresh token
    expiresAt: Date;
    revoked: boolean;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
    revokedAt?: Date;
}

export class Session {
    private props: SessionProps;

    constructor(props: SessionProps) {
        this.props = props;
    }

    get id(): string {
        return this.props.id;
    }

    get userId(): string {
        return this.props.userId;
    }

    get token(): string {
        return this.props.token;
    }

    get expiresAt(): Date {
        return this.props.expiresAt;
    }

    get revoked(): boolean {
        return this.props.revoked;
    }

    get ipAddress(): string | undefined {
        return this.props.ipAddress;
    }

    get userAgent(): string | undefined {
        return this.props.userAgent;
    }

    // Business Methods

    /**
     * Check if session is expired
     */
    isExpired(): boolean {
        return this.props.expiresAt < new Date();
    }

    /**
     * Check if session is valid (not revoked & not expired)
     */
    isValid(): boolean {
        return !this.revoked && !this.isExpired();
    }

    /**
     * Revoke session (logout)
     */
    revoke(): void {
        this.props.revoked = true;
        this.props.revokedAt = new Date();
    }

    /**
     * Check if session is from same IP address
     */
    isSameIpAddress(ipAddress: string): boolean {
        return this.props.ipAddress === ipAddress;
    }

    /**
     * Check if session is from same user agent
     */
    isSameUserAgent(userAgent: string): boolean {
        return this.props.userAgent === userAgent;
    }

    toObject() {
        return {
            id: this.id,
            userId: this.userId,
            token: this.token, // Already hashed
            expiresAt: this.expiresAt,
            revoked: this.revoked,
            revokedAt: this.props.revokedAt,
            ipAddress: this.ipAddress,
            userAgent: this.userAgent,
            createdAt: this.props.createdAt,
        };
    }
}
