import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/portfolio';

/** Shared clipboard feedback for the header and contact section. */
export function useCopyEmail() {
  const [copyStatus, setCopyStatus] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyStatus('Email copied');
    } catch {
      setCopyStatus(
        'You can select the email address to copy it, or click it to email me.',
      );
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopyStatus(''), 5000);
  }

  return { copyEmail, copyStatus };
}
