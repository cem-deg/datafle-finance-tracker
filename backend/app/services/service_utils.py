"""Shared validation and normalization helpers for service and schema layers."""

from __future__ import annotations

from datetime import date

from fastapi import HTTPException, status


SUPPORTED_CURRENCY_CODES = {
    "USD",
    "EUR",
    "TRY",
    "GBP",
    "JPY",
    "KRW",
    "CAD",
    "AUD",
    "CHF",
    "INR",
    "BRL",
    "MXN",
    "SEK",
    "NOK",
    "PLN",
    "AED",
    "SAR",
    "RUB",
}


def normalize_email(email: str) -> str:
    """Trim and lowercase an email address."""
    return email.strip().lower()


def normalize_currency_code(currency_code: str) -> str:
    """Trim and uppercase a currency code."""
    return currency_code.strip().upper()


def normalize_optional_text(value: str | None) -> str | None:
    """Trim text and collapse blank strings to ``None``."""
    if value is None:
        return None
    normalized = value.strip()
    return normalized or None


def validate_date_range(
    start_date: date | None,
    end_date: date | None,
    *,
    start_label: str = "start_date",
    end_label: str = "end_date",
) -> None:
    """Raise a 400 error when a date range is invalid."""
    if start_date and end_date and start_date > end_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{start_label} cannot be after {end_label}",
        )


def validate_amount_range(
    min_amount: float | None,
    max_amount: float | None,
) -> None:
    """Raise a 400 error when an amount range is invalid."""
    if (
        min_amount is not None
        and max_amount is not None
        and min_amount > max_amount
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="min_amount cannot be greater than max_amount",
        )
