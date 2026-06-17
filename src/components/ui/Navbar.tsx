"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, User, SignOut } from "@phosphor-icons/react";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminUser } from "@/lib/firebase";

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, signOut } = useAuth();

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
          ? "border-b border-white/10 bg-black/60 backdrop-blur-2xl backdrop-saturate-150"
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
            className="inline-block h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_rgba(212,162,47,0.9)]"
          />
          Chill / Zone
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <button
            onClick={() => window.location.href = '/'}
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-400 transition-colors hover:text-foreground"
          >
            Home
          </button>
          <a
            href="#systems"
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-400 transition-colors hover:text-foreground"
          >
            About
          </a>
          <Link
            href="/games"
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-400 transition-colors hover:text-foreground"
          >
            Games
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-400 transition-colors hover:text-foreground"
            >
              Admin
            </Link>
          )}
          <a
            href="#footer"
            className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-400 transition-colors hover:text-foreground"
          >
            Support
          </a>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <button
              onClick={() => signOut()}
              className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-foreground backdrop-blur-md transition-all duration-200 hover:bg-white/[0.1] active:translate-y-[1px]"
            >
              <SignOut size={14} weight="regular" />
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth"
              className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-foreground backdrop-blur-md transition-all duration-200 hover:bg-white/[0.1] active:translate-y-[1px]"
            >
              <User size={14} weight="regular" />
              Sign In
            </Link>
          )}
          
          <Link
            href="/games"
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-foreground backdrop-blur-md transition-all duration-200 hover:bg-white/[0.1] active:translate-y-[1px]"
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
