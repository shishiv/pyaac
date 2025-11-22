"""Account schemas."""

from pydantic import BaseModel, EmailStr, Field, field_validator


class AccountCreate(BaseModel):
    """Schema for account creation."""

    name: str = Field(
        ...,
        min_length=3,
        max_length=32,
        description="Account name (3-32 characters)",
    )
    password: str = Field(
        ...,
        min_length=8,
        max_length=255,
        description="Password (min 8 characters)",
    )
    email: EmailStr | None = Field(None, description="Email address (optional)")

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        """Validate account name."""
        if not v.isalnum():
            raise ValueError("Account name must be alphanumeric")
        return v.lower()


class AccountUpdate(BaseModel):
    """Schema for account updates."""

    email: EmailStr | None = None
    password: str | None = Field(None, min_length=8, max_length=255)


class AccountResponse(BaseModel):
    """Schema for account response."""

    id: int
    name: str
    email: str | None = None
    premdays: int | None = None
    coins: int | None = None
    character_count: int = 0

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    """Schema for login request."""

    name: str = Field(..., description="Account name")
    password: str = Field(..., description="Account password")


class TokenResponse(BaseModel):
    """Schema for token response."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"
