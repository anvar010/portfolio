"use client";

import {
  type CSSProperties,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/* Inline stand-in for @gsap/react's useGSAP: one gsap.context lives for the
   component's lifetime, the callback is re-added when dependencies change. */
function useGSAP(
  callback: () => void | (() => void),
  options?: {
    dependencies?: unknown[];
    scope?: { current: Element | null } | Element | null;
  }
) {
  const deps = options?.dependencies ?? [];
  const scope = options?.scope;
  const ctxRef = useRef<gsap.Context | null>(null);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  useLayoutEffect(() => {
    const el =
      scope && typeof scope === "object" && "current" in scope
        ? scope.current
        : (scope as Element | null);
    ctxRef.current = gsap.context(() => {}, el ?? undefined);
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = undefined;
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!ctxRef.current) return;
    cleanupRef.current?.();
    const ret = ctxRef.current.add(callback);
    cleanupRef.current = typeof ret === "function" ? ret : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export type TimelineItem = {
  id: string;
  /** Large heading, e.g. a date range. */
  label: string;
  /** Short role / company line shown above the description. */
  heading?: string;
  content: string;
};

type SplitTextInstance = InstanceType<typeof SplitText>;

export type TimelineProps = {
  /** Items in chronological order (left to right). Even indexes sit on top, odd below. */
  items: TimelineItem[];
  id?: string;
  title?: string;
  periodLabel?: string;
  textColor?: string;
  mutedTextColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  fontFamily?: string;
  imageUrl?: string;
  imageAlt?: string;
  /** Reveal animation duration, in seconds. */
  duration?: number;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );
}

/* Evenly spread reveal windows (scroll %) over the items. */
function getPositions(count: number, mobile: boolean) {
  const first = mobile ? 22 : 6;
  const last = mobile ? 69 : 65;
  const span = mobile ? 10 : 20;
  return Array.from({ length: count }, (_, i) => {
    const start = count === 1 ? first : first + ((last - first) * i) / (count - 1);
    return [start, start + span] as const;
  });
}

export default function Timeline({
  items,
  id = "journey",
  title = "Product Storyline",
  periodLabel = "2020-2026",
  textColor = "var(--color-foreground, #000000)",
  mutedTextColor = "var(--color-muted-foreground, #3f3f46)",
  activeColor = "#ff5f00",
  backgroundColor = "var(--color-background, #ffffff)",
  fontFamily,
  imageUrl,
  imageAlt = "",
  duration = 1.2,
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const wholeSliderRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const normalizedDuration = Math.max(0.2, duration);

  const topItems = items.filter((_, i) => i % 2 === 0);
  const bottomItems = items.filter((_, i) => i % 2 === 1);
  const topCount = topItems.length;

  const sectionStyle: CSSProperties = {
    color: textColor,
    backgroundColor,
    fontFamily,
  };
  const activeStyle: CSSProperties = { backgroundColor: activeColor };
  const mutedTextStyle: CSSProperties = { color: mutedTextColor };

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const isMobile = window.innerWidth < 600;
      // Slide just far enough that the last top item ends up on screen.
      const slidePercent = isMobile
        ? -(57 - (4 - topCount) * 13.75)
        : -(65 - (4 - topCount) * 18.75);
      const lineWidth = isMobile ? "65%" : "98%";
      const lineStart = isMobile ? "top 30%" : "top 25%";
      const slideEnd = isMobile ? "82% 50%" : "92% bottom";
      const lineEnd = isMobile ? "80% 50%" : "92% bottom";

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: slideEnd,
          scrub: true,
        },
        defaults: { ease: "none" },
      });

      tl.fromTo(wholeSliderRef.current, { xPercent: 0 }, { xPercent: slidePercent });

      if (reducedMotion) {
        gsap.set(".journey-line", { width: lineWidth });
        return;
      }

      gsap.to(".journey-line", {
        width: lineWidth,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: lineStart,
          end: lineEnd,
          scrub: true,
        },
      });
    },
    { dependencies: [reducedMotion, topCount], scope: sectionRef },
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      if (reducedMotion) {
        items.forEach((item) => {
          gsap.set(`.jl-${item.id}`, { scaleY: 1 });
          gsap.set(`.jd-${item.id}`, { scale: 1 });
        });
        return;
      }

      items.forEach((item) => {
        gsap.set(`.jl-${item.id}`, { scaleY: 0, transformOrigin: "bottom bottom" });
        gsap.set(`.jd-${item.id}`, { scale: 0 });
      });

      const titleSplits: Partial<Record<string, SplitTextInstance>> = {};
      const descriptionSplits: Partial<Record<string, SplitTextInstance>> = {};

      items.forEach((item) => {
        titleSplits[item.id] = new SplitText(`.title-${item.id}`, {
          type: "chars, words, lines",
          mask: "lines",
        });
        descriptionSplits[item.id] = new SplitText(`.description-${item.id}`, {
          type: "chars, words, lines",
          mask: "lines",
        });
      });

      const positions = getPositions(items.length, window.innerWidth < 600);

      items.forEach((item, index) => {
        const [startPos, endPos] = positions[index];
        const titleLines = titleSplits[item.id]?.lines || [];
        const descriptionLines = descriptionSplits[item.id]?.lines || [];
        const isTop = index % 2 === 0;

        if (!isTop) gsap.set(`.jl-${item.id}`, { transformOrigin: "top top" });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: `${startPos}% 30%`,
              end: `${endPos}% 50%`,
              scrub: true,
            },
          })
          .to(`.jl-${item.id}`, { scaleY: 1, duration: normalizedDuration * 0.4 })
          .to(`.jd-${item.id}`, { scale: 1, duration: normalizedDuration * 0.4 }, "<")
          .fromTo(
            titleLines,
            { y: 100 },
            {
              y: 0,
              delay: -0.8 * normalizedDuration,
              duration: normalizedDuration,
              stagger: 0.02,
              ease: "power2.out",
            },
          )
          .fromTo(
            descriptionLines,
            { y: 100 },
            { y: 0, duration: normalizedDuration, stagger: 0.02, ease: "power2.out" },
            "<",
          );
      });

      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", handleResize);

      return () => {
        Object.values(titleSplits).forEach((split) => split?.revert?.());
        Object.values(descriptionSplits).forEach((split) => split?.revert?.());
        window.removeEventListener("resize", handleResize);
      };
    },
    { dependencies: [normalizedDuration, reducedMotion, items], scope: sectionRef },
  );

  const renderText = (item: TimelineItem) => (
    <>
      <h3
        className={`title-${item.id} text-[1.9vw] leading-none max-[600px]:text-[5.6vw]`}
      >
        {item.label}
      </h3>
      {item.heading && (
        <p
          className="text-[1.15vw] font-semibold leading-[1.15] max-[600px]:text-[4vw]"
          style={{ color: textColor }}
        >
          {item.heading}
        </p>
      )}
      <p
        className={`description-${item.id} w-[90%] text-[1.05vw] leading-[1.25] max-[600px]:w-[90%] max-[600px]:text-[3.8vw]`}
        style={mutedTextStyle}
      >
        {item.content}
      </p>
    </>
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className="h-[200vw] max-[600px]:h-[400vh] w-full relative"
      style={sectionStyle}
    >
      <div className="h-screen w-screen sticky top-[0%] pt-[10%] overflow-hidden max-[600px]:top-[5%]">
        <div
          ref={wholeSliderRef}
          className="mr-[2vw] flex h-[30vw] w-[240vw] items-center gap-[5vw] px-[5vw] max-[600px]:h-[80vh] max-[600px]:w-[800vw] max-[600px]:px-[7vw]"
        >
          {imageUrl && (
            <div className="h-full w-[30vw] overflow-hidden rounded-[1vw] max-[600px]:h-[65vw] max-[600px]:w-[85vw] max-[600px]:rounded-[5vw]">
              <img
                src={imageUrl}
                alt={imageAlt}
                draggable={false}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="relative h-full w-full">
            <div className="w-full absolute left-0 top-[49%] flex items-center h-fit">
              <div
                className="h-[.8vw] max-[600px]:h-[2vw] max-[600px]:w-[2vw] w-[.8vw] rounded-full"
                style={activeStyle}
              ></div>
              <div className="h-px w-[0%] rounded-full journey-line" style={activeStyle}></div>
              <div
                className="h-[.8vw] max-[600px]:h-[2vw] max-[600px]:w-[2vw] w-[.8vw] rounded-full"
                style={activeStyle}
              ></div>
            </div>

            <div className="flex h-1/2 w-full items-center justify-start gap-[.5vw]">
              <div className="h-full w-[20%] pt-[2vw] max-[600px]:h-fit max-[600px]:pt-[5vw]">
                <h2 className="w-[65%] text-[3vw] leading-[0.95] max-[600px]:text-[8.5vw]">
                  {title}
                </h2>
              </div>

              <div className="w-full flex h-full gap-x-[15vw] max-[600px]:gap-x-[40vw]">
                {topItems.map((item) => (
                  <div
                    key={`top-${item.id}`}
                    className="relative h-full w-[30vw] px-[3vw] max-[600px]:flex max-[600px]:w-[70vw] max-[600px]:flex-col max-[600px]:px-[7vw]"
                  >
                    <div className="w-full absolute left-0 bottom-0 top-0 h-full">
                      <div
                        className={`size-[1vw] max-[600px]:size-[2.5vw] translate-x-[-50%] relative aspect-square rounded-full jd-${item.id}`}
                        style={activeStyle}
                      ></div>
                      <div
                        className={`h-[94%] w-px origin-bottom rounded-full jl-${item.id}`}
                        style={activeStyle}
                      ></div>
                    </div>

                    <div className="mt-[-1vw] space-y-[.6vw] max-[600px]:mt-[-2vw]">
                      {renderText(item)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-1/2 flex items-center justify-start w-full">
              <div className="w-[34%] pt-[2vw] max-[600px]:pt-[5vw] max-[600px]:w-[30%] h-full">
                <p
                  className="text-[1.65vw] leading-none max-[600px]:text-[4.2vw]"
                  style={mutedTextStyle}
                >
                  {periodLabel}
                </p>
              </div>

              <div className="w-full flex h-full gap-x-[20vw] ml-[7vw] max-[600px]:gap-x-[40vw] max-[600px]:ml-[7vw]">
                {bottomItems.map((item) => (
                  <div
                    key={`bottom-${item.id}`}
                    className="relative h-full w-[25vw] px-[3vw] max-[600px]:w-[70vw] max-[600px]:px-[7vw]"
                  >
                    <div className="w-full absolute left-0 bottom-[-1%] h-full">
                      <div
                        className={`h-[94%] origin-top w-px rounded-full max-[600px]:h-full jl-${item.id}`}
                        style={activeStyle}
                      ></div>
                      <div
                        className={`size-[1vw] max-[600px]:size-[2.5vw] translate-x-[-50%] relative w-auto aspect-square rounded-full jd-${item.id}`}
                        style={activeStyle}
                      ></div>
                    </div>

                    <div className="flex h-full w-full flex-col justify-start space-y-[.6vw] pt-[2vw] max-[600px]:justify-end max-[600px]:pt-0">
                      {renderText(item)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
