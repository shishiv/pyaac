"""News model."""

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import BigInteger, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.account import Account


class News(Base):
    """
    News model for server announcements and updates.

    Compatible with MyAAC news system.
    """

    __tablename__ = "news"

    # Primary fields
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)

    # Metadata
    author_id: Mapped[int] = mapped_column(Integer, nullable=False)
    date: Mapped[int] = mapped_column(BigInteger, nullable=False)

    # Optional fields
    category: Mapped[str | None] = mapped_column(String(50), nullable=True, default="general")
    icon: Mapped[str | None] = mapped_column(String(50), nullable=True)

    # MyAAC compatibility
    type: Mapped[int | None] = mapped_column(Integer, nullable=True, default=1)
    comments: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)
    article_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    article_image: Mapped[str | None] = mapped_column(String(255), nullable=True)
    hidden: Mapped[int | None] = mapped_column(Integer, nullable=True, default=0)

    def __repr__(self) -> str:
        """String representation."""
        return f"<News {self.id}: {self.title}>"
