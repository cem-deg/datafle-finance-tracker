"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { ExchangeRatesResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface CurrencyInfo {
  code: string;
  symbol: string;
  locale: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: "USD", symbol: "$", locale: "en-US", flag: "US" },
  { code: "EUR", symbol: "EUR", locale: "de-DE", flag: "EU" },
  { code: "TRY", symbol: "TRY", locale: "tr-TR", flag: "TR" },
  { code: "GBP", symbol: "GBP", locale: "en-GB", flag: "GB" },
  { code: "JPY", symbol: "JPY", locale: "ja-JP", flag: "JP" },
  { code: "KRW", symbol: "KRW", locale: "ko-KR", flag: "KR" },
  { code: "CAD", symbol: "C$", locale: "en-CA", flag: "CA" },
  { code: "AUD", symbol: "A$", locale: "en-AU", flag: "AU" },
  { code: "CHF", symbol: "CHF", locale: "de-CH", flag: "CH" },
  { code: "INR", symbol: "INR", locale: "en-IN", flag: "IN" },
  { code: "BRL", symbol: "R$", locale: "pt-BR", flag: "BR" },
  { code: "MXN", symbol: "MX$", locale: "es-MX", flag: "MX" },
  { code: "SEK", symbol: "kr", locale: "sv-SE", flag: "SE" },
  { code: "NOK", symbol: "kr", locale: "nb-NO", flag: "NO" },
  { code: "PLN", symbol: "PLN", locale: "pl-PL", flag: "PL" },
  { code: "AED", symbol: "AED", locale: "ar-AE", flag: "AE" },
  { code: "SAR", symbol: "SAR", locale: "ar-SA", flag: "SA" },
  { code: "RUB", symbol: "RUB", locale: "ru-RU", flag: "RU" },
];

// Exchange rates relative to USD (1 USD = X CURRENCY)
// These are approximate rates and should be updated periodically.
export const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  TRY: 32.5,
  GBP: 0.79,
  JPY: 150.0,
  KRW: 1320.0,
  CAD: 1.36,
  AUD: 1.52,
  CHF: 0.88,
  INR: 83.2,
  BRL: 4.97,
  MXN: 17.05,
  SEK: 10.8,
  NOK: 10.65,
  PLN: 3.98,
  AED: 3.67,
  SAR: 3.75,
  RUB: 95.0,
};

interface CurrencyContextType {
  currency: CurrencyInfo;
  setCurrency: (code: string) => void;
  formatAmount: (amount: number) => string;
  convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => number;
  convertAndFormat: (amount: number, fromCurrency: string, toCurrency?: string) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyInfo>(SUPPORTED_CURRENCIES[0]);
  const [rates, setRates] = useState<Record<string, number>>(EXCHANGE_RATES);

  React.useEffect(() => {
    const stored = localStorage.getItem("datafle_currency");
    if (stored) {
      const found = SUPPORTED_CURRENCIES.find((candidate) => candidate.code === stored);
      if (found) setCurrencyState(found);
    }
  }, []);

  React.useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(`${API_URL}/api/analytics/exchange-rates`);
        if (response.ok) {
          const data = (await response.json()) as ExchangeRatesResponse;
          setRates(data.rates || EXCHANGE_RATES);
        }
      } catch {
        console.debug("Using fallback exchange rates");
        setRates(EXCHANGE_RATES);
      }
    };

    void fetchRates();
    const interval = setInterval(fetchRates, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const setCurrency = useCallback((code: string) => {
    const found = SUPPORTED_CURRENCIES.find((candidate) => candidate.code === code);
    if (found) {
      setCurrencyState(found);
      localStorage.setItem("datafle_currency", code);
    }
  }, []);

  const formatAmount = useCallback(
    (amount: number) =>
      new Intl.NumberFormat(currency.locale, {
        style: "currency",
        currency: currency.code,
        minimumFractionDigits:
          currency.code === "JPY" || currency.code === "KRW" ? 0 : 2,
      }).format(amount),
    [currency]
  );

  const convertAmount = useCallback(
    (amount: number, fromCurrency: string, toCurrency: string) => {
      const normalizedFromCurrency = fromCurrency.toUpperCase();
      const normalizedToCurrency = toCurrency.toUpperCase();
      const fromRate = rates[normalizedFromCurrency] || 1;
      const toRate = rates[normalizedToCurrency] || 1;
      const usdAmount = normalizedFromCurrency === "USD" ? amount : amount / fromRate;
      return normalizedToCurrency === "USD" ? usdAmount : usdAmount * toRate;
    },
    [rates]
  );

  const convertAndFormat = useCallback(
    (amount: number, fromCurrency: string, toCurrency?: string) => {
      const targetCurrency = (toCurrency || currency.code).toUpperCase();
      const convertedAmount = convertAmount(amount, fromCurrency, targetCurrency);
      const currencyInfo = SUPPORTED_CURRENCIES.find(
        (candidate) => candidate.code === targetCurrency
      );

      if (!currencyInfo) return `${amount}`;

      return new Intl.NumberFormat(currencyInfo.locale, {
        style: "currency",
        currency: currencyInfo.code,
        minimumFractionDigits:
          currencyInfo.code === "JPY" || currencyInfo.code === "KRW" ? 0 : 2,
      }).format(convertedAmount);
    },
    [currency, convertAmount]
  );

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, formatAmount, convertAmount, convertAndFormat }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
