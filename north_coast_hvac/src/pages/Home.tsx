import { Accordion, AccordionDetails, AccordionSummary, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Snowflake,
  Star,
} from 'lucide-react';
import { business, faqs } from '../../shared/business';
import { ServiceCards } from '../components/ServiceCards';
import { TestimonialCarousel } from '../components/Testimonials';

export default function Home({ openChat }: { openChat: () => void }) {
  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">CLEVELAND’S NEIGHBORHOOD HVAC TEAM</span>
            <h1>
              Home feels better
              <br />
              when comfort
              <br />
              comes standard<span>.</span>
            </h1>
            <p>
              From lake-effect winters to sticky summer nights, count on friendly,
              straightforward heating and cooling care.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="contained" color="secondary" component={Link} to="/book">
                Book your $89 diagnostic <ArrowRight size={18} className="ml-3" />
              </Button>
              <Button variant="outlined" href={business.phoneHref}>
                <Phone size={17} className="mr-2" /> 24/7 emergency help
              </Button>
            </div>
            <div className="hero-trust">
              <span>
                <ShieldCheck size={18} /> Licensed & insured
              </span>
              <span>
                <Star size={17} fill="currentColor" /> 4.9-star service
              </span>
            </div>
            <small className="demo-caption">
              Fictional company demo · sample credentials, rating & phone
            </small>
          </div>
          <div className="hero-image">
            <img
              src="/hvac-hero.png"
              alt="Illustrative HVAC technician beside an air conditioner outside a Cleveland-style home"
              width="1536"
              height="1024"
              fetchPriority="high"
            />
            <div className="comfort-card">
              <span className="comfort-icon">
                <Snowflake size={25} />
              </span>
              <div>
                <strong>Your comfort. Our calling.</strong>
                <span>Good neighbors. Great service.</span>
              </div>
            </div>
            <div className="hero-location">CLEVELAND, OH & SURROUNDING COMMUNITIES</div>
          </div>
        </div>
      </section>
      <div className="promise-strip">
        <div className="shell">
          <div>
            <Clock3 size={23} />
            <span>
              <strong>Here for the unexpected</strong>
              <small>24/7 emergency availability</small>
            </span>
          </div>
          <div>
            <ShieldCheck size={24} />
            <span>
              <strong>Care you can feel good about</strong>
              <small>Respect for your home, every visit</small>
            </span>
          </div>
          <div>
            <Check size={25} />
            <span>
              <strong>Clarity before the work</strong>
              <small>Upfront options. No pressure.</small>
            </span>
          </div>
        </div>
      </div>
      <section className="shell section-pad">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A LITTLE LESS WORRY. A LOT MORE COMFORT.</span>
            <h2>
              Whatever the season,
              <br />
              we’ve got your home covered.
            </h2>
          </div>
          <Link className="inline-link" to="/services">
            Explore our services <ArrowRight size={18} />
          </Link>
        </div>
        <ServiceCards />
        <p className="price-note">
          Illustrative prices. Diagnostic assessment is $89; repairs and installations are
          quoted separately.
        </p>
      </section>
      <section className="area-section">
        <div className="shell area-layout">
          <div>
            <span className="eyebrow">ROOTED RIGHT HERE</span>
            <h2>
              For Cleveland homes.
              <br />
              And the people in them.
            </h2>
            <p>
              Old houses with character. New places to put down roots. We’re here to help
              our neighbors feel at home, across Cleveland and the surrounding
              communities.
            </p>
            <Button
              onClick={openChat}
              variant="outlined"
              startIcon={<MessageCircle size={18} />}
            >
              Ask Frosty about your area
            </Button>
          </div>
          <div className="area-panel">
            <div className="area-panel-title">
              <MapPin size={23} />
              <strong>Proudly serving Greater Cleveland</strong>
            </div>
            <div className="area-pills">
              {business.areas.slice(1).map((area) => (
                <span key={area}>
                  <Check size={14} />
                  {area}
                </span>
              ))}
            </div>
            <p>Not seeing your neighborhood? Let’s check before you book.</p>
          </div>
        </div>
      </section>
      <TestimonialCarousel />
      <section className="shell faq-section section-pad">
        <div>
          <span className="eyebrow">A FEW THINGS YOU MIGHT BE WONDERING</span>
          <h2>
            Good questions.
            <br />
            Straight answers.
          </h2>
          <p>
            Need a little more help?
            <br />
            Frosty is always a click away.
          </p>
          <Button onClick={openChat} endIcon={<MessageCircle size={18} />}>
            Chat with Frosty
          </Button>
        </div>
        <div>
          {faqs.map((faq, index) => (
            <Accordion key={faq.question}>
              <AccordionSummary
                expandIcon={<ChevronDown size={20} />}
                id={`faq-${index}`}
                aria-controls={`faq-answer-${index}`}
              >
                {faq.question}
              </AccordionSummary>
              <AccordionDetails id={`faq-answer-${index}`}>{faq.answer}</AccordionDetails>
            </Accordion>
          ))}
        </div>
      </section>
      <section className="ready-banner">
        <div className="shell">
          <div>
            <span className="eyebrow">LET’S GET COMFORTABLE</span>
            <h2>
              Your home deserves
              <br />a little North Coast care.
            </h2>
          </div>
          <Button
            component={Link}
            to="/book"
            variant="contained"
            color="secondary"
            endIcon={<ArrowRight size={19} />}
          >
            Book a visit
          </Button>
        </div>
      </section>
    </>
  );
}
