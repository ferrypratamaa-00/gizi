# 📚 Gizi Platform Backend - Documentation Hub

> **Comprehensive Documentation for Auth System Development**

Welcome! Ini adalah dokumentasi lengkap untuk development **Authentication & Authorization System** Gizi Platform menggunakan **Domain-Driven Design (DDD)** + **Clean Architecture**.

---

## 🎯 Quick Start

Jika kamu developer yang baru join project:

1. **Read** → [00-MASTER_PLAN.md](./00-MASTER_PLAN.md) - Overview & roadmap lengkap
2. **Setup** → [04-SETUP_GUIDE.md](./04-SETUP_GUIDE.md) - Step-by-step setup development environment
3. **Code** → Follow implementation docs dibawah
4. **Test** → Verify your work

---

## 📖 Documentation Index

### Planning & Architecture

| Document                                         | Description                                                              | Status      |
| ------------------------------------------------ | ------------------------------------------------------------------------ | ----------- |
| [00-MASTER_PLAN.md](./00-MASTER_PLAN.md)         | 🎯 **Start Here!** Master plan, roadmap, checklist, tech stack decisions | ✅ Complete |
| [01-DATABASE_SCHEMA.md](./01-DATABASE_SCHEMA.md) | 🗄️ Database schema, ERD, tables, indexes, constraints                    | ✅ Complete |

### Implementation Guides

| Document                                                       | Description                                                       | Status      |
| -------------------------------------------------------------- | ----------------------------------------------------------------- | ----------- |
| [02-DOMAIN_LAYER.md](./02-DOMAIN_LAYER.md)                     | 🏛️ Value Objects, Entities, Repository Interfaces, Business Rules | ✅ Complete |
| [03-USE_CASES.md](./03-USE_CASES.md)                           | 🎯 Application Layer - Use Cases dengan flow diagrams             | ✅ Complete |
| [04-SETUP_GUIDE.md](./04-SETUP_GUIDE.md)                       | 🚀 Step-by-step setup untuk development environment               | ✅ Complete |
| [05-ROLE_PERMISSION_SYSTEM.md](./05-ROLE_PERMISSION_SYSTEM.md) | 🔐 Role matrix, policy-based permissions, scalable design         | ✅ Complete |
| [06-OTP_AUTHENTICATION.md](./06-OTP_AUTHENTICATION.md)         | 📱 OTP/WhatsApp authentication untuk Parent & Kader               | ✅ Complete |
| [08-IMPLEMENTATION_GUIDE.md](./08-IMPLEMENTATION_GUIDE.md)     | 🛠️ Complete step-by-step implementation dengan code examples      | ✅ Complete |

---

## 🏗️ Architecture Overview

Gizi Platform menggunakan **Clean Architecture** dengan **DDD pattern**:

```
┌─────────────────────────────────────────────────────────────┐
│                  INTERFACE LAYER                            │
│        (HTTP Routes, Controllers, Middleware, DTOs)         │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                 APPLICATION LAYER                           │
│              (Use Cases, Business Flows)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   DOMAIN LAYER                              │
│   (Entities, Value Objects, Business Rules, Interfaces)     │
└────────────────────────▲────────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────────┐
│               INFRASTRUCTURE LAYER                          │
│      (Drizzle ORM, Supabase Auth, External Services)        │
└─────────────────────────────────────────────────────────────┘
```

**Key Principle**: Dependency mengarah ke dalam → Domain tidak tahu tentang framework.

---

## 🛠️ Tech Stack

| Layer          | Technology            | Why                                       |
| -------------- | --------------------- | ----------------------------------------- |
| **Runtime**    | Bun                   | Native TypeScript, 3x faster than Node    |
| **Framework**  | Hono                  | Lightweight, edge-ready, TypeScript-first |
| **Database**   | PostgreSQL (Supabase) | Managed, JSONB support, built-in auth     |
| **ORM**        | Drizzle               | Type-safe, zero overhead, migrations      |
| **Auth**       | Supabase Auth         | Managed auth, JWT, email verification     |
| **Validation** | Zod                   | Type-safe schema validation               |
| **Testing**    | Bun Test              | Built-in test runner                      |

---

## 🎯 Development Workflow

### Phase 1: Foundation (Week 1)

- [ ] Setup environment (Supabase, dependencies)
- [ ] Create database schema & migrations
- [ ] Seed master data (roles, permissions)
- [ ] Implement Domain Layer (Value Objects, Entities)

### Phase 2: Core Features (Week 2)

- [ ] Implement Use Cases (Login, Register, Refresh Token)
- [ ] Implement Repositories (User, Tenant, Permission)
- [ ] Implement Supabase Auth Provider
- [ ] Setup JWT token generation

### Phase 3: API Layer (Week 3)

- [ ] Create Controllers & Routes
- [ ] Implement Middleware (Auth, Authorization, Scope)
- [ ] Error handling
- [ ] API documentation

### Phase 4: Testing & Polish (Week 4)

- [ ] Unit tests (Domain & Application Layer)
- [ ] Integration tests (End-to-end flows)
- [ ] Performance testing
- [ ] Security audit

---

## 🚀 Quick Commands

```bash
# Development
bun run dev                 # Start dev server with hot reload

# Database
bun run db:generate         # Generate migration from schema
bun run db:migrate          # Apply migrations
bun run db:push             # Push schema (dev only, skip migrations)
bun run db:studio           # Open Drizzle Studio (DB GUI)
bun run db:seed             # Seed master data

# Testing
bun test                    # Run all tests
bun test --watch            # Run tests in watch mode

# Code Quality
bun run lint                # Run ESLint
bun run format              # Format with Prettier
bun run typecheck           # TypeScript type checking
```

---

## 📂 Folder Structure

```
apps/backend/
├── docs/                       # 📚 This documentation
│   ├── 00-MASTER_PLAN.md
│   ├── 01-DATABASE_SCHEMA.md
│   ├── 02-DOMAIN_LAYER.md
│   ├── 03-USE_CASES.md
│   ├── 04-SETUP_GUIDE.md
│   └── README.md              # You are here
│
├── src/
│   ├── core/                  # 🔧 Shared utilities
│   │   ├── env/              # Environment config
│   │   ├── logger/           # Logging
│   │   └── http/             # HTTP utilities, error handler
│   │
│   ├── db/                    # 🗄️ Database
│   │   ├── schema/           # Drizzle schema files
│   │   ├── seeders/          # Seed scripts
│   │   ├── schema.ts         # Barrel export
│   │   ├── index.ts          # Drizzle client
│   │   └── seed.ts           # Seed runner
│   │
│   └── modules/
│       └── auth/              # 🔐 Auth Module (DDD)
│           ├── domain/
│           │   ├── entities/
│           │   ├── value-objects/
│           │   ├── repositories/  # Interfaces only
│           │   ├── services/      # Interfaces only
│           │   └── errors/
│           │
│           ├── application/
│           │   ├── use-cases/
│           │   │   ├── tenant/
│           │   │   ├── user/
│           │   │   └── auth/
│           │   └── dto/
│           │
│           ├── infrastructure/
│           │   ├── repositories/   # Drizzle implementations
│           │   ├── supabase/       # Supabase Auth Provider
│           │   └── services/       # Token, Audit Log services
│           │
│           └── interfaces/
│               └── http/
│                   ├── controllers/
│                   ├── middleware/
│                   ├── routes/
│                   └── dto/
│
├── drizzle/                   # 📦 Generated migrations
├── tests/                     # 🧪 Tests
├── .env                       # 🔒 Environment variables (DO NOT COMMIT!)
├── .env.example               # 📝 Environment template
├── drizzle.config.ts          # Drizzle configuration
├── package.json
└── tsconfig.json
```

---

## 🔐 Security Best Practices

### Environment Variables

- ✅ **NEVER** commit `.env` file
- ✅ Use `.env.example` untuk template
- ✅ Rotate `JWT_SECRET` di production
- ✅ Use `SUPABASE_SERVICE_ROLE_KEY` hanya di backend (never expose ke frontend)

### Database

- ✅ Use prepared statements (Drizzle handles this)
- ✅ Enforce tenant isolation via middleware
- ✅ Soft delete untuk audit trail
- ✅ Log semua sensitive actions

### Authentication

- ✅ Short-lived access tokens (15 min)
- ✅ HTTP-only refresh tokens
- ✅ Rate limiting untuk login endpoint
- ✅ Password strength validation
- ✅ Email verification before full access

### Authorization

- ✅ Permission-based access control (PBAC)
- ✅ Scope-based data filtering
- ✅ Validate user scope before write operations
- ✅ Audit log untuk role/permission changes

---

## 🧪 Testing Strategy

### Unit Tests

- Domain Layer (Value Objects, Entities)
- Application Layer (Use Cases dengan mocked repositories)

### Integration Tests

- API endpoints
- Database queries
- Supabase Auth integration

### E2E Tests

- Complete user flows (Register → Login → Access Protected Resource)
- Multi-tenant isolation
- Scope-based access

**Coverage Target**: 70% minimum

---

## 🐛 Common Issues & Solutions

### Issue: Drizzle migration error

```bash
Error: Couldn't find any schema files
```

**Solution**: Check `drizzle.config.ts` → `schema` path correct

---

### Issue: Supabase connection timeout

**Solution**:

1. Check firewall/network
2. Verify `SUPABASE_URL` correct
3. Use Supabase connection pooler if high traffic

---

### Issue: JWT verification failed

**Solution**:

1. Check `JWT_SECRET` sama di semua env
2. Verify token belum expired
3. Check clock skew (server time sync)

---

## 📊 Project Status

**Current Phase**: Planning & Setup ✅  
**Next Phase**: Domain Layer Implementation 🚧

### Progress Tracker

| Phase                    | Status         | Completion |
| ------------------------ | -------------- | ---------- |
| Planning & Documentation | ✅ Complete    | 100%       |
| Environment Setup        | 🚧 In Progress | 80%        |
| Database Schema          | ⏳ Pending     | 0%         |
| Domain Layer             | ⏳ Pending     | 0%         |
| Application Layer        | ⏳ Pending     | 0%         |
| Infrastructure Layer     | ⏳ Pending     | 0%         |
| Interface Layer          | ⏳ Pending     | 0%         |
| Testing                  | ⏳ Pending     | 0%         |

---

## 🤝 Contributing

### Code Style

- Use **TypeScript strict mode**
- Follow **DDD patterns** dari dokumentasi
- Write **meaningful variable names**
- Add **JSDoc comments** for public APIs

### Commit Messages

```
feat: implement User entity with business methods
fix: resolve tenant isolation bug in UserRepository
docs: update API specification with new endpoints
test: add unit tests for Email value object
```

### Pull Request

1. Create feature branch: `git checkout -b feat/login-use-case`
2. Implement dengan follow dokumentasi
3. Write tests
4. Create PR dengan deskripsi clear
5. Request review dari team lead

---

## 📞 Support & Questions

- **Documentation Issues**: Update docs dan open PR
- **Implementation Questions**: Refer ke documentation first, lalu discuss di team chat
- **Bugs**: Create issue dengan reproduction steps

---

## 📜 License

Proprietary - Gizi Platform © 2025

---

## 🎉 Let's Build!

Dokumentasi ini adalah **living document**. Update seiring progress development.

**Happy Coding! 🚀**

---

**Last Updated**: 2025-12-28  
**Version**: 1.0.0  
**Maintained By**: Backend Team
