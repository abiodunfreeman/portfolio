import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy, Menu, X } from 'lucide-react';
import { profile } from '../data/portfolio';
import { useCopyEmail } from '../hooks/useCopyEmail';

const navigation = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { copyEmail, copyStatus } = useCopyEmail();

  useEffect(() => {
    function closeMenu(event: KeyboardEvent) {
      if (event.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    }
    window.addEventListener('keydown', closeMenu);
    return () => window.removeEventListener('keydown', closeMenu);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="page-shell header-inner">
        <a
          className="brand"
          href="#home"
          aria-label="Abiodun Freeman, home"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-mark">
            af<span>↗</span>
          </span>
          <span className="brand-name">
            Abiodun
            <br />
            Freeman<span className="accent">.</span>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <a key={item.label} href={item.href}>
              {item.label}
            </a>
          ))}
          <a href="/resume.txt" download="Abiodun-Freeman-Resume.txt">
            Resume
          </a>
        </nav>
        <div className="header-contact-group">
          <a className="header-contact" href={`mailto:${profile.email}`}>
            <span className="conversation-long">Start a conversation</span>
            <span className="conversation-short">Let’s talk</span>
            <ArrowUpRight size={16} />
          </a>
          <div className="header-email">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <button
              type="button"
              className="icon-button header-copy"
              aria-label="Copy email address"
              title="Copy email address"
              onClick={copyEmail}
            >
              {copyStatus === 'Email copied' ? <Check size={14} /> : <Copy size={14} />}
            </button>
            <span className="header-copy-status" role="status">
              {copyStatus}
            </span>
          </div>
        </div>
        <button
          ref={menuButton}
          className="mobile-menu-button icon-button"
          aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="Mobile navigation"
        hidden={!menuOpen}
      >
        {[...navigation, { label: 'Email me', href: `mailto:${profile.email}` }].map(
          (item) => (
            <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
              <ArrowUpRight size={19} />
            </a>
          ),
        )}
        <a
          href="/resume.txt"
          download="Abiodun-Freeman-Resume.txt"
          onClick={() => setMenuOpen(false)}
        >
          Resume <ArrowUpRight size={19} />
        </a>
      </nav>
    </header>
  );
}
