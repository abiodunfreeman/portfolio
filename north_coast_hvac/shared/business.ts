export const business = {
  name: 'North Coast Heating & Cooling',
  phone: '(216) 555-0148',
  phoneHref: 'tel:+12165550148',
  email: 'hello@northcoasthvac.example',
  diagnosticPrice: 89,
  rating: '4.9',
  areas: [
    'Cleveland',
    'Lakewood',
    'Westlake',
    'Strongsville',
    'Parma',
    'Mentor',
    'Beachwood',
    'Shaker Heights',
  ],
  hours: [
    'Monday–Friday: 8am–6pm',
    'Saturday: 9am–2pm',
    'Sunday: emergency service only',
  ],
  emergencyHours: 'Emergency service: 24 hours, every day',
};

export const services = [
  {
    id: 'ac-repair',
    title: 'AC repair',
    subtitle: 'A cooler home. A clearer head.',
    description:
      'Warm air, strange sounds, or a system that just won’t start? We get to the source of the problem and explain your options before any repair.',
    price: '$150–$1,200',
    priceLabel: 'Typical repair range',
    icon: 'cooling',
    features: [
      'Cooling and airflow diagnostics',
      'Thermostat and electrical troubleshooting',
      'Clear repair options before work begins',
    ],
  },
  {
    id: 'furnace-installation',
    title: 'Furnace installation',
    subtitle: 'Ready for whatever winter brings.',
    description:
      'Bring dependable warmth to your home with a furnace sized for your space. We walk you through efficiency, equipment choices, and the installation plan.',
    price: '$3,500–$8,500',
    priceLabel: 'Typical installed system',
    icon: 'heating',
    features: [
      'Home comfort and system-sizing consultation',
      'Efficient equipment options explained simply',
      'Old equipment removal and system walkthrough',
    ],
  },
  {
    id: 'maintenance',
    title: 'Maintenance plans',
    subtitle: 'A little care goes a long way.',
    description:
      'Keep the surprises out of the changing seasons. Our Comfort Club brings regular attention to your heating and cooling system, all year long.',
    price: '$199 / year',
    priceLabel: 'Comfort Club membership',
    icon: 'maintenance',
    features: [
      'One spring AC and one fall furnace tune-up',
      'Seasonal system checks and cleaning',
      'Priority scheduling for members',
    ],
  },
] as const;

export const serviceOptions = [
  ...services.map(({ id, title }) => ({ id, title })),
  { id: 'not-sure', title: 'Not sure — help me choose' },
];

export const testimonials = [
  {
    name: 'Melissa R.',
    suburb: 'Lakewood',
    service: 'AC repair',
    quote:
      'Our AC stopped on the hottest afternoon of the week. The technician explained what had failed, showed us the price, and had cool air moving again. Exactly the kind of service you hope for.',
  },
  {
    name: 'James T.',
    suburb: 'Westlake',
    service: 'Furnace installation',
    quote:
      'We never felt pushed toward the most expensive furnace. They helped us choose what made sense for our house, kept the work area clean, and walked us through the new thermostat.',
  },
  {
    name: 'Angela M.',
    suburb: 'Parma',
    service: 'Maintenance plan',
    quote:
      'The seasonal visits take one thing off my list. They arrive when they say they will and explain the small things I can do between tune-ups. Friendly people, every time.',
  },
  {
    name: 'David K.',
    suburb: 'Strongsville',
    service: 'Heating repair',
    quote:
      'Waking up to a cold house is never fun. Having someone pick up, listen, and explain the next steps made the morning a lot less stressful. We really appreciated the clear communication.',
  },
  {
    name: 'Priya S.',
    suburb: 'Beachwood',
    service: 'AC repair',
    quote:
      'Shoe covers, a tidy workspace, and no surprise charges. The technician took time to answer my questions without making me feel rushed. I would gladly call them again.',
  },
  {
    name: 'Robert L.',
    suburb: 'Shaker Heights',
    service: 'Maintenance plan',
    quote:
      'Our older home has its quirks. They listened to what we were noticing and gave us practical advice instead of a sales pitch. It feels good to have a team we can turn to.',
  },
];

export const faqs = [
  {
    question: 'Which neighborhoods do you serve?',
    answer: `We serve ${business.areas.join(', ')}. If you’re just outside these areas, call to check before requesting a visit.`,
  },
  {
    question: 'What does the $89 diagnostic visit include?',
    answer:
      'The $89 diagnostic visit covers an on-site assessment of your heating or cooling concern and an explanation of the findings. Repairs, parts, and installation are quoted separately before work starts. These are sample demo prices.',
  },
  {
    question: 'Can I get help after hours?',
    answer:
      'Our emergency service line is available 24/7, including weekends. For an urgent heating or cooling problem, call rather than submitting an online request. Arrival times depend on technician availability. The phone number on this demo is fictional.',
  },
  {
    question: 'Should I repair or replace my system?',
    answer:
      'The right choice depends on the system’s condition, repair needs, and how well it serves your home. A diagnostic visit is a good first step. We’ll explain the options so you can decide without pressure.',
  },
  {
    question: 'What’s included in a maintenance plan?',
    answer:
      'Our sample Comfort Club plan is $199 per year. It includes a spring AC tune-up, a fall furnace tune-up, seasonal checks and cleaning, and priority scheduling.',
  },
  {
    question: 'How does booking work on this demo?',
    answer:
      'Choose your service and preferred date and time, then submit the form. Your request is saved in this browser and you’ll see a confirmation. No appointment is actually scheduled and no one will call. In a live version, the team would follow up to confirm availability.',
  },
];
