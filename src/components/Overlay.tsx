import { useEffect, type ReactNode } from 'react';

interface OverlayProps {
  onDismiss: () => void;
  children: ReactNode;
  labelledBy?: string;
}

export const Overlay = ({ onDismiss, children, labelledBy }: OverlayProps) => {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [onDismiss]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-[2em] bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      onClick={onDismiss}
    >
      <div
        className="glass-panel rounded-[2em] max-w-[60em] w-full p-[3em] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="noise-overlay" />
        {children}
      </div>
    </div>
  );
};
