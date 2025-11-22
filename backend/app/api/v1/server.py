"""Server status endpoints."""

import asyncio
import socket
from typing import List

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.character import Character

router = APIRouter(prefix="/server", tags=["server"])


class OnlinePlayer(BaseModel):
    """Online player information."""

    name: str
    level: int
    vocation: str


class ServerStatus(BaseModel):
    """Server status information."""

    online: bool
    players_online: int
    players_max: int = 1000
    uptime: str = "N/A"
    server_name: str = "Open Tibia Server"
    version: str = "1.0"


async def check_server_connection(host: str, port: int, timeout: float = 2.0) -> bool:
    """
    Check if OTS server is online via TCP connection.

    Args:
        host: Server host
        port: Server port
        timeout: Connection timeout in seconds

    Returns:
        bool: True if server is online
    """
    try:
        # Try to connect to server
        reader, writer = await asyncio.wait_for(
            asyncio.open_connection(host, port),
            timeout=timeout
        )
        writer.close()
        await writer.wait_closed()
        return True
    except (asyncio.TimeoutError, ConnectionRefusedError, OSError):
        return False


@router.get("/status", response_model=ServerStatus)
async def get_server_status(
    db: AsyncSession = Depends(get_db),
) -> ServerStatus:
    """
    Get server status.

    Args:
        db: Database session

    Returns:
        ServerStatus: Server status information
    """
    # Check if server is online
    is_online = await check_server_connection(
        settings.ots_server_host,
        settings.ots_server_port,
    )

    # Count online players
    stmt = select(Character).where(Character.online == 1)
    result = await db.execute(stmt)
    online_players = result.scalars().all()

    return ServerStatus(
        online=is_online,
        players_online=len(online_players),
    )


@router.get("/online-players", response_model=List[OnlinePlayer])
async def get_online_players(
    db: AsyncSession = Depends(get_db),
) -> List[OnlinePlayer]:
    """
    Get list of online players.

    Args:
        db: Database session

    Returns:
        List[OnlinePlayer]: List of online players
    """
    stmt = select(Character).where(Character.online == 1).order_by(Character.level.desc())
    result = await db.execute(stmt)
    online_players = result.scalars().all()

    return [
        OnlinePlayer(
            name=player.name,
            level=player.level,
            vocation=player.vocation_name,
        )
        for player in online_players
    ]
