import { useEffect, useRef, type ReactNode } from 'react';
import { focusableIn, trapTab } from './focus';

interface OverlayProps {
  onDismiss: () => void;
  children: ReactNode;
  labelledBy?: string;
}

export const Overlay = ({ onDismiss, children, labelledBy }: OverlayProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  /* Captured during the first render, before focus moves into the panel, so
     StrictMode's double effect run can't overwrite it. */
  const returnFocusTo = useRef(document.activeElement as HTMLElement | null);
  /* A click only dismisses when the press also started on the backdrop.
     Otherwise a drag from inside the panel to the backdrop would dismiss. */
  const pressOnBackdrop = useRef(false);

  useEffect(() => {
    const panel = panelRef.current;
    if (panel) (focusableIn(panel)[0] ?? panel).focus();
    const target = returnFocusTo.current;
    return () => {
      const active = document.activeElement;
      if (!active || active === document.body) target?.focus();
    };
  }, []);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
      else if (panelRef.current) trapTab(e, panelRef.current);
    };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-[2em] bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      onPointerDown={(e) => {
        pressOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (pressOnBackdrop.current && e.target === e.currentTarget) onDismiss();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="glass-panel rounded-[2em] max-w-[60em] w-full p-[3em] relative overflow-hidden outline-hidden"
      >
        <div className="noise-overlay" />
        {children}
      </div>
    </div>
  );
};
