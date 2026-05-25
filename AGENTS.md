# AGENTS.md

## Commands
- Install from the repo root with `npm install`; this is an npm workspaces repo for `frontend` and `backend`.
- Run both dev servers from the root with `npm run serve`; it starts Vue CLI in `frontend` and `nodemon index.js` in `backend`.
- Build the client with `npm run build` from the root or `npm run build -w frontend`.
- Lint only exists for the frontend: `npm run lint -w frontend`.
- There is no useful backend test script; `npm run test -w backend` is the default failing placeholder.

## Local Tooling Gotcha
- In this workspace, `npm` currently resolves to `/mnt/c/Program Files/nodejs/npm`; it fails Vue CLI scripts from WSL UNC paths. Use a Linux Node/npm on `PATH` before relying on npm script results.

## Architecture
- `frontend/src/main.js` mounts the Vue 3 app, router, Vuex store, Tailwind CSS, and global FontAwesome/user-alert components.
- Routes live in `frontend/src/router.js`: `/armies` is the main list and `/armies/:armyId` renders `ArmyView`; `/units` renders the unit catalog.
- `frontend/src/App.vue` dispatches `getStateData` on creation and provides imported JSON references/helpers to child components via Vue `provide`/`inject`.
- Backend entrypoint is `backend/index.js`; it is a small Express API on `process.env.PORT || 3000` with permissive CORS and JSON bodies.

## Data And Env
- Local frontend API URLs are committed in `frontend/.env.development.local` and `frontend/.env.production.local` as `VUE_APP_*` variables pointing at `http://localhost:3000/api/...`.
- Army save/load data is written under `backend/data/armies/*.json`; that directory is created by GET `/api/get-army-data` but not before POST `/api/save-army-data`.
- State/currency reference data is stored in `backend/data/references/*.json`; frontend copies of unit/reference JSON live in `frontend/src/*.json`.
- `backend/index.js` has a case-sensitive path typo in GET `/api/get-state-list`: it reads `./data/references/Currency.json`, while the repo file is `CURRENCY.json`.

## Style
- Both packages use Prettier settings with 2 spaces, semicolons, single quotes, trailing commas where valid in ES5, and `arrowParens: avoid`.
- Frontend imports use the `@/*` alias configured in `frontend/jsconfig.json`.
