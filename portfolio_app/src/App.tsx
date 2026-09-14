import { useState } from 'react';
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Code2,
  Download,
  Layers3,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { ContactSection } from './components/ContactSection';
import { SiteHeader } from './components/SiteHeader';
import { CaseStudy } from './components/CaseStudy';
import { OrbitSculpture } from './components/OrbitSculpture';
import { ProjectVisual } from './components/ProjectVisual';
import { experience, profile, projects, services, type Project } from './data/portfolio';

const serviceIcons = [Code2, Layers3, Sparkles];
const process = [
  {
    step: '01',
    title: 'Find the real problem.',
    description:
      'We start with your goals, your users, and what a successful project looks like.',
  },
  {
    step: '02',
    title: 'Make the complex feel simple.',
    description:
      'I turn the plan into thoughtful interfaces and solid technical foundations.',
  },
  {
    step: '03',
    title: 'Build, refine, and launch.',
    description:
      'You stay involved as we test the details, iterate, and get your product out into the world.',
  },
];

function App() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main">
        <section id="home" className="hero page-shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow">
              <span className="status-dot" /> AI-POWERED WEB APPS. HUMAN-CENTERED DESIGN.
            </div>
            <h1 id="hero-title">
              Good design.
              <br />
              Great code.
              <br />
              <span className="accent">Real impact.</span>
            </h1>
            <p className="hero-description">
              I’m Abiodun. I build AI-powered websites and apps that answer questions,
              capture inquiries, and connect businesses with customers.
            </p>
            <div className="hero-actions">
              <a
                className="button button-primary"
                href={`mailto:${profile.email}?subject=${encodeURIComponent('Let’s discuss a project')}`}
              >
                Have a project in mind? <ArrowUpRight size={20} />
              </a>
              <a className="text-link" href="#work">
                Explore my work <ArrowDownRight size={17} />
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <span className="visual-coordinate top">
              CREATIVE THINKING / PRECISE ENGINEERING
            </span>
            <OrbitSculpture />
            <div className="visual-coordinate bottom">
              <span className="crosshair">+</span>
              <span>FORM MEETS FUNCTION</span>
              <span className="coordinate-line" />
            </div>
          </div>
          <div className="hero-bottom">
            <span>
              <MapPin size={13} /> CLEVELAND, OH · WORKING BEYOND BORDERS
            </span>
            <a href="#work">
              SCROLL TO EXPLORE <ArrowDown size={14} />
            </a>
          </div>
        </section>

        <div className="experience-strip">
          <div className="page-shell experience-strip-inner">
            <p>
              REAL-WORLD EXPERIENCE.
              <br />
              <span>MEANINGFUL PROBLEMS.</span>
            </p>
            <div className="experience-wordmark sherwin">Sherwin-Williams</div>
            <div className="experience-wordmark nasa">
              NASA <span>VIA COMSAT ARCHITECTS</span>
            </div>
            <div className="experience-wordmark givecamp">
              Cleveland
              <span>
                GiveCamp<span className="accent">✳</span>
              </span>
            </div>
          </div>
        </div>

        <section
          id="work"
          className="section-space page-shell"
          aria-labelledby="work-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span className="section-number">01 /</span> SELECTED EXPERIENCE
              </p>
              <h2 id="work-title">
                Built with purpose<span className="accent">.</span>
              </h2>
            </div>
            <p>
              Complex systems. Clear experiences.
              <br />A few problems I’ve helped solve.
            </p>
          </div>
          <div className="projects-grid">
            {projects.map((project) => (
              <article
                className={`project-card project-${project.kind}`}
                key={project.id}
              >
                <button
                  className="project-image-button"
                  aria-label={`Read project: ${project.client}`}
                  onClick={() => setActiveProject(project)}
                >
                  <ProjectVisual kind={project.kind} />
                  <span className="project-open">
                    <ArrowUpRight size={24} />
                  </span>
                </button>
                <div className="project-description">
                  <div className="project-meta">
                    <span>{project.category}</span>
                    <span>{project.number}</span>
                  </div>
                  <h3>
                    <button onClick={() => setActiveProject(project)}>
                      {project.client}
                      <ArrowUpRight size={22} />
                    </button>
                  </h3>
                  <p>{project.summary}</p>
                  <div className="tag-list">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <button
                    className="project-read text-link"
                    onClick={() => setActiveProject(project)}
                  >
                    Explore the project <ArrowRight size={17} />
                  </button>
                </div>
              </article>
            ))}
          </div>
          <div className="work-footnote">
            <span>Good work starts with a good conversation.</span>
            <a className="text-link" href="#contact">
              Let’s talk about yours <ArrowUpRight size={17} />
            </a>
          </div>
        </section>

        <section
          id="services"
          className="services-section section-space"
          aria-labelledby="services-title"
        >
          <div className="page-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  <span className="section-number">02 /</span> HOW I CAN HELP
                </p>
                <h2 id="services-title">
                  Your vision.
                  <br />
                  My kind of challenge<span className="accent">.</span>
                </h2>
              </div>
              <p>
                Help your next customer find answers
                <br className="desktop-break" /> and take the next step with your
                business.
              </p>
            </div>
            <div className="services-grid">
              {services.map((service, index) => {
                const Icon = serviceIcons[index];
                return (
                  <article className="service-card" key={service.number}>
                    <div className="service-top">
                      <Icon size={26} strokeWidth={1.4} />
                      <span>{service.number}</span>
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                    <div className="service-tags">
                      {service.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="process-layout">
              <div>
                <span className="eyebrow">CLEAR COMMUNICATION. SHARED PROGRESS.</span>
                <h3>
                  A clear path
                  <br />
                  from idea to impact.
                </h3>
                <a className="text-link" href="#contact">
                  Tell me what you’re thinking <ArrowUpRight size={17} />
                </a>
              </div>
              <ol className="process-list">
                {process.map((item) => (
                  <li key={item.step}>
                    <span className="process-number">{item.step}</span>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="section-space page-shell about-section"
          aria-labelledby="about-title"
        >
          <div className="about-intro">
            <p className="eyebrow">
              <span className="section-number">03 /</span> THE PERSON BEHIND THE PIXELS
            </p>
            <h2 id="about-title">
              A builder’s mindset.
              <br />A designer’s eye<span className="accent">.</span>
            </h2>
            <div className="about-body">
              <div className="personal-mark" aria-hidden="true">
                <span>af.</span>
                <svg viewBox="0 0 180 180">
                  <defs>
                    <path
                      id="text-circle"
                      d="M90,90m-73,0a73,73 0 1,1 146,0a73,73 0 1,1 -146,0"
                    />
                  </defs>
                  <text>
                    <textPath href="#text-circle" textLength="455">
                      THOUGHTFUL BY DESIGN · CURIOUS BY NATURE ·{' '}
                    </textPath>
                  </text>
                </svg>
              </div>
              <div>
                <p>
                  I’m Abiodun Freeman, a software engineer with a full-stack perspective
                  and an eye for the details that make a product feel right.
                </p>
                <p>
                  From enterprise interfaces to internal NASA tools and local nonprofits,
                  I’ve learned that the best software starts with understanding people. I
                  bring that same curiosity, care, and practical thinking to every
                  project.
                </p>
                <a
                  className="text-link"
                  href="/resume.txt"
                  download="Abiodun-Freeman-Resume.txt"
                >
                  A little more about my background <Download size={16} />
                </a>
              </div>
            </div>
          </div>
          <div className="background-grid">
            <div>
              <div className="subsection-label">THE JOURNEY</div>
              <div className="experience-timeline">
                {experience.map((item) => (
                  <div className="timeline-item" key={item.company}>
                    <span className="timeline-dot" />
                    <div className="timeline-meta">
                      <h3>{item.company}</h3>
                      <span>{item.period}</span>
                    </div>
                    <p>{item.role}</p>
                    <p className="timeline-description">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="toolbox">
              <div className="subsection-label">TOOLS I REACH FOR</div>
              <p>
                The right tool for the problem.
                <br />A strong foundation for what’s next.
              </p>
              <div className="tool-tags">
                {[
                  'React',
                  'TypeScript',
                  'Next.js',
                  'Tailwind CSS',
                  'Figma',
                  'Node.js',
                  'GraphQL',
                  'PostgreSQL',
                  'Java / Spring',
                  'Docker',
                  'Azure',
                  'Kubernetes',
                ].map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
              <div className="education">
                <span className="tiny-dot" /> Computer Science · Kent State · 2016–2020
              </div>
            </div>
          </div>
        </section>

        <ContactSection />
      </main>

      <footer className="site-footer page-shell">
        <a className="footer-signature" href="#home">
          Abiodun Freeman<span className="accent">.</span>
        </a>
        <span>Thoughtfully designed. Carefully built.</span>
        <div>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub <Code2 size={15} />
          </a>
          <a href="/resume.txt" download="Abiodun-Freeman-Resume.txt">
            Resume <Download size={15} />
          </a>
          <a href="#home" aria-label="Back to top">
            <ArrowUpRight size={20} />
          </a>
        </div>
        <p>© {new Date().getFullYear()} Abiodun Freeman</p>
      </footer>
      <CaseStudy project={activeProject} onClose={() => setActiveProject(null)} />
    </>
  );
}

export default App;
