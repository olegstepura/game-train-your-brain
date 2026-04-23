# Train Your Brain

A cows and bows-style logic puzzle: break a hidden 4-color sequence in 10 attempts.

## Stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Yarn 4](https://yarnpkg.com/) (via Corepack)
- [Task](https://taskfile.dev/) for task running

## Getting started

```sh
corepack enable      # one-time, enables Yarn 4
task install         # install dependencies
task dev             # start dev server on :3003
task build           # production build
task preview         # preview production build
```

Available tasks: `task --list`.

## Layout

- `src/game/` — state, reducer, logic (pure)
- `src/components/` — presentation
- `src/App.tsx` — composition root
