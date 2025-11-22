"""Player deaths endpoints."""

from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.database import get_db
from app.models.character import Character
from app.models.player_death import PlayerDeath
from app.schemas.death import DeathResponse

router = APIRouter(prefix="/deaths", tags=["deaths"])


@router.get("/", response_model=List[DeathResponse])
async def get_recent_deaths(
    limit: int = Query(50, ge=1, le=200),
    player_name: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> List[dict]:
    """
    Get recent player deaths.

    Args:
        limit: Maximum number of deaths to return
        player_name: Filter by player name (optional)
        db: Database session

    Returns:
        List[DeathResponse]: List of recent deaths
    """
    stmt = select(PlayerDeath, Character).join(
        Character, PlayerDeath.player_id == Character.id
    ).order_by(PlayerDeath.time.desc()).limit(limit)

    if player_name:
        stmt = stmt.where(Character.name == player_name)

    result = await db.execute(stmt)
    rows = result.all()

    deaths = []
    for death, character in rows:
        death_dict = {
            "id": death.id,
            "player_id": death.player_id,
            "player_name": character.name,
            "time": death.time,
            "level": death.level,
            "killed_by": death.killed_by,
            "is_player": death.is_player,
            "mostdamage_by": death.mostdamage_by,
            "mostdamage_is_player": death.mostdamage_is_player,
        }
        deaths.append(death_dict)

    return deaths


@router.get("/character/{character_name}", response_model=List[DeathResponse])
async def get_character_deaths(
    character_name: str,
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> List[dict]:
    """
    Get deaths for a specific character.

    Args:
        character_name: Character name
        limit: Maximum number of deaths to return
        db: Database session

    Returns:
        List[DeathResponse]: List of character deaths
    """
    # Find character first
    stmt = select(Character).where(Character.name == character_name)
    result = await db.execute(stmt)
    character = result.scalar_one_or_none()

    if not character:
        return []

    # Get deaths for this character
    stmt = (
        select(PlayerDeath)
        .where(PlayerDeath.player_id == character.id)
        .order_by(PlayerDeath.time.desc())
        .limit(limit)
    )

    result = await db.execute(stmt)
    deaths = result.scalars().all()

    return [
        {
            "id": death.id,
            "player_id": death.player_id,
            "player_name": character.name,
            "time": death.time,
            "level": death.level,
            "killed_by": death.killed_by,
            "is_player": death.is_player,
            "mostdamage_by": death.mostdamage_by,
            "mostdamage_is_player": death.mostdamage_is_player,
        }
        for death in deaths
    ]
