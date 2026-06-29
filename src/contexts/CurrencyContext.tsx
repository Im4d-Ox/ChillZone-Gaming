"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Currency = "USD" | "EUR" | "GBP" | "MAD" | "CNY" | "JPY" | "CAD" | "AUD" | "SAR" | "AED";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceUSD: number) => number;
  formatPrice: (priceUSD: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CONVERSION_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,  // 1 USD = 0.92 EUR
  GBP: 0.79,  // 1 USD = 0.79 GBP
  MAD: 10.0,  // 1 USD = 10 MAD
  CNY: 7.2,   // 1 USD = 7.2 CNY
  JPY: 149.5, // 1 USD = 149.5 JPY
  CAD: 1.36,  // 1 USD = 1.36 CAD
  AUD: 1.53,  // 1 USD = 1.53 AUD
  SAR: 3.75,  // 1 USD = 3.75 SAR
  AED: 3.67,  // 1 USD = 3.67 AED
};

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  MAD: "DH",
  CNY: "¥",
  JPY: "¥",
  CAD: "C$",
  AUD: "A$",
  SAR: "﷼",
  AED: "د.إ",
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");

  useEffect(() => {
    // Load currency preference from localStorage
    const saved = localStorage.getItem("preferredCurrency") as Currency;
    if (saved && CONVERSION_RATES[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("preferredCurrency", newCurrency);
  };

  const convertPrice = (priceUSD: number): number => {
    return priceUSD * CONVERSION_RATES[currency];
  };

  const formatPrice = (priceUSD: number): string => {
    const converted = convertPrice(priceUSD);
    return `${CURRENCY_SYMBOLS[currency]}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
