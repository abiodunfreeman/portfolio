import { useEffect, useState, type ReactNode } from 'react';
import { Button, Drawer, IconButton, Tooltip } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  CircleHelp,
  LayoutDashboard,
  MapPin,
  Menu,
  RefreshCw,
  Snowflake,
  Users,
  X,
} from 'lucide-react';
import { demoMode } from '../lib/api';
import { dateKey, formatDate } from '../lib/dates';

const navigation = [
  { to: '/', title: 'Overview', icon: LayoutDashboard },
  { to: '/jobs', title: 'Jobs', icon: BriefcaseBusiness },
  { to: '/schedule', title: 'Schedule', icon: CalendarDays },
  { to: '/customers', title: 'Customers', icon: Users },
];

export default function WorkspaceLayout({
  children,
  loading,
  refresh,
}: {
  children: ReactNode;
  loading: boolean;
  refresh: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const { pathname } = useLocation();
  const page = navigation.find((item) => item.to === pathname)?.title || 'Workspace';
  useEffect(() => {
    document.title = `${page} · North Coast Operations`;
    window.scrollTo(0, 0);
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [page]);

  function sidebar(mobile = false) {
    return (
      <aside className="sidebar-content">
        <NavLink className="brand" to="/" onClick={() => setMenuOpen(false)}>
          <span>
            <Snowflake size={26} />
          </span>
          <div>
            NORTH COAST<small>HEATING & COOLING</small>
          </div>
        </NavLink>
        {mobile && (
          <IconButton
            className="sidebar-close"
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          >
            <X size={20} />
          </IconButton>
        )}
        <div className="workspace-label">
          <span className="workspace-mark">NC</span>
          <div>
            Operations workspace<small>Cleveland, Ohio</small>
          </div>
          <ChevronRight size={15} />
        </div>
        <p className="nav-label">WORKSPACE</p>
        <nav aria-label="Main navigation">
          {navigation.map(({ to, title, icon: Icon }) => (
            <NavLink key={to} to={to} end onClick={() => setMenuOpen(false)}>
              <Icon size={19} />
              <span>{title}</span>
              <ChevronRight size={15} className="nav-arrow" />
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="team-note">
            <span className="team-note-icon">
              <Snowflake size={19} />
            </span>
            <strong>Comfort is a team effort.</strong>
            <p>
              Good people. Great service.
              <br />
              One organized day at a time.
            </p>
            <NavLink to="/schedule" onClick={() => setMenuOpen(false)}>
              See the week ahead <ArrowUpRight size={15} />
            </NavLink>
          </div>
          <button
            className="help-button"
            onClick={() => {
              setHelpOpen(true);
              setMenuOpen(false);
            }}
          >
            <CircleHelp size={18} /> About this demo
          </button>
          <div className="workspace-user">
            <span>NC</span>
            <div>
              North Coast team<small>Demo workspace</small>
            </div>
            <span className="online-dot" />
          </div>
        </div>
      </aside>
    );
  }

  return (
    <div className="app-layout">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="desktop-sidebar">{sidebar()}</div>
      <Drawer anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
        {sidebar(true)}
      </Drawer>
      <div className="workspace-main">
        <header className="topbar">
          <div className="breadcrumb">
            <IconButton
              className="menu-toggle"
              aria-label="Open navigation"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={21} />
            </IconButton>
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>{page}</strong>
          </div>
          <div className="topbar-actions">
            <span className="location-chip">
              <MapPin size={14} />
              Cleveland, OH
            </span>
            <span className={`connection-badge ${demoMode ? 'local' : ''}`}>
              <i />
              {demoMode ? 'Browser demo' : 'Spring Boot API'}
            </span>
            <Tooltip title="Refresh workspace">
              <span>
                <IconButton
                  aria-label="Refresh workspace"
                  disabled={loading}
                  onClick={refresh}
                >
                  <RefreshCw size={17} className={loading ? 'spinning' : ''} />
                </IconButton>
              </span>
            </Tooltip>
            <span className="topbar-avatar">NC</span>
          </div>
        </header>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer className="app-footer">
          <span>
            <Snowflake size={13} /> North Coast Heating & Cooling <b>·</b> Fictional
            company demo
          </span>
          <span>
            {formatDate(dateKey(), { month: 'short', day: 'numeric', year: 'numeric' })}{' '}
            <b>·</b> Eastern time
          </span>
        </footer>
      </div>
      <Drawer anchor="right" open={helpOpen} onClose={() => setHelpOpen(false)}>
        <section className="info-drawer">
          <div className="drawer-top">
            <span className="eyebrow">WELCOME TO NORTH COAST</span>
            <IconButton
              aria-label="Close demo information"
              onClick={() => setHelpOpen(false)}
            >
              <X />
            </IconButton>
          </div>
          <h2>A calmer way to run the day.</h2>
          <p>
            This fictional dashboard brings your jobs, customers, and team schedule into
            one workspace.
          </p>
          <ul>
            <li>Open a job to view details or update its status.</li>
            <li>Use New job to schedule work for an existing sample customer.</li>
            <li>Move between weeks on the schedule and search customer history.</li>
          </ul>
          <div className="info-note">
            <strong>
              {demoMode
                ? 'You’re using browser demo mode.'
                : 'You’re connected to the Spring Boot API.'}
            </strong>
            <p>
              {demoMode
                ? 'Job changes are saved on this browser. Your API is not configured.'
                : 'Changes are saved in the API’s in-memory database. Restarting the API restores the sample data.'}
            </p>
          </div>
          <p>
            The AI week summary uses the current job data. It shows whether the text comes
            from the local rules or a connected AI model. All names, contact details, and
            jobs are fictional.
          </p>
          <Button variant="contained" fullWidth onClick={() => setHelpOpen(false)}>
            Got it
          </Button>
        </section>
      </Drawer>
    </div>
  );
}
