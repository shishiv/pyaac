"""Main FastAPI application."""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1 import accounts, auth, characters, guilds, highscores, news, server
from app.config import settings
from app.database import close_db, init_db


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan events.

    Handles startup and shutdown tasks.
    """
    # Startup
    print("🚀 Starting PyAAC...")
    # Note: init_db() is commented out to avoid creating tables automatically
    # Use Alembic for migrations in production
    # await init_db()
    print("✅ PyAAC started successfully")

    yield

    # Shutdown
    print("👋 Shutting down PyAAC...")
    await close_db()
    print("✅ PyAAC shut down successfully")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="Python Alternative to MyAAC for Open Tibia Servers",
    version=settings.version,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health", tags=["health"])
async def health_check() -> JSONResponse:
    """Health check endpoint."""
    return JSONResponse(
        content={
            "status": "ok",
            "app": settings.app_name,
            "version": settings.version,
        }
    )


# Root endpoint
@app.get("/", tags=["root"])
async def root() -> dict[str, str]:
    """Root endpoint."""
    return {
        "message": "Welcome to PyAAC API",
        "version": settings.version,
        "docs": "/docs",
    }


# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(accounts.router, prefix="/api/v1")
app.include_router(characters.router, prefix="/api/v1")
app.include_router(guilds.router, prefix="/api/v1")
app.include_router(highscores.router, prefix="/api/v1")
app.include_router(news.router, prefix="/api/v1")
app.include_router(server.router, prefix="/api/v1")
