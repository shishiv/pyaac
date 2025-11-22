"""News schemas."""

from datetime import datetime

from pydantic import BaseModel, Field


class NewsCreate(BaseModel):
    """Schema for news creation."""

    title: str = Field(..., min_length=1, max_length=255, description="News title")
    body: str = Field(..., min_length=1, description="News body content")
    category: str | None = Field(None, max_length=50, description="News category")
    icon: str | None = Field(None, max_length=50, description="News icon")


class NewsUpdate(BaseModel):
    """Schema for news updates."""

    title: str | None = Field(None, min_length=1, max_length=255)
    body: str | None = Field(None, min_length=1)
    category: str | None = Field(None, max_length=50)
    icon: str | None = Field(None, max_length=50)
    hidden: int | None = Field(None, ge=0, le=1)


class NewsResponse(BaseModel):
    """Schema for news response."""

    id: int
    title: str
    body: str
    author_id: int
    date: int
    category: str | None = None
    icon: str | None = None
    type: int | None = 1
    comments: int | None = 0
    hidden: int | None = 0

    model_config = {"from_attributes": True}

    @property
    def date_formatted(self) -> str:
        """Return formatted date."""
        return datetime.fromtimestamp(self.date).strftime("%Y-%m-%d %H:%M:%S")
