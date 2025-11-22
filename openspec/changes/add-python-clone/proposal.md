# Change: Python Clone of MyAAC

## Why

The current MyAAC is built on PHP 8.1+, which works well but has limitations in terms of:
- Modern async/await patterns for high-performance database and network operations
- Type safety and static analysis capabilities (PHPStan is good, but Python's type hints with mypy/pyright offer stronger guarantees)
- Modern web framework ecosystems with better developer experience
- Growing Python ecosystem for web development with mature frameworks like FastAPI and Django

A Python clone would provide an alternative implementation that:
- Maintains full compatibility with existing Open Tibia Server databases
- Offers better performance for I/O-bound operations through async patterns
- Provides a modern, type-safe codebase for easier maintenance
- Attracts Python developers to the OTS community
- Serves as a reference implementation for API design and architecture

This is a greenfield project that will run parallel to the existing PHP implementation, not replace it.

## What Changes

### New Python Project
- **NEW**: Standalone Python web application (separate repository/directory)
- **NEW**: FastAPI backend (async-first, lightweight, type-safe)
- **NEW**: React + TypeScript frontend (modern SPA architecture)
- **NEW**: Full type hints with mypy validation (backend) and TypeScript (frontend)
- **NEW**: Async database access using SQLAlchemy 2.0+ with asyncio
- **NEW**: Modern Python packaging with Poetry

### Core Features (Parity with PHP MyAAC)
- **NEW**: Account management (creation, login, recovery, settings)
- **NEW**: Character management (create, delete, view stats, vocations)
- **NEW**: Guild system (create, join, ranks, wars)
- **NEW**: News system (announcements, comments)
- **NEW**: Highscores (experience, skills, loyalty points)
- **NEW**: Server status monitoring (TCP connection to game server)
- **NEW**: Admin panel (user management, settings, moderation)
- **NEW**: Plugin architecture (extensibility system)

### Database Compatibility
- **NEW**: Support for existing Open Tibia Server MySQL databases
- **NEW**: Dynamic schema detection (similar to PHP version)
- **NEW**: ORM models for accounts, characters, guilds, etc.
- **NEW**: Migration system for Python-specific tables (if needed)

### Frontend Integration
- **NEW**: Full REST API backend with OpenAPI/Swagger documentation
- **NEW**: React Single Page Application (SPA) with TypeScript
- **NEW**: Tailwind CSS for modern, utility-first styling
- **NEW**: Vite for fast development builds and HMR (Hot Module Replacement)
- **NEW**: TanStack Query (React Query) for data fetching and caching
- **NEW**: React Router for client-side routing
- **NEW**: Headless UI for accessible, unstyled components

### Development Tools

**Backend**:
- **NEW**: pytest + pytest-asyncio for testing
- **NEW**: mypy for type checking
- **NEW**: ruff for linting and formatting
- **NEW**: httpx for API testing
- **NEW**: Docker setup for development and deployment

**Frontend**:
- **NEW**: Vitest for unit/component testing
- **NEW**: React Testing Library for component testing
- **NEW**: Playwright for E2E testing
- **NEW**: ESLint + Prettier for code quality
- **NEW**: TypeScript compiler for type checking
- **NEW**: pnpm for efficient package management

**Shared**:
- **NEW**: CI/CD with GitHub Actions
- **NEW**: Docker Compose for full-stack development

## Impact

### Affected Specs (All New)
This change introduces entirely new specifications for:
- `account-management` - User account CRUD, authentication, sessions
- `character-management` - Character CRUD, stats, vocations
- `guild-management` - Guild CRUD, membership, ranks, wars
- `news-system` - News posts, comments, moderation
- `highscores` - Rankings by various metrics
- `server-status` - Real-time server monitoring
- `admin-panel` - Administrative interface and controls
- `plugin-system` - Extensibility and plugin architecture

### Affected Code
- **NEW**: All code is new (greenfield project)
- **NO IMPACT**: Existing PHP MyAAC remains unchanged
- **NO IMPACT**: Current deployment and workflows unchanged

### Breaking Changes
- **NONE**: This is a parallel implementation, not a replacement

### Migration Path
- Users can choose to deploy Python version alongside or instead of PHP version
- Database remains compatible with both implementations
- No migration required for existing PHP users
- Optional migration guide for users wanting to switch

### Documentation Impact
- New setup and deployment guides for Python version
- API documentation (if exposing REST API)
- Plugin development guide for Python version
- Comparison guide between PHP and Python versions

### Timeline Considerations
This is a large, multi-phase project that should be broken into milestones:
1. **Phase 1**: Framework selection, project structure, database models
2. **Phase 2**: Core authentication and account management
3. **Phase 3**: Character and guild management
4. **Phase 4**: Content features (news, highscores, server status)
5. **Phase 5**: Admin panel and plugin system
6. **Phase 6**: Testing, documentation, and deployment guides

### Open Questions
1. ~~**Framework Choice**~~: ✅ **RESOLVED** - FastAPI for backend
2. ~~**Frontend Stack**~~: ✅ **RESOLVED** - React + TypeScript + Tailwind CSS
3. **Repository**: Separate repo or monorepo with PHP version?
4. **Branding**: Name it differently (PyAAC, MyAAC-Python) or keep MyAAC brand?
5. **Feature Parity**: Full 1:1 feature parity or start with core features and expand?
6. **Deployment**: Docker-first or support traditional deployment too?
