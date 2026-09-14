import { useState } from 'react';
import { IconButton } from '@mui/material';
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react';
import { testimonials } from '../../shared/business';

export function Stars() {
  return (
    <span className="stars" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} size={16} fill="currentColor" aria-hidden="true" />
      ))}
    </span>
  );
}

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  const review = testimonials[index];
  return (
    <section className="testimonial-section section-pad">
      <div className="shell testimonial-layout">
        <div>
          <span className="eyebrow">GOOD NEIGHBORS. HAPPY HOMES.</span>
          <h2>
            Service worth
            <br />
            talking about.
          </h2>
          <div className="review-score">
            <strong>
              4.9<span>/5</span>
            </strong>
            <div>
              <Stars />
              <span>Sample customer rating</span>
            </div>
          </div>
          <p className="demo-caption">
            Illustrative stories for this fictional business.
          </p>
        </div>
        <div
          className="carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
        >
          <Quote className="quote-mark" size={35} fill="currentColor" />
          <div className="carousel-content" aria-live="polite" aria-atomic="true">
            <Stars />
            <blockquote>“{review.quote}”</blockquote>
            <div className="review-person">
              <span className="review-avatar">
                {review.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')}
              </span>
              <div>
                <strong>{review.name}</strong>
                <span>
                  {review.suburb} · {review.service}
                </span>
              </div>
            </div>
          </div>
          <div className="carousel-controls">
            <span>
              {String(index + 1).padStart(2, '0')} <span>/ 06</span>
            </span>
            <div>
              <IconButton
                aria-label="Previous testimonial"
                onClick={() => setIndex((index + 5) % 6)}
              >
                <ArrowLeft size={20} />
              </IconButton>
              <IconButton
                aria-label="Next testimonial"
                onClick={() => setIndex((index + 1) % 6)}
              >
                <ArrowRight size={20} />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
