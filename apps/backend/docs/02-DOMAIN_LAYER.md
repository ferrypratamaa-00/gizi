# 🏛️ Domain Layer - Gizi Platform Auth System

> **Version**: 1.0.0  
> **Last Updated**: 2025-12-28  
> **Pattern**: Domain-Driven Design (DDD)

---

## 📋 Table of Contents

1. [Domain Layer Overview](#domain-layer-overview)
2. [Value Objects](#value-objects)
3. [Entities](#entities)
4. [Repository Interfaces](#repository-interfaces)
5. [Service Interfaces](#service-interfaces)
6. [Domain Errors](#domain-errors)
7. [Business Rules](#business-rules)

---

## 🎯 Domain Layer Overview

### What is Domain Layer?

Domain layer adalah **jantung** aplikasi yang berisi:

- **Business Logic** (aturan bisnis)
- **Domain Models** (entities, value objects)
- **Abstractions** (interfaces untuk repository & services)

### Prinsip Domain Layer

✅ **Framework Agnostic** - Tidak boleh import dari Hono, Drizzle, Supabase  
✅ **Pure TypeScript** - Business logic dalam TypeScript murni  
✅ **Self-Contained** - Semua validation & rules ada di domain  
✅ **Testable** - Easy to unit test (no external dependencies)  
✅ **Explicit** - Nama method & property jelas purpose nya

### Folder Structure

```
src/modules/auth/domain/
├── value-objects/          # Primitive wrappers dengan validation
│   ├── Email.vo.ts
│   ├── Password.vo.ts
│   ├── TenantId.vo.ts
│   ├── UserId.vo.ts
│   ├── Role.vo.ts
│   └── Permission.vo.ts
├── entities/               # Business objects dengan behavior
│   ├── User.entity.ts
│   ├── Tenant.entity.ts
│   └── Session.entity.ts
├── repositories/           # Data access interfaces (kontrak saja)
│   ├── IUserRepository.ts
│   ├── ITenantRepository.ts
│   ├── IRoleRepository.ts
│   ├── IPermissionRepository.ts
│   ├── IRefreshTokenRepository.ts
│   └── IAuditLogRepository.ts
├── services/               # External service interfaces
│   └── IAuthProvider.ts
└── errors/                 # Domain-specific errors
    ├── AuthErrors.ts
    ├── TenantErrors.ts
    └── PermissionErrors.ts
```

---

## 💎 Value Objects

### What is Value Object?

Value Object adalah **wrapper** untuk primitive types (string, number) yang:

- **Immutable** (tidak bisa diubah setelah dibuat)
- **Self-validating** (validasi di constructor)
- **Equality by value** (dua object sama jika value nya sama)

### Use Case

Instead of:

```typescript
function createUser(email: string) {
    if (!email.includes("@")) throw new Error("Invalid email");
    // ...
}
```

Use Value Object:

```typescript
function createUser(email: Email) {
    // Email sudah pasti valid (validated di constructor)
}
```

---

### 1. `Email` Value Object

**File**: `src/modules/auth/domain/value-objects/Email.vo.ts`

```typescript
export class Email {
    private readonly value: string;

    constructor(email: string) {
        this.value = this.validate(email);
    }

    private validate(email: string): string {
        const trimmed = email.trim().toLowerCase();

        // RFC 5322 simplified regex
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
```

**Usage**:

```typescript
const email = new Email("user@example.com"); // OK
const invalid = new Email("not-an-email"); // Throw InvalidEmailError
```

---

### 2. `Password` Value Object

**File**: `src/modules/auth/domain/value-objects/Password.vo.ts`

```typescript
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
        // if (!/[!@#$%^&*]/.test(password)) {
        //   throw new WeakPasswordError('Password harus ada simbol');
        // }

        return password;
    }

    getValue(): string {
        return this.value;
    }

    // Password tidak boleh di-toString untuk security
    toString(): string {
        return "***";
    }
}
```

**Business Rule**:

- ✅ Minimal 8 karakter
- ✅ Harus ada uppercase, lowercase, number
- ✅ Optional: simbol (bisa diaktifkan jika perlu)

---

### 3. `TenantId` & `UserId` Value Object

**File**: `src/modules/auth/domain/value-objects/TenantId.vo.ts`

```typescript
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

export class TenantId {
    private readonly value: string;

    constructor(id: string) {
        if (!uuidValidate(id)) {
            throw new InvalidTenantIdError(id);
        }
        this.value = id;
    }

    static generate(): TenantId {
        return new TenantId(uuidv4());
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
```

**`UserId`** - sama dengan `TenantId` (copy paste, ganti nama)

---

### 4. `Role` Value Object

**File**: `src/modules/auth/domain/value-objects/Role.vo.ts`

```typescript
export enum RoleEnum {
    SUPER_ADMIN = "SUPER_ADMIN",
    SUPPORT_STAFF = "SUPPORT_STAFF",
    TENANT_ADMIN = "TENANT_ADMIN",
    TENANT_HEAD = "TENANT_HEAD",
    UNIT_ADMIN = "UNIT_ADMIN",
    UNIT_HEAD = "UNIT_HEAD",
    KADER = "KADER",
    VILLAGE_HEAD = "VILLAGE_HEAD",
    DISTRICT_HEAD = "DISTRICT_HEAD",
    PARENT = "PARENT",
}

export class Role {
    private readonly value: RoleEnum;

    constructor(role: string) {
        if (!Object.values(RoleEnum).includes(role as RoleEnum)) {
            throw new InvalidRoleError(role);
        }
        this.value = role as RoleEnum;
    }

    getValue(): RoleEnum {
        return this.value;
    }

    equals(other: Role): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }

    // Helper methods
    isPlatformLevel(): boolean {
        return [RoleEnum.SUPER_ADMIN, RoleEnum.SUPPORT_STAFF].includes(
            this.value
        );
    }

    isTenantLevel(): boolean {
        return [RoleEnum.TENANT_ADMIN, RoleEnum.TENANT_HEAD].includes(
            this.value
        );
    }

    isUnitLevel(): boolean {
        return [
            RoleEnum.UNIT_ADMIN,
            RoleEnum.UNIT_HEAD,
            RoleEnum.KADER,
        ].includes(this.value);
    }

    isTerritoryLevel(): boolean {
        return [RoleEnum.VILLAGE_HEAD, RoleEnum.DISTRICT_HEAD].includes(
            this.value
        );
    }
}
```

---

### 5. `Permission` Value Object

**File**: `src/modules/auth/domain/value-objects/Permission.vo.ts`

```typescript
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
```

**Example**:

```typescript
const perm = new Permission("users:write");
perm.getResource(); // 'users'
perm.getAction(); // 'write'
perm.isWrite(); // true
```

---

## 🏛️ Entities

### What is Entity?

Entity adalah **business object** yang:

- **Punya identity** (ID unique)
- **Punya behavior** (method untuk business logic)
- **Mutable** (bisa berubah state)
- **Equality by ID** (dua entity sama jika ID sama)

---

### 1. `User` Entity

**File**: `src/modules/auth/domain/entities/User.entity.ts`

```typescript
import { UserId } from "../value-objects/UserId.vo";
import { TenantId } from "../value-objects/TenantId.vo";
import { Email } from "../value-objects/Email.vo";
import { Role } from "../value-objects/Role.vo";
import { Permission } from "../value-objects/Permission.vo";

export interface UserProps {
    id: UserId;
    tenantId: TenantId | null; // Null untuk SUPER_ADMIN
    supabaseAuthId: string;
    email: Email;
    fullName: string;
    role: Role;
    permissions: Permission[]; // Effective permissions (role default + user override)
    scopeUnitId?: string | null;
    scopeRegionId?: string | null;
    isActive: boolean;
    emailVerified: boolean;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export class User {
    private props: UserProps;

    constructor(props: UserProps) {
        this.props = props;
    }

    // Getters
    get id(): UserId {
        return this.props.id;
    }

    get tenantId(): TenantId | null {
        return this.props.tenantId;
    }

    get email(): Email {
        return this.props.email;
    }

    get role(): Role {
        return this.props.role;
    }

    get permissions(): Permission[] {
        return this.props.permissions;
    }

    get scopeUnitId(): string | null | undefined {
        return this.props.scopeUnitId;
    }

    get scopeRegionId(): string | null | undefined {
        return this.props.scopeRegionId;
    }

    get isActive(): boolean {
        return this.props.isActive;
    }

    // Business Methods

    /**
     * Check apakah user bisa akses tenant tertentu
     */
    canAccessTenant(tenantId: TenantId): boolean {
        // Platform admin bisa akses semua tenant
        if (this.role.isPlatformLevel()) {
            return true;
        }

        // User biasa hanya bisa akses tenant mereka sendiri
        return this.tenantId?.equals(tenantId) ?? false;
    }

    /**
     * Check apakah user punya permission tertentu
     */
    hasPermission(permission: Permission): boolean {
        // Super admin punya semua permission
        if (this.role.getValue() === RoleEnum.SUPER_ADMIN) {
            return true;
        }

        return this.permissions.some((p) => p.equals(permission));
    }

    /**
     * Check apakah resource dalam scope unit user
     */
    isInUnitScope(unitId: string): boolean {
        // No scope = bisa akses semua unit (tenant admin)
        if (!this.scopeUnitId) {
            return true;
        }

        return this.scopeUnitId === unitId;
    }

    /**
     * Check apakah resource dalam scope region user
     */
    isInRegionScope(regionId: string): boolean {
        // No scope = bisa akses semua region (tenant admin)
        if (!this.scopeRegionId) {
            return true;
        }

        return this.scopeRegionId === regionId;
    }

    /**
     * Check apakah user adalah super admin
     */
    isSuperAdmin(): boolean {
        return this.role.getValue() === RoleEnum.SUPER_ADMIN;
    }

    /**
     * Check apakah user bisa assign role ke user lain
     */
    canAssignRole(targetRole: Role): boolean {
        // Super admin bisa assign semua role
        if (this.isSuperAdmin()) {
            return true;
        }

        // Tenant admin bisa assign role di bawah tenant level
        if (this.role.getValue() === RoleEnum.TENANT_ADMIN) {
            return targetRole.isUnitLevel() || targetRole.isTerritoryLevel();
        }

        // Role lain tidak bisa assign
        return false;
    }

    /**
     * Activate user
     */
    activate(): void {
        this.props.isActive = true;
        this.props.updatedAt = new Date();
    }

    /**
     * Deactivate user
     */
    deactivate(): void {
        this.props.isActive = false;
        this.props.updatedAt = new Date();
    }

    /**
     * Change role
     */
    changeRole(newRole: Role): void {
        this.props.role = newRole;
        this.props.updatedAt = new Date();
    }

    /**
     * Verify email
     */
    verifyEmail(): void {
        this.props.emailVerified = true;
        this.props.updatedAt = new Date();
    }

    /**
     * Convert to plain object (untuk serialization)
     */
    toObject() {
        return {
            id: this.id.getValue(),
            tenantId: this.tenantId?.getValue() ?? null,
            supabaseAuthId: this.props.supabaseAuthId,
            email: this.email.getValue(),
            fullName: this.props.fullName,
            role: this.role.getValue(),
            permissions: this.permissions.map((p) => p.getValue()),
            scopeUnitId: this.scopeUnitId,
            scopeRegionId: this.scopeRegionId,
            isActive: this.isActive,
            emailVerified: this.props.emailVerified,
            metadata: this.props.metadata,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}
```

**Key Methods Explained**:

| Method              | Purpose             | Example                                                                 |
| ------------------- | ------------------- | ----------------------------------------------------------------------- |
| `canAccessTenant()` | Check tenant access | Platform admin bypass, others check tenant_id                           |
| `hasPermission()`   | Check permission    | Super admin auto-true, others check permission list                     |
| `isInUnitScope()`   | Validate scope      | Kader hanya bisa akses data di unit mereka                              |
| `isInRegionScope()` | Validate scope      | Village Head hanya bisa akses data regionnya                            |
| `canAssignRole()`   | Authorization       | Tenant Admin bisa assign role ke Kader, tapi bukan ke Tenant Admin lain |

---

### 2. `Tenant` Entity

**File**: `src/modules/auth/domain/entities/Tenant.entity.ts`

```typescript
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

    get maxUsers(): number {
        return this.props.maxUsers;
    }

    get currentUserCount(): number {
        return this.props.currentUserCount;
    }

    // Business Methods

    /**
     * Check apakah tenant aktif (bisa digunakan)
     */
    isActive(): boolean {
        return (
            this.props.subscriptionStatus === SubscriptionStatus.ACTIVE &&
            (this.props.subscriptionExpiresAt === null ||
                this.props.subscriptionExpiresAt > new Date())
        );
    }

    /**
     * Check apakah bisa tambah user baru (belum exceed limit)
     */
    canAddUser(): boolean {
        return this.currentUserCount < this.maxUsers;
    }

    /**
     * Check apakah tenant punya feature tertentu
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

    toObject() {
        return {
            id: this.id.getValue(),
            name: this.name,
            slug: this.slug,
            subscriptionPlan: this.props.subscriptionPlan,
            subscriptionStatus: this.subscriptionStatus,
            subscriptionExpiresAt: this.props.subscriptionExpiresAt,
            maxUsers: this.maxUsers,
            currentUserCount: this.currentUserCount,
            config: this.props.config,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}
```

---

### 3. `Session` Entity

**File**: `src/modules/auth/domain/entities/Session.entity.ts`

```typescript
export interface SessionProps {
    id: string;
    userId: string;
    token: string; // Hashed refresh token
    expiresAt: Date;
    revoked: boolean;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
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

    // Business Methods

    /**
     * Check apakah session sudah expired
     */
    isExpired(): boolean {
        return this.props.expiresAt < new Date();
    }

    /**
     * Check apakah session valid (not revoked & not expired)
     */
    isValid(): boolean {
        return !this.revoked && !this.isExpired();
    }

    /**
     * Revoke session (logout)
     */
    revoke(): void {
        this.props.revoked = true;
    }

    toObject() {
        return {
            id: this.id,
            userId: this.userId,
            expiresAt: this.expiresAt,
            revoked: this.revoked,
            ipAddress: this.props.ipAddress,
            userAgent: this.props.userAgent,
            createdAt: this.props.createdAt,
        };
    }
}
```

---

## 📦 Repository Interfaces

Repository adalah **abstraksi** untuk data access. Domain layer hanya define **interface** (kontrak), implementasi ada di Infrastructure layer.

### Why Interface?

✅ **Dependency Inversion** - Domain tidak tergantung pada Drizzle/Supabase  
✅ **Testability** - Bisa mock repository di unit test  
✅ **Flexibility** - Ganti ORM tanpa ubah domain logic

---

### 1. `IUserRepository`

**File**: `src/modules/auth/domain/repositories/IUserRepository.ts`

```typescript
import { User } from "../entities/User.entity";
import { Email } from "../value-objects/Email.vo";
import { UserId } from "../value-objects/UserId.vo";
import { TenantId } from "../value-objects/TenantId.vo";

export interface CreateUserDTO {
    tenantId: TenantId | null;
    supabaseAuthId: string;
    email: Email;
    fullName: string;
    role: string;
    scopeUnitId?: string;
    scopeRegionId?: string;
    metadata?: Record<string, any>;
}

export interface UpdateUserDTO {
    fullName?: string;
    role?: string;
    scopeUnitId?: string;
    scopeRegionId?: string;
    isActive?: boolean;
    metadata?: Record<string, any>;
}

export interface IUserRepository {
    /**
     * Find user by ID
     */
    findById(id: UserId): Promise<User | null>;

    /**
     * Find user by email (scoped by tenant)
     */
    findByEmail(email: Email, tenantId: TenantId): Promise<User | null>;

    /**
     * Find user by Supabase Auth ID
     */
    findBySupabaseAuthId(supabaseAuthId: string): Promise<User | null>;

    /**
     * Create new user
     */
    create(data: CreateUserDTO): Promise<User>;

    /**
     * Update user
     */
    update(id: UserId, data: UpdateUserDTO): Promise<User>;

    /**
     * Soft delete user
     */
    delete(id: UserId): Promise<void>;

    /**
     * Count users by tenant (untuk check limit)
     */
    countByTenant(tenantId: TenantId): Promise<number>;

    /**
     * List users by tenant (paginated)
     */
    listByTenant(
        tenantId: TenantId,
        page: number,
        limit: number
    ): Promise<User[]>;
}
```

---

### 2. `ITenantRepository`

**File**: `src/modules/auth/domain/repositories/ITenantRepository.ts`

```typescript
import { Tenant } from "../entities/Tenant.entity";
import { TenantId } from "../value-objects/TenantId.vo";

export interface CreateTenantDTO {
    name: string;
    slug: string;
    subscriptionPlan: string;
    maxUsers: number;
    config?: Record<string, any>;
    contactEmail?: string;
    contactPhone?: string;
}

export interface UpdateTenantDTO {
    name?: string;
    subscriptionPlan?: string;
    subscriptionStatus?: string;
    maxUsers?: number;
    config?: Record<string, any>;
}

export interface ITenantRepository {
    findById(id: TenantId): Promise<Tenant | null>;
    findBySlug(slug: string): Promise<Tenant | null>;
    create(data: CreateTenantDTO): Promise<Tenant>;
    update(id: TenantId, data: UpdateTenantDTO): Promise<Tenant>;
    delete(id: TenantId): Promise<void>;
    list(page: number, limit: number): Promise<Tenant[]>;
}
```

---

### 3. Other Repository Interfaces

Simplified (follow same pattern):

- **`IRoleRepository`** - findAll, findByName
- **`IPermissionRepository`** - findByUserId, assignToUser, revokeFromUser
- **`IRefreshTokenRepository`** - create, findByToken, revoke, revokeAllByUser
- **`IAuditLogRepository`** - log, findByUser, findByTenant

**File Paths** (create empty interfaces for now):

- `src/modules/auth/domain/repositories/IRoleRepository.ts`
- `src/modules/auth/domain/repositories/IPermissionRepository.ts`
- `src/modules/auth/domain/repositories/IRefreshTokenRepository.ts`
- `src/modules/auth/domain/repositories/IAuditLogRepository.ts`

---

## 🔌 Service Interfaces

### `IAuthProvider`

Abstraksi untuk Supabase Auth (atau provider lain).

**File**: `src/modules/auth/domain/services/IAuthProvider.ts`

```typescript
export interface SignUpResult {
    authUserId: string;
    email: string;
}

export interface SignInResult {
    authUserId: string;
    email: string;
    accessToken: string;
}

export interface VerifyTokenResult {
    authUserId: string;
    email: string;
    expiresAt: Date;
}

export interface IAuthProvider {
    /**
     * Sign up user via auth provider
     */
    signUp(email: string, password: string): Promise<SignUpResult>;

    /**
     * Sign in user via auth provider
     */
    signIn(email: string, password: string): Promise<SignInResult>;

    /**
     * Verify JWT token
     */
    verifyToken(token: string): Promise<VerifyTokenResult>;

    /**
     * Send password reset email
     */
    sendPasswordResetEmail(email: string): Promise<void>;

    /**
     * Reset password with token
     */
    resetPassword(token: string, newPassword: string): Promise<void>;
}
```

---

## ❌ Domain Errors

### Custom Error Classes

**File**: `src/modules/auth/domain/errors/AuthErrors.ts`

```typescript
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
```

**File**: `src/modules/auth/domain/errors/TenantErrors.ts`

```typescript
export class TenantNotFoundError extends Error {
    constructor(identifier: string) {
        super(`Tenant not found: ${identifier}`);
        this.name = "TenantNotFoundError";
    }
}

export class TenantInactiveError extends Error {
    constructor(tenantId: string) {
        super(`Tenant is inactive: ${tenantId}`);
        this.name = "TenantInactiveError";
    }
}

export class UserLimitExceededError extends Error {
    constructor(tenantId: string, limit: number) {
        super(`Tenant ${tenantId} has reached user limit: ${limit}`);
        this.name = "UserLimitExceededError";
    }
}

export class InvalidTenantIdError extends Error {
    constructor(id: string) {
        super(`Invalid tenant ID format: ${id}`);
        this.name = "InvalidTenantIdError";
    }
}
```

**File**: `src/modules/auth/domain/errors/PermissionErrors.ts`

```typescript
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
```

---

## 📜 Business Rules

### Authentication Rules

1. ✅ Email harus valid format & unique per tenant
2. ✅ Password minimal 8 karakter dengan complexity
3. ✅ User harus verify email sebelum bisa login (optional, tergantung requirement)
4. ✅ Failed login > 5x dalam 15 menit = lock account

### Authorization Rules

1. ✅ **Tenant Isolation**: User hanya bisa akses data tenant mereka (kecuali Platform Admin)
2. ✅ **Scope-based Access**:
    - Kader/Unit Admin: Hanya bisa akses data di unit mereka
    - Village Head: Hanya bisa akses data di region mereka
    - Tenant Admin: Bisa akses semua data di tenant mereka
3. ✅ **Permission Hierarchy**:
    - Super Admin punya semua permission
    - Effective permission = role default + user granted - user revoked
4. ✅ **Role Assignment**:
    - Super Admin bisa assign semua role
    - Tenant Admin bisa assign role level Unit & Territory
    - User lain tidak bisa assign role

### Session Rules

1. ✅ Access token expires dalam 15 menit
2. ✅ Refresh token expires dalam 30 hari
3. ✅ Revoked token tidak bisa dipakai lagi
4. ✅ User bisa punya multiple active sessions (login dari multiple devices)

---

## ✅ Checklist

- [ ] Create all Value Objects dengan validation
- [ ] Create all Entities dengan business methods
- [ ] Create all Repository Interfaces
- [ ] Create IAuthProvider interface
- [ ] Create all Domain Errors
- [ ] Write unit tests untuk Value Objects
- [ ] Write unit tests untuk Entity business methods
- [ ] Review dengan team (pastikan business rules benar)

---

**Next**: [03-USE_CASES.md](./03-USE_CASES.md)
