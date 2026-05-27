## Commands
- Install from the repo root with `npm install`; npm workspaces cover `frontend` and `backend`, and the root lockfile is the one to prefer over package-local lockfiles.
- Run both dev servers from the root with `npm run serve`; it starts Vue CLI in `frontend` and `nodemon index.js` in `backend`.
- Run only the frontend with `npm run serve -w frontend`; there is no backend serve script, so use `npm exec -w backend -- nodemon index.js` when needed.
- Build the client with `npm run build` from the root or `npm run build -w frontend`.
- Lint only exists for the frontend: `npm run lint -w frontend`.
- There is no useful backend test script; `npm run test -w backend` is the default failing placeholder.

## Architecture
- This is Vue CLI 5/Vue 3, not Vite; `frontend/src/main.js` mounts router, Vuex, Tailwind CSS, FontAwesome, and `user-alert`.
- Routes live in `frontend/src/router.js`: `/armies` lists states, `/armies/:armyId` renders `ArmyView`, and `/units` renders the unit catalog.
- `frontend/src/App.vue` dispatches `getStateData` on creation and exposes unit/reference helpers through Vue `provide`/`inject`.
- Backend entrypoint is `backend/index.js`; it is a small Express API on `process.env.PORT || 3000` with permissive CORS and JSON bodies.

## Data And Env
- Army save/load uses `VUE_APP_GET_DATA_URL` and `VUE_APP_SAVE_DATA_URL` from `frontend/.env.*.local`, but Vuex state-list actions hard-code `http://localhost:3000/api/...`.
- `backend/data/` is gitignored but required at runtime; `references/` and `defaults/` hold `STATE_ID.json`, `STATE_MAP.json`, and `CURRENCY.json`.
- Army save/load data is written under `backend/data/armies/*.json`; GET `/api/get-army-data` creates the `armies` directory, POST `/api/save-army-data` does not.
- `backend/index.js` has a case-sensitive path typo in GET `/api/get-state-list`: it reads `./data/references/Currency.json`, while the file is `CURRENCY.json`.

## Style
- Both packages use Prettier settings with 2 spaces, semicolons, single quotes, trailing commas where valid in ES5, and `arrowParens: avoid`.
- Frontend imports use the `@/*` alias configured in `frontend/jsconfig.json`.
