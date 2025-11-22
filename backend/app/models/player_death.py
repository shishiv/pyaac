"""Player deaths model."""

from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.character import Character


class PlayerDeath(Base):
    """
    Player deaths model compatible with OTS database schemas.

    Tracks character deaths and killers.
    """

    __tablename__ = "player_deaths"

    # Primary fields
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    player_id: Mapped[int] = mapped_column(Integer, nullable=False, index=True)
    time: Mapped[int] = mapped_column(BigInteger, nullable=False, index=True)
    level: Mapped[int] = mapped_column(Integer, nullable=False)

    # Killer information
    killed_by: Mapped[str] = mapped_column(String(255), nullable=False)
    is_player: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    # Optional fields for different OTS distributions
    mostdamage_by: Mapped[str | None] = mapped_column(String(255), nullable=True)
    mostdamage_is_player: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    unjustified: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    mostdamage_unjustified: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)

    def __repr__(self) -> str:
        """String representation."""
        return f"<PlayerDeath {self.id}: Player {self.player_id} killed by {self.killed_by}>"
