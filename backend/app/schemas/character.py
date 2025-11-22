"""Character schemas."""

from pydantic import BaseModel, Field, field_validator


class CharacterCreate(BaseModel):
    """Schema for character creation."""

    name: str = Field(
        ...,
        min_length=3,
        max_length=29,
        description="Character name (3-29 characters)",
    )
    vocation: int = Field(..., ge=0, le=8, description="Vocation ID (0-8)")
    sex: int = Field(..., ge=0, le=1, description="Sex (0=female, 1=male)")

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        """Validate character name."""
        if not all(c.isalpha() or c.isspace() for c in v):
            raise ValueError("Character name can only contain letters and spaces")
        # Capitalize each word
        return " ".join(word.capitalize() for word in v.split())


class CharacterResponse(BaseModel):
    """Schema for character response."""

    id: int
    name: str
    account_id: int
    level: int
    vocation: int
    vocation_name: str
    health: int
    healthmax: int
    mana: int
    manamax: int
    experience: int
    sex: int
    online: int | None = None

    model_config = {"from_attributes": True}


class CharacterDetailResponse(CharacterResponse):
    """Schema for detailed character response."""

    soul: int
    cap: int
    stamina: int | None
    skill_fist: int
    skill_club: int
    skill_sword: int
    skill_axe: int
    skill_dist: int
    skill_shielding: int
    skill_fishing: int
    maglevel: int
