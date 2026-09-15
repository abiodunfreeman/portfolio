/** Decorative concept previews for the two public North Coast demos. */
export function NorthCoastVisual({ kind }: { kind: 'dashboard' | 'hvac' }) {
  const isDashboard = kind === 'dashboard';

  return (
    <div className={`project-art north-coast-art ${kind}-art`} aria-hidden="true">
      <svg viewBox="0 0 620 350" fill="none" fontFamily="var(--font-sans)">
        <rect x="28" y="27" width="564" height="290" rx="10" fill="#fff" />
        <path d="M38 27H582Q592 27 592 37V56H28V37Q28 27 38 27" fill="#eef2f5" />
        <g fill="#b6c4cd">
          <circle cx="44" cy="42" r="3" />
          <circle cx="55" cy="42" r="3" />
          <circle cx="66" cy="42" r="3" />
        </g>
        <text x="310" y="45" textAnchor="middle" fill="#526778" fontSize="8">
          {isDashboard ? 'NORTH COAST / OPERATIONS' : 'NORTH COAST / HEATING & COOLING'}
        </text>
        {isDashboard ? (
          <>
            <path d="M28 56H142V317H38Q28 317 28 307Z" fill="#18364b" />
            <text x="43" y="86" fill="#fff" fontSize="13" fontWeight="700">
              North Coast
            </text>
            <rect x="37" y="109" width="96" height="25" rx="4" fill="#2c5268" />
            {['Overview', 'Jobs', 'Schedule', 'Customers'].map((label, index) => (
              <text key={label} x="49" y={125 + index * 34} fill="#e2ebf0" fontSize="9">
                {label}
              </text>
            ))}
            <text x="162" y="91" fill="#173348" fontSize="21" fontWeight="700">
              Your business, at a glance.
            </text>
            <text x="162" y="109" fill="#6c7d87" fontSize="9">
              The right details. A clearer day.
            </text>
            {['Jobs this week', 'Customers', 'Revenue'].map((label, index) => (
              <g key={label} transform={`translate(${162 + index * 137} 128)`}>
                <rect width="126" height="58" rx="5" fill="#f0f5f7" />
                <text x="10" y="18" fill="#5f7583" fontSize="8">
                  {label}
                </text>
                <rect x="10" y="31" width="35" height="10" rx="3" fill="#245a73" />
                <path d="M83 40L92 33L101 36L114 24" stroke="#20a38c" strokeWidth="2" />
              </g>
            ))}
            <rect x="162" y="201" width="220" height="96" rx="5" fill="#f0f5f7" />
            <text x="174" y="219" fill="#173348" fontSize="10" fontWeight="600">
              Weekly activity
            </text>
            {[26, 39, 30, 48, 35, 51, 42].map((height, index) => (
              <rect
                key={index}
                x={179 + index * 28}
                y={284 - height}
                width="15"
                height={height}
                rx="3"
                fill={index === 5 ? '#ef9755' : '#60aaa8'}
              />
            ))}
            <text x="400" y="218" fill="#173348" fontSize="10" fontWeight="600">
              On the schedule
            </text>
            {['AC repair', 'Furnace installation', 'Seasonal maintenance'].map(
              (label, index) => (
                <g key={label} transform={`translate(400 ${237 + index * 22})`}>
                  <circle cx="3" cy="-3" r="3" fill="#20a38c" />
                  <text x="13" fill="#5f7583" fontSize="8">
                    {label}
                  </text>
                </g>
              ),
            )}
          </>
        ) : (
          <>
            <text x="48" y="84" fill="#173348" fontSize="13" fontWeight="700">
              NORTH COAST
            </text>
            <text x="368" y="83" fill="#526778" fontSize="9">
              Services
            </text>
            <text x="428" y="83" fill="#526778" fontSize="9">
              Reviews
            </text>
            <rect x="487" y="66" width="86" height="26" rx="4" fill="#173348" />
            <text x="530" y="83" textAnchor="middle" fill="#fff" fontSize="9">
              Book a visit
            </text>
            <path d="M28 105H592V307Q592 317 582 317H38Q28 317 28 307Z" fill="#eaf3f4" />
            <text x="49" y="137" fill="#427d82" fontSize="8" letterSpacing="1.5">
              CLEVELAND’S HOME COMFORT
            </text>
            <g fill="#173348" fontSize="35" fontWeight="700" letterSpacing="-1">
              <text x="47" y="182">
                Comfort for
              </text>
              <text x="47" y="221">
                every season.
              </text>
            </g>
            <text x="49" y="245" fill="#526778" fontSize="10">
              Heating. Cooling. A little peace of mind.
            </text>
            <rect x="49" y="264" width="122" height="29" rx="4" fill="#e98745" />
            <text
              x="110"
              y="283"
              textAnchor="middle"
              fill="#173348"
              fontSize="10"
              fontWeight="600"
            >
              Request service ↗
            </text>
            <circle cx="463" cy="179" r="62" fill="#c7e3e4" />
            <circle cx="463" cy="179" r="42" stroke="#86b7bb" strokeWidth="1.5" />
            <g stroke="#347b84" strokeWidth="4" strokeLinecap="round">
              <path d="M442 166H473C491 166 491 148 479 148" />
              <path d="M432 180H496" />
              <path d="M442 194H473C491 194 491 212 479 212" />
            </g>
            <rect x="359" y="245" width="213" height="55" rx="8" fill="#173348" />
            <circle cx="379" cy="262" r="4" fill="#79d8c6" />
            <text x="391" y="266" fill="#fff" fontSize="10" fontWeight="600">
              Frosty · Your comfort assistant
            </text>
            <text x="374" y="285" fill="#d6e5ec" fontSize="9">
              How can I help with your home today?
            </text>
          </>
        )}
      </svg>
      <span className="illustration-label">Concept illustration</span>
    </div>
  );
}
