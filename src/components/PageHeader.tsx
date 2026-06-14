import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

interface Props {
  title: string;
  intro?: ReactNode;
  crumbs: Crumb[];
}

/** Reusable inner-page hero banner with breadcrumbs. */
export function PageHeader({ title, intro, crumbs }: Props) {
  return (
    <header className="page-header">
      <div className="container">
        <Breadcrumbs items={crumbs} />
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
    </header>
  );
}
