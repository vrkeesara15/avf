import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Layout } from "../components/Layout";

/** Render a component wrapped in a router (no shared chrome). */
export function renderWithRouter(
  ui: ReactElement,
  { route = "/" }: { route?: string } = {}
) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

/**
 * Render a full page inside the app Layout at a given route so links,
 * header and footer behave as in the real app.
 */
export function renderPage(
  path: string,
  element: ReactElement,
  { route = path }: { route?: string } = {}
) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route element={<Layout />}>
          <Route path={path} element={element} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}
