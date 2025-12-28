# 🎯 Gizi Platform - Auth System Master Plan

> **Status**: Planning  
> **Created**: 2025-12-28  
> **Last Updated**: 2025-12-28  
> **Version**: 1.0.0

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Tech Stack Decisions](#tech-stack-decisions)
4. [Implementation Roadmap](#implementation-roadmap)
5. [Success Criteria](#success-criteria)
6. [Related Documents](#related-documents)

---

## 🎬 Executive Summary

### Goal

Membangun **Authentication & Authorization System** untuk Gizi Platform - sebuah **Multi-Tenant SaaS** untuk monitoring stunting dengan role-based access control yang kompleks dan scope-based data isolation.

### Key Requirements

1. **Multi-Tenant Architecture**
    - Satu instalasi aplikasi melayani banyak organisasi (Dinas Kesehatan, Klinik)
    - Isolasi data ketat antar tenant
    - Tenant bisa punya banyak unit (Puskesmas, Posyandu)

2. **Complex Role Matrix** (9+ roles)
    - Platform Level: Super Admin, Support Staff
    - Tenant Level: Tenant Admin, Head of Dinas
    - Unit Level: Unit Admin (Bidan), Unit Head (Kapus), Kader
    - Territory Level: Village Head, District Head
    - Public: Parent

3. **Permission-Based Access Control (PBAC)**
    - Role dinamis (bisa berubah sesuai kebutuhan bisnis)
    - Permission granular: `read`, `write`, `delete`, `approve`, `export`
    - Scope-based: user hanya akses data di scope mereka (tenant/unit/region)

4. **Audit Trail**
    - Semua aksi penting tercatat (login, perubahan role, perubahan data sensitif)
    - Compliance untuk data kesehatan

---

## 🏗️ Architecture Overview

### Arsitektur Pattern: **DDD + Clean Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                      INTERFACE LAYER                        │
│  (HTTP Controllers, Routes, Middleware, DTOs, Validators)   │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    APPLICATION LAYER                        │
│         (Use Cases, Business Flow Orchestration)            │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                      DOMAIN LAYER                           │
│   (Entities, Value Objects, Repository Interfaces, Rules)   │
└────────────────────────▲────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│                  INFRASTRUCTURE LAYER                       │
│  (DB Repositories, Supabase Auth, External Services, ORM)   │
└─────────────────────────────────────────────────────────────┘
```

**Dependency Rule**: Dependency hanya boleh mengarah ke dalam (Infrastructure → Domain, bukan sebaliknya).

### Why This Pattern?

✅ **Testability**: Business logic (Domain) terpisah dari framework  
✅ **Maintainability**: Perubahan di DB tidak affect business rules  
✅ **Scalability**: Mudah ganti auth provider (Supabase → Auth0) tanpa ubah domain  
✅ **Team Collaboration**: Tim bisa kerja parallel (FE, BE, Domain, Infrastructure)

---

## 🛠️ Tech Stack Decisions

### Runtime & Framework

| Component     | Choice     | Rationale                                                                                                         |
| ------------- | ---------- | ----------------------------------------------------------------------------------------------------------------- |
| **Runtime**   | Bun        | • Native TypeScript support<br>• 3x faster than Node.js<br>• Built-in test runner<br>• Zero config                |
| **Framework** | Hono       | • Lightweight (12KB)<br>• Edge-ready<br>• TypeScript-first<br>• Middleware ecosystem<br>• RPC untuk type-safe API |
| **Language**  | TypeScript | • Type safety<br>• Better DX<br>• Catch errors at compile time                                                    |

### Database & ORM

| Component    | Choice                | Rationale                                                                                                                                                                                      |
| ------------ | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Database** | PostgreSQL (Supabase) | • Relational (complex joins)<br>• JSONB support (flexible metadata)<br>• Row Level Security (bonus security)<br>• Managed hosting (no DevOps overhead)<br>• Built-in realtime (future feature) |
| **ORM**      | Drizzle               | • Type-safe query builder<br>• Zero runtime overhead<br>• SQL-like syntax (easy to learn)<br>• Auto-complete & type inference<br>• Migration support                                           |

> **Why Supabase PostgreSQL over Self-Hosted?**
>
> - Managed backups & replication
> - Built-in connection pooling
> - PITR (Point-in-Time Recovery)
> - Auto-scaling storage
> - **Supabase Auth integration** (seamless)

### Authentication

| Component            | Choice                       | Rationale                                                                                                                                                                                       |
| -------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Auth Provider**    | Supabase Auth                | • Managed service (email verification, password reset)<br>• JWT tokens (stateless)<br>• Social login ready (Google, etc.)<br>• Row Level Security integration<br>• Free tier generous (50K MAU) |
| **Session**          | JWT (Access + Refresh Token) | • Stateless (scalable)<br>• Access token: 15 menit (short-lived)<br>• Refresh token: 30 hari (long-lived, stored in DB)                                                                         |
| **Metadata Storage** | PostgreSQL (Drizzle)         | • User metadata: tenant_id, role, scope<br>• Supabase Auth hanya untuk autentikasi<br>• PostgreSQL untuk relasi (users ↔ tenants ↔ units)                                                       |

**Flow**:

```
1. User sign up → Supabase Auth creates auth user
2. Backend creates user record di PostgreSQL dengan tenant_id, role, scope
3. User login → Supabase verify credential → Backend generate JWT dengan metadata
4. Setiap request → Verify JWT → Load user dari PostgreSQL → Check permission
```

### Validation & Security

| Component            | Choice                     | Rationale                                                                                                                  |
| -------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Validation**       | Zod                        | • Type-safe schema validation<br>• Auto TypeScript inference<br>• Custom error messages<br>• Runtime & compile-time safety |
| **Password Hashing** | Supabase (bcrypt)          | • Managed oleh Supabase Auth<br>• Industry standard<br>• Salted & hashed                                                   |
| **Rate Limiting**    | Hono Rate Limit Middleware | • Prevent brute force attack<br>• Per IP & per user                                                                        |

---

## 🗓️ Implementation Roadmap

### Phase 1: Foundation Setup (Day 1-2)

**Goal**: Setup project structure, dependencies, database schema

#### Checklist

- [ ] **1.1 Dependencies Installation**
    - [ ] Install Supabase client (`@supabase/supabase-js`)
    - [ ] Install Drizzle ORM (`drizzle-orm`, `drizzle-kit`, `postgres`)
    - [ ] Install Zod (`zod`)
    - [ ] Install Hono middleware (`@hono/zod-validator`, `hono-rate-limiter`)
    - [ ] Install JWT libraries (`jose` or use Supabase JWT verify)
    - [ ] Install testing tools (Bun built-in)

- [ ] **1.2 Environment Setup**
    - [ ] Create `.env.example` dengan semua variable yang dibutuhkan
    - [ ] Create `src/core/env/index.ts` (appEnv pattern seperti dashboard)
    - [ ] Setup Supabase project (manual via web console)
    - [ ] Get Supabase credentials:
        - `SUPABASE_URL`
        - `SUPABASE_ANON_KEY`
        - `SUPABASE_SERVICE_ROLE_KEY`
        - `DATABASE_URL` (PostgreSQL connection string)
    - [ ] Setup `.env` file lokal

- [ ] **1.3 Drizzle Configuration**
    - [ ] Create `drizzle.config.ts`
    - [ ] Setup migration folder structure
    - [ ] Test connection ke database

- [ ] **1.4 Database Schema Design**
    - [ ] Create schema file: `src/db/schema/tenants.ts`
    - [ ] Create schema file: `src/db/schema/users.ts`
    - [ ] Create schema file: `src/db/schema/roles.ts`
    - [ ] Create schema file: `src/db/schema/permissions.ts`
    - [ ] Create schema file: `src/db/schema/role-permissions.ts`
    - [ ] Create schema file: `src/db/schema/user-permissions.ts` (override)
    - [ ] Create schema file: `src/db/schema/refresh-tokens.ts`
    - [ ] Create schema file: `src/db/schema/audit-logs.ts`
    - [ ] Create index file: `src/db/schema.ts` (export all)
    - [ ] Run migration: `bun run drizzle-kit generate`
    - [ ] Apply migration: `bun run drizzle-kit migrate`

- [ ] **1.5 Folder Structure**
    - [ ] Create folder structure sesuai DDD pattern
    - [ ] Create barrel exports (`index.ts`) di setiap folder
    - [ ] Setup path aliases di `tsconfig.json`

**📄 Reference**: See [01-DATABASE_SCHEMA.md](./01-DATABASE_SCHEMA.md) for detailed schema

---

### Phase 2: Domain Layer (Day 2-3)

**Goal**: Define business rules & domain logic (framework-agnostic)

#### Checklist

- [ ] **2.1 Value Objects**
    - [ ] Create `Email.vo.ts` (validation RFC 5322)
    - [ ] Create `Password.vo.ts` (validation: min 8 char, uppercase, number, symbol)
    - [ ] Create `TenantId.vo.ts` (UUID validation)
    - [ ] Create `UserId.vo.ts` (UUID validation)
    - [ ] Create `Role.vo.ts` (enum validation)
    - [ ] Create `Permission.vo.ts` (enum validation)

- [ ] **2.2 Entities**
    - [ ] Create `User.entity.ts`
        - [ ] Method: `canAccessTenant(tenantId: TenantId): boolean`
        - [ ] Method: `hasPermission(permission: Permission): boolean`
        - [ ] Method: `isInUnitScope(unitId: string): boolean`
        - [ ] Method: `isInRegionScope(regionId: string): boolean`
        - [ ] Method: `isSuperAdmin(): boolean`
    - [ ] Create `Tenant.entity.ts`
        - [ ] Method: `isActive(): boolean`
        - [ ] Method: `canAddUser(): boolean` (check subscription limit)
    - [ ] Create `Session.entity.ts`
        - [ ] Method: `isExpired(): boolean`
        - [ ] Method: `revoke(): void`

- [ ] **2.3 Repository Interfaces** (kontrak saja, no implementation)
    - [ ] Create `IUserRepository.ts`
    - [ ] Create `ITenantRepository.ts`
    - [ ] Create `IRoleRepository.ts`
    - [ ] Create `IPermissionRepository.ts`
    - [ ] Create `IRefreshTokenRepository.ts`
    - [ ] Create `IAuditLogRepository.ts`

- [ ] **2.4 Service Interfaces**
    - [ ] Create `IAuthProvider.ts` (abstraksi untuk Supabase Auth)
        - [ ] Method: `signUp(email, password)`
        - [ ] Method: `signIn(email, password)`
        - [ ] Method: `verifyToken(token)`
        - [ ] Method: `resetPassword(email)`

- [ ] **2.5 Domain Errors**
    - [ ] Create `AuthErrors.ts`
        - `InvalidCredentialsError`
        - `UserNotFoundError`
        - `TokenExpiredError`
        - `UnauthorizedError`
    - [ ] Create `TenantErrors.ts`
        - `TenantNotFoundError`
        - `TenantInactiveError`
        - `UserLimitExceededError`
    - [ ] Create `PermissionErrors.ts`
        - `PermissionDeniedError`
        - `InvalidScopeError`

**📄 Reference**: See [02-DOMAIN_LAYER.md](./02-DOMAIN_LAYER.md) for detailed specs

---

### Phase 3: Application Layer (Day 3-4)

**Goal**: Implement use cases (business flow orchestration)

#### Checklist

- [ ] **3.1 DTOs (Data Transfer Objects)**
    - [ ] Create `register-tenant.dto.ts` (Zod schema)
    - [ ] Create `register-user.dto.ts` (Zod schema)
    - [ ] Create `login.dto.ts` (Zod schema)
    - [ ] Create `refresh-token.dto.ts` (Zod schema)
    - [ ] Create `assign-role.dto.ts` (Zod schema)
    - [ ] Create `assign-permission.dto.ts` (Zod schema)

- [ ] **3.2 Use Cases - Tenant Management** (Platform Admin only)
    - [ ] `RegisterTenantUseCase`
        - Input: tenant name, subscription plan, admin email
        - Output: tenant record + admin user created
        - Validation: email unique, plan valid
    - [ ] `ActivateTenantUseCase`
    - [ ] `DeactivateTenantUseCase`

- [ ] **3.3 Use Cases - User Management**
    - [ ] `RegisterUserUseCase`
        - Input: email, password, tenant_id, role, scope (unit/region)
        - Flow:
            1. Validate tenant exists & active
            2. Create auth user di Supabase
            3. Create user record di PostgreSQL
            4. Assign default permissions by role
            5. Send verification email (Supabase auto)
        - Output: user record (without password)
    - [ ] `AssignRoleUseCase`
        - Input: user_id, role, assigned_by
        - Validation: only TENANT_ADMIN or higher can assign
        - Audit: log role change
    - [ ] `AssignPermissionUseCase`
        - Input: user_id, permission[], assigned_by
        - Use case: override default role permissions

- [ ] **3.4 Use Cases - Authentication**
    - [ ] `LoginUseCase`
        - Input: email, password
        - Flow:
            1. Authenticate via Supabase
            2. Get user from PostgreSQL (join tenant)
            3. Check tenant active
            4. Generate access token (JWT dengan metadata: user_id, tenant_id, role, permissions, scope)
            5. Generate refresh token → save to DB
            6. Return tokens + user metadata
        - Output: `{ accessToken, refreshToken, user }`
    - [ ] `RefreshTokenUseCase`
        - Input: refresh token
        - Flow:
            1. Verify token exists in DB & not expired
            2. Get user (check tenant still active)
            3. Generate new access token
            4. Rotate refresh token (optional, for security)
        - Output: `{ accessToken, refreshToken }`
    - [ ] `VerifyTokenUseCase` (untuk middleware)
        - Input: JWT access token
        - Output: user metadata
    - [ ] `LogoutUseCase`
        - Input: refresh token
        - Flow: revoke token dari DB
    - [ ] `RequestPasswordResetUseCase`
        - Input: email
        - Flow: trigger Supabase password reset email
    - [ ] `ResetPasswordUseCase`
        - Input: reset token, new password
        - Flow: update password via Supabase

- [ ] **3.5 Use Cases - Authorization**
    - [ ] `CheckPermissionUseCase`
        - Input: user_id, permission, resource_id (optional)
        - Logic:
            1. Get user permissions (role default + user override)
            2. Check scope (apakah resource dalam scope user?)
            3. Return boolean
    - [ ] `GetUserScopeFilterUseCase`
        - Input: user
        - Output: SQL filter untuk query (e.g., `WHERE tenant_id = X AND unit_id = Y`)

**📄 Reference**: See [03-USE_CASES.md](./03-USE_CASES.md) for detailed flow diagrams

---

### Phase 4: Infrastructure Layer (Day 4-5)

**Goal**: Implement concrete adapters (DB, external services)

#### Checklist

- [ ] **4.1 Supabase Setup**
    - [ ] Create `src/infrastructure/supabase/client.ts` (singleton Supabase client)
    - [ ] Create `SupabaseAuthProvider.ts` (implement `IAuthProvider`)
        - [ ] Method: `signUp()`
        - [ ] Method: `signIn()`
        - [ ] Method: `verifyToken()` (verify Supabase JWT)
        - [ ] Method: `resetPassword()`
    - [ ] Create `verify-jwt.ts` (helper untuk verify & decode JWT)

- [ ] **4.2 Drizzle Repositories** (implement domain repository interfaces)
    - [ ] Create `UserRepository.ts` (implement `IUserRepository`)
        - [ ] `findById(id: string): Promise<User | null>`
        - [ ] `findByEmail(email: string): Promise<User | null>`
        - [ ] `findBySupabaseAuthId(id: string): Promise<User | null>`
        - [ ] `create(user: CreateUserDTO): Promise<User>`
        - [ ] `update(id: string, data: UpdateUserDTO): Promise<User>`
        - [ ] `delete(id: string): Promise<void>`
    - [ ] Create `TenantRepository.ts`
        - [ ] `findById(id: string): Promise<Tenant | null>`
        - [ ] `create(tenant: CreateTenantDTO): Promise<Tenant>`
        - [ ] `update(id: string, data: UpdateTenantDTO): Promise<Tenant>`
    - [ ] Create `RoleRepository.ts`
        - [ ] `findAll(): Promise<Role[]>`
        - [ ] `findByName(name: string): Promise<Role | null>`
    - [ ] Create `PermissionRepository.ts`
        - [ ] `findByUserId(userId: string): Promise<Permission[]>`
        - [ ] `assignToUser(userId: string, permissions: string[]): Promise<void>`
        - [ ] `removeFromUser(userId: string, permissions: string[]): Promise<void>`
    - [ ] Create `RefreshTokenRepository.ts`
        - [ ] `create(userId: string, token: string, expiresAt: Date): Promise<void>`
        - [ ] `findByToken(token: string): Promise<RefreshToken | null>`
        - [ ] `revoke(token: string): Promise<void>`
        - [ ] `revokeAllByUserId(userId: string): Promise<void>`
    - [ ] Create `AuditLogRepository.ts`
        - [ ] `log(event: AuditEvent): Promise<void>`
        - [ ] `findByUserId(userId: string): Promise<AuditLog[]>`
        - [ ] `findByTenantId(tenantId: string): Promise<AuditLog[]>`

- [ ] **4.3 Services**
    - [ ] Create `AuditLogService.ts`
        - [ ] `logLogin(userId: string)`
        - [ ] `logLogout(userId: string)`
        - [ ] `logRoleChange(userId: string, oldRole: string, newRole: string, changedBy: string)`
        - [ ] `logPermissionChange(userId: string, permissions: string[], changedBy: string)`
    - [ ] Create `TokenService.ts`
        - [ ] `generateAccessToken(user: User): string` (JWT dengan payload metadata)
        - [ ] `generateRefreshToken(): string`
        - [ ] `verifyAccessToken(token: string): TokenPayload`

- [ ] **4.4 Database Seeder**
    - [ ] Create `src/db/seeders/roles.seeder.ts`
        - Seed default roles:
            - `SUPER_ADMIN`, `SUPPORT_STAFF`
            - `TENANT_ADMIN`, `TENANT_HEAD`
            - `UNIT_ADMIN`, `UNIT_HEAD`, `KADER`
            - `VILLAGE_HEAD`, `DISTRICT_HEAD`
            - `PARENT`
    - [ ] Create `src/db/seeders/permissions.seeder.ts`
        - Seed permissions:
            - `users:read`, `users:write`, `users:delete`
            - `children:read`, `children:write`, `children:delete`
            - `measurements:read`, `measurements:write`, `measurements:approve`
            - `reports:read`, `reports:export`
            - `tenants:read`, `tenants:write` (Platform Admin only)
    - [ ] Create `src/db/seeders/role-permissions.seeder.ts`
        - Map role → default permissions
    - [ ] Create `src/db/seed.ts` (runner)

**📄 Reference**: See [04-INFRASTRUCTURE.md](./04-INFRASTRUCTURE.md) for implementation details

---

### Phase 5: Interface Layer (Day 5-6)

**Goal**: HTTP endpoints, controllers, middleware

#### Checklist

- [ ] **5.1 Middleware**
    - [ ] Create `src/modules/auth/interfaces/http/middleware/authenticate.ts`
        - [ ] Extract JWT dari header `Authorization: Bearer <token>`
        - [ ] Verify token (via `VerifyTokenUseCase`)
        - [ ] Load user dari database
        - [ ] Attach user ke context: `c.set('user', user)`
        - [ ] Handle error: 401 jika token invalid/expired
    - [ ] Create `src/modules/auth/interfaces/http/middleware/authorize.ts`
        - [ ] Check role: `authorize(['TENANT_ADMIN', 'SUPER_ADMIN'])`
        - [ ] Return 403 jika role tidak match
    - [ ] Create `src/modules/auth/interfaces/http/middleware/check-permission.ts`
        - [ ] Check permission: `checkPermission('users:write')`
        - [ ] Via `CheckPermissionUseCase`
        - [ ] Return 403 jika tidak punya permission
    - [ ] Create `src/modules/auth/interfaces/http/middleware/tenant-scope.ts`
        - [ ] Inject tenant filter ke context
        - [ ] Platform Admin bypass
        - [ ] Other users: enforce `WHERE tenant_id = user.tenant_id`
    - [ ] Create `src/modules/auth/interfaces/http/middleware/rate-limit.ts`
        - [ ] Limit login attempts: 5x per 15 menit per IP
        - [ ] Return 429 Too Many Requests

- [ ] **5.2 Controllers**
    - [ ] Create `AuthController.ts`
        - [ ] `POST /auth/register` → `RegisterUserUseCase`
        - [ ] `POST /auth/login` → `LoginUseCase`
        - [ ] `POST /auth/refresh` → `RefreshTokenUseCase`
        - [ ] `POST /auth/logout` → `LogoutUseCase`
        - [ ] `POST /auth/password/request-reset` → `RequestPasswordResetUseCase`
        - [ ] `POST /auth/password/reset` → `ResetPasswordUseCase`
        - [ ] `GET /auth/me` → get current user info (protected)
    - [ ] Create `TenantController.ts` (Platform Admin only)
        - [ ] `POST /tenants` → `RegisterTenantUseCase`
        - [ ] `GET /tenants` → list all tenants
        - [ ] `GET /tenants/:id` → get tenant detail
        - [ ] `PATCH /tenants/:id` → update tenant
        - [ ] `POST /tenants/:id/activate` → activate tenant
        - [ ] `POST /tenants/:id/deactivate` → deactivate tenant
    - [ ] Create `UserController.ts`
        - [ ] `GET /users` → list users (scoped by tenant)
        - [ ] `GET /users/:id` → get user detail
        - [ ] `PATCH /users/:id/role` → `AssignRoleUseCase`
        - [ ] `PATCH /users/:id/permissions` → `AssignPermissionUseCase`
        - [ ] `DELETE /users/:id` → soft delete user

- [ ] **5.3 Routes**
    - [ ] Create `auth.routes.ts`
        - [ ] Setup route group `/auth`
        - [ ] Apply rate limiting untuk `/login`
        - [ ] Apply validation middleware (Zod)
    - [ ] Create `tenant.routes.ts`
        - [ ] Setup route group `/tenants`
        - [ ] Apply `authenticate` + `authorize(['SUPER_ADMIN'])`
    - [ ] Create `user.routes.ts`
        - [ ] Setup route group `/users`
        - [ ] Apply `authenticate` + `tenantScope`

- [ ] **5.4 Error Handling**
    - [ ] Create `src/core/http/error-handler.ts`
        - [ ] Global error handler untuk Hono
        - [ ] Map domain errors ke HTTP status:
            - `UserNotFoundError` → 404
            - `InvalidCredentialsError` → 401
            - `PermissionDeniedError` → 403
            - `TenantInactiveError` → 403
        - [ ] Return consistent error format:
            ```json
            {
                "error": {
                    "code": "USER_NOT_FOUND",
                    "message": "User with email xxx@example.com not found",
                    "details": {}
                }
            }
            ```

- [ ] **5.5 Main App Setup**
    - [ ] Update `src/index.ts`
        - [ ] Import Hono
        - [ ] Setup CORS
        - [ ] Mount auth routes
        - [ ] Mount tenant routes
        - [ ] Mount user routes
        - [ ] Apply error handler
        - [ ] Health check endpoint: `GET /health`

**📄 Reference**: See [05-API_SPECIFICATION.md](./05-API_SPECIFICATION.md) for API docs

---

### Phase 6: Testing & Validation (Day 6-7)

**Goal**: Test semua flow, ensure correctness

#### Checklist

- [ ] **6.1 Unit Tests** (Domain & Application Layer)
    - [ ] Test Value Objects validation
        - [ ] Email validation (valid/invalid cases)
        - [ ] Password strength validation
    - [ ] Test Entity methods
        - [ ] `User.canAccessTenant()`
        - [ ] `User.hasPermission()`
        - [ ] `User.isInUnitScope()`
    - [ ] Test Use Cases (with mocked repositories)
        - [ ] `LoginUseCase` → happy path & error cases
        - [ ] `RegisterUserUseCase` → duplicate email
        - [ ] `CheckPermissionUseCase` → various permission scenarios

- [ ] **6.2 Integration Tests** (End-to-End)
    - [ ] Test: Register tenant (Platform Admin)
        - [ ] POST `/tenants` → return 201 + tenant object
    - [ ] Test: Register user dengan tenant_id
        - [ ] POST `/auth/register` → user created di Supabase & PostgreSQL
        - [ ] Verify user di database punya tenant_id yang benar
    - [ ] Test: Login flow
        - [ ] POST `/auth/login` → return access token & refresh token
        - [ ] Decode JWT → verify payload punya tenant_id, role, permissions
    - [ ] Test: Access protected endpoint
        - [ ] GET `/auth/me` dengan token → return user info
        - [ ] GET `/auth/me` tanpa token → 401
    - [ ] Test: Multi-tenant isolation
        - [ ] User Tenant A login → create data
        - [ ] User Tenant B login → tidak bisa lihat data Tenant A
    - [ ] Test: Scope-based access
        - [ ] Kader dari Unit A → hanya bisa create data untuk Unit A
        - [ ] Village Head dari Desa X → hanya bisa read data children dari Desa X
    - [ ] Test: Permission check
        - [ ] User tanpa permission `reports:export` → 403 saat akses export endpoint
    - [ ] Test: Refresh token
        - [ ] POST `/auth/refresh` → return new access token
    - [ ] Test: Logout
        - [ ] POST `/auth/logout` → token di-revoke
        - [ ] Coba pakai token yang sudah di-logout → 401

- [ ] **6.3 Manual Testing**
    - [ ] Test dengan Postman/Insomnia
    - [ ] Create Postman collection untuk semua endpoints
    - [ ] Test rate limiting (coba login 6x → harus kena 429)

**📄 Reference**: See [06-TESTING_GUIDE.md](./06-TESTING_GUIDE) for test cases

---

### Phase 7: Documentation & Deployment Prep (Day 7)

#### Checklist

- [ ] **7.1 API Documentation**
    - [ ] Generate OpenAPI/Swagger spec (optional, pakai `@hono/swagger`)
    - [ ] Write API usage examples
    - [ ] Document authentication flow

- [ ] **7.2 Setup Guide**
    - [ ] Write step-by-step setup untuk developer baru
    - [ ] Environment variables documentation
    - [ ] Database migration guide

- [ ] **7.3 Deployment Preparation**
    - [ ] Create `Dockerfile` (Bun runtime)
    - [ ] Create `docker-compose.yml` (untuk local development)
    - [ ] Environment variables untuk production
    - [ ] Database backup strategy

---

## ✅ Success Criteria

Auth system dianggap **selesai** jika:

1. ✅ **Functional Requirements**
    - [ ] User bisa register dengan tenant_id
    - [ ] User bisa login & mendapat JWT
    - [ ] JWT berisi metadata: tenant_id, role, permissions, scope
    - [ ] Multi-tenant isolation work (User Tenant A tidak bisa akses data Tenant B)
    - [ ] Scope-based access work (Kader hanya bisa akses data unit mereka)
    - [ ] Permission-based authorization work
    - [ ] Refresh token flow work
    - [ ] Password reset work

2. ✅ **Non-Functional Requirements**
    - [ ] Response time login < 500ms
    - [ ] Response time verify token < 100ms
    - [ ] Code coverage minimal 70%
    - [ ] Zero security vulnerabilities (dari `bun audit`)
    - [ ] Error handling comprehensive (semua error case tercovered)

3. ✅ **Code Quality**
    - [ ] TypeScript strict mode enabled
    - [ ] No `any` type (kecuali absolutely necessary)
    - [ ] ESLint passing
    - [ ] Clean Architecture principles followed (dependency rule)
    - [ ] DDD patterns implemented correctly

4. ✅ **Documentation**
    - [ ] All public APIs documented
    - [ ] Setup guide complete
    - [ ] Database schema documented dengan ERD

---

## 📚 Related Documents

Dokumentasi ini adalah **master plan**. Detail implementasi ada di dokumen terpisah:

1. **[01-DATABASE_SCHEMA.md](./01-DATABASE_SCHEMA.md)** - Detail schema, ERD, indexes, constraints
2. **[02-DOMAIN_LAYER.md](./02-DOMAIN_LAYER.md)** - Entities, Value Objects, Repository interfaces
3. **[03-USE_CASES.md](./03-USE_CASES.md)** - Use case specifications dengan flow diagram
4. **[04-INFRASTRUCTURE.md](./04-INFRASTRUCTURE.md)** - Repository implementations, Supabase setup
5. **[05-API_SPECIFICATION.md](./05-API_SPECIFICATION.md)** - HTTP endpoints, request/response format
6. **[06-TESTING_GUIDE.md](./06-TESTING_GUIDE.md)** - Test cases & scenarios
7. **[07-SETUP_GUIDE.md](./07-SETUP_GUIDE.md)** - Step-by-step setup untuk development

---

## 🔄 Maintenance & Updates

Dokumen ini akan di-update seiring progress development:

- ✅ **Checklist**: Mark `[x]` saat task selesai
- 📝 **Decision Log**: Catat perubahan keputusan teknis di section terpisah
- 🐛 **Known Issues**: Track issues yang ditemukan selama development

---

## 🤝 Questions & Feedback

Jika ada pertanyaan atau saran improvement, discuss di:

- GitHub Issues
- Team chat
- Code review comments

---

**Happy Coding! 🚀**
