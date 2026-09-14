import { useEffect, useRef } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { profile, type Project } from '../data/portfolio';
import { ProjectVisual } from './ProjectVisual';

interface CaseStudyProps {
  project: Project | null;
  onClose: () => void;
}

export function CaseStudy({ project, onClose }: CaseStudyProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!project) return;
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [project]);

  return (
    <dialog
      ref={dialogRef}
      className="case-dialog"
      aria-labelledby="case-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {project && (
        <div className="case-content">
          <div className="case-topline">
            <span className="eyebrow">PROJECT NOTES / {project.number}</span>
            <button
              className="icon-button"
              aria-label="Close project details"
              autoFocus
              onClick={onClose}
            >
              <X size={22} />
            </button>
          </div>
          <p className="case-client">{project.client}</p>
          <h2 id="case-title">{project.title}</h2>
          <div className="case-meta">
            <span>{project.role}</span>
            <span>{project.period}</span>
          </div>
          <ProjectVisual kind={project.kind} />
          <div className="case-detail">
            <h3>The challenge</h3>
            <p>{project.challenge}</p>
          </div>
          <div className="case-detail">
            <h3>My contribution</h3>
            <ul>
              {project.contribution.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="case-detail">
            <h3>{project.outcomeLabel}</h3>
            <p>{project.outcome}</p>
          </div>
          <div className="tag-list">
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <p className="case-disclosure">
            Visuals are original concept illustrations, not screenshots of internal
            applications.
          </p>
          <a
            className="button button-primary"
            href={`mailto:${profile.email}?subject=${encodeURIComponent('Let’s discuss a similar project')}`}
          >
            Build something with me <ArrowUpRight size={18} />
          </a>
        </div>
      )}
    </dialog>
  );
}
