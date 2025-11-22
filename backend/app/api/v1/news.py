"""News management endpoints."""

from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_active_account
from app.database import get_db
from app.models.account import Account
from app.models.news import News
from app.schemas.news import NewsCreate, NewsResponse, NewsUpdate

router = APIRouter(prefix="/news", tags=["news"])


@router.post("/", response_model=NewsResponse, status_code=status.HTTP_201_CREATED)
async def create_news(
    news_data: NewsCreate,
    current_account: Account = Depends(get_current_active_account),
    db: AsyncSession = Depends(get_db),
) -> News:
    """
    Create a new news article (admin only).

    Args:
        news_data: News creation data
        current_account: Current authenticated account
        db: Database session

    Returns:
        News: Created news article

    Raises:
        HTTPException: If user is not admin
    """
    # Check if user is admin (type >= 4 is gamemaster or higher)
    if not current_account.type or current_account.type < 4:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can create news articles",
        )

    # Create news article
    new_news = News(
        title=news_data.title,
        body=news_data.body,
        author_id=current_account.id,
        date=int(datetime.now().timestamp()),
        category=news_data.category or "general",
        icon=news_data.icon,
    )

    db.add(new_news)
    await db.commit()
    await db.refresh(new_news)

    return new_news


@router.get("/", response_model=List[NewsResponse])
async def list_news(
    limit: int = 10,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
) -> List[News]:
    """
    List news articles (public endpoint).

    Args:
        limit: Maximum number of news to return
        offset: Offset for pagination
        db: Database session

    Returns:
        List[News]: List of news articles
    """
    stmt = (
        select(News)
        .where(News.hidden == 0)
        .order_by(News.date.desc())
        .limit(limit)
        .offset(offset)
    )

    result = await db.execute(stmt)
    news_list = result.scalars().all()

    return list(news_list)


@router.get("/{news_id}", response_model=NewsResponse)
async def get_news(
    news_id: int,
    db: AsyncSession = Depends(get_db),
) -> News:
    """
    Get a single news article (public endpoint).

    Args:
        news_id: News ID
        db: Database session

    Returns:
        News: News article

    Raises:
        HTTPException: If news not found
    """
    stmt = select(News).where(News.id == news_id, News.hidden == 0)
    result = await db.execute(stmt)
    news = result.scalar_one_or_none()

    if not news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News article not found",
        )

    return news


@router.patch("/{news_id}", response_model=NewsResponse)
async def update_news(
    news_id: int,
    news_data: NewsUpdate,
    current_account: Account = Depends(get_current_active_account),
    db: AsyncSession = Depends(get_db),
) -> News:
    """
    Update a news article (admin only).

    Args:
        news_id: News ID
        news_data: News update data
        current_account: Current authenticated account
        db: Database session

    Returns:
        News: Updated news article

    Raises:
        HTTPException: If news not found or user is not admin
    """
    # Check if user is admin
    if not current_account.type or current_account.type < 4:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can update news articles",
        )

    stmt = select(News).where(News.id == news_id)
    result = await db.execute(stmt)
    news = result.scalar_one_or_none()

    if not news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News article not found",
        )

    # Update fields
    if news_data.title is not None:
        news.title = news_data.title
    if news_data.body is not None:
        news.body = news_data.body
    if news_data.category is not None:
        news.category = news_data.category
    if news_data.icon is not None:
        news.icon = news_data.icon
    if news_data.hidden is not None:
        news.hidden = news_data.hidden

    await db.commit()
    await db.refresh(news)

    return news


@router.delete("/{news_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_news(
    news_id: int,
    current_account: Account = Depends(get_current_active_account),
    db: AsyncSession = Depends(get_db),
) -> None:
    """
    Delete a news article (admin only).

    Args:
        news_id: News ID
        current_account: Current authenticated account
        db: Database session

    Raises:
        HTTPException: If news not found or user is not admin
    """
    # Check if user is admin
    if not current_account.type or current_account.type < 4:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can delete news articles",
        )

    stmt = select(News).where(News.id == news_id)
    result = await db.execute(stmt)
    news = result.scalar_one_or_none()

    if not news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News article not found",
        )

    await db.delete(news)
    await db.commit()
