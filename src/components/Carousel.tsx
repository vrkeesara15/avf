import { useState, type ReactNode } from "react";

interface Props {
  slides: ReactNode[];
  label: string;
}

/** Accessible carousel used for success stories (HP-05) and testimonials (HP-09). */
export function Carousel({ slides, label }: Props) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const go = (next: number) => setIndex(((next % count) + count) % count);

  return (
    <div className="carousel" aria-roledescription="carousel" aria-label={label}>
      <div className="carousel__viewport">
        <div
          className="carousel__track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              className="carousel__slide"
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      <div className="carousel__controls">
        <button
          type="button"
          className="carousel__btn"
          aria-label="Previous slide"
          onClick={() => go(index - 1)}
        >
          ‹
        </button>
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`carousel__dot${i === index ? " is-active" : ""}`}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => go(i)}
          />
        ))}
        <button
          type="button"
          className="carousel__btn"
          aria-label="Next slide"
          onClick={() => go(index + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
}
