# Make Movies UI

No frills [React](https://react.dev) + [Vite](https://vite.dev) + [Chakra](https://chakra-ui.com)
based UI for movie library maintenance.

This is a plain static SPA. It is built into the API's `wwwroot` at image build time and served
from there, so there is no separate UI container and no deploy of its own. See the root
[Dockerfile](../Dockerfile).

## Routing

File based, via [TanStack Router](https://tanstack.com/router). A file under `src/routes` is a
route: `movies/index.tsx` is `/movies`, `movies/$id.tsx` is `/movies/{id}`, `__root.tsx` is the
layout everything renders inside.

The vite plugin generates `src/routeTree.gen.ts` from that directory. It is **committed**,
because `pnpm build` typechecks before it bundles and would otherwise not find it on a clean
clone. `pnpm dev` and `pnpm build` both regenerate it, so just commit whatever changes.

Search params are validated and typed per route rather than being loose strings, see
`validateSearch` in `movies/index.tsx`. `Route.useSearch()` gives back the parsed object and
`navigate({ search })` is checked against it.

`components/link.tsx` is an href based escape hatch for call sites that build a path as a
string, e.g. `/movies/${id}`. Where a target is known statically, prefer the router's own
`Link` with `to` and `params` so it is typechecked.

## Development

`vite dev` proxies `/api`, `/movie-images`, `/auth` and the OIDC callbacks to the API on
`http://localhost:5266`. Set `Auth:Disabled` in the API's `appsettings.Development.json` and it
authenticates a fake user, so no identity provider is needed:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

To work on the UI alone, run the mock api in `./mock-api` and point the proxy at it:

```bash
API_URL=http://localhost:5000 pnpm dev
```

## Authentication

There is no login page. The API gates `index.html` behind the same authorization policy as the
API endpoints, so an unauthenticated navigation is redirected out to the identity provider and
comes back signed in — this code only ever runs authenticated.

Two consequences:

- The user is read from `GET /api/v1/me` (`src/client/user.ts`), not from a session prop.
- A 401 on any API call means the session expired underneath us. The request adapter in
  `src/client/index.ts` turns that into a navigation to `/auth/login?returnUrl=...`.

Logging out is a real navigation to `/auth/logout`, not a fetch, because it has to follow the
redirect chain out to the identity provider.

## Build

```bash
pnpm build     # tsc --noEmit && vite build, output in ./dist
pnpm lint
```
