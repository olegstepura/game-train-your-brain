import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'tyb.theme';

const readStored = (): Theme | null => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'dark' || v === 'light' ? v : null;
  } catch {
    return null;
  }
};

const store = (theme: Theme) => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
};

const LIGHT_QUERY = '(prefers-color-scheme: light)';

const systemPreference = (): Theme =>
  window.matchMedia?.(LIGHT_QUERY).matches ? 'light' : 'dark';

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.classList.toggle('light', theme === 'light');
};

const initial: Theme = readStored() ?? systemPreference();
applyTheme(initial);

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(initial);

  useEffect(() => applyTheme(theme), [theme]);

  /* Until the player picks a theme, follow the OS setting, also when it
     changes while the page is open. */
  useEffect(() => {
    const mq = window.matchMedia?.(LIGHT_QUERY);
    if (!mq) return;
    const onChange = () => {
      if (readStored() === null) setTheme(mq.matches ? 'light' : 'dark');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* Only an explicit choice is saved. Saving the detected default would pin
     it and ignore later OS changes. */
  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    store(next);
    setTheme(next);
  };
  return { theme, toggle };
};
