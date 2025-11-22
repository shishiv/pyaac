# Design: Python Clone of MyAAC

## Context

MyAAC is a mature PHP application serving the Open Tibia Server community. This design document outlines the architecture for a Python-based alternative that maintains database compatibility while leveraging modern Python web frameworks and async patterns.

### Background
- Existing PHP codebase is stable and feature-complete
- Python implementation is a parallel project, not a replacement
- Must support existing OTS database schemas (TFS, Canary, OTServBR, etc.)
- Target audience: OTS administrators and developers comfortable with Python

### Constraints
- **MUST** maintain MySQL database compatibility with existing OTS servers
- **MUST** support dynamic schema detection (different OTS distributions have different schemas)
- **MUST** provide equivalent core functionality to PHP version
- **SHOULD** improve performance for I/O-bound operations
- **SHOULD** provide better type safety and developer experience

### Stakeholders
- OTS server administrators (deployment and maintenance)
- Players (end users of the web interface)
- Plugin developers (extensibility)
- Contributors (code maintainers)

## Goals / Non-Goals

### Goals
- Create a production-ready Python AAC with core feature parity
- Achieve better performance through async I/O patterns
- Provide strong type safety with comprehensive type hints
- Offer modern developer experience (better tooling, testing, documentation)
- Maintain full database compatibility with existing OTS servers
- Support extensibility through a plugin system
- Enable both traditional server-side rendering and modern API-first architectures

### Non-Goals
- Replace the existing PHP MyAAC (this is an alternative, not a replacement)
- Achieve 100% feature parity in first release (start with core features)
- Support PostgreSQL or other databases (MySQL only, matching PHP version)
- Provide automatic migration from PHP to Python (manual migration only)
- Build a new frontend framework (reuse existing patterns or standard frameworks)

## Decisions

### Decision 1: Framework Selection - **FastAPI**

**Choice**: FastAPI over Django

**Rationale**:
- **Async-first**: Native async/await support for database and HTTP operations
- **Performance**: Significantly faster than Django for I/O-bound operations
- **Type Safety**: Built-in Pydantic validation with automatic API documentation
- **Lightweight**: Easier to understand and maintain for smaller teams
- **Modern**: Better alignment with current Python web development trends
- **API-First Ready**: Easy to build REST API for modern frontend frameworks
- **WebSockets**: Native support for real-time features (server status updates)

**Alternatives Considered**:
1. **Django**:
   - Pros: Batteries-included, mature admin panel, larger ecosystem
   - Cons: Heavier, sync-first (async support still maturing), more opinionated
   - Why rejected: Async support is secondary, heavier than needed

2. **Flask**:
   - Pros: Lightweight, flexible, familiar to many developers
   - Cons: No native async support, requires more dependencies for modern features
   - Why rejected: Lacks async capabilities and type safety features

### Decision 2: Database Access - **SQLAlchemy 2.0+ (Async)**

**Choice**: SQLAlchemy 2.0 with asyncio support + Alembic for migrations

**Rationale**:
- Mature ORM with async support via `asyncpg` or `aiomysql`
- Flexible enough to handle dynamic schema detection
- Compatible with existing OTS database structures
- Strong typing support with SQLAlchemy 2.0+
- Alembic provides robust migration system

**Implementation Pattern**:
```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import declarative_base

# Async engine for MySQL
engine = create_async_engine("mysql+aiomysql://user:pass@localhost/otserver")

# Models with optional columns (for schema flexibility)
class Account(Base):
    __tablename__ = "accounts"
    id = Column(Integer, primary_key=True)
    name = Column(String(32), nullable=False)
    # ... other fields
```

### Decision 3: Architecture Pattern - **API-First with React SPA**

**Choice**: Full REST API backend with React Single Page Application frontend

**Rationale**:
- **Modern User Experience**: React provides smooth, app-like interactions
- **Clear Separation**: Backend (FastAPI) and frontend (React) are completely decoupled
- **Scalability**: API can serve multiple clients (web, mobile apps, third-party integrations)
- **Developer Experience**: Rich ecosystem of React libraries and tools
- **Performance**: Client-side rendering reduces server load, better perceived performance
- **Type Safety**: Can use TypeScript for end-to-end type safety

**Structure**:
```
backend/
├── app/
│   ├── api/           # REST API endpoints (FastAPI routers)
│   │   └── v1/
│   │       ├── accounts.py
│   │       ├── characters.py
│   │       └── guilds.py
│   ├── core/          # Business logic
│   │   ├── auth.py
│   │   ├── characters.py
│   │   └── guilds.py
│   ├── models/        # SQLAlchemy models
│   ├── schemas/       # Pydantic schemas (validation, serialization)
│   └── plugins/       # Plugin system
├── tests/
└── pyproject.toml

frontend/
├── src/
│   ├── components/    # React components
│   ├── pages/         # Page components (routes)
│   ├── api/           # API client functions
│   ├── hooks/         # Custom React hooks
│   ├── context/       # React Context providers
│   └── utils/         # Utilities
├── public/
└── package.json
```

### Decision 4: Frontend Stack - **React + TypeScript + Tailwind CSS**

**Choice**: React with TypeScript and Tailwind CSS for styling

**Rationale**:
- **React**: Industry-standard, large community, mature ecosystem
- **TypeScript**: Type safety for frontend code, better IDE support, fewer runtime errors
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
  - Highly customizable and themeable
  - Smaller CSS bundle (purges unused styles)
  - Consistent design system
  - Modern, professional look
  - Better performance than Bootstrap (no unused CSS)

**Additional Frontend Tools**:
- **Vite**: Fast build tool with HMR (Hot Module Replacement)
- **React Router**: Client-side routing
- **TanStack Query (React Query)**: Data fetching, caching, and state management
- **Axios**: HTTP client for API calls
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation (complements backend Pydantic schemas)
- **Headless UI**: Unstyled accessible components for Tailwind

**Alternatives Considered**:
1. **Bootstrap 5**:
   - Pros: Component library included, familiar
   - Cons: Heavier, less flexible, more opinionated styling
   - Why rejected: Tailwind offers more flexibility and better performance

2. **Material UI (MUI)**:
   - Pros: Comprehensive component library, polished look
   - Cons: Heavy bundle size, harder to customize
   - Why rejected: Tailwind + Headless UI more lightweight and flexible

3. **Chakra UI**:
   - Pros: Good developer experience, accessible components
   - Cons: Less flexible than Tailwind, smaller ecosystem
   - Why rejected: Tailwind is more popular and has better long-term support

### Decision 5: Plugin System - **Entry Points + Hooks**

**Choice**: Python entry points + hook system similar to PHP version

**Rationale**:
- Entry Points: Standard Python mechanism for plugin discovery
- Hooks: Event-driven architecture for extensibility
- Type Safety: Typed hook signatures for better DX
- API Extension: Plugins can add custom API endpoints

**Pattern**:
```python
# Plugin registration via entry points (setup.py or pyproject.toml)
[project.entry-points."myaac.plugins"]
my_plugin = "my_plugin:init"

# Hook system
from myaac.plugins import register_hook

@register_hook("before_character_create")
async def validate_character_name(character_data: CharacterCreateData):
    # Custom validation logic
    pass
```

### Decision 6: Authentication - **JWT Token Based**

**Choice**: JWT tokens for all authentication (API and web frontend)

**Rationale**:
- **Stateless**: No server-side session storage required
- **Scalability**: Easy to scale horizontally without session persistence
- **SPA Friendly**: Perfect for React frontend consuming REST API
- **Secure**: Access tokens (short-lived) + refresh tokens (long-lived)
- **Standard**: Industry-standard approach for modern web applications

**Implementation**:
- `python-jose` for JWT handling
- Access token expiration: 15-30 minutes
- Refresh token expiration: 7-30 days
- Refresh token rotation for security
- Token storage in frontend: `localStorage` or `sessionStorage`
- HTTP-only cookies for refresh tokens (optional, more secure)

### Decision 7: Development Tools

**Backend Tools**:
- **Package Management**: Poetry (better dependency resolution than pip)
- **Linting/Formatting**: Ruff (all-in-one, extremely fast)
- **Type Checking**: mypy (most mature, wide adoption)
- **Testing**: pytest + pytest-asyncio + httpx (async support)
- **Documentation**: MkDocs with Material theme
- **CI/CD**: GitHub Actions (consistency with PHP version)

**Frontend Tools**:
- **Package Management**: npm or pnpm (pnpm is faster and more efficient)
- **Build Tool**: Vite (extremely fast HMR, optimized builds)
- **Linting**: ESLint with TypeScript plugin
- **Formatting**: Prettier
- **Type Checking**: TypeScript compiler (tsc)
- **Testing**: Vitest (unit tests, fast, Vite-powered) + React Testing Library
- **E2E Testing**: Playwright or Cypress
- **State Management**: TanStack Query + React Context (Zustand if needed)
- **CSS**: Tailwind CSS with PostCSS

## Technical Details

### Database Schema Detection

Support dynamic schema detection similar to PHP version:

```python
from sqlalchemy import inspect

async def detect_guild_deletion_column(engine):
    """Detect if 'deletion' column exists in guilds table."""
    inspector = inspect(engine)
    columns = await inspector.get_columns("guilds")
    return "deletion" in [col["name"] for columns]
```

### Performance Optimization

1. **Connection Pooling**: SQLAlchemy's async pool with configurable size
2. **Query Optimization**: Use eager loading to avoid N+1 queries
3. **Caching**: Redis or in-memory caching for frequently accessed data
4. **Async I/O**: All database and network operations async

### Security Measures

1. **Input Validation**: Pydantic models for all inputs
2. **SQL Injection**: SQLAlchemy ORM prevents raw SQL where possible
3. **XSS Prevention**: Jinja2 auto-escaping enabled by default
4. **CSRF Protection**: Built-in FastAPI middleware
5. **Password Hashing**: bcrypt or argon2 (compatible with PHP version)
6. **Rate Limiting**: `slowapi` middleware for API endpoints

### Type Safety

All code must include type hints:
```python
from typing import Optional
from pydantic import BaseModel

class AccountCreate(BaseModel):
    name: str
    password: str
    email: Optional[str] = None

async def create_account(data: AccountCreate, db: AsyncSession) -> Account:
    # Type-checked implementation
    pass
```

### Plugin Architecture

```python
# plugins/base.py
from abc import ABC, abstractmethod
from typing import Protocol

class PluginProtocol(Protocol):
    name: str
    version: str

    async def init(self, app: FastAPI) -> None:
        """Initialize plugin with FastAPI app."""
        ...

    async def on_character_create(self, character: Character) -> None:
        """Hook called before character creation."""
        ...
```

### Frontend-Backend Communication

**API Contract**:
- Backend exposes RESTful API with OpenAPI specification
- Frontend consumes API using typed API client (generated from OpenAPI)
- Data validation on both sides: Pydantic (backend) + Zod (frontend)
- Error handling: Standardized error responses (RFC 7807 Problem Details)

**CORS Configuration**:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**API Response Format**:
```typescript
// Success response
interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Error response
interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  errors?: Record<string, string[]>;
}
```

## Risks / Trade-offs

### Risk: Community Adoption
- **Risk**: Python version may not gain traction in PHP-dominated OTS community
- **Mitigation**:
  - Maintain feature parity with PHP version
  - Provide clear migration guides
  - Emphasize performance benefits
  - Keep both versions active

### Risk: Database Compatibility
- **Risk**: Different OTS distributions have varying database schemas
- **Mitigation**:
  - Implement robust schema detection
  - Test against multiple OTS distributions (TFS, Canary, OTServBR)
  - Provide compatibility matrix documentation

### Risk: Plugin Ecosystem
- **Risk**: Existing PHP plugins won't work with Python version
- **Mitigation**:
  - Document plugin migration guide
  - Port popular PHP plugins to Python
  - Make plugin API simple and well-documented

### Risk: Maintenance Burden
- **Risk**: Maintaining two codebases (PHP and Python)
- **Mitigation**:
  - Separate repositories with independent release cycles
  - Clear ownership and contribution guidelines
  - Python version can evolve independently

### Trade-off: Type Safety vs Flexibility
- **Trade-off**: Strict typing may make dynamic schema handling harder
- **Decision**: Use `Optional` types and runtime validation where schema varies
- **Rationale**: Type safety benefits outweigh slight complexity increase

### Trade-off: Framework Choice
- **Trade-off**: FastAPI is lighter but Django has more built-in features
- **Decision**: FastAPI for performance and modern async patterns
- **Rationale**: Can build admin panel with FastAPI + templates, don't need Django's full ORM

## Migration Plan

### Phase 1: Backend Foundation (Weeks 1-2)
1. Project scaffolding (Poetry, directory structure)
2. Database models (Account, Character, Guild basic models)
3. FastAPI app setup with CORS
4. Authentication system (JWT tokens)
5. OpenAPI documentation setup

### Phase 2: Frontend Foundation (Weeks 1-2, parallel)
1. React + TypeScript project setup (Vite)
2. Tailwind CSS configuration
3. Basic layout components (header, footer, navigation)
4. Routing setup (React Router)
5. API client setup (Axios + TanStack Query)
6. Authentication context and protected routes

### Phase 3: Core API & UI (Weeks 3-5)
**Backend**:
1. Account management API (create, login, settings)
2. Character management API (CRUD operations)
3. Guild management API (CRUD, membership)
4. Server status API and WebSocket

**Frontend**:
1. Login, registration, account pages
2. Character listing, creation, profile pages
3. Guild listing, creation, profile pages
4. Server status page with real-time updates

### Phase 4: Content Features (Weeks 6-7)
**Backend**:
1. News system API (posts, comments)
2. Highscores API (rankings, caching)

**Frontend**:
1. News listing, detail, comment components
2. Highscores tables with filtering
3. Search functionality

### Phase 5: Admin & Plugins (Weeks 8-9)
**Backend**:
1. Admin API endpoints (user/character management, settings)
2. Plugin system architecture
3. Sample plugins

**Frontend**:
1. Admin panel UI (dashboard, user management)
2. Settings management interface
3. Plugin management UI

### Phase 6: Testing, Optimization & Documentation (Weeks 10-11)
**Backend**:
1. Comprehensive test suite (pytest, coverage >80%)
2. Performance optimization (query optimization, caching)
3. API documentation (OpenAPI/Swagger)

**Frontend**:
1. Component tests (Vitest + React Testing Library)
2. E2E tests (Playwright)
3. Performance optimization (code splitting, lazy loading)
4. SEO optimization (React Helmet)

**Documentation**:
1. Deployment guides (Docker, nginx, systemd)
2. API documentation
3. User manual
4. Migration guide from PHP version

### Rollback Plan
Since this is a new parallel implementation:
- No rollback needed - PHP version remains unchanged
- Users can switch back to PHP version at any time
- Database remains compatible with both

## Open Questions

### Q1: Package Name and Branding ✅ **RESOLVED**
- **Question**: Should we name it `myaac-python`, `pyaac`, or keep it separate brand?
- **Decision**: **PyAAC** (distinct name, separate project identity)
- **Rationale**:
  - Clear Python focus distinguishes it from PHP version
  - Shorter, more memorable name
  - Easier to find in package repositories (PyPI, npm)
  - Allows independent branding and community
  - Package names: `pyaac` (backend on PyPI), `@pyaac/web` (frontend on npm)

### Q2: Repository Location
- **Question**: Same repo as PHP version (monorepo) or separate repository?
- **Options**:
  1. Monorepo: `myaac/php` and `myaac/python`
  2. Separate repos: `myaac` and `myaac-python`
- **Recommendation**: Separate repository for independent versioning and CI/CD

### Q3: Feature Parity Strategy ✅ **RESOLVED**
- **Question**: Full feature parity from day 1, or MVP → iterate?
- **Decision**: **MVP approach** - Core features first, expand iteratively
- **Rationale**:
  - Faster time to market and user feedback
  - Allows validating architecture with real-world usage
  - Reduces risk of over-engineering
  - Community can contribute additional features post-MVP
  - Easier to maintain quality with smaller scope

**MVP v0.1 Scope** (Core Features):
- ✅ Account management (registration, login, recovery)
- ✅ Character management (CRUD, vocations, stats)
- ✅ Guild system (creation, membership, basic management)
- ✅ Server status (online/offline, player count)
- ✅ Basic admin panel (user/character management)
- ✅ Plugin system foundation

**Post-MVP** (Expand in future releases):
- News system with comments
- Advanced highscores (multiple categories)
- Guild wars
- Payment integrations (via plugins)
- Advanced admin features (audit logs, statistics)
- Premium account features
- Email notifications

### Q4: Frontend Strategy ✅ **RESOLVED**
- **Question**: Server-side rendering only, API-first only, or both?
- **Decision**: API-first with React + TypeScript + Tailwind CSS frontend
- **Rationale**: Modern SPA provides better UX, clear separation of concerns, and scalability

### Q5: Premium/Payment Features
- **Question**: Include payment gateway integrations or defer to plugins?
- **Options**:
  1. Core feature: Built-in payment gateways
  2. Plugin: Keep payment features in plugins only
- **Recommendation**: Plugin-based - keeps core focused, allows flexibility

### Q6: Real-time Features
- **Question**: WebSocket support for real-time server status, online players, etc.?
- **Options**:
  1. Polling: Traditional HTTP polling (simple)
  2. WebSocket: Real-time updates (better UX, more complex)
  3. SSE: Server-Sent Events (middle ground)
- **Recommendation**: WebSocket for real-time features (FastAPI has native support)

### Q7: Docker Deployment ✅ **RESOLVED**
- **Question**: Provide Docker images and docker-compose setup?
- **Decision**: **Docker-first** deployment strategy
- **Rationale**:
  - Simplifies deployment and reduces configuration errors
  - Ensures consistent environment across development and production
  - Easier dependency management (Python, Node, MySQL, Redis)
  - Popular in OTS community for game server hosting
  - Provides isolation and security benefits
  - Easy to scale horizontally with container orchestration

**Implementation**:
- Provide official Docker images for backend and frontend
- Include docker-compose.yml for complete stack
- Document traditional deployment as alternative
- Support both development and production Docker configs
- Publish images to Docker Hub or GitHub Container Registry
- Include health checks and proper logging in containers

**Docker Compose Stack**:
```yaml
services:
  backend:     # FastAPI + Uvicorn
  frontend:    # React build served by nginx
  mysql:       # Database (optional, can use existing)
  redis:       # Cache and session storage
```

## Success Criteria

### Technical Success
- [ ] 100% type hint coverage with mypy validation
- [ ] >80% test coverage
- [ ] <100ms average API response time for read operations
- [ ] Supports TFS, Canary, and OTServBR database schemas
- [ ] Zero SQL injection vulnerabilities
- [ ] Plugin system with at least 3 example plugins

### User Success
- [ ] Complete documentation (setup, API, plugin development)
- [ ] At least 5 production deployments within 6 months
- [ ] Active community contributions (>10 contributors)
- [ ] Migration guide validated by actual migrations

### Performance Benchmarks
- [ ] Account creation: <200ms (50% faster than PHP)
- [ ] Character list: <50ms (100+ characters)
- [ ] Highscores: <100ms (1000+ entries)
- [ ] Server status check: <500ms (network dependent)
