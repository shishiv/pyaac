"""Application configuration."""

from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str = "PyAAC"
    debug: bool = False
    version: str = "0.1.0"

    # Database
    database_url: str = Field(
        default="mysql+aiomysql://root:password@localhost:3306/otserver",
        description="Database connection URL",
    )

    # Security
    secret_key: str = Field(
        default="change-this-secret-key-in-production",
        description="Secret key for JWT signing",
    )
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # CORS
    cors_origins: List[str] = Field(
        default=["http://localhost:5173", "http://localhost:3000"],
        description="Allowed CORS origins",
    )

    # Rate Limiting
    rate_limit_enabled: bool = True
    rate_limit_per_minute: int = 60

    # Redis (optional)
    redis_url: str | None = Field(
        default=None,
        description="Redis URL for caching and session storage",
    )

    # Server
    server_host: str = "0.0.0.0"
    server_port: int = 8000

    # OTS Server
    ots_server_host: str = "localhost"
    ots_server_port: int = 7171


settings = Settings()
