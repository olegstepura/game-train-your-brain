export const PEGS_PER_ROW = 4;
export const MAX_ATTEMPTS = 10;

export type ColorId =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple';

export interface PegColor {
  id: ColorId;
  label: string;
  bg: string;
  glow: string;
}

export const PEG_COLORS: readonly PegColor[] = [
  { id: 'red', label: 'Red', bg: 'bg-red-500', glow: 'rgba(239, 68, 68, 0.5)' },
  { id: 'orange', label: 'Orange', bg: 'bg-orange-500', glow: 'rgba(249, 115, 22, 0.5)' },
  { id: 'yellow', label: 'Yellow', bg: 'bg-yellow-500', glow: 'rgba(234, 179, 8, 0.5)' },
  { id: 'green', label: 'Green', bg: 'bg-green-500', glow: 'rgba(34, 197, 94, 0.5)' },
  { id: 'blue', label: 'Blue', bg: 'bg-blue-500', glow: 'rgba(59, 130, 246, 0.5)' },
  { id: 'purple', label: 'Purple', bg: 'bg-purple-500', glow: 'rgba(168, 85, 247, 0.5)' },
] as const;

export const PEG_COLOR_BY_ID: Record<ColorId, PegColor> = Object.fromEntries(
  PEG_COLORS.map((c) => [c.id, c]),
) as Record<ColorId, PegColor>;
