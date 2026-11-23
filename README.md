# Train Your Brain

A cows and bows-style logic puzzle: break a hidden 4-color sequence in 10 attempts.

## Stack

- [Vite](https://vitejs.dev/) + [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [pnpm](https://pnpm.io/)
- [Task](https://taskfile.dev/) for task running

## Getting started

```sh
task install         # install dependencies
task dev             # start dev server on :3003
task test            # unit tests (Vitest)
task build           # production build
task preview         # preview production build
```

Available tasks: `task --list`.

## Layout

- `src/game/` — state, reducer, logic (pure)
- `src/components/` — presentation
- `src/App.tsx` — composition root
