import { lazy, Suspense, useState } from 'react';
import { Button } from '@mui/material';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { RouteEffects, SiteFooter, SiteHeader } from './components/SiteLayout';
import Frosty from './components/Frosty';
import Home from './pages/Home';
const Services = lazy(() => import('./pages/Services'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Booking = lazy(() => import('./pages/Booking'));

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <Suspense
          fallback={
            <div className="shell section-pad min-h-96" role="status">
              Getting things comfortable…
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home openChat={() => setChatOpen(true)} />} />
            <Route path="/services" element={<Services />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/book" element={<Booking />} />
            <Route path="/contact" element={<Navigate to="/book" replace />} />
            <Route
              path="*"
              element={
                <section className="shell section-pad not-found">
                  <span className="eyebrow">404 · A LITTLE OFF COURSE</span>
                  <h1>Let’s get you back home.</h1>
                  <p>That page isn’t here, but comfort is just a click away.</p>
                  <Button component={Link} to="/" variant="contained">
                    Back to home
                  </Button>
                </section>
              }
            />
          </Routes>
        </Suspense>
      </main>
      <SiteFooter />
      <Frosty open={chatOpen} setOpen={setChatOpen} />
      <RouteEffects />
    </>
  );
}
