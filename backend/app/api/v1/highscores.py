"""Highscores/rankings endpoints."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.character import Character

router = APIRouter(prefix="/highscores", tags=["highscores"])


class HighscoreEntry:
    """Highscore entry model for API responses."""

    def __init__(self, rank: int, character: Character, value: int):
        """Initialize highscore entry."""
        self.rank = rank
        self.name = character.name
        self.level = character.level
        self.vocation = character.vocation
        self.value = value


@router.get("/experience")
async def get_experience_highscores(
    limit: int = Query(100, ge=1, le=500),
    vocation: int | None = Query(None, ge=0, le=8),
    db: AsyncSession = Depends(get_db),
) -> List[dict]:
    """
    Get experience/level highscores.

    Args:
        limit: Maximum number of entries to return
        vocation: Filter by vocation (optional)
        db: Database session

    Returns:
        List[dict]: List of highscore entries
    """
    stmt = select(Character).where(Character.deleted == 0)

    if vocation is not None:
        stmt = stmt.where(Character.vocation == vocation)

    stmt = stmt.order_by(Character.experience.desc()).limit(limit)

    result = await db.execute(stmt)
    characters = result.scalars().all()

    return [
        {
            "rank": idx + 1,
            "name": char.name,
            "level": char.level,
            "vocation": char.vocation,
            "experience": char.experience,
        }
        for idx, char in enumerate(characters)
    ]


@router.get("/magic")
async def get_magic_highscores(
    limit: int = Query(100, ge=1, le=500),
    vocation: int | None = Query(None, ge=0, le=8),
    db: AsyncSession = Depends(get_db),
) -> List[dict]:
    """
    Get magic level highscores.

    Args:
        limit: Maximum number of entries to return
        vocation: Filter by vocation (optional)
        db: Database session

    Returns:
        List[dict]: List of highscore entries
    """
    stmt = select(Character).where(Character.deleted == 0)

    if vocation is not None:
        stmt = stmt.where(Character.vocation == vocation)

    stmt = stmt.order_by(Character.maglevel.desc()).limit(limit)

    result = await db.execute(stmt)
    characters = result.scalars().all()

    return [
        {
            "rank": idx + 1,
            "name": char.name,
            "level": char.level,
            "vocation": char.vocation,
            "maglevel": char.maglevel,
        }
        for idx, char in enumerate(characters)
    ]


@router.get("/skill/{skill_name}")
async def get_skill_highscores(
    skill_name: str,
    limit: int = Query(100, ge=1, le=500),
    vocation: int | None = Query(None, ge=0, le=8),
    db: AsyncSession = Depends(get_db),
) -> List[dict]:
    """
    Get skill highscores.

    Args:
        skill_name: Skill name (fist, club, sword, axe, dist, shielding, fishing)
        limit: Maximum number of entries to return
        vocation: Filter by vocation (optional)
        db: Database session

    Returns:
        List[dict]: List of highscore entries

    Raises:
        HTTPException: If invalid skill name
    """
    valid_skills = {
        "fist": Character.skill_fist,
        "club": Character.skill_club,
        "sword": Character.skill_sword,
        "axe": Character.skill_axe,
        "dist": Character.skill_dist,
        "distance": Character.skill_dist,
        "shielding": Character.skill_shielding,
        "fishing": Character.skill_fishing,
    }

    if skill_name.lower() not in valid_skills:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid skill name. Valid skills: {', '.join(valid_skills.keys())}",
        )

    skill_column = valid_skills[skill_name.lower()]

    stmt = select(Character).where(Character.deleted == 0)

    if vocation is not None:
        stmt = stmt.where(Character.vocation == vocation)

    stmt = stmt.order_by(skill_column.desc()).limit(limit)

    result = await db.execute(stmt)
    characters = result.scalars().all()

    return [
        {
            "rank": idx + 1,
            "name": char.name,
            "level": char.level,
            "vocation": char.vocation,
            "skill_value": getattr(char, f"skill_{skill_name.lower().replace('distance', 'dist')}"),
        }
        for idx, char in enumerate(characters)
    ]
