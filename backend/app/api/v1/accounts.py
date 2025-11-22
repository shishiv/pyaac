"""Account management endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import get_current_active_account, get_password_hash, verify_password
from app.database import get_db
from app.models.account import Account
from app.schemas.account import AccountResponse, AccountUpdate

router = APIRouter(prefix="/accounts", tags=["accounts"])


@router.get("/me", response_model=AccountResponse)
async def get_current_account_info(
    current_account: Account = Depends(get_current_active_account),
) -> Account:
    """
    Get current account information.

    Args:
        current_account: Current authenticated account

    Returns:
        Account: Current account data
    """
    return current_account


@router.patch("/me", response_model=AccountResponse)
async def update_account(
    account_data: AccountUpdate,
    current_account: Account = Depends(get_current_active_account),
    db: AsyncSession = Depends(get_db),
) -> Account:
    """
    Update current account information.

    Args:
        account_data: Account update data
        current_account: Current authenticated account
        db: Database session

    Returns:
        Account: Updated account

    Raises:
        HTTPException: If validation fails
    """
    # Update email if provided
    if account_data.email is not None:
        current_account.email = str(account_data.email) if account_data.email else None

    # Update password if provided
    if account_data.password is not None:
        current_account.password = get_password_hash(account_data.password)

    await db.commit()
    await db.refresh(current_account)

    return current_account


@router.post("/change-password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    current_password: str,
    new_password: str,
    current_account: Account = Depends(get_current_active_account),
    db: AsyncSession = Depends(get_db),
) -> None:
    """
    Change account password.

    Args:
        current_password: Current password
        new_password: New password
        current_account: Current authenticated account
        db: Database session

    Raises:
        HTTPException: If current password is incorrect
    """
    # Verify current password
    if not verify_password(current_password, current_account.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    # Validate new password
    if len(new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters",
        )

    # Update password
    current_account.password = get_password_hash(new_password)
    await db.commit()
