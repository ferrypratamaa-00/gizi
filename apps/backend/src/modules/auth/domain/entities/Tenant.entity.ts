import { TenantId } from "../value-objects/TenantId.vo";

export enum SubscriptionStatus {
    ACTIVE = "ACTIVE",
    PAST_DUE = "PAST_DUE",
    CANCELED = "CANCELED",
}

export interface TenantProps {
    id: TenantId;
    name: string;
    slug: string;
    subscriptionPlan: string;
    subscriptionStatus: SubscriptionStatus;
    subscriptionExpiresAt: Date | null;
    maxUsers: number;
    currentUserCount: number; // From database count
    config: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export class Tenant {
    private props: TenantProps;

    constructor(props: TenantProps) {
        this.props = props;
    }

    get id(): TenantId {
        return this.props.id;
    }

    get name(): string {
        return this.props.name;
    }

    get slug(): string {
        return this.props.slug;
    }

    get subscriptionStatus(): SubscriptionStatus {
        return this.props.subscriptionStatus;
    }

    get subscriptionPlan(): string {
        return this.props.subscriptionPlan;
    }

    get maxUsers(): number {
        return this.props.maxUsers;
    }

    get currentUserCount(): number {
        return this.props.currentUserCount;
    }

    get config(): Record<string, any> {
        return this.props.config;
    }

    // Business Methods

    /**
     * Check if tenant is active (can be used)
     */
    isActive(): boolean {
        return (
            this.props.subscriptionStatus === SubscriptionStatus.ACTIVE &&
            (this.props.subscriptionExpiresAt === null ||
                this.props.subscriptionExpiresAt > new Date())
        );
    }

    /**
     * Check if tenant can add new user (not exceed limit)
     */
    canAddUser(): boolean {
        return this.currentUserCount < this.maxUsers;
    }

    /**
     * Check if tenant has a specific feature
     */
    hasFeature(feature: string): boolean {
        const features = this.props.config.features as string[] | undefined;
        return features?.includes(feature) ?? false;
    }

    /**
     * Activate tenant
     */
    activate(): void {
        this.props.subscriptionStatus = SubscriptionStatus.ACTIVE;
        this.props.updatedAt = new Date();
    }

    /**
     * Cancel tenant
     */
    cancel(): void {
        this.props.subscriptionStatus = SubscriptionStatus.CANCELED;
        this.props.updatedAt = new Date();
    }

    /**
     * Update subscription expiry date
     */
    extendSubscription(newExpiryDate: Date): void {
        this.props.subscriptionExpiresAt = newExpiryDate;
        this.props.updatedAt = new Date();
    }

    /**
     * Upgrade/downgrade plan
     */
    changePlan(newPlan: string, newMaxUsers: number): void {
        this.props.subscriptionPlan = newPlan;
        this.props.maxUsers = newMaxUsers;
        this.props.updatedAt = new Date();
    }

    toObject() {
        return {
            id: this.id.getValue(),
            name: this.name,
            slug: this.slug,
            subscriptionPlan: this.subscriptionPlan,
            subscriptionStatus: this.subscriptionStatus,
            subscriptionExpiresAt: this.props.subscriptionExpiresAt,
            maxUsers: this.maxUsers,
            currentUserCount: this.currentUserCount,
            config: this.config,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}
