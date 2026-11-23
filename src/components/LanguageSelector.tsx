import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '@/i18n/config';
import { useI18n } from '@/i18n/context';

export const LanguageSelector = () => {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const current = SUPPORTED_LANGUAGES.find((l) => l.code === lang) ?? SUPPORTED_LANGUAGES[0];

  const options = () =>
    Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const choose = (code: LanguageCode) => {
    setLang(code);
    close(true);
  };

  useEffect(() => {
    if (!open) return;
    /* Move focus to the current language so arrow keys start from there. */
    listRef.current?.querySelector<HTMLElement>('[aria-selected="true"]')?.focus();
    const handlePointer = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointer);
    return () => document.removeEventListener('pointerdown', handlePointer);
  }, [open]);

  const handleListKey = (e: KeyboardEvent<HTMLUListElement>) => {
    const items = options();
    const idx = items.indexOf(document.activeElement as HTMLElement);
    const focusAt = (i: number) => items[(i + items.length) % items.length]?.focus();
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        focusAt(idx + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        focusAt(idx - 1);
        break;
      case 'Home':
        e.preventDefault();
        focusAt(0);
        break;
      case 'End':
        e.preventDefault();
        focusAt(items.length - 1);
        break;
      case 'Escape':
        e.preventDefault();
        close(true);
        break;
      case 'Tab':
        close(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            setOpen(true);
          }
        }}
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
          ref={listRef}
          onKeyDown={handleListKey}
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
                  tabIndex={selected ? 0 : -1}
                  onClick={() => choose(l.code)}
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
