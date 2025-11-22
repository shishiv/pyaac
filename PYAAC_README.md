# PyAAC - Python Alternative to MyAAC

A modern, type-safe alternative to MyAAC for Open Tibia Servers, built with Python (FastAPI) and React + TypeScript.

## Overview

PyAAC provides a modern web interface for Open Tibia Server management with:

- **FastAPI Backend** - Async-first Python web framework with automatic API documentation
- **React + TypeScript Frontend** - Modern SPA with Tailwind CSS
- **Full Type Safety** - Type hints in Python + TypeScript on frontend
- **Database Compatibility** - Works with existing OTS database schemas (TFS, Canary, OTServBR)
- **Docker-First Deployment** - Easy deployment with Docker Compose
- **Plugin System** - Extensible architecture for custom features

## Features

### Core Features (MVP v0.1)
- ✅ Account management (registration, login, JWT authentication)
- ✅ Character management (CRUD operations, vocations, stats)
- 🚧 Guild system (creation, membership, basic management)
- 🚧 Server status (online/offline, player count)
- 🚧 Basic admin panel (user/character management)
- 🚧 Plugin system foundation

### Future Features
- News system with comments
- Advanced highscores (multiple categories)
- Guild wars
- Payment integrations (via plugins)
- Advanced admin features (audit logs, statistics)
- Premium account features
- Email notifications

## Quick Start

### Prerequisites

- **Docker & Docker Compose** (recommended)
- **OR** Python 3.11+, Node.js 18+, and MySQL 8.0+

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd pyaac

# Copy environment file
cp .env.docker.example .env

# Start all services
docker-compose up -d

# The application will be available at:
# - Frontend: http://localhost
# - Backend API: http://localhost:8000
# - API Docs: http://localhost:8000/docs
```

### Option 2: Manual Installation

#### Backend Setup

```bash
cd backend

# Install dependencies with Poetry
poetry install

# Copy environment file
cp .env.example .env
# Edit .env with your database credentials

# Run migrations (if any)
poetry run alembic upgrade head

# Start development server
poetry run uvicorn app.main:app --reload --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

## Project Structure

```
pyaac/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints (FastAPI routers)
│   │   ├── core/           # Business logic
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── plugins/        # Plugin system
│   │   ├── config.py       # Configuration
│   │   ├── database.py     # Database setup
│   │   └── main.py         # FastAPI application
│   ├── tests/
│   ├── alembic/            # Database migrations
│   ├── pyproject.toml      # Python dependencies
│   └── Dockerfile
├── frontend/               # React frontend
│   ├── src/
│   │   ├── api/           # API client and endpoints
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components (routes)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── context/       # React Context providers
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── package.json       # Node dependencies
│   └── Dockerfile
├── docker-compose.yml     # Full stack deployment
├── openspec/              # OpenSpec documentation
└── README.md
```

## Development

### Backend Development

```bash
cd backend

# Run tests
poetry run pytest

# Run with coverage
poetry run pytest --cov=app --cov-report=html

# Lint code
poetry run ruff check .

# Format code
poetry run ruff format .

# Type checking
poetry run mypy app/

# Create migration
poetry run alembic revision --autogenerate -m "Description"

# Apply migrations
poetry run alembic upgrade head
```

### Frontend Development

```bash
cd frontend

# Run tests (to be implemented)
npm run test

# Lint code
npm run lint

# Format code
npm run format

# Type checking
npm run type-check

# Build for production
npm run build
```

## API Documentation

Once the backend is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Configuration

### Backend Configuration

Create `.env` file in `backend/` directory:

```env
DATABASE_URL=mysql+aiomysql://user:password@localhost:3306/otserver
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
DEBUG=true
```

### Frontend Configuration

Create `.env` file in `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Deployment

### Docker Deployment

```bash
# Production build
docker-compose -f docker-compose.yml up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Traditional Deployment

See individual README files in `backend/` and `frontend/` directories for traditional deployment instructions.

## Database Compatibility

PyAAC is compatible with existing Open Tibia Server database schemas:

- ✅ TFS (The Forgotten Server)
- ✅ Canary
- ✅ OTServBR
- ✅ Other OTS distributions with similar schemas

The application includes dynamic schema detection to handle different column names and optional fields.

## Contributing

Contributions are welcome! Please read the [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linters
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Testing

### Backend Tests

```bash
cd backend
poetry run pytest
poetry run pytest --cov=app --cov-report=html
```

### Frontend Tests

```bash
cd frontend
npm run test
npm run test:coverage
```

## License

GPL-3.0-or-later - Same as MyAAC PHP version

## Acknowledgments

- MyAAC PHP - Original inspiration and reference
- Open Tibia Server community
- FastAPI, React, and all open-source dependencies

## Support

- 📖 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/your-org/pyaac/issues)
- 💬 [Discussions](https://github.com/your-org/pyaac/discussions)

## Roadmap

See [OpenSpec Changes](openspec/changes/) for detailed feature planning and implementation status.

### Current Status: MVP Development (v0.1.0)

- [x] Project scaffolding and setup
- [x] Backend foundation (FastAPI, SQLAlchemy)
- [x] Frontend foundation (React, TypeScript, Tailwind)
- [x] Authentication system (JWT)
- [x] Database models (Account, Character, Guild)
- [ ] Character management features
- [ ] Guild management features
- [ ] Server status monitoring
- [ ] Admin panel
- [ ] Plugin system

## FAQ

**Q: Is this a replacement for MyAAC PHP?**
A: No, PyAAC is a parallel implementation, not a replacement. Both can coexist.

**Q: Can I migrate from MyAAC PHP to PyAAC?**
A: Yes, PyAAC uses the same database schema, so you can switch without data migration.

**Q: Does PyAAC support all MyAAC features?**
A: Not yet. We're following an MVP approach - core features first, then expanding based on community feedback.

**Q: Can I use my existing database?**
A: Yes! PyAAC is designed to work with existing OTS databases.

**Q: How do I contribute?**
A: Check the Contributing Guidelines and pick an issue labeled "good first issue" or "help wanted".
