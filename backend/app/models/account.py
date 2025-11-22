"""Account model."""

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.character import Character


class Account(Base):
    """
    Account model compatible with OTS database schemas.

    This model supports dynamic schema detection for different
    OTS distributions (TFS, Canary, OTServBR, etc.).
    """

    __tablename__ = "accounts"

    # Primary fields (required)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(32), unique=True, nullable=False, index=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)

    # Optional fields (may vary by OTS distribution)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    premdays: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    lastday: Mapped[int | None] = mapped_column(BigInteger, nullable=True, default=0)
    type: Mapped[int | None] = mapped_column(Integer, nullable=True, default=1)
    premium_ends_at: Mapped[int | None] = mapped_column(BigInteger, nullable=True, default=0)
    create_ip: Mapped[int | None] = mapped_column(BigInteger, nullable=True, default=0)
    creation: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)

    # TFS-specific fields
    secret: Mapped[str | None] = mapped_column(String(16), nullable=True)
    coins: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)

    # MyAAC compatibility fields
    page_access: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    email_new: Mapped[str | None] = mapped_column(String(255), nullable=True)
    email_new_time: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    email_code: Mapped[str | None] = mapped_column(String(255), nullable=True)
    email_verified: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    key: Mapped[str | None] = mapped_column(String(20), nullable=True)
    blocked: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    warnings: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    group_id: Mapped[int | None] = mapped_column(Integer, nullable=True, default=1)
    page_lastday: Mapped[int | None] = mapped_column(BigInteger, nullable=True)
    recruiter: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    rlname: Mapped[str | None] = mapped_column(Text, nullable=True)
    location: Mapped[str | None] = mapped_column(Text, nullable=True)
    flag: Mapped[str | None] = mapped_column(String(80), nullable=True)

    # Relationships
    characters: Mapped[list["Character"]] = relationship(
        "Character",
        back_populates="account",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        """String representation."""
        return f"<Account(id={self.id}, name='{self.name}')>"

    @property
    def is_premium(self) -> bool:
        """Check if account has premium status."""
        if self.premium_ends_at:
            return self.premium_ends_at > int(datetime.now().timestamp())
        if self.premdays:
            return self.premdays > 0
        return False

    @property
    def is_blocked(self) -> bool:
        """Check if account is blocked."""
        return bool(self.blocked)

    @property
    def character_count(self) -> int:
        """Get number of characters on this account."""
        return len(self.characters) if self.characters else 0
