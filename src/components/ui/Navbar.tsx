"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, User, SignOut, CaretDown } from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import { useCurrency, Currency } from "@/contexts/CurrencyContext";
import { isAdminUser } from "@/lib/firebase";

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const { user, signOut } = useAuth();
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const adminStatus = await isAdminUser(user);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [user]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,border-color] duration-300 ${
        scrolled
          ? "border-b border-accent/20 bg-black/70 backdrop-blur-2xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-8 md:py-5">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.32em] text-foreground"
        >
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full bg-gradient-to-r from-accent to-accent-secondary shadow-[0_0_15px_rgba(255,107,157,0.8)]"
          />
          Chill / Zone
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <button
            onClick={() => window.location.href = '/'}
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-400 transition-colors hover:text-accent"
          >
            Home
          </button>
          <a
            href="#systems"
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-400 transition-colors hover:text-accent"
          >
            About
          </a>
          <Link
            href="/games"
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-400 transition-colors hover:text-accent"
          >
            Games
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-400 transition-colors hover:text-accent"
            >
              Admin
            </Link>
          )}
          <a
            href="#footer"
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-400 transition-colors hover:text-accent"
          >
            Support
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-gradient-to-r from-accent/10 to-accent-secondary/10 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-foreground backdrop-blur-md transition-all duration-200 hover:from-accent/20 hover:to-accent-secondary/20 hover:border-accent/50"
            >
              {currency}
              <CaretDown size={12} />
            </button>
            {showCurrencyDropdown && (
              <div className="absolute right-0 mt-2 w-40 rounded-lg border border-accent/20 bg-zinc-900/95 backdrop-blur-xl shadow-xl max-h-80 overflow-y-auto">
                {(["USD", "EUR", "GBP", "MAD", "CNY", "JPY", "CAD", "AUD", "SAR", "AED"] as Currency[]).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr);
                      setShowCurrencyDropdown(false);
                    }}
                    className={`w-full px-4 py-2 text-left font-mono text-[11px] uppercase tracking-[0.22em] transition-colors ${
                      currency === curr
                        ? "text-accent bg-gradient-to-r from-accent/20 to-accent-secondary/20"
                        : "text-zinc-400 hover:text-foreground hover:bg-white/[0.05]"
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <button
              onClick={() => signOut()}
              className="group inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-gradient-to-r from-accent/10 to-accent-secondary/10 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-foreground backdrop-blur-md transition-all duration-200 hover:from-accent/20 hover:to-accent-secondary/20 hover:border-accent/50 active:translate-y-[1px]"
            >
              <SignOut size={14} weight="regular" />
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth"
              className="group inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-gradient-to-r from-accent/10 to-accent-secondary/10 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-foreground backdrop-blur-md transition-all duration-200 hover:from-accent/20 hover:to-accent-secondary/20 hover:border-accent/50 active:translate-y-[1px]"
            >
              <User size={14} weight="regular" />
              Sign In
            </Link>
          )}
          
          <Link
            href="/games"
            className="group inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-gradient-to-r from-accent to-accent-secondary px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-black backdrop-blur-md transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,107,157,0.4)] active:translate-y-[1px]"
          >
            Shop Now
            <ArrowUpRight
              size={14}
              weight="bold"
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
