import { business } from './business.ts';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };
export type ChatReply = {
  message: string;
  mode: 'demo' | 'ai';
  action?: 'booking' | 'callback' | 'call';
};

export function hasSafetyConcern(text: string) {
  return /gas\s*(leak|smell)|smell.{0,20}gas|carbon monoxide|\bco (alarm|detector)\b|smoke|\bfire\b|burning smell/i.test(
    text,
  );
}

/** Deterministic replies are shared with the browser for offline/preview resilience. */
export function demoReply(text: string): ChatReply {
  const q = text.toLowerCase();
  if (hasSafetyConcern(q))
    return {
      mode: 'demo',
      message:
        'If you suspect a gas leak, carbon monoxide, smoke, or fire, leave the building and contact 911 or your gas utility from a safe place. Don’t wait for a chat or callback. This is a fictional demo, not an emergency service.',
      action: 'call',
    };
  if (/cancel|never mind|nevermind/.test(q))
    return {
      mode: 'demo',
      message:
        'No problem. I can help with service areas, pricing, emergency availability, or a demo booking whenever you’re ready.',
    };
  if (
    /call\s*back|callback|call me|contact me|speak to|talk to (a |the )?(person|team|human)/.test(
      q,
    )
  )
    return {
      mode: 'demo',
      message:
        'I can help you try a callback request. I’ll ask for your name and phone, then let you review it before saving it on this device. No call will be placed in this demo.',
      action: 'callback',
    };
  if (/book|appointment|schedule|reserve/.test(q))
    return {
      mode: 'demo',
      message:
        'Let’s find a little more comfort. Open the booking form to choose your service and a preferred date and time. It will save a demo request only, not reserve a real appointment.',
      action: 'booking',
    };
  const answers: string[] = [];
  if (
    /area|serve|service.*(near|in)|cleveland|lakewood|westlake|strongsville|parma|mentor|beachwood|shaker|zip|441|440/.test(
      q,
    )
  )
    answers.push(
      `Our service area includes ${business.areas.join(', ')}. Outside that list? Please check with the team first.`,
    );
  if (/price|cost|\$|89|diagnostic|fee|charge|quote/.test(q))
    answers.push(
      'The diagnostic visit is $89 for an on-site assessment. Repairs and parts are quoted separately before work starts. Sample ranges: AC repair $150–$1,200; furnace installation $3,500–$8,500; maintenance $199/year. Final pricing depends on the work needed.',
    );
  if (
    /emergency|urgent|24|after.hour|weekend|tonight|no heat|not (heating|cooling)|no (ac|air|cooling)/.test(
      q,
    )
  )
    answers.push(
      `The emergency line is available 24/7. For urgent help, call ${business.phone} rather than waiting for an online request. No arrival time is guaranteed. This demo phone number is fictional.`,
    );
  if (/hour|open|sunday|saturday|monday/.test(q) && !answers.length)
    answers.push(`${business.hours.join('. ')}. ${business.emergencyHours}.`);
  if (/maintain|maintenance|tune.?up|club|plan/.test(q) && !/price|cost|\$/.test(q))
    answers.push(
      'The Comfort Club is $199/year and includes a spring AC tune-up, a fall furnace tune-up, seasonal checks and cleaning, and priority scheduling. It’s a simple way to plan ahead.',
    );
  if (/furnace|install|replace|heating/.test(q) && !answers.length)
    answers.push(
      'We offer furnace installation, with a sample installed range of $3,500–$8,500. A home assessment helps determine sizing, equipment, and the final quote.',
    );
  if (/\bac\b|air condition|cooling|repair/.test(q) && !answers.length)
    answers.push(
      'We troubleshoot cooling, airflow, thermostat, and electrical issues. Start with an $89 diagnostic visit; AC repairs typically range from $150–$1,200 in this demo, with a quote before work begins.',
    );
  if (/licensed|insured|trust/.test(q))
    answers.push(
      'The fictional North Coast brand is presented as licensed and insured. Credentials, reviews, and ratings on this site are sample demo content, not verified business claims.',
    );
  if (/thank/.test(q) && !answers.length)
    answers.push(
      'You’re very welcome! I’m here if you’d like to explore services, try a booking, or request a demo callback.',
    );
  return {
    mode: 'demo',
    message:
      answers.join('\n\n') ||
      'Hi! I’m Frosty, your North Coast comfort helper. I can answer questions about our Cleveland service area, the $89 diagnostic visit, maintenance, or 24/7 emergency availability. You can also try a booking or request a callback.',
  };
}
