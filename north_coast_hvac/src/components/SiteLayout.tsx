import { useEffect, useState } from 'react';
import { Button, Drawer, IconButton } from '@mui/material';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ArrowRight, Clock3, Menu, Phone, Snowflake, X } from 'lucide-react';
import { business } from '../../shared/business';

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/book', label: 'Contact / Book' },
];

export function RouteEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const title = links.find((link) => link.to === pathname)?.label || 'Page not found';
    document.title = `${title} | North Coast Heating & Cooling — Demo`;
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [pathname]);
  return null;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="utility-bar">
        <div className="shell flex items-center justify-between gap-4">
          <span>
            Locally focused. Cleveland proud.{' '}
            <span className="demo-label">FICTIONAL BUSINESS DEMO</span>
          </span>
          <a href={business.phoneHref} className="flex items-center gap-2">
            <Clock3 size={14} /> 24/7 emergency line <strong>{business.phone}</strong>
          </a>
        </div>
      </div>
      <header className="shell site-header">
        <Link
          className="wordmark"
          to="/"
          aria-label="North Coast Heating and Cooling home"
        >
          <span className="brand-symbol">
            <Snowflake />
          </span>
          <span>
            NORTH COAST<small>HEATING & COOLING</small>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="desktop-nav flex items-center gap-7">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <Button
          className="header-book"
          variant="contained"
          color="secondary"
          component={Link}
          to="/book"
        >
          Book a visit <ArrowRight size={18} className="ml-3" />
        </Button>
        <IconButton
          className="mobile-menu"
          aria-label="Open navigation"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </IconButton>
      </header>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <div className="mobile-drawer">
          <div className="flex items-center justify-between">
            <strong>North Coast</strong>
            <IconButton aria-label="Close navigation" onClick={() => setOpen(false)}>
              <X />
            </IconButton>
          </div>
          <nav aria-label="Mobile navigation">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)}>
                {link.label}
                <ArrowRight size={18} />
              </NavLink>
            ))}
          </nav>
          <Button
            variant="contained"
            color="secondary"
            href={business.phoneHref}
            startIcon={<Phone size={18} />}
          >
            Call {business.phone}
          </Button>
          <p className="demo-caption">Fictional demo phone number.</p>
        </div>
      </Drawer>
    </>
  );
}

export function SiteFooter() {
  return (
    <>
      <footer className="site-footer">
        <div className="shell footer-grid">
          <div>
            <Link className="wordmark" to="/">
              <span className="brand-symbol">
                <Snowflake />
              </span>
              <span>
                NORTH COAST<small>HEATING & COOLING</small>
              </span>
            </Link>
            <p>
              Comfort for your home.
              <br />
              Care for our community.
            </p>
            <span>Cleveland, Ohio & surrounding suburbs</span>
          </div>
          <div>
            <h3>Around the site</h3>
            <nav aria-label="Footer navigation">
              {links.map((link) => (
                <Link key={link.to} to={link.to}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <h3>Here when you need us</h3>
            {business.hours.map((hours) => (
              <p key={hours}>{hours}</p>
            ))}
            <strong className="footer-emergency">24/7 emergency service</strong>
          </div>
          <div>
            <h3>Let’s get you comfortable</h3>
            <a className="footer-phone" href={business.phoneHref}>
              <Phone size={18} />
              {business.phone}
            </a>
            <small>Fictional demo phone</small>
            <Button variant="contained" color="secondary" component={Link} to="/book">
              Request a visit <ArrowRight size={17} className="ml-3" />
            </Button>
          </div>
        </div>
        <div className="shell footer-bottom">
          <span>© {new Date().getFullYear()} North Coast Heating & Cooling</span>
          <p>
            Fictional portfolio demo. Reviews, credentials, rating, prices, and contact
            details are illustrative. Requests stay on this device; no real service is
            scheduled.
          </p>
        </div>
      </footer>
      <a className="mobile-call" href={business.phoneHref}>
        <Phone size={19} />
        <span>
          <strong>24/7 emergency line</strong>
          <small>{business.phone} · demo number</small>
        </span>
        <ArrowRight size={19} />
      </a>
    </>
  );
}
