const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const focusableIn = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE));

/** Keeps Tab and Shift+Tab inside `root`. Call it from a keydown handler. */
export const trapTab = (e: KeyboardEvent, root: HTMLElement) => {
  if (e.key !== 'Tab') return;
  const items = focusableIn(root);
  if (items.length === 0) {
    e.preventDefault();
    return;
  }
  const first = items[0]!;
  const last = items[items.length - 1]!;
  const active = document.activeElement;
  const inside = active instanceof Node && root.contains(active);
  if (e.shiftKey && (active === first || !inside)) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && (active === last || !inside)) {
    e.preventDefault();
    first.focus();
  }
};
