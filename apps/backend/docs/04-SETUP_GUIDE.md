# 🚀 Setup Guide - Gizi Platform Auth System

> **Version**: 1.0.0  
> **Last Updated**: 2025-12-28  
> **Audience**: Backend Developer

---

## 📋 Prerequisites

Sebelum mulai, pastikan sudah install:

- ✅ **Bun** >= 1.3.3 ([Download](https://bun.sh))
- ✅ **Git**
- ✅ **Code Editor** (VSCode recommended)
- ✅ **Akun Supabase** (gratis di [supabase.com](https://supabase.com))

---

## 🎯 Step-by-Step Setup

### Step 1: Setup Supabase Project

#### 1.1 Create Project

1. Login ke [Supabase Dashboard](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
    - **Name**: `gizi-platform-dev` (atau nama lain)
    - **Database Password**: Generate strong password & **save it**
    - **Region**: Singapore (terdekat dengan Indonesia)
4. Wait ~2 menit (project provisioning)

#### 1.2 Get Credentials

Setelah project ready:

1. Go to **Settings** → **API**
2. Copy credentials:
    - **Project URL** → `https://xxxxx.supabase.co`
    - **anon/public key** → `eyJhbGc...` (public key)
    - **service_role key** → `eyJhbGc...` (secret key, jangan expose!)

3. Go to **Settings** → **Database**
4. Copy **Connection String** → URI format:
    ```
    postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
    ```
    Replace `[YOUR-PASSWORD]` dengan password yang tadi di-save

---

### Step 2: Setup Environment Variables

#### 2.1 Create `.env` File

Di root `apps/backend/`, create file `.env`:

```bash
cd /home/miss/projects/gizi/apps/backend
touch .env
```

#### 2.2 Fill Environment Variables

Open `.env` dan isi:

```env
# ===================================
# APP Configuration
# ===================================
NODE_ENV=development
APP_NAME=Gizi Platform API
APP_PORT=3000

# ===================================
# Supabase Configuration
# ===================================
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOi... # Public key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi... # Secret key (JANGAN COMMIT!)

# ===================================
# Database Configuration
# ===================================
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# ===================================
# JWT Configuration
# ===================================
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=30d

# ===================================
# Security
# ===================================
BCRYPT_SALT_ROUNDS=10
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000

# ===================================
# Logging
# ===================================
LOG_LEVEL=debug
```

**⚠️ IMPORTANT**:

- Copy `.env` ke `.env.example` tapi **hapus nilai sensitive**
- Add `.env` ke `.gitignore`

```bash
# Create .env.example
cp .env .env.example

# Edit .env.example, replace values dengan placeholder
# SUPABASE_URL=your-supabase-url-here
# DATABASE_URL=your-database-url-here
```

---

### Step 3: Install Dependencies

#### 3.1 Install Core Dependencies

```bash
cd /home/miss/projects/gizi/apps/backend

bun install @supabase/supabase-js
bun install drizzle-orm postgres
bun install zod
bun install jose # JWT handling
bun install hono
```

#### 3.2 Install Dev Dependencies

```bash
bun install -D drizzle-kit
bun install -D @types/bun
bun install -D tsx # For running TypeScript scripts
```

#### 3.3 Verify Installation

```bash
bun --version
# Should show 1.3.3 or higher
```

---

### Step 4: Setup Drizzle ORM

#### 4.1 Create Drizzle Config

Create file `drizzle.config.ts` di root `apps/backend/`:

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

#### 4.2 Create Environment Loader

Create file `src/core/env/index.ts`:

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
    // App
    NODE_ENV: optionalEnv("NODE_ENV", "development"),
    APP_NAME: optionalEnv("APP_NAME", "Gizi Platform API"),
    APP_PORT: parseInt(optionalEnv("APP_PORT", "3000"), 10),

    // Supabase
    SUPABASE_URL: requiredEnv("SUPABASE_URL"),
    SUPABASE_ANON_KEY: requiredEnv("SUPABASE_ANON_KEY"),
    SUPABASE_SERVICE_ROLE_KEY: requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),

    // Database
    DATABASE_URL: requiredEnv("DATABASE_URL"),

    // JWT
    JWT_SECRET: requiredEnv("JWT_SECRET"),
    JWT_ACCESS_TOKEN_EXPIRY: optionalEnv("JWT_ACCESS_TOKEN_EXPIRY", "15m"),
    JWT_REFRESH_TOKEN_EXPIRY: optionalEnv("JWT_REFRESH_TOKEN_EXPIRY", "30d"),

    // Security
    BCRYPT_SALT_ROUNDS: parseInt(optionalEnv("BCRYPT_SALT_ROUNDS", "10"), 10),
    RATE_LIMIT_MAX_REQUESTS: parseInt(
        optionalEnv("RATE_LIMIT_MAX_REQUESTS", "100"),
        10
    ),
    RATE_LIMIT_WINDOW_MS: parseInt(
        optionalEnv("RATE_LIMIT_WINDOW_MS", "60000"),
        10
    ),

    // Logging
    LOG_LEVEL: optionalEnv("LOG_LEVEL", "info"),
};
```

#### 4.3 Create Database Client

Create file `src/db/index.ts`:

```typescript
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { appEnv } from "@/core/env";
import * as schema from "./schema";

// Create postgres client
const client = postgres(appEnv.DATABASE_URL, {
    max: 10, // Connection pool size
});

// Create drizzle instance
export const db = drizzle(client, { schema });
```

#### 4.4 Add Scripts to package.json

Update `apps/backend/package.json`:

```json
{
    "name": "backend",
    "scripts": {
        "dev": "bun run --hot src/index.ts",
        "db:generate": "drizzle-kit generate",
        "db:migrate": "drizzle-kit migrate",
        "db:push": "drizzle-kit push",
        "db:studio": "drizzle-kit studio",
        "db:seed": "bun run src/db/seed.ts"
    },
    "dependencies": {
        "@supabase/supabase-js": "^2.39.0",
        "drizzle-orm": "^0.29.0",
        "postgres": "^3.4.0",
        "zod": "^3.22.0",
        "jose": "^5.2.0",
        "hono": "^4.11.3"
    },
    "devDependencies": {
        "@types/bun": "latest",
        "drizzle-kit": "^0.20.0",
        "tsx": "^4.7.0"
    }
}
```

---

### Step 5: Create Database Schema

Ikuti schema yang sudah didefinisikan di `01-DATABASE_SCHEMA.md`.

#### 5.1 Create Schema Files

Create folder structure:

```bash
mkdir -p src/db/schema
```

Create schema files (simplified untuk quick start):

**`src/db/schema/tenants.ts`**:

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
    config: jsonb("config"),
    contactEmail: varchar("contact_email", { length: 255 }),
    contactPhone: varchar("contact_phone", { length: 50 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
});
```

**`src/db/schema/users.ts`**:

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
        email: varchar("email", { length: 255 }).notNull(),
        fullName: varchar("full_name", { length: 255 }),
        phoneNumber: varchar("phone_number", { length: 50 }),
        role: varchar("role", { length: 50 }).notNull(),
        scopeUnitId: uuid("scope_unit_id"),
        scopeRegionId: uuid("scope_region_id"),
        metadata: jsonb("metadata"),
        emailVerified: boolean("email_verified").default(false),
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
    })
);
```

Create remaining schema files (roles, permissions, etc.) - refer to `01-DATABASE_SCHEMA.md`

**`src/db/schema.ts`** (barrel export):

```typescript
export * from "./schema/tenants";
export * from "./schema/users";
export * from "./schema/roles";
export * from "./schema/permissions";
export * from "./schema/role-permissions";
export * from "./schema/user-permissions";
export * from "./schema/refresh-tokens";
export * from "./schema/audit-logs";
```

#### 5.2 Generate Migration

```bash
bun run db:generate
```

Output:

```
✔ Generated migration file: drizzle/0000_initial_schema.sql
```

#### 5.3 Apply Migration

```bash
bun run db:migrate
```

Atau pakai `db:push` untuk development (skip migration files):

```bash
bun run db:push
```

#### 5.4 Verify Tables Created

Open Supabase Dashboard → **Table Editor** → Should see tables: `tenants`, `users`, etc.

---

### Step 6: Seed Master Data

#### 6.1 Create Seeder

Create file `src/db/seeders/roles.seeder.ts`:

```typescript
import { db } from "../index";
import { roles } from "../schema";

export async function seedRoles() {
    console.log("Seeding roles...");

    const roleData = [
        {
            name: "SUPER_ADMIN",
            displayName: "Super Administrator",
            level: 1,
            category: "PLATFORM",
        },
        {
            name: "SUPPORT_STAFF",
            displayName: "Support Staff",
            level: 2,
            category: "PLATFORM",
        },
        {
            name: "TENANT_ADMIN",
            displayName: "Tenant Administrator",
            level: 3,
            category: "TENANT",
        },
        {
            name: "TENANT_HEAD",
            displayName: "Head of Dinas",
            level: 4,
            category: "TENANT",
        },
        {
            name: "UNIT_ADMIN",
            displayName: "Unit Administrator (Bidan)",
            level: 5,
            category: "UNIT",
        },
        {
            name: "UNIT_HEAD",
            displayName: "Unit Head (Kepala Puskesmas)",
            level: 6,
            category: "UNIT",
        },
        {
            name: "KADER",
            displayName: "Kader Posyandu",
            level: 7,
            category: "UNIT",
        },
        {
            name: "VILLAGE_HEAD",
            displayName: "Kepala Desa / Lurah",
            level: 8,
            category: "TERRITORY",
        },
        {
            name: "DISTRICT_HEAD",
            displayName: "Camat",
            level: 7,
            category: "TERRITORY",
        },
        {
            name: "PARENT",
            displayName: "Orang Tua",
            level: 9,
            category: "PUBLIC",
        },
    ];

    await db.insert(roles).values(roleData).onConflictDoNothing();

    console.log("✅ Roles seeded successfully");
}
```

Create similar seeders for permissions & role-permissions.

**`src/db/seed.ts`** (runner):

```typescript
import { seedRoles } from "./seeders/roles.seeder";
import { seedPermissions } from "./seeders/permissions.seeder";
import { seedRolePermissions } from "./seeders/role-permissions.seeder";

async function main() {
    console.log("🌱 Starting database seeding...\n");

    await seedRoles();
    await seedPermissions();
    await seedRolePermissions();

    console.log("\n✅ Database seeding completed!");
    process.exit(0);
}

main().catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
});
```

#### 6.2 Run Seeder

```bash
bun run db:seed
```

---

### Step 7: Setup Folder Structure (DDD)

Create folder structure sesuai pattern:

```bash
cd src

# Domain Layer
mkdir -p modules/auth/domain/value-objects
mkdir -p modules/auth/domain/entities
mkdir -p modules/auth/domain/repositories
mkdir -p modules/auth/domain/services
mkdir -p modules/auth/domain/errors

# Application Layer
mkdir -p modules/auth/application/use-cases/tenant
mkdir -p modules/auth/application/use-cases/user
mkdir -p modules/auth/application/use-cases/auth
mkdir -p modules/auth/application/dto

# Infrastructure Layer
mkdir -p modules/auth/infrastructure/repositories
mkdir -p modules/auth/infrastructure/supabase
mkdir -p modules/auth/infrastructure/services

# Interface Layer
mkdir -p modules/auth/interfaces/http/controllers
mkdir -p modules/auth/interfaces/http/middleware
mkdir -p modules/auth/interfaces/http/routes
mkdir -p modules/auth/interfaces/dto
```

---

### Step 8: Implement Core Components

Follow implementation dari dokumentasi:

- `02-DOMAIN_LAYER.md` → Implement Value Objects, Entities, Interfaces
- `03-USE_CASES.md` → Implement Use Cases
- `04-INFRASTRUCTURE.md` → Implement Repositories, Supabase Provider (create next)
- `05-API_SPECIFICATION.md` → Implement Controllers & Routes (create next)

---

### Step 9: Test Setup

#### 9.1 Create Health Check Endpoint

Update `src/index.ts`:

```typescript
import { Hono } from "hono";
import { appEnv } from "./core/env";

const app = new Hono();

app.get("/health", (c) => {
    return c.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        environment: appEnv.NODE_ENV,
    });
});

app.get("/", (c) => {
    return c.json({
        message: "Gizi Platform API",
        version: "1.0.0",
        docs: "/api/docs",
    });
});

export default {
    port: appEnv.APP_PORT,
    fetch: app.fetch,
};
```

#### 9.2 Run Development Server

```bash
bun run dev
```

Output:

```
Started server on 0.0.0.0:3000
```

#### 9.3 Test Endpoint

Open browser atau curl:

```bash
curl http://localhost:3000/health
```

Response:

```json
{
    "status": "ok",
    "timestamp": "2025-12-28T10:00:00.000Z",
    "environment": "development"
}
```

---

## ✅ Setup Verification Checklist

- [ ] ✅ Supabase project created
- [ ] ✅ Environment variables configured
- [ ] ✅ Dependencies installed
- [ ] ✅ Drizzle configured
- [ ] ✅ Database schema created & migrated
- [ ] ✅ Master data seeded (roles, permissions)
- [ ] ✅ Folder structure created (DDD pattern)
- [ ] ✅ Development server running
- [ ] ✅ Health check endpoint works

---

## 🐛 Troubleshooting

### Issue: Drizzle connection error

**Error**:

```
Error: Connection terminated unexpectedly
```

**Solution**:

1. Check `DATABASE_URL` di `.env` correct
2. Verify password tidak ada special characters yang perlu di-encode
3. Test connection:
    ```bash
    psql "$DATABASE_URL"
    ```

### Issue: Environment variables not loaded

**Error**:

```
Missing required environment variable: DATABASE_URL
```

**Solution**:

1. Ensure `.env` file exists di `apps/backend/`
2. Restart dev server (Bun `--hot` reload might not catch `.env` changes)

### Issue: Bun not found

**Solution**:

```bash
curl -fsSL https://bun.sh/install | bash
# Restart terminal
bun --version
```

---

## 📚 Next Steps

Setelah setup complete, lanjut ke implementasi:

1. ✅ **Implement Domain Layer** → Follow `02-DOMAIN_LAYER.md`
2. ✅ **Implement Use Cases** → Follow `03-USE_CASES.md`
3. ✅ **Implement Infrastructure** → Follow `04-INFRASTRUCTURE.md`
4. ✅ **Implement API Endpoints** → Follow `05-API_SPECIFICATION.md`
5. ✅ **Write Tests** → Follow `06-TESTING_GUIDE.md`

---

## 🎉 Done!

Setup complete! Siap untuk mulai development auth system.

**Questions?** Refer to documentation atau open issue.
