export type Project = {
  id: string;
  number: string;
  category: string;
  client: string;
  title: string;
  summary: string;
  tags: string[];
  kind: 'enterprise' | 'space' | 'community' | 'dashboard' | 'hvac';
  liveUrl?: string;
  role: string;
  period: string;
  challenge: string;
  contribution: string[];
  outcome: string;
  outcomeLabel: string;
};

export const profile = {
  name: 'Abiodun Freeman',
  email: 'freemanabiodun@gmail.com',
  github: 'https://github.com/abiodunfreeman',
  location: 'Cleveland, OH',
  role: 'Software Engineer & Solutions Architect',
};

export const projects: Project[] = [
  {
    id: 'north-coast-dashboard',
    number: '01',
    category: 'Front-end app · Operations',
    client: 'North Coast Dashboard',
    title: 'A clearer view of the working day.',
    summary:
      'An interactive HVAC operations dashboard for managing jobs, technician schedules, and customer histories.',
    tags: ['React', 'TypeScript', 'Material UI', 'Tailwind CSS', 'Vite'],
    kind: 'dashboard',
    liveUrl: 'https://northcoastdashboard.vercel.app/',
    role: 'Front-end development',
    period: 'Interactive demo',
    challenge:
      'Bring the daily work of a home-service business into one workspace, with clear navigation between customer records, scheduled jobs, and performance insights.',
    contribution: [
      'Built a responsive React and TypeScript dashboard with Material UI and Tailwind CSS.',
      'Created searchable customer records, job filters and status updates, and a weekly technician schedule.',
      'Added a standalone browser demo with sample data so visitors can explore the workflows.',
    ],
    outcome:
      'A hands-on front-end demo for a fictional HVAC business. Explore the workspace and sample records to see how the interface supports day-to-day operations.',
    outcomeLabel: 'Explore the app',
  },
  {
    id: 'north-coast-hvac',
    number: '02',
    category: 'Front-end app · Customer experience',
    client: 'North Coast Heating & Cooling',
    title: 'From a service question to the next step.',
    summary:
      'A responsive HVAC website with service information, appointment requests, and a conversational assistant.',
    tags: ['React', 'TypeScript', 'Material UI', 'Tailwind CSS', 'Vite'],
    kind: 'hvac',
    liveUrl: 'https://northcoasthvac.vercel.app/',
    role: 'Front-end development',
    period: 'Interactive demo',
    challenge:
      'Help homeowners understand heating and cooling services, find answers, and request a visit through a clear, approachable website.',
    contribution: [
      'Built a responsive multi-page experience with service details, FAQs, and contact information.',
      'Created a validated appointment-request form with service, date, and time-window selection.',
      'Integrated Frosty, a conversational assistant for service questions, booking guidance, and callback requests.',
    ],
    outcome:
      'An interactive front-end demo for a fictional Cleveland HVAC company. Booking and callback requests are saved in the browser for demonstration and do not create real appointments.',
    outcomeLabel: 'Explore the app',
  },
  {
    id: 'sherwin-williams',
    number: '03',
    category: 'Enterprise applications',
    client: 'Sherwin-Williams',
    title: 'Complex workflows. Clear interfaces.',
    summary:
      'Modernizing enterprise experiences with precise interfaces and reusable React foundations.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Micro-frontends'],
    kind: 'enterprise',
    role: 'Software Engineer',
    period: 'May 2023 — Present',
    challenge:
      'Align enterprise applications with design and stakeholder requirements while making them work smoothly across tablets and desktops.',
    contribution: [
      'Led UI/UX overhauls using React, TypeScript, and Figma.',
      'Built reusable tables and forms as micro-frontends with Material UI and Tailwind CSS.',
      'Implemented responsive layouts that followed design specifications.',
    ],
    outcome:
      'Reusable interface components reduced development time across the team and supported consistent tablet and desktop experiences.',
    outcomeLabel: 'The impact',
  },
  {
    id: 'nasa-comsat',
    number: '04',
    category: 'Mission information systems',
    client: 'NASA · through Comsat Architects',
    title: 'Making mission data make sense.',
    summary:
      'Connecting requirements, capabilities, and information through full-stack applications for internal NASA use.',
    tags: ['Full-stack', 'Data visualization', 'GraphQL', 'PostgreSQL'],
    kind: 'space',
    role: 'Software Developer at Comsat Architects',
    period: 'January 2022 — April 2023',
    challenge:
      'Help stakeholders navigate information from multiple NASA sources and evaluate communications providers against mission requirements.',
    contribution: [
      'Built semantically structured full-stack applications for internal NASA use.',
      'Worked on SPARC, which integrates and visualizes spaceflight standards, exploration requirements, and human-system risks.',
      'Worked on CSP, which evaluates communications service providers against mission requirements.',
      'Collaborated with backend teams on scalable APIs using GraphQL and PostgreSQL.',
    ],
    outcome:
      'Give stakeholders clearer access to related mission information and help identify communications providers suited to their requirements.',
    outcomeLabel: 'The purpose',
  },
  {
    id: 'cleveland-givecamp',
    number: '05',
    category: 'Community & nonprofit',
    client: 'Cleveland GiveCamp',
    title: 'Good technology. Greater community.',
    summary:
      'Turning nonprofit needs into practical improvements for their websites and the people they serve.',
    tags: ['Technical leadership', 'UI/UX', 'Payment processing'],
    kind: 'community',
    role: 'Volunteer Lead Developer',
    period: '2022, 2024 & 2025',
    challenge:
      'Translate nonprofit organizations’ business needs into clear technical requirements and useful website improvements.',
    contribution: [
      'Served as a volunteer lead developer at Cleveland GiveCamp.',
      'Collaborated with nonprofits to improve website interfaces, payment processing, and user engagement.',
      'Conducted stakeholder workshops to connect organizational goals with technical requirements.',
    ],
    outcome:
      'Contributed to website and payment-processing improvements shaped by nonprofit stakeholders and their communities.',
    outcomeLabel: 'The contribution',
  },
];

export type Service = {
  number: string;
  title: string;
  description: string;
  tags: string[];
};

export const services: Service[] = [
  {
    number: '01',
    title: 'AI-powered web apps',
    description:
      'Build a website or web app that pairs a polished customer experience with practical AI features tailored to your business.',
    tags: ['React', 'TypeScript', 'AI integration'],
  },
  {
    number: '02',
    title: 'Conversational lead capture',
    description:
      'Help visitors get answers from your business information and choose to leave contact details for a follow-up—even when your team is busy.',
    tags: ['AI chat', 'Business FAQs', 'Inquiry capture'],
  },
  {
    number: '03',
    title: 'Business integrations',
    description:
      'Connect your website to booking, email, and business tools so new inquiries can reach the right place with less manual work.',
    tags: ['API integrations', 'Node.js', 'PostgreSQL'],
  },
];

export type Experience = {
  period: string;
  company: string;
  role: string;
  description: string;
};

export const experience: Experience[] = [
  {
    period: '2023 — Present',
    company: 'Sherwin-Williams',
    role: 'Software Engineer',
    description:
      'Enterprise UI/UX modernization, reusable React micro-frontends, and responsive application design.',
  },
  {
    period: '2022 — 2023',
    company: 'Comsat Architects',
    role: 'Software Developer',
    description:
      'Full-stack applications for internal NASA use, with GraphQL APIs and PostgreSQL.',
  },
  {
    period: '2022, 2024 & 2025',
    company: 'Cleveland GiveCamp',
    role: 'Volunteer Lead Developer',
    description:
      'Nonprofit website improvements and stakeholder workshops that turned business needs into technical requirements.',
  },
];
