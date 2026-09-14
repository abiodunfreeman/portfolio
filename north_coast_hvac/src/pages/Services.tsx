import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Flame, Phone, Snowflake, Wrench } from 'lucide-react';
import { business, services } from '../../shared/business';

const icons = { cooling: Snowflake, heating: Flame, maintenance: Wrench };
export default function Services() {
  return (
    <>
      <section className="page-intro">
        <div className="shell">
          <span className="eyebrow">HEATING, COOLING & A LITTLE PEACE OF MIND</span>
          <h1>Comfort for every season.</h1>
          <p>
            Clear explanations, thoughtful options, and care built around your home. Start
            with an $89 diagnostic assessment when something doesn’t feel right.
          </p>
        </div>
      </section>
      <section className="shell section-pad">
        <div className="service-details">
          {services.map((service) => {
            const Icon = icons[service.icon];
            return (
              <article className="service-detail" id={service.id} key={service.id}>
                <div>
                  <span className={`service-icon ${service.icon}`}>
                    <Icon size={30} />
                  </span>
                  <h2>{service.title}</h2>
                  <p>{service.subtitle}</p>
                  <div className="service-price">
                    <strong>{service.price}</strong>
                    <span>{service.priceLabel}</span>
                  </div>
                </div>
                <div>
                  <p>{service.description}</p>
                  <ul>
                    {service.features.map((feature) => (
                      <li key={feature}>
                        <Check size={18} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    component={Link}
                    to={`/book?service=${service.id}`}
                    variant="contained"
                    color="secondary"
                    endIcon={<ArrowRight size={18} />}
                  >
                    Request {service.id === 'maintenance' ? 'a tune-up' : 'a visit'}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
        <p className="price-note">
          Demo pricing is illustrative. Equipment, home layout, and the repair needed
          affect the final quote. The $89 diagnostic is a separate assessment; additional
          work is priced before it begins.
        </p>
        <div className="emergency-panel">
          <div>
            <span className="eyebrow">HEAT OUT? AC GONE QUIET?</span>
            <h2>Some things can’t wait.</h2>
            <p>
              The emergency line is available 24/7. Call for urgent concerns instead of
              waiting on an online request.
            </p>
          </div>
          <div>
            <Button
              variant="contained"
              color="secondary"
              href={business.phoneHref}
              startIcon={<Phone size={18} />}
            >
              {business.phone}
            </Button>
            <small>Fictional demo number · no dispatch</small>
          </div>
        </div>
      </section>
    </>
  );
}
