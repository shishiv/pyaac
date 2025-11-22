"""Guild management endpoints."""

from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_active_account
from app.database import get_db
from app.models.account import Account
from app.models.character import Character
from app.models.guild import Guild, GuildMembership, GuildRank
from app.schemas.guild import GuildCreate, GuildResponse

router = APIRouter(prefix="/guilds", tags=["guilds"])


@router.post("/", response_model=GuildResponse, status_code=status.HTTP_201_CREATED)
async def create_guild(
    guild_data: GuildCreate,
    character_name: str,
    current_account: Account = Depends(get_current_active_account),
    db: AsyncSession = Depends(get_db),
) -> Guild:
    """
    Create a new guild.

    Args:
        guild_data: Guild creation data
        character_name: Name of character to be guild leader
        current_account: Current authenticated account
        db: Database session

    Returns:
        Guild: Created guild

    Raises:
        HTTPException: If guild name exists, character not found, or requirements not met
    """
    # Check if guild name already exists
    stmt = select(Guild).where(Guild.name == guild_data.name)
    result = await db.execute(stmt)
    existing_guild = result.scalar_one_or_none()

    if existing_guild:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Guild name already exists",
        )

    # Get character
    stmt = select(Character).where(
        Character.name == character_name,
        Character.account_id == current_account.id,
        Character.deleted == 0,
    )
    result = await db.execute(stmt)
    character = result.scalar_one_or_none()

    if not character:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Character not found or doesn't belong to your account",
        )

    # Check if character is already in a guild
    stmt = select(GuildMembership).where(GuildMembership.player_id == character.id)
    result = await db.execute(stmt)
    existing_membership = result.scalar_one_or_none()

    if existing_membership:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Character is already in a guild",
        )

    # Check premium requirement (optional, based on server settings)
    # if not current_account.is_premium:
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="Premium account required to create a guild",
    #     )

    # Check level requirement
    MIN_LEVEL = 20
    if character.level < MIN_LEVEL:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Character must be at least level {MIN_LEVEL} to create a guild",
        )

    # Create guild
    new_guild = Guild(
        name=guild_data.name,
        ownerid=character.id,
        creationdata=int(datetime.now().timestamp()),
        motd=guild_data.motd,
        description=guild_data.description,
    )

    db.add(new_guild)
    await db.flush()  # Flush to get guild ID

    # Create default ranks
    leader_rank = GuildRank(guild_id=new_guild.id, name="Leader", level=3)
    vice_rank = GuildRank(guild_id=new_guild.id, name="Vice-Leader", level=2)
    member_rank = GuildRank(guild_id=new_guild.id, name="Member", level=1)

    db.add_all([leader_rank, vice_rank, member_rank])
    await db.flush()

    # Add guild leader as member
    membership = GuildMembership(
        player_id=character.id,
        guild_id=new_guild.id,
        rank_id=leader_rank.id,
        nick="",
    )

    db.add(membership)
    await db.commit()
    await db.refresh(new_guild)

    return new_guild


@router.get("/", response_model=List[GuildResponse])
async def list_guilds(
    db: AsyncSession = Depends(get_db),
) -> List[Guild]:
    """
    List all guilds (public endpoint).

    Args:
        db: Database session

    Returns:
        List[Guild]: List of guilds
    """
    stmt = select(Guild).order_by(Guild.name)
    result = await db.execute(stmt)
    guilds = result.scalars().all()

    return list(guilds)


@router.get("/{guild_id}", response_model=GuildResponse)
async def get_guild(
    guild_id: int,
    db: AsyncSession = Depends(get_db),
) -> Guild:
    """
    Get guild details (public endpoint).

    Args:
        guild_id: Guild ID
        db: Database session

    Returns:
        Guild: Guild details

    Raises:
        HTTPException: If guild not found
    """
    stmt = select(Guild).where(Guild.id == guild_id)
    result = await db.execute(stmt)
    guild = result.scalar_one_or_none()

    if not guild:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guild not found",
        )

    return guild


@router.patch("/{guild_id}", response_model=GuildResponse)
async def update_guild(
    guild_id: int,
    guild_data: GuildCreate,
    current_account: Account = Depends(get_current_active_account),
    db: AsyncSession = Depends(get_db),
) -> Guild:
    """
    Update guild information (leader only).

    Args:
        guild_id: Guild ID
        guild_data: Guild update data
        current_account: Current authenticated account
        db: Database session

    Returns:
        Guild: Updated guild

    Raises:
        HTTPException: If guild not found or user is not guild leader
    """
    stmt = select(Guild).where(Guild.id == guild_id)
    result = await db.execute(stmt)
    guild = result.scalar_one_or_none()

    if not guild:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guild not found",
        )

    # Check if current account owns the guild leader character
    stmt = select(Character).where(Character.id == guild.ownerid)
    result = await db.execute(stmt)
    leader = result.scalar_one_or_none()

    if not leader or leader.account_id != current_account.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only guild leader can update guild information",
        )

    # Update guild
    guild.motd = guild_data.motd
    if guild_data.description is not None:
        guild.description = guild_data.description

    await db.commit()
    await db.refresh(guild)

    return guild


@router.delete("/{guild_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_guild(
    guild_id: int,
    current_account: Account = Depends(get_current_active_account),
    db: AsyncSession = Depends(get_db),
) -> None:
    """
    Delete (disband) a guild (leader only).

    Args:
        guild_id: Guild ID
        current_account: Current authenticated account
        db: Database session

    Raises:
        HTTPException: If guild not found or user is not guild leader
    """
    stmt = select(Guild).where(Guild.id == guild_id)
    result = await db.execute(stmt)
    guild = result.scalar_one_or_none()

    if not guild:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guild not found",
        )

    # Check if current account owns the guild leader character
    stmt = select(Character).where(Character.id == guild.ownerid)
    result = await db.execute(stmt)
    leader = result.scalar_one_or_none()

    if not leader or leader.account_id != current_account.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only guild leader can disband the guild",
        )

    # Delete guild (will cascade to memberships and ranks)
    await db.delete(guild)
    await db.commit()
