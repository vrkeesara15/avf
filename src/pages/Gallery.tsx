import { useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import {
  albums,
  photos as fallbackPhotos,
  type Album,
  type Photo,
} from "../data/content";
import { api } from "../lib/api";
import { useContent } from "../lib/useContent";

export function Gallery() {
  const photos = useContent<Photo[]>(api.getGallery, fallbackPhotos);
  const [album, setAlbum] = useState<Album>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const visible =
    album === "All" ? photos : photos.filter((p) => p.album === album);

  const current = lightbox !== null ? visible[lightbox] : null;

  const close = () => setLightbox(null);
  const next = () =>
    setLightbox((i) => (i === null ? null : (i + 1) % visible.length));
  const prev = () =>
    setLightbox((i) =>
      i === null ? null : (i - 1 + visible.length) % visible.length
    );

  // GAL-02 — keyboard navigation within the lightbox.
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, visible.length]);

  return (
    <>
      <PageHeader
        title="Gallery"
        intro="Moments from our classrooms, events, graduations and community drives."
        crumbs={[{ label: "Home", to: "/" }, { label: "Gallery" }]}
      />

      <section className="section">
        <div className="container">
          {/* GAL-03 — album filter tabs */}
          <div className="gallery-filters" role="tablist" aria-label="Photo albums">
            {albums.map((a) => (
              <button
                key={a}
                role="tab"
                aria-selected={album === a}
                className={`gallery-filter${album === a ? " is-active" : ""}`}
                onClick={() => {
                  setAlbum(a);
                  setLightbox(null);
                }}
              >
                {a}
              </button>
            ))}
          </div>

          {/* GAL-01 — gallery grid */}
          <div className="gallery-grid" data-testid="gallery-grid">
            {visible.map((p, i) => (
              <button
                key={p.id}
                type="button"
                className="gallery-item"
                style={{ background: p.color }}
                onClick={() => setLightbox(i)}
                aria-label={`Open: ${p.caption}`}
              >
                <span className="gallery-item__icon" aria-hidden="true">
                  {p.icon}
                </span>
                <span className="gallery-item__caption">{p.caption}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GAL-02 — lightbox overlay */}
      {current && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={current.caption}
          onClick={close}
        >
          <button className="lightbox__close" aria-label="Close" onClick={close}>
            ×
          </button>
          <button
            className="lightbox__nav lightbox__nav--prev"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            ‹
          </button>
          <div
            className="lightbox__panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="lightbox__media"
              style={{ background: current.color }}
              aria-hidden="true"
            >
              {current.icon}
            </div>
            <div className="lightbox__body">
              <span className="badge">{current.album}</span>
              <h3 style={{ marginTop: "0.6rem" }}>{current.caption}</h3>
              <p style={{ color: "var(--avf-muted)", margin: 0 }}>
                {current.detail}
              </p>
            </div>
          </div>
          <button
            className="lightbox__nav lightbox__nav--next"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
