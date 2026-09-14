import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { ArrowRight, Quote } from 'lucide-react';
import { testimonials } from '../../shared/business';
import { Stars } from '../components/Testimonials';

export default function Reviews() {
  return (
    <>
      <section className="page-intro">
        <div className="shell reviews-intro">
          <div>
            <span className="eyebrow">
              THE KIND OF SERVICE YOU’D TELL A NEIGHBOR ABOUT
            </span>
            <h1>
              Good words.
              <br />
              From around the neighborhood.
            </h1>
            <p>
              Six illustrative customer stories, inspired by the thoughtful service North
              Coast is designed to represent.
            </p>
          </div>
          <div className="rating-card">
            <strong>
              4.9<span>/5</span>
            </strong>
            <Stars />
            <p>Sample overall rating</p>
            <small>Fictional business · demo reviews</small>
          </div>
        </div>
      </section>
      <section className="shell section-pad">
        <div className="reviews-grid">
          {testimonials.map((review) => (
            <article className="review-card" key={review.name}>
              <div className="flex items-center justify-between">
                <Stars />
                <Quote size={24} className="text-slate-300" />
              </div>
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
                  <span>{review.suburb}</span>
                </div>
              </div>
              <span className="review-service">
                {review.service} · sample testimonial
              </span>
            </article>
          ))}
        </div>
        <div className="reviews-cta">
          <h2>Let’s make your home more comfortable.</h2>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/book"
            endIcon={<ArrowRight size={18} />}
          >
            Try a demo booking
          </Button>
        </div>
      </section>
    </>
  );
}
