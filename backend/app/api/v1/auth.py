"""Authentication endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    verify_password,
)
from app.database import get_db
from app.models.account import Account
from app.schemas.account import AccountCreate, AccountResponse, LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=AccountResponse, status_code=status.HTTP_201_CREATED)
async def register(
    account_data: AccountCreate,
    db: AsyncSession = Depends(get_db),
) -> Account:
    """
    Register a new account.

    Args:
        account_data: Account creation data
        db: Database session

    Returns:
        Account: Created account

    Raises:
        HTTPException: If account name already exists
    """
    # Check if account already exists
    stmt = select(Account).where(Account.name == account_data.name.lower())
    result = await db.execute(stmt)
    existing_account = result.scalar_one_or_none()

    if existing_account:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account name already exists",
        )

    # Create new account
    hashed_password = get_password_hash(account_data.password)
    new_account = Account(
        name=account_data.name.lower(),
        password=hashed_password,
        email=str(account_data.email) if account_data.email else None,
    )

    db.add(new_account)
    await db.commit()
    await db.refresh(new_account)

    return new_account


@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: LoginRequest,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    """
    Login and get access token.

    Args:
        credentials: Login credentials
        db: Database session

    Returns:
        TokenResponse: Access and refresh tokens

    Raises:
        HTTPException: If credentials are invalid
    """
    # Find account
    stmt = select(Account).where(Account.name == credentials.name.lower())
    result = await db.execute(stmt)
    account = result.scalar_one_or_none()

    # Verify credentials
    if not account or not verify_password(credentials.password, account.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect account name or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if account is blocked
    if account.is_blocked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is blocked",
        )

    # Create tokens
    access_token = create_access_token(data={"sub": str(account.id)})
    refresh_token = create_refresh_token(data={"sub": str(account.id)})

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
    )
