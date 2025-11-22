# PyAAC Backend

Python backend for PyAAC - a modern alternative to MyAAC for Open Tibia Servers.

## Features

- **FastAPI** - Modern async web framework with automatic API documentation
- **SQLAlchemy 2.0+** - Async ORM with support for dynamic schema detection
- **Type Safety** - Full type hints with mypy validation
- **Authentication** - JWT token-based auth with refresh tokens
- **Plugin System** - Extensible architecture via entry points
- **Testing** - Comprehensive test suite with pytest

## Requirements

- Python 3.11+
- MySQL 8.0+ or MariaDB 10.5+
- Redis (optional, for caching)

## Installation

### Using Poetry (Recommended)

```bash
# Install dependencies
poetry install

# Activate virtual environment
poetry shell

# Run development server
uvicorn app.main:app --reload --port 8000
```

### Using pip

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -e .

# Run development server
uvicorn app.main:app --reload --port 8000
```

## Configuration

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=mysql+aiomysql://user:password@localhost:3306/otserver

# Security
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS (for development)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Server
DEBUG=true
```

## Development

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py
```

### Code Quality

```bash
# Format code
ruff format .

# Lint code
ruff check .

# Type checking
mypy app/
```

### Database Migrations

```bash
# Create a new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## API Documentation

Once the server is running, visit:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Project Structure

```
backend/
├── app/
│   ├── api/           # API endpoints (FastAPI routers)
│   │   └── v1/
│   ├── core/          # Business logic
│   ├── models/        # SQLAlchemy models
│   ├── schemas/       # Pydantic schemas
│   ├── plugins/       # Plugin system
│   ├── config.py      # Configuration
│   └── main.py        # FastAPI application
├── tests/
├── docs/
└── pyproject.toml
```

## License

GPL-3.0-or-later - Same as MyAAC PHP version
