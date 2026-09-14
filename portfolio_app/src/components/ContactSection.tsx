import { useState } from 'react';
import { ArrowDownRight, Check, Copy, MoveUpRight } from 'lucide-react';
import { profile } from '../data/portfolio';
import { useCopyEmail } from '../hooks/useCopyEmail';

export function ContactSection() {
  const [contactType, setContactType] = useState<'project' | 'opportunity'>('project');
  const { copyEmail, copyStatus } = useCopyEmail();

  const emailSubject =
    contactType === 'project'
      ? 'Let’s build something — project inquiry'
      : 'Let’s talk — engineering opportunity';
  const emailBody =
    contactType === 'project'
      ? 'Hi Abiodun,\n\nI’d love to talk about a project.\n\nWhat I’m building:\nTimeline:\nBudget range (if known):\n\nThanks!'
      : 'Hi Abiodun,\n\nI’d love to connect about an engineering opportunity.\n\nCompany / team:\nRole:\nA little about the opportunity:\n\nThanks!';

  return (
    <section id="contact" className="contact-section" aria-labelledby="contact-title">
      <div className="page-shell">
        <div className="contact-top">
          <p className="eyebrow">
            <span className="section-number">04 /</span> SOMETHING GOOD STARTS HERE
          </p>
          <ArrowDownRight size={48} strokeWidth={1} />
        </div>
        <h2 id="contact-title">
          Have a good idea?
          <br />
          Let’s make it{' '}
          <span>
            real
            <svg viewBox="0 0 310 24" preserveAspectRatio="none" aria-hidden="true">
              <path d="M4 15Q145 -3 305 7M28 21Q140 7 280 16" />
            </svg>
            .
          </span>
        </h2>
        <div className="contact-content">
          <p>
            An AI-powered web app, a smarter website, or a role on your team.
            <br />
            I’d love to hear what you have in mind.
          </p>
          <div className="contact-actions">
            <div className="contact-type" role="group" aria-label="Conversation type">
              <button
                aria-pressed={contactType === 'project'}
                onClick={() => setContactType('project')}
              >
                I have a project
              </button>
              <button
                aria-pressed={contactType === 'opportunity'}
                onClick={() => setContactType('opportunity')}
              >
                I’m hiring
              </button>
            </div>
            <a
              className="button button-dark"
              href={`mailto:${profile.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`}
            >
              Start a conversation <MoveUpRight size={20} />
            </a>
            <small>Opens your email app with a starting point.</small>
          </div>
        </div>
        <div className="contact-email">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <button
            className="icon-button"
            aria-label="Copy email address"
            onClick={copyEmail}
          >
            {copyStatus === 'Email copied' ? <Check size={18} /> : <Copy size={18} />}
          </button>
          <span className="copy-status" role="status">
            {copyStatus}
          </span>
        </div>
      </div>
    </section>
  );
}
