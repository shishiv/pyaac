"""Guild models."""

from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.character import Character


class Guild(Base):
    """Guild model compatible with OTS database schemas."""

    __tablename__ = "guilds"

    # Primary fields
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    ownerid: Mapped[int] = mapped_column(Integer, nullable=False)
    creationdata: Mapped[int] = mapped_column(BigInteger, nullable=False)
    motd: Mapped[str] = mapped_column(String(255), nullable=False, default="")

    # Optional fields
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    guild_logo: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    create_ip: Mapped[int | None] = mapped_column(BigInteger, nullable=True, default=0)
    balance: Mapped[int | None] = mapped_column(BigInteger, nullable=True, default=0)
    points: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)

    # TFS 1.5+ deletion tracking
    deletion: Mapped[int | None] = mapped_column(BigInteger, nullable=True)

    # Relationships
    members: Mapped[list["GuildMembership"]] = relationship(
        "GuildMembership",
        back_populates="guild",
        lazy="selectin",
    )
    ranks: Mapped[list["GuildRank"]] = relationship(
        "GuildRank",
        back_populates="guild",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        """String representation."""
        return f"<Guild(id={self.id}, name='{self.name}')>"

    @property
    def member_count(self) -> int:
        """Get number of members in guild."""
        return len(self.members) if self.members else 0

    @property
    def is_scheduled_for_deletion(self) -> bool:
        """Check if guild is scheduled for deletion."""
        return self.deletion is not None and self.deletion > 0


class GuildRank(Base):
    """Guild rank model compatible with OTS database schemas."""

    __tablename__ = "guild_ranks"

    # Primary fields
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    guild_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("guilds.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    level: Mapped[int] = mapped_column(Integer, nullable=False)

    # Relationships
    guild: Mapped["Guild"] = relationship("Guild", back_populates="ranks")

    def __repr__(self) -> str:
        """String representation."""
        return f"<GuildRank(id={self.id}, name='{self.name}', level={self.level})>"


class GuildMembership(Base):
    """Guild membership model compatible with OTS database schemas."""

    __tablename__ = "guild_membership"

    # Primary fields
    player_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("players.id", ondelete="CASCADE"),
        primary_key=True,
    )
    guild_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("guilds.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    rank_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("guild_ranks.id", ondelete="CASCADE"),
        nullable=False,
    )
    nick: Mapped[str] = mapped_column(String(15), nullable=False, default="")

    # Relationships
    character: Mapped["Character"] = relationship(
        "Character",
        back_populates="guild_membership",
    )
    guild: Mapped["Guild"] = relationship("Guild", back_populates="members")
    rank: Mapped["GuildRank"] = relationship("GuildRank", lazy="selectin")

    def __repr__(self) -> str:
        """String representation."""
        return f"<GuildMembership(player_id={self.player_id}, guild_id={self.guild_id})>"
