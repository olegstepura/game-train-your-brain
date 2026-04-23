import { useEffect, useRef, useState } from 'react';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import { useI18n } from '@/i18n/context';

export const LanguageSelector = () => {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = SUPPORTED_LANGUAGES.find((l) => l.code === lang) ?? SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const handlePointer = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t('headerSelectLanguage')}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={t('headerSelectLanguage')}
        className="group w-[3.5em] h-[3.5em] flex items-center justify-center rounded-[0.8em] hover:bg-white/10 transition-colors"
      >
        <span
          className={`text-[2.2em] leading-none transition-[filter,opacity] duration-300 ease-out group-hover:grayscale-0 group-hover:opacity-100 group-focus-visible:grayscale-0 group-focus-visible:opacity-100 ${open ? 'opacity-100' : 'opacity-70'}`}
          aria-hidden="true"
        >
          {current.flag}
        </span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={t('headerSelectLanguage')}
          className="glass-panel absolute right-0 top-[calc(100%+0.5em)] z-50 rounded-[1em] p-[0.5em] min-w-[12em] flex flex-col gap-[0.2em]"
        >
          {SUPPORTED_LANGUAGES.map((l) => {
            const selected = l.code === lang;
            return (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-[0.7em] px-[0.8em] py-[0.6em] rounded-[0.7em] text-[1.4em] transition-colors ${selected
                    ? 'bg-white/10 text-on-surface'
                    : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
                    }`}
                >
                  <span className="text-[1.2em] leading-none" aria-hidden="true">
                    {l.flag}
                  </span>
                  <span>{l.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
