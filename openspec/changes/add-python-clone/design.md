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

### Decision 3: Architecture Pattern - **API-First with SSR Option**

**Choice**: Hybrid architecture supporting both REST API and server-side rendering

**Rationale**:
- Flexibility: Support both modern SPAs and traditional server-rendered pages
- Future-proof: Can migrate fully to API + SPA over time
- Compatibility: Server-side rendering maintains similarity to PHP version
- Developer Choice: Let deployments choose their preferred approach

**Structure**:
```
app/
├── api/           # REST API endpoints (FastAPI routers)
│   ├── v1/
│   │   ├── accounts.py
│   │   ├── characters.py
│   │   └── guilds.py
├── web/           # Server-side rendered pages (Jinja2 templates)
│   ├── templates/
│   └── routes.py
├── core/          # Business logic (shared by API and web)
│   ├── auth.py
│   ├── characters.py
│   └── guilds.py
├── models/        # SQLAlchemy models
├── schemas/       # Pydantic schemas (validation, serialization)
└── plugins/       # Plugin system
```

### Decision 4: Frontend - **Bootstrap 5 + Optional HTMX**

**Choice**: Bootstrap 5 for CSS framework, HTMX for enhanced interactivity (optional)

**Rationale**:
- Bootstrap 5: Modern, well-documented, easy migration from Bootstrap 4.6
- HTMX: Add interactivity without heavy JavaScript frameworks
- Progressive Enhancement: Start with SSR, add interactivity where needed
- Familiarity: Similar to existing PHP version frontend

**Alternatives**:
- React/Vue/Svelte: Supported via REST API, but not default
- Alpine.js: Lighter alternative to HTMX, also viable

### Decision 5: Plugin System - **Entry Points + Hooks**

**Choice**: Python entry points + hook system similar to PHP version

**Rationale**:
- Entry Points: Standard Python mechanism for plugin discovery
- Hooks: Event-driven architecture for extensibility
- Type Safety: Typed hook signatures for better DX

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

### Decision 6: Authentication - **JWT + Session Hybrid**

**Choice**: JWT tokens for API, session cookies for web interface

**Rationale**:
- JWT: Stateless authentication for API consumers
- Sessions: Traditional session management for web interface (compatibility)
- Security: Both approaches supported, user/deployment can choose

**Implementation**:
- `python-jose` for JWT handling
- `itsdangerous` for session management (FastAPI built-in)
- Configurable token expiration and refresh

### Decision 7: Development Tools

**Choices**:
- **Package Management**: Poetry (better dependency resolution than pip)
- **Linting/Formatting**: Ruff (all-in-one, extremely fast)
- **Type Checking**: mypy (most mature, wide adoption)
- **Testing**: pytest + pytest-asyncio + httpx (async support)
- **Documentation**: MkDocs with Material theme
- **CI/CD**: GitHub Actions (consistency with PHP version)

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

### Phase 1: Foundation (Weeks 1-2)
1. Project scaffolding (Poetry, directory structure)
2. Database models (Account, Character, Guild basic models)
3. FastAPI app setup
4. Authentication system (JWT + sessions)

### Phase 2: Core Features (Weeks 3-5)
1. Account management (create, login, settings)
2. Character management (CRUD operations)
3. Guild management (CRUD, membership)
4. Server status monitoring

### Phase 3: Content Features (Weeks 6-7)
1. News system (posts, comments)
2. Highscores (rankings)
3. Templates and frontend (Bootstrap 5)

### Phase 4: Admin & Plugins (Weeks 8-9)
1. Admin panel (user management, settings)
2. Plugin system architecture
3. Sample plugins

### Phase 5: Testing & Documentation (Week 10)
1. Comprehensive test suite (pytest)
2. API documentation (OpenAPI/Swagger)
3. Deployment guides
4. Migration guide from PHP version

### Rollback Plan
Since this is a new parallel implementation:
- No rollback needed - PHP version remains unchanged
- Users can switch back to PHP version at any time
- Database remains compatible with both

## Open Questions

### Q1: Package Name and Branding
- **Question**: Should we name it `myaac-python`, `pyaac`, or keep it separate brand?
- **Options**:
  1. `myaac` (same brand, clear it's official alternative)
  2. `pyaac` (distinct name, separate project)
  3. `myaac-python` (explicit about implementation)
- **Recommendation**: `myaac-python` for clarity, or `pyaac` if wanting separate identity

### Q2: Repository Location
- **Question**: Same repo as PHP version (monorepo) or separate repository?
- **Options**:
  1. Monorepo: `myaac/php` and `myaac/python`
  2. Separate repos: `myaac` and `myaac-python`
- **Recommendation**: Separate repository for independent versioning and CI/CD

### Q3: Feature Parity Strategy
- **Question**: Full feature parity from day 1, or MVP → iterate?
- **Options**:
  1. Full parity: Delay release until all features implemented
  2. MVP: Core features first (auth, characters, guilds), expand over time
- **Recommendation**: MVP approach - release v0.1 with core features, iterate

### Q4: Frontend Strategy
- **Question**: Server-side rendering only, API-first only, or both?
- **Options**:
  1. SSR only (like PHP version)
  2. API only (modern, let users build their own frontend)
  3. Both (hybrid approach)
- **Recommendation**: Both - API-first with default templates for compatibility

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

### Q7: Docker Deployment
- **Question**: Provide Docker images and docker-compose setup?
- **Options**:
  1. Docker-first: Primary deployment method
  2. Optional: Support but don't require Docker
- **Recommendation**: Provide Docker setup as recommended deployment, support traditional too

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
