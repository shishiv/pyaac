"""Guild schemas."""

from pydantic import BaseModel, Field


class GuildCreate(BaseModel):
    """Schema for guild creation."""

    name: str = Field(
        ...,
        min_length=3,
        max_length=255,
        description="Guild name (3-255 characters)",
    )
    motd: str = Field(
        default="",
        max_length=255,
        description="Message of the day",
    )
    description: str | None = Field(
        None,
        max_length=5000,
        description="Guild description",
    )


class GuildResponse(BaseModel):
    """Schema for guild response."""

    id: int
    name: str
    ownerid: int
    motd: str
    description: str | None = None
    member_count: int = 0

    model_config = {"from_attributes": True}
