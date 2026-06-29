"use client";

import { useEffect, useRef, useState } from "react";
import { EyebrowBadge } from "@/components/ui/EyebrowBadge";
import { HudFrame } from "@/components/ui/HudFrame";
import { DIALOGUES, HERO_TEXT_FADE_END } from "@/lib/hero";

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const heroTextRef = useRef<HTMLDivElement | null>(null);
  const bigLeftTextRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const powerReadoutRef = useRef<HTMLSpanElement | null>(null);

  const playerRef = useRef<any>(null);
  const tickingRef = useRef(false);
  const loadedRef = useRef(false);
  const prevVisibleIdsRef = useRef("");

  const [loaded, setLoaded] = useState(false);
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    (window as any).onYouTubeIframeAPIReady = () => {
      if (videoContainerRef.current) {
        playerRef.current = new (window as any).YT.Player(videoContainerRef.current, {
          videoId: "WYhz6WJ02So",
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            loop: 1,
            playlist: "WYhz6WJ02So",
            mute: 1,
            iv_load_policy: 3,
          },
          events: {
            onReady: (event: any) => {
              event.target.mute();
              event.target.setVolume(0);
              event.target.playVideo();
              loadedRef.current = true;
              setLoaded(true);
            },
          },
        });
      }
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        tickingRef.current = false;
        const section = sectionRef.current;
        if (!section || !loadedRef.current) return;

        const rect = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        const progress =
          scrollable <= 0
            ? 0
            : Math.min(1, Math.max(0, -rect.top / scrollable));

        if (heroTextRef.current) {
          const opacity = Math.max(0, 1 - progress / HERO_TEXT_FADE_END);
          heroTextRef.current.style.opacity = String(opacity);
          heroTextRef.current.style.transform = `translateY(${(1 - opacity) * 12}px)`;
        }

        if (bigLeftTextRef.current) {
          const op = Math.min(1, Math.max(0, (progress - 0.1) / 0.08));
          bigLeftTextRef.current.style.opacity = String(op);
          bigLeftTextRef.current.style.transform = `translateY(${(1 - op) * 14}px)`;
        }

        if (progressFillRef.current) {
          progressFillRef.current.style.transform = `scaleX(${progress})`;
        }

        if (powerReadoutRef.current) {
          const pwr = 87.3 + Math.sin(progress * Math.PI * 2) * 6.7;
          powerReadoutRef.current.textContent = pwr.toFixed(1) + "%";
        }

        const newVisible = new Set<string>();
        for (const d of DIALOGUES) {
          if (progress >= d.show && progress <= d.hide) newVisible.add(d.id);
        }
        const newIds = [...newVisible].sort().join(",");
        if (newIds !== prevVisibleIdsRef.current) {
          prevVisibleIdsRef.current = newIds;
          setVisibleCards(newVisible);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="scroll-animation relative">
      <div
        className="sticky top-0 min-h-[100dvh] w-full overflow-hidden bg-background"
        style={{ height: "100dvh", willChange: "transform", transform: "translateZ(0)" }}
      >
        <div
          ref={videoContainerRef}
          className="absolute inset-0 h-full w-full pointer-events-none"
          style={{ willChange: "contents", transform: "translateZ(0)" }}
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 50% 10%, transparent 30%, rgba(10,10,11,0.6) 70%, rgba(10,10,11,0.9) 100%)",
          }}
        />
        
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(30,58,138,0.3) 0%, rgba(255,107,157,0.2) 50%, rgba(255,140,66,0.3) 100%)",
          }}
        />

        <div className="pointer-events-none absolute left-6 top-24 text-accent md:left-10 md:top-28">
          <HudFrame corner="tl" size={26} />
        </div>
        <div className="pointer-events-none absolute right-6 top-24 text-accent md:right-10 md:top-28">
          <HudFrame corner="tr" size={26} />
        </div>
        <div className="pointer-events-none absolute bottom-14 left-6 text-accent md:bottom-16 md:left-10">
          <HudFrame corner="bl" size={26} />
        </div>
        <div className="pointer-events-none absolute bottom-14 right-6 text-accent md:bottom-16 md:right-10">
          <HudFrame corner="br" size={26} />
        </div>

        <div
          ref={heroTextRef}
          className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-start gap-5 px-6 pb-24 md:px-12 md:pb-28"
          style={{ transition: "opacity 80ms linear" }}
        >
          <EyebrowBadge>CHILLZONE // GAMING STORE // ONLINE</EyebrowBadge>
          <h1 className="max-w-[14ch] font-sans text-5xl font-semibold leading-[0.95] tracking-tighter text-foreground md:text-7xl lg:text-8xl">
            Welcome to
            <br />
            <span className="text-accent">Chillzone.</span>
          </h1>
          <p className="max-w-[42ch] font-sans text-sm leading-relaxed text-zinc-400 md:text-base">
            Premium gaming experience curated for you. Browse our collection of
            the best games across all genres. Scroll to explore.
          </p>
        </div>

        <div
          ref={bigLeftTextRef}
          className="pointer-events-none absolute bottom-24 left-6 z-10 hidden max-w-[58%] flex-col gap-5 md:flex md:bottom-28 md:left-12"
          style={{ opacity: 0, transition: "opacity 80ms linear" }}
        >
          <span className="inline-flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(255,107,157,0.85)]" />
            Protocol &mdash; Chillzone
          </span>
          <h2 className="font-sans font-semibold leading-[0.88] tracking-tighter text-foreground text-[clamp(4rem,9.5vw,9rem)]">
            Game
            <br />
            with <span className="text-accent">Chillzone</span>
          </h2>
          <p className="max-w-[36ch] font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400">
            Premium games &amp; experiences, curated for gamers.
          </p>
        </div>

        <div className="pointer-events-none absolute left-6 top-20 z-10 flex items-center gap-2 md:left-10 md:top-24">
          <div className="h-px w-8 bg-accent/60" />
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-400">
            Store Link &mdash; Live
          </span>
        </div>

        <div className="pointer-events-none absolute right-6 top-20 z-10 flex items-center gap-3 md:right-10 md:top-24">
          <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-400">
            Games Available
          </span>
          <span
            ref={powerReadoutRef}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent"
          >
            8
          </span>
          <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(255,107,157,0.85)]" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
          <div className="mx-6 mb-3 h-px bg-white/10 md:mx-10">
            <div
              ref={progressFillRef}
              className="h-full origin-left bg-accent"
              style={{ transform: "scaleX(0)", transition: "transform 80ms linear" }}
            />
          </div>
          <div className="mx-6 flex items-center justify-between pb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 md:mx-10">
            <span>SEQ 001 / VIDEO</span>
            <span>CHILLZONE // STORE</span>
            <span>Scroll &darr;</span>
          </div>
        </div>

        {DIALOGUES.map((d) => {
          const visible = visibleCards.has(d.id);
          const position =
            d.id === "d1"
              ? "top-[22%] right-6 md:right-12"
              : d.id === "d2"
              ? "top-1/2 -translate-y-1/2 right-6 md:right-12"
              : "bottom-24 right-6 md:bottom-28 md:right-12";
          return (
            <div
              key={d.id}
              className={`pointer-events-none absolute ${position} z-20 hidden w-[420px] max-w-[90vw] md:block`}
            >
              <figure
                className={`card-surface pointer-events-auto p-6 transition-all duration-400 ease-out ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                }`}
              >
                <blockquote className="font-sans text-xl font-medium leading-snug tracking-tight text-foreground">
                  &ldquo;{d.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 flex items-center justify-between">
                  <span className="font-sans text-sm text-zinc-300">{d.speaker}</span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                    {d.film}
                  </span>
                </figcaption>
              </figure>
            </div>
          );
        })}

        <div className="pointer-events-none absolute inset-x-0 top-[38%] z-20 flex flex-col gap-3 px-6 md:hidden">
          {DIALOGUES.map((d) => {
            const visible = visibleCards.has(d.id);
            return (
              <figure
                key={d.id}
                className={`card-surface pointer-events-auto p-5 transition-all duration-400 ease-out ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
              >
                <blockquote className="font-sans text-base font-medium leading-snug text-foreground">
                  &ldquo;{d.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-3 flex items-center justify-between">
                  <span className="font-sans text-xs text-zinc-300">
                    {d.speaker}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
                    {d.film}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>

        {!loaded && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-background px-6">
            <EyebrowBadge>CHILLZONE // LOADING</EyebrowBadge>
            <div className="h-px w-60 bg-white/10 md:w-80">
              <div className="h-full bg-accent animate-pulse" />
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              Loading Video
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
