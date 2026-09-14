import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Snowflake, Wrench } from 'lucide-react';
import { services } from '../../shared/business';

const icons = { cooling: Snowflake, heating: Flame, maintenance: Wrench };

export function ServiceCards() {
  return (
    <div className="service-grid">
      {services.map((service, index) => {
        const Icon = icons[service.icon];
        return (
          <article className="service-card" key={service.id}>
            <div className="service-card-top">
              <span className={`service-icon ${service.icon}`}>
                <Icon size={27} strokeWidth={1.7} />
              </span>
              <span>0{index + 1}</span>
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <div className="service-price">
              <strong>{service.price}</strong>
              <span>{service.priceLabel}</span>
            </div>
            <Button
              component={Link}
              to={`/book?service=${service.id}`}
              endIcon={<ArrowRight size={17} />}
            >
              Book {service.id === 'maintenance' ? 'a tune-up' : 'a visit'}
            </Button>
          </article>
        );
      })}
    </div>
  );
}
