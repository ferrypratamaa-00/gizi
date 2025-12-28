# 🛠️ Implementation Guide - Step by Step

> **Purpose**: Complete step-by-step guide untuk implement auth system  
> **Audience**: Developer yang akan eksekusi implementation  
> **Estimated Time**: 2-3 hari (dengan testing)

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Phase 1: Setup & Dependencies](#phase-1-setup--dependencies)
3. [Phase 2: Database Setup](#phase-2-database-setup)
4. [Phase 3: Domain Layer](#phase-3-domain-layer)
5. [Phase 4: Infrastructure Layer](#phase-4-infrastructure-layer)
6. [Phase 5: Application Layer](#phase-5-application-layer)
7. [Phase 6: Interface Layer](#phase-6-interface-layer)
8. [Phase 7: Testing](#phase-7-testing)
9. [Phase 8: Monorepo Integration](#phase-8-monorepo-integration)

---

## ✅ Prerequisites

Before starting, ensure you have:

- [ ] Bun installed (>= 1.3.3)
- [ ] Supabase account created
- [ ] Git configured
- [ ] VSCode or IDE ready

---

## 📦 Phase 1: Setup & Dependencies

### 1.1 Install Dependencies

```bash
cd apps/backend

# Core dependencies
bun add @supabase/supabase-js drizzle-orm postgres zod jose

# Hono utilities
bun add @hono/zod-validator

# Dev dependencies
bun add -d drizzle-kit tsx @types/node
```

**Verify**:

```bash
bun --version # Should show >= 1.3.3
```

---

### 1.2 Create Environment File

Create `.env` in `apps/backend/`:

```env
# App
NODE_ENV=development
APP_NAME=Gizi Platform API
APP_PORT=3000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.your-project.supabase.co:5432/postgres

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=30d

# OTP / WhatsApp (optional untuk Phase 1)
FONNTE_API_KEY=your-fonnte-key
# or
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=+1234567890
```

Create `.env.example` (copy `.env` but remove values).

---

### 1.3 Update package.json Scripts

```json
{
    "name": "backend",
    "scripts": {
        "dev": "bun run --hot src/index.ts",
        "db:generate": "drizzle-kit generate",
        "db:migrate": "drizzle-kit migrate",
        "db:push": "drizzle-kit push",
        "db:studio": "drizzle-kit studio",
        "db:seed": "bun run src/db/seed.ts",
        "test": "bun test"
    }
}
```

---

### 1.4 Create Drizzle Config

Create `drizzle.config.ts` di root `apps/backend/`:

```typescript
import type { Config } from "drizzle-kit";

export default {
    schema: "./src/db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    verbose: true,
    strict: true,
} satisfies Config;
```

---

### 1.5 Setup tsconfig

Create/update `tsconfig.json`:

```json
{
    "compilerOptions": {
        "target": "ESNext",
        "module": "ESNext",
        "lib": ["ESNext"],
        "moduleResolution": "bundler",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "resolveJsonModule": true,
        "allowSyntheticDefaultImports": true,
        "types": ["bun-types"],
        "baseUrl": ".",
        "paths": {
            "@/*": ["./src/*"]
        }
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules"]
}
```

---

## 🗄️ Phase 2: Database Setup

### 2.1 Create Folder Structure

```bash
mkdir -p src/db/schema
mkdir -p src/db/seeders
```

### 2.2 Create Schema Files

**File**: `src/db/schema/tenants.ts`

```typescript
import {
    pgTable,
    uuid,
    varchar,
    jsonb,
    timestamp,
    integer,
} from "drizzle-orm/pg-core";

export const tenants = pgTable("tenants", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    subscriptionPlan: varchar("subscription_plan", { length: 50 })
        .notNull()
        .default("BASIC"),
    subscriptionStatus: varchar("subscription_status", { length: 50 })
        .notNull()
        .default("ACTIVE"),
    subscriptionExpiresAt: timestamp("subscription_expires_at"),
    maxUsers: integer("max_users").default(100),
    config: jsonb("config").$type<{
        features?: string[];
        enabledResources?: string[];
        branding?: {
            logo?: string;
            primaryColor?: string;
            appName?: string;
        };
    }>(),
    contactEmail: varchar("contact_email", { length: 255 }),
    contactPhone: varchar("contact_phone", { length: 50 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
});
```

**File**: `src/db/schema/users.ts`

```typescript
import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    jsonb,
    boolean,
    uniqueIndex,
} from "drizzle-orm/pg-core";
import { tenants } from "./tenants";

export const users = pgTable(
    "users",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        tenantId: uuid("tenant_id").references(() => tenants.id),
        supabaseAuthId: uuid("supabase_auth_id").notNull().unique(),

        // Email or Phone auth
        email: varchar("email", { length: 255 }), // Nullable (phone users don't need email)  phoneNumber: varchar('phone_number', { length: 20 }),
        authMethod: varchar("auth_method", { length: 20 })
            .notNull()
            .default("email"), // 'email' | 'phone'

        fullName: varchar("full_name", { length: 255 }),
        role: varchar("role", { length: 50 }).notNull(),

        scopeUnitId: uuid("scope_unit_id"),
        scopeRegionId: uuid("scope_region_id"),

        metadata: jsonb("metadata"),

        emailVerified: boolean("email_verified").default(false),
        phoneVerified: boolean("phone_verified").default(false),
        isActive: boolean("is_active").default(true),

        lastLoginAt: timestamp("last_login_at"),

        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
        deletedAt: timestamp("deleted_at"),
    },
    (table) => ({
        emailTenantUnique: uniqueIndex("email_tenant_unique").on(
            table.email,
            table.tenantId
        ),
        phoneUnique: uniqueIndex("phone_unique").on(table.phoneNumber),
    })
);
```

**File**: `src/db/schema/refresh-tokens.ts`

```typescript
import {
    pgTable,
    uuid,
    text,
    timestamp,
    boolean,
    varchar,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const refreshTokens = pgTable("refresh_tokens", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    revoked: boolean("revoked").notNull().default(false),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    revokedAt: timestamp("revoked_at"),
});
```

**File**: `src/db/schema/otp-codes.ts`

```typescript
import {
    pgTable,
    uuid,
    varchar,
    timestamp,
    boolean,
    integer,
} from "drizzle-orm/pg-core";

export const otpCodes = pgTable("otp_codes", {
    id: uuid("id").primaryKey().defaultRandom(),
    phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
    otp: varchar("otp", { length: 6 }).notNull(),
    purpose: varchar("purpose", { length: 50 }).notNull(), // 'login' | 'register'
    expiresAt: timestamp("expires_at").notNull(),
    verified: boolean("verified").notNull().default(false),
    attempts: integer("attempts").notNull().default(0),
    ipAddress: varchar("ip_address", { length: 45 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

**File**: `src/db/schema/audit-logs.ts`

```typescript
import {
    pgTable,
    uuid,
    varchar,
    text,
    jsonb,
    timestamp,
} from "drizzle-orm/pg-core";
import { tenants } from "./tenants";
import { users } from "./users";

export const auditLogs = pgTable("audit_logs", {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").references(() => tenants.id),
    userId: uuid("user_id").references(() => users.id),
    action: varchar("action", { length: 100 }).notNull(),
    resource: varchar("resource", { length: 50 }),
    resourceId: uuid("resource_id"),
    oldValue: jsonb("old_value"),
    newValue: jsonb("new_value"),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

**File**: `src/db/schema.ts` (barrel export)

```typescript
export * from "./schema/tenants";
export * from "./schema/users";
export * from "./schema/refresh-tokens";
export * from "./schema/otp-codes";
export * from "./schema/audit-logs";
```

---

### 2.3 Generate & Run Migration

```bash
# Generate migration
bun run db:generate

# Review generated SQL
cat drizzle/0000_*.sql

# Apply migration
bun run db:migrate

# Or use push for development (skip migration files)
bun run db:push
```

**Verify** in Supabase Dashboard → Table Editor → Should see all tables.

---

### 2.4 Create Database Client

**File**: `src/db/index.ts`

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { appEnv } from "@/core/env";
import * as schema from "./schema";

const client = postgres(appEnv.DATABASE_URL, {
    max: 10,
});

export const db = drizzle(client, { schema });
```

---

### 2.5 Create Environment Loader

**File**: `src/core/env/index.ts`

```typescript
const requiredEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

const optionalEnv = (key: string, defaultValue: string = ""): string => {
    return process.env[key] ?? defaultValue;
};

export const appEnv = {
    NODE_ENV: optionalEnv("NODE_ENV", "development"),
    APP_NAME: optionalEnv("APP_NAME", "Gizi Platform API"),
    APP_PORT: parseInt(optionalEnv("APP_PORT", "3000"), 10),

    SUPABASE_URL: requiredEnv("SUPABASE_URL"),
    SUPABASE_ANON_KEY: requiredEnv("SUPABASE_ANON_KEY"),
    SUPABASE_SERVICE_ROLE_KEY: requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),

    DATABASE_URL: requiredEnv("DATABASE_URL"),

    JWT_SECRET: requiredEnv("JWT_SECRET"),
    JWT_ACCESS_TOKEN_EXPIRY: optionalEnv("JWT_ACCESS_TOKEN_EXPIRY", "15m"),
    JWT_REFRESH_TOKEN_EXPIRY: optionalEnv("JWT_REFRESH_TOKEN_EXPIRY", "30d"),

    // OTP (optional)
    FONNTE_API_KEY: optionalEnv("FONNTE_API_KEY"),
};
```

---

## 🏛️ Phase 3: Domain Layer

### 3.1 Create Folder Structure

```bash
mkdir -p src/modules/auth/domain/value-objects
mkdir -p src/modules/auth/domain/entities
mkdir -p src/modules/auth/domain/repositories
mkdir -p src/modules/auth/domain/services
mkdir -p src/modules/auth/domain/errors
mkdir -p src/modules/auth/domain/policies
```

### 3.2 Create Value Objects

**File**: `src/modules/auth/domain/value-objects/Email.vo.ts`

```typescript
import { InvalidEmailError } from "../errors/AuthErrors";

export class Email {
    private readonly value: string;

    constructor(email: string) {
        this.value = this.validate(email);
    }

    private validate(email: string): string {
        const trimmed = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(trimmed)) {
            throw new InvalidEmailError(email);
        }

        if (trimmed.length > 255) {
            throw new InvalidEmailError("Email too long");
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

**File**: `src/modules/auth/domain/value-objects/PhoneNumber.vo.ts`

```typescript
import { InvalidPhoneNumberError } from "../errors/AuthErrors";

export class PhoneNumber {
    private readonly value: string;

    constructor(phoneNumber: string) {
        this.value = this.validate(phoneNumber);
    }

    private validate(phone: string): string {
        const cleaned = phone.replace(/\D/g, "");
        let normalized = cleaned;

        if (normalized.startsWith("62")) {
            normalized = "0" + normalized.substring(2);
        }

        if (!normalized.startsWith("08")) {
            throw new InvalidPhoneNumberError("Phone must start with 08");
        }

        if (normalized.length < 10 || normalized.length > 13) {
            throw new InvalidPhoneNumberError("Invalid phone length");
        }

        return normalized;
    }

    getValue(): string {
        return this.value;
    }

    getInternationalFormat(): string {
        return "62" + this.value.substring(1);
    }

    getMasked(): string {
        const first4 = this.value.substring(0, 4);
        const last4 = this.value.substring(this.value.length - 4);
        return `${first4}****${last4}`;
    }
}
```

Create other Value Objects:

- `Password.vo.ts` (with strength validation)
- `TenantId.vo.ts` (UUID validation)
- `UserId.vo.ts` (UUID validation)
- `Role.vo.ts` (enum validation)

---

### 3.3 Create Entities

**File**: `src/modules/auth/domain/entities/User.entity.ts`

```typescript
import { UserId } from "../value-objects/UserId.vo";
import { TenantId } from "../value-objects/TenantId.vo";
import { Email } from "../value-objects/Email.vo";
import { Role, RoleEnum } from "../value-objects/Role.vo";

export interface UserProps {
    id: UserId;
    tenantId: TenantId | null;
    supabaseAuthId: string;
    email?: Email;
    phoneNumber?: string;
    authMethod: "email" | "phone";
    fullName: string;
    role: Role;
    scopeUnitId?: string | null;
    scopeRegionId?: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class User {
    private props: UserProps;

    constructor(props: UserProps) {
        this.props = props;
    }

    get id(): UserId {
        return this.props.id;
    }

    get tenantId(): TenantId | null {
        return this.props.tenantId;
    }

    get role(): Role {
        return this.props.role;
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
    canAccessTenant(tenantId: TenantId): boolean {
        if (this.role.isPlatformLevel()) {
            return true;
        }
        return this.tenantId?.equals(tenantId) ?? false;
    }

    isInUnitScope(unitId: string): boolean {
        if (!this.scopeUnitId) return true; // No scope = can access all
        return this.scopeUnitId === unitId;
    }

    isInRegionScope(regionId: string): boolean {
        if (!this.scopeRegionId) return true;
        return this.scopeRegionId === regionId;
    }

    isSuperAdmin(): boolean {
        return this.role.getValue() === RoleEnum.SUPER_ADMIN;
    }

    toObject() {
        return {
            id: this.id.getValue(),
            tenantId: this.tenantId?.getValue() ?? null,
            supabaseAuthId: this.props.supabaseAuthId,
            email: this.props.email?.getValue(),
            phoneNumber: this.props.phoneNumber,
            authMethod: this.props.authMethod,
            fullName: this.props.fullName,
            role: this.role.getValue(),
            scopeUnitId: this.scopeUnitId,
            scopeRegionId: this.scopeRegionId,
            isActive: this.isActive,
            createdAt: this.props.createdAt,
            updatedAt: this.props.updatedAt,
        };
    }
}
```

---

### 3.4 Create Repository Interfaces

**File**: `src/modules/auth/domain/repositories/IUserRepository.ts`

```typescript
import { User } from "../entities/User.entity";
import { Email } from "../value-objects/Email.vo";
import { UserId } from "../value-objects/UserId.vo";
import { TenantId } from "../value-objects/TenantId.vo";
import { PhoneNumber } from "../value-objects/PhoneNumber.vo";

export interface CreateUserDTO {
    tenantId: TenantId | null;
    supabaseAuthId: string;
    email?: Email;
    phoneNumber?: string;
    authMethod: "email" | "phone";
    fullName: string;
    role: string;
    scopeUnitId?: string;
    scopeRegionId?: string;
    metadata?: Record<string, any>;
}

export interface IUserRepository {
    findById(id: UserId): Promise<User | null>;
    findByEmail(email: Email, tenantId?: TenantId): Promise<User | null>;
    findByPhoneNumber(phone: PhoneNumber): Promise<User | null>;
    findBySupabaseAuthId(supabaseAuthId: string): Promise<User | null>;
    create(data: CreateUserDTO): Promise<User>;
    update(id: UserId, data: Partial<CreateUserDTO>): Promise<User>;
    delete(id: UserId): Promise<void>;
}
```

Create other repository interfaces:

- `ITenantRepository.ts`
- `IRefreshTokenRepository.ts`
- `IOtpRepository.ts`
- `IAuditLogRepository.ts`

---

### 3.5 Create Service Interfaces

**File**: `src/modules/auth/domain/services/IAuthProvider.ts`

```typescript
export interface SignUpResult {
    authUserId: string;
    email?: string;
    phoneNumber?: string;
}

export interface SignInResult {
    authUserId: string;
    accessToken: string;
}

export interface IAuthProvider {
    signUpWithEmail(email: string, password: string): Promise<SignUpResult>;
    signInWithEmail(email: string, password: string): Promise<SignInResult>;
    signUpWithPhone(phoneNumber: string): Promise<SignUpResult>;
    verifyToken(token: string): Promise<{ authUserId: string }>;
    resetPassword(email: string): Promise<void>;
}
```

**File**: `src/modules/auth/domain/services/IWhatsAppService.ts`

```typescript
export interface SendOtpParams {
    phoneNumber: string;
    otp: string;
    expiresIn: number; // minutes
}

export interface IWhatsAppService {
    sendOtp(params: SendOtpParams): Promise<void>;
}
```

---

### 3.6 Create Permission Policies

**File**: `src/modules/auth/domain/policies/role-policies.ts`

```typescript
export type Action = 'read' | 'write' | 'delete' | 'approve' | 'export';
export type Resource =
  | 'users'
  | 'children'
  | 'measurements'
  | 'reports'
  | 'tenants'
  | 'units'
  | 'regions';

export interface RolePolicy {
  role(string;
  permissions: {
    [key: string]: Action[]; // Support '*' for all resources
  };
  scope: 'global' | 'tenant' | 'unit' | 'region' | 'self';
}

export const ROLE_POLICIES: Record<string, RolePolicy> = {
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    permissions: {
      '*': ['read', 'write', 'delete', 'approve', 'export'],
    },
    scope: 'global',
  },
  TENANT_ADMIN: {
    role: 'TENANT_ADMIN',
    permissions: {
      users: ['read', 'write', 'delete'],
      children: ['read', 'write', 'delete'],
      measurements: ['read', 'write', 'approve'],
      reports: ['read', 'export'],
      units: ['read', 'write'],
      regions: ['read', 'write'],
    },
    scope: 'tenant',
  },
  KADER: {
    role: 'KADER',
    permissions: {
      children: ['read', 'write'],
      measurements: ['write'],
    },
    scope: 'unit',
  },
  PARENT: {
    role: 'PARENT',
    permissions: {
      children: ['read'],
      measurements: ['read'],
    },
    scope: 'self',
  },
  // ... add other roles
};
```

---

### 3.7 Create Domain Errors

**File**: `src/modules/auth/domain/errors/AuthErrors.ts`

```typescript
export class InvalidEmailError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidEmailError";
    }
}

export class InvalidPhoneNumberError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidPhoneNumberError";
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
        super("Invalid credentials");
        this.name = "InvalidCredentialsError";
    }
}

// ... add more errors
```

---

## 🏗️ Phase 4: Infrastructure Layer

(To be continued in next document due to length...)

**This covers**:

- Supabase Auth Provider implementation
- Drizzle Repository implementations
- Token Service (JWT generation & verification)
- WhatsApp Service (Fonnte/Twilio integration)

---

**Next**: Continue with Phase 4-8 in separate implementation docs or refer to existing documentation for detailed implementation patterns.

---

## 📝 Quick Reference

After implementing all layers, your folder structure should look like:

```
src/
├── core/
│   └── env/
├── db/
│   ├── schema/
│   ├── seeders/
│   └── index.ts
└── modules/
    └── auth/
        ├── domain/
        │   ├── entities/
        │   ├── value-objects/
        │   ├── repositories/
        │   ├── services/
        │   ├── policies/
        │   └── errors/
        ├── application/
        │   ├── use-cases/
        │   └── dto/
        ├── infrastructure/
        │   ├── repositories/
        │   ├── supabase/
        │   └── services/
        └── interfaces/
            └── http/
                ├── controllers/
                ├── middleware/
                ├── routes/
                └── dto/
```

---

**For complete implementation details**, refer to:

- [02-DOMAIN_LAYER.md](./02-DOMAIN_LAYER.md)
- [03-USE_CASES.md](./03-USE_CASES.md)
- [06-OTP_AUTHENTICATION.md](./06-OTP_AUTHENTICATION.md)
- [05-ROLE_PERMISSION_SYSTEM.md](./05-ROLE_PERMISSION_SYSTEM.md)
