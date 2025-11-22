"""Character management endpoints."""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_active_account
from app.database import get_db
from app.models.account import Account
from app.models.character import Character
from app.models.guild import GuildMembership
from app.schemas.character import CharacterCreate, CharacterDetailResponse, CharacterResponse

router = APIRouter(prefix="/characters", tags=["characters"])


@router.post("/", response_model=CharacterResponse, status_code=status.HTTP_201_CREATED)
async def create_character(
    character_data: CharacterCreate,
    current_account: Account = Depends(get_current_active_account),
    db: AsyncSession = Depends(get_db),
) -> Character:
    """
    Create a new character.

    Args:
        character_data: Character creation data
        current_account: Current authenticated account
        db: Database session

    Returns:
        Character: Created character

    Raises:
        HTTPException: If character name already exists or character limit reached
    """
    # Check if character name already exists
    stmt = select(Character).where(Character.name == character_data.name)
    result = await db.execute(stmt)
    existing_character = result.scalar_one_or_none()

    if existing_character:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Character name already exists",
        )

    # Check character limit (default: 15 characters per account)
    CHARACTER_LIMIT = 15
    if current_account.character_count >= CHARACTER_LIMIT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Character limit reached ({CHARACTER_LIMIT} characters per account)",
        )

    # Create new character with default values
    new_character = Character(
        name=character_data.name,
        account_id=current_account.id,
        vocation=character_data.vocation,
        sex=character_data.sex,
        # Default starting values
        level=1,
        health=150,
        healthmax=150,
        mana=0,
        manamax=0,
        experience=0,
        lookbody=0,
        lookfeet=0,
        lookhead=0,
        looklegs=0,
        looktype=136 if character_data.sex == 1 else 137,  # Male/Female outfit
        lookaddons=0,
        maglevel=0,
        manaspent=0,
        soul=100,
        town_id=1,  # Default town
        posx=0,
        posy=0,
        posz=0,
        cap=400,
        # Default skills
        skill_fist=10,
        skill_club=10,
        skill_sword=10,
        skill_axe=10,
        skill_dist=10,
        skill_shielding=10,
        skill_fishing=10,
    )

    db.add(new_character)
    await db.commit()
    await db.refresh(new_character)

    return new_character


@router.get("/", response_model=List[CharacterResponse])
async def list_characters(
    current_account: Account = Depends(get_current_active_account),
    db: AsyncSession = Depends(get_db),
) -> List[Character]:
    """
    List all characters for the current account.

    Args:
        current_account: Current authenticated account
        db: Database session

    Returns:
        List[Character]: List of characters
    """
    stmt = select(Character).where(
        Character.account_id == current_account.id,
        Character.deleted == 0,
    ).order_by(Character.name)

    result = await db.execute(stmt)
    characters = result.scalars().all()

    return list(characters)


@router.get("/{character_name}", response_model=CharacterDetailResponse)
async def get_character(
    character_name: str,
    current_account: Account = Depends(get_current_active_account),
    db: AsyncSession = Depends(get_db),
) -> Character:
    """
    Get detailed character information.

    Args:
        character_name: Character name
        current_account: Current authenticated account
        db: Database session

    Returns:
        Character: Character details

    Raises:
        HTTPException: If character not found or doesn't belong to account
    """
    stmt = select(Character).where(
        Character.name == character_name,
        Character.deleted == 0,
    )
    result = await db.execute(stmt)
    character = result.scalar_one_or_none()

    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found",
        )

    # Check ownership
    if character.account_id != current_account.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to access this character",
        )

    return character


@router.delete("/{character_name}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_character(
    character_name: str,
    current_account: Account = Depends(get_current_active_account),
    db: AsyncSession = Depends(get_db),
) -> None:
    """
    Delete a character (mark as deleted).

    Args:
        character_name: Character name
        current_account: Current authenticated account
        db: Database session

    Raises:
        HTTPException: If character not found, doesn't belong to account, or is guild leader
    """
    stmt = select(Character).where(
        Character.name == character_name,
        Character.deleted == 0,
    )
    result = await db.execute(stmt)
    character = result.scalar_one_or_none()

    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found",
        )

    # Check ownership
    if character.account_id != current_account.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to delete this character",
        )

    # Check if character is guild leader
    if character.guild_membership:
        stmt = select(GuildMembership).where(
            GuildMembership.player_id == character.id
        )
        result = await db.execute(stmt)
        membership = result.scalar_one_or_none()

        if membership and membership.guild.ownerid == character.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot delete character who is a guild leader. Transfer or disband the guild first.",
            )

    # Mark as deleted instead of actually deleting
    character.deleted = 1
    await db.commit()


@router.get("/search/{query}", response_model=List[CharacterResponse])
async def search_characters(
    query: str,
    db: AsyncSession = Depends(get_db),
) -> List[Character]:
    """
    Search for characters by name (public endpoint).

    Args:
        query: Search query (minimum 3 characters)
        db: Database session

    Returns:
        List[Character]: Matching characters

    Raises:
        HTTPException: If query is too short
    """
    if len(query) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Search query must be at least 3 characters",
        )

    stmt = select(Character).where(
        Character.name.like(f"%{query}%"),
        Character.deleted == 0,
    ).limit(50)

    result = await db.execute(stmt)
    characters = result.scalars().all()

    return list(characters)
