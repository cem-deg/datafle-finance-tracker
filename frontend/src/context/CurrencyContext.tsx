"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export interface CurrencyInfo {
  code: string;
  symbol: string;
  locale: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: "USD", symbol: "$", locale: "en-US", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", locale: "de-DE", flag: "🇪🇺" },
  { code: "TRY", symbol: "₺", locale: "tr-TR", flag: "🇹🇷" },
  { code: "GBP", symbol: "£", locale: "en-GB", flag: "🇬🇧" },
  { code: "JPY", symbol: "¥", locale: "ja-JP", flag: "🇯🇵" },
  { code: "KRW", symbol: "₩", locale: "ko-KR", flag: "🇰🇷" },
  { code: "CAD", symbol: "C$", locale: "en-CA", flag: "🇨🇦" },
  { code: "AUD", symbol: "A$", locale: "en-AU", flag: "🇦🇺" },
  { code: "CHF", symbol: "CHF", locale: "de-CH", flag: "🇨🇭" },
  { code: "INR", symbol: "₹", locale: "en-IN", flag: "🇮🇳" },
  { code: "BRL", symbol: "R$", locale: "pt-BR", flag: "🇧🇷" },
  { code: "MXN", symbol: "MX$", locale: "es-MX", flag: "🇲🇽" },
  { code: "SEK", symbol: "kr", locale: "sv-SE", flag: "🇸🇪" },
  { code: "NOK", symbol: "kr", locale: "nb-NO", flag: "🇳🇴" },
  { code: "PLN", symbol: "zł", locale: "pl-PL", flag: "🇵🇱" },
  { code: "AED", symbol: "د.إ", locale: "ar-AE", flag: "🇦🇪" },
  { code: "SAR", symbol: "﷼", locale: "ar-SA", flag: "🇸🇦" },
  { code: "RUB", symbol: "₽", locale: "ru-RU", flag: "🇷🇺" },
];

interface CurrencyContextType {
  currency: CurrencyInfo;
  setCurrency: (code: string) => void;
  formatAmount: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyInfo>(SUPPORTED_CURRENCIES[0]);

  // Load from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem("datafle_currency");
    if (stored) {
      const found = SUPPORTED_CURRENCIES.find((c) => c.code === stored);
      if (found) setCurrencyState(found);
    }
  }, []);

  const setCurrency = useCallback((code: string) => {
    const found = SUPPORTED_CURRENCIES.find((c) => c.code === code);
    if (found) {
      setCurrencyState(found);
      localStorage.setItem("datafle_currency", code);
    }
  }, []);

  const formatAmount = useCallback(
    (amount: number) => {
      return new Intl.NumberFormat(currency.locale, {
        style: "currency",
        currency: currency.code,
        minimumFractionDigits: currency.code === "JPY" || currency.code === "KRW" ? 0 : 2,
      }).format(amount);
    },
    [currency]
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
