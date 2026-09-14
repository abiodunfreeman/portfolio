import { useId } from 'react';
import { ArrowUpRight, Check, Circle, Command, Layers, Plus } from 'lucide-react';
import type { Project } from '../data/portfolio';

/** Original illustrations communicate the work without exposing internal screens. */
export function ProjectVisual({ kind }: { kind: Project['kind'] }) {
  const visualId = useId();
  const planetId = `${visualId}-planet`;
  const gridId = `${visualId}-grid`;

  if (kind === 'space') {
    return (
      <div className="project-art space-art" aria-hidden="true">
        <div className="art-caption">
          <span className="tiny-dot" /> MISSION / CONNECTED
        </div>
        <svg className="space-orbits" viewBox="0 0 600 370" fill="none">
          <defs>
            <radialGradient id={planetId} cx="30%" cy="25%">
              <stop offset="0" stopColor="#e2e9bc" />
              <stop offset="0.35" stopColor="#8f9c62" />
              <stop offset="1" stopColor="#263326" />
            </radialGradient>
            <pattern id={gridId} width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M28 0H0V28" stroke="#d4ddac" strokeOpacity=".07" />
            </pattern>
          </defs>
          <rect width="600" height="370" fill={`url(#${gridId})`} />
          <ellipse
            cx="310"
            cy="190"
            rx="223"
            ry="80"
            transform="rotate(-27 310 190)"
            stroke="#bbc996"
            strokeOpacity=".4"
          />
          <ellipse
            cx="310"
            cy="190"
            rx="185"
            ry="132"
            transform="rotate(27 310 190)"
            stroke="#bbc996"
            strokeOpacity=".2"
          />
          <ellipse
            cx="310"
            cy="190"
            rx="105"
            ry="159"
            transform="rotate(42 310 190)"
            stroke="#bbc996"
            strokeOpacity=".18"
            strokeDasharray="3 7"
          />
          <path
            d="M105 241L305 181L470 94M305 181L451 281"
            stroke="#dae9ad"
            strokeOpacity=".55"
            strokeDasharray="3 5"
          />
          <circle cx="310" cy="190" r="57" fill={`url(#${planetId})`} />
          <circle cx="310" cy="190" r="65" stroke="#d7e4ac" strokeOpacity=".2" />
          <g fill="#dbe5b8">
            <circle cx="105" cy="241" r="5" />
            <circle cx="470" cy="94" r="5" />
            <circle cx="451" cy="281" r="5" />
          </g>
          <g stroke="#dbe5b8" strokeOpacity=".4">
            <circle cx="105" cy="241" r="13" />
            <circle cx="470" cy="94" r="13" />
            <circle cx="451" cy="281" r="13" />
          </g>
          <g fill="#c5ceb0" fontFamily="monospace" fontSize="10" letterSpacing="1.5">
            <text x="59" y="272">
              STANDARDS
            </text>
            <text x="428" y="65">
              CAPABILITIES
            </text>
            <text x="411" y="313">
              REQUIREMENTS
            </text>
          </g>
        </svg>
        <div className="space-wordmark">
          SPARC<span>Making connections. Enabling discovery.</span>
        </div>
        <span className="illustration-label">Concept illustration</span>
      </div>
    );
  }

  if (kind === 'community') {
    return (
      <div className="project-art community-art" aria-hidden="true">
        <div className="community-type">
          Good people.
          <br />
          Great possibilities.
        </div>
        <div className="flower">
          <i />
          <i />
          <i />
          <i />
          <span>
            <ArrowUpRight size={37} strokeWidth={1.4} />
          </span>
        </div>
        <span className="community-note">A LITTLE CODE. A LOT OF GOOD.</span>
        <span className="illustration-label">Concept illustration</span>
      </div>
    );
  }

  return (
    <div className="project-art enterprise-art" aria-hidden="true">
      <div className="interface-window">
        <div className="interface-toolbar">
          <span>
            <Circle />
            <Circle />
            <Circle />
          </span>
          <span>WORKSPACE / OVERVIEW</span>
          <Command size={13} />
        </div>
        <div className="interface-body">
          <aside className="interface-sidebar">
            <div className="interface-logo">
              <Layers size={18} />
            </div>
            <span className="selected" />
            <span />
            <span />
            <span />
            <i />
          </aside>
          <div className="interface-main">
            <div className="interface-heading">
              <div>
                <small>LET’S MAKE THINGS WORK BETTER</small>
                <strong>A clearer view.</strong>
              </div>
              <span className="interface-add">
                <Plus size={13} /> Create
              </span>
            </div>
            <div className="interface-tiles">
              <div>
                <small>CONSISTENT</small>
                <Layers size={25} />
                <b>One system.</b>
              </div>
              <div>
                <small>CONNECTED</small>
                <div className="mini-bars">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <b>Less friction.</b>
              </div>
              <div>
                <small>INTUITIVE</small>
                <span className="mini-check">
                  <Check size={22} />
                </span>
                <b>Better flow.</b>
              </div>
            </div>
            <div className="interface-table">
              <div>
                <span>COMPONENT LIBRARY</span>
                <span>STATUS</span>
              </div>
              {['Responsive tables', 'Reusable forms', 'Shared foundations'].map(
                (label) => (
                  <div key={label}>
                    <span>
                      <span className="table-square" />
                      {label}
                    </span>
                    <span className="table-status">
                      <Check size={9} /> Ready
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
      <span className="illustration-label">Concept illustration</span>
    </div>
  );
}
