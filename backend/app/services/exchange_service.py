"""Exchange rate service for currency conversion."""

from datetime import datetime, timedelta

import requests

from app.config import settings


# Fallback rates (used if API is unavailable)
FALLBACK_RATES = {
    "USD": 1.0,
    "EUR": 0.92,
    "TRY": 32.50,
    "GBP": 0.79,
    "JPY": 150.0,
    "KRW": 1320.0,
    "CAD": 1.36,
    "AUD": 1.52,
    "CHF": 0.88,
    "INR": 83.20,
    "BRL": 4.97,
    "MXN": 17.05,
    "SEK": 10.80,
    "NOK": 10.65,
    "PLN": 3.98,
    "AED": 3.67,
    "SAR": 3.75,
    "RUB": 95.0,
}


class ExchangeRateService:
    """Manages currency exchange rates."""

    # Cache rates per base currency.
    _cached_rates: dict[str, dict[str, float]] = {}
    _cache_time: dict[str, datetime] = {}
    _cache_duration = timedelta(hours=1)  # Cache for 1 hour

    @classmethod
    def get_rates(cls, base_currency: str = "USD") -> dict:
        """
        Get exchange rates relative to base currency.
        Returns a dict like: {"USD": 1.0, "EUR": 0.92, "TRY": 32.50, ...}
        """
        base_currency = base_currency.upper()

        cached_rates = cls._cached_rates.get(base_currency)
        cached_at = cls._cache_time.get(base_currency)
        if cached_rates and cached_at:
            if datetime.now() - cached_at < cls._cache_duration:
                return cached_rates

        # Try to fetch from API
        api_key = settings.EXCHANGE_API_KEY

        if api_key:
            rates = cls._fetch_from_api(base_currency, api_key)
            if rates:
                cls._cached_rates[base_currency] = rates
                cls._cache_time[base_currency] = datetime.now()
                return rates

        if base_currency == "USD":
            return FALLBACK_RATES

        usd_rates = FALLBACK_RATES
        base_rate = usd_rates.get(base_currency)
        if not base_rate:
            return {"USD": 1.0, base_currency: 1.0}

        derived_rates: dict[str, float] = {base_currency: 1.0}
        for currency_code, rate in usd_rates.items():
            derived_rates[currency_code] = rate / base_rate
        return derived_rates

    @classmethod
    def _fetch_from_api(cls, base_currency: str, api_key: str) -> dict | None:
        """
        Fetch rates from exchangerate-api.com.
        API Endpoint: https://v6.exchangerate-api.com/v6/{API_KEY}/latest/{BASE_CURRENCY}
        """
        try:
            url = f"https://v6.exchangerate-api.com/v6/{api_key}/latest/{base_currency}"
            response = requests.get(url, timeout=5)
            response.raise_for_status()

            data = response.json()

            # Check for API error
            if data.get("result") == "error":
                return None

            # Extract rates from response
            if "conversion_rates" in data:
                return data["conversion_rates"]

            return None

        except requests.exceptions.RequestException:
            return None
        except Exception:
            return None

    @classmethod
    def convert(cls, amount: float, from_currency: str, to_currency: str) -> float:
        """Convert amount from one currency to another."""
        from_currency = from_currency.upper()
        to_currency = to_currency.upper()

        if from_currency == to_currency:
            return amount

        usd_rates = cls.get_rates("USD")
        from_rate = usd_rates.get(from_currency)
        to_rate = usd_rates.get(to_currency)

        if not from_rate or not to_rate:
            return amount

        usd_amount = amount if from_currency == "USD" else amount / from_rate
        return usd_amount if to_currency == "USD" else usd_amount * to_rate

    @classmethod
    def normalize_to_base(
        cls, amount: float, currency_code: str | None, base_currency: str = "USD"
    ) -> float:
        """Normalize an amount into the requested base currency."""
        if amount is None:
            return 0.0

        source_currency = (currency_code or base_currency).upper()
        target_currency = base_currency.upper()

        if source_currency == target_currency:
            return float(amount)

        converted = cls.convert(float(amount), source_currency, target_currency)
        return float(converted)


# Singleton instance
exchange_service = ExchangeRateService()
