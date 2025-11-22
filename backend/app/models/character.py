"""Character (Player) model."""

from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.account import Account
    from app.models.guild import GuildMembership


class Character(Base):
    """
    Character (Player) model compatible with OTS database schemas.

    Note: Some OTS distributions use 'players' table name,
    others use 'characters'. This model assumes 'players'.
    """

    __tablename__ = "players"

    # Primary fields
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    account_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("accounts.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Character attributes
    level: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    vocation: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    health: Mapped[int] = mapped_column(Integer, nullable=False, default=150)
    healthmax: Mapped[int] = mapped_column(Integer, nullable=False, default=150)
    experience: Mapped[int] = mapped_column(BigInteger, nullable=False, default=0)
    lookbody: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    lookfeet: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    lookhead: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    looklegs: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    looktype: Mapped[int] = mapped_column(Integer, nullable=False, default=136)
    lookaddons: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    maglevel: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    mana: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    manamax: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    manaspent: Mapped[int] = mapped_column(BigInteger, nullable=False, default=0)
    soul: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    town_id: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    posx: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    posy: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    posz: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    cap: Mapped[int] = mapped_column(Integer, nullable=False, default=400)
    sex: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    # Skills
    skill_fist: Mapped[int] = mapped_column(Integer, nullable=False, default=10)
    skill_club: Mapped[int] = mapped_column(Integer, nullable=False, default=10)
    skill_sword: Mapped[int] = mapped_column(Integer, nullable=False, default=10)
    skill_axe: Mapped[int] = mapped_column(Integer, nullable=False, default=10)
    skill_dist: Mapped[int] = mapped_column(Integer, nullable=False, default=10)
    skill_shielding: Mapped[int] = mapped_column(Integer, nullable=False, default=10)
    skill_fishing: Mapped[int] = mapped_column(Integer, nullable=False, default=10)

    # Optional fields
    group_id: Mapped[int | None] = mapped_column(Integer, nullable=True, default=1)
    stamina: Mapped[int | None] = mapped_column(Integer, nullable=True, default=2520)
    direction: Mapped[int | None] = mapped_column(Integer, nullable=True, default=2)
    loss_experience: Mapped[int | None] = mapped_column(Integer, nullable=True, default=10)
    loss_mana: Mapped[int | None] = mapped_column(Integer, nullable=True, default=10)
    loss_skills: Mapped[int | None] = mapped_column(Integer, nullable=True, default=10)
    loss_items: Mapped[int | None] = mapped_column(Integer, nullable=True, default=10)
    premend: Mapped[int | None] = mapped_column(BigInteger, nullable=True, default=0)
    online: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    marriage: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    promotion: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    deleted: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    created: Mapped[int | None] = mapped_column(BigInteger, nullable=True, default=0)
    hidden: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Canary/OTServBR specific
    prey_wildcard: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    task_points: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    quickloot_fallback: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    lookmountbody: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    lookmountfeet: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    lookmounthead: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    lookmountlegs: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    lookfamiliarstype: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    isreward: Mapped[int | None] = mapped_column(Integer, nullable=True, default=1)
    ismain: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)

    # Relationships
    account: Mapped["Account"] = relationship("Account", back_populates="characters")
    guild_membership: Mapped["GuildMembership | None"] = relationship(
        "GuildMembership",
        back_populates="character",
        uselist=False,
        lazy="selectin",
    )

    def __repr__(self) -> str:
        """String representation."""
        return f"<Character(id={self.id}, name='{self.name}', level={self.level})>"

    @property
    def is_online(self) -> bool:
        """Check if character is online."""
        return bool(self.online)

    @property
    def is_deleted(self) -> bool:
        """Check if character is marked for deletion."""
        return bool(self.deleted)

    @property
    def vocation_name(self) -> str:
        """Get vocation name."""
        vocations = {
            0: "None",
            1: "Sorcerer",
            2: "Druid",
            3: "Paladin",
            4: "Knight",
            5: "Master Sorcerer",
            6: "Elder Druid",
            7: "Royal Paladin",
            8: "Elite Knight",
        }
        return vocations.get(self.vocation, "Unknown")
