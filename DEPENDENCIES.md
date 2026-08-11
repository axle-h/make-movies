# Dependencies

Notes on the version choices that are *not* just "take the latest", so they
don't get re-litigated on the next update pass. Everything not listed here
tracks latest.

Last reviewed: 2026-08-11.

## Held back

### `typescript` pinned to 6.x (latest is 7.x)

TypeScript 7 is the Go-native compiler. It deliberately ships **no JavaScript
compiler API** until 7.1, and that API is what `typescript-eslint` is built
on. `typescript-eslint` 8.x peers `typescript >=4.8.4 <6.1.0`, so installing
TS 7 resolves with peer warnings and leaves type-aware linting non-functional.

TS 6.0 is Microsoft's designated bridge release between 5.9 and 7, so we are
on the right stepping stone rather than sitting still. Note TS 6 defaults
`types` to `[]`, which is why `ui/tsconfig.json` declares `"types": ["node"]`.

**Unblock when:** `typescript-eslint` v9 ships with TS 7 support, which needs
the TS 7.1 JavaScript API.

## Pinned to match a runtime, not to latest

### `@types/node` tracks the Node major we actually run

Currently the 24.x line. npm `latest` is well ahead (26.x), but the runtime is
Node 24 — `node:24-alpine` in the root `Dockerfile` and `container: node:24` in
CI — which is Active LTS. Bump this only when the runtime major moves.

Node is only a build-time dependency now: it builds the SPA, it does not run
anything in production.

### .NET stays on 10.0

.NET 10 is the current LTS (EOL 2028-11-14). .NET 11 is preview-only. The
`mcr.microsoft.com/dotnet/{sdk,aspnet}:10.0` tags float, so patches arrive
without a manifest change.

## Not what the name suggests

### `next-themes` is not a Next.js dependency

It is a standalone React theme provider — context, `localStorage`, a class on
`<html>` — and is what Chakra v3's own colour mode snippet
(`ui/src/components/ui/color-mode.tsx`) is built on. It survived the move off
Next deliberately. Do not remove it as a leftover.

## Gotchas

### `ui/src/client/` is generated

Regenerating it needs the full set of kiota serializers installed, even though
this API is JSON only. See `ui/src/client/README.md`. Do not hand-edit the
generated code — `index.ts` and `user.ts` are hand written and sit alongside it
deliberately.

### `ui/src/routeTree.gen.ts` is generated but committed

The TanStack Router vite plugin generates it from `ui/src/routes`. It is committed rather than
gitignored because `pnpm build` runs `tsc --noEmit` before `vite build`, so on a clean clone the
typecheck would run before anything had generated it. Both `pnpm dev` and `pnpm build`
regenerate it; do not hand edit it.

### pnpm blocks package build scripts

`esbuild` has a postinstall that pnpm refuses to run unless it is allowlisted.
pnpm 11 spells this `allowBuilds` in `ui/pnpm-workspace.yaml`, not
`onlyBuiltDependencies` in `package.json` as pnpm 10 did. Without it `pnpm
install` fails with `ERR_PNPM_IGNORED_BUILDS`.

### Lock files are enforced

Both .NET projects set `RestorePackagesWithLockFile`, so any version change
needs `dotnet restore --force-evaluate` and the regenerated
`packages.lock.json` committed, otherwise restore fails with NU1004. Note there
are **two** lock files: the test project's lists the API's direct packages, so
adding a package reference to the API invalidates both.

## Resolved

### `eslint` is on 10.x again

The old hold existed because `eslint-config-next` pulled in
`eslint-plugin-import`, `-react` and `-jsx-a11y`, all of which peered `eslint
^9`. Dropping Next dropped that whole tree. The flat config now composes
`@eslint/js`, `typescript-eslint` and `eslint-plugin-react-hooks` directly, all
of which peer `^10.0.0`.
