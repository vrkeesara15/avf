import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
});

// jsdom does not implement these — stub them so components relying on them
// (scroll behaviours, intersection-based counters) can be tested safely.
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;

if (!("IntersectionObserver" in window)) {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds = [];
    constructor(private cb: IntersectionObserverCallback) {}
    observe = (target: Element) => {
      // Immediately report the element as fully visible.
      this.cb(
        [{ isIntersecting: true, target } as IntersectionObserverEntry],
        this
      );
    };
    unobserve = () => {};
    disconnect = () => {};
    takeRecords = () => [];
  }
  // @ts-expect-error assigning mock to global
  window.IntersectionObserver = MockIntersectionObserver;
}

if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }) as unknown as MediaQueryList;
}
