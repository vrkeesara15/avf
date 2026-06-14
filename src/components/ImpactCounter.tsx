import { useEffect, useRef, useState } from "react";
import type { Metric } from "../data/content";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export function formatNumber(n: number): string {
  // Indian-locale-friendly grouping (NFR-L04).
  return n.toLocaleString("en-IN");
}

interface Props {
  metric: Metric;
  dark?: boolean;
  duration?: number;
}

/** HP-03 / IMP-01 — animated count-up impact tile. */
export function ImpactCounter({ metric, dark = false, duration = 1400 }: Props) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const run = () => {
      if (started.current) return;
      started.current = true;

      if (prefersReducedMotion()) {
        setDisplay(metric.value);
        return;
      }

      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(metric.value * eased));
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          setDisplay(metric.value);
        }
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) run();
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [metric.value, duration]);

  return (
    <div className={`counter${dark ? " counter--dark" : ""}`} ref={ref}>
      <div
        className={`counter__value${
          metric.accent ? " counter__value--orange" : ""
        }`}
        data-testid={`counter-${metric.id}`}
      >
        {metric.prefix ?? ""}
        {formatNumber(display)}
        {metric.suffix ?? ""}
      </div>
      <div className="counter__label">{metric.label}</div>
    </div>
  );
}
