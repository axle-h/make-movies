# Dependencies

Notes on the version choices that are *not* just "take the latest", so they
don't get re-litigated on the next update pass. Everything not listed here
tracks latest.

Last reviewed: 2026-08-11.

## Held back

### `eslint` pinned to 9.x (latest is 10.x)

ESLint 10 itself is fine — the flat config migration is already done. The
blocker is downstream of `eslint-config-next`, which depends on
`eslint-plugin-import`, `eslint-plugin-react` and `eslint-plugin-jsx-a11y`.
All three still declare `eslint ^9` as their peer, so installing ESLint 10
resolves with three `ERESOLVE overriding peer dependency` warnings.

9.39.5 is upstream's `maintenance` dist-tag, so this is a supported line, not
an abandoned one.

**Unblock when:** `eslint-config-next` widens those plugin peers to ESLint 10.

### `typescript` pinned to 6.x (latest is 7.x)

TypeScript 7 is the Go-native compiler. It deliberately ships **no JavaScript
compiler API** until 7.1, and that API is what `typescript-eslint` is built
on. `typescript-eslint` 8.x — a direct dependency of `eslint-config-next` —
peers `typescript >=4.8.4 <6.1.0`. Installing TS 7 resolves with eight
`ERESOLVE` warnings and leaves type-aware linting non-functional.

TS 6.0 is Microsoft's designated bridge release between 5.9 and 7, so we are
on the right stepping stone rather than sitting still. Note TS 6 defaults
`types` to `[]`, which is why `ui/tsconfig.json` declares `"types": ["node"]`.

**Unblock when:** `typescript-eslint` v9 ships with TS 7 support, which needs
the TS 7.1 JavaScript API.

## Pinned to match a runtime, not to latest

### `@types/node` tracks the Node major we actually run

Currently the 24.x line. npm `latest` is well ahead (26.x), but the runtime is
Node 24 — `node:24-alpine` in `ui/Dockerfile` and `container: node:24` in CI —
which is Active LTS. Bump this only when the runtime major moves.

### .NET stays on 10.0

.NET 10 is the current LTS (EOL 2028-11-14). .NET 11 is preview-only. The
`mcr.microsoft.com/dotnet/{sdk,aspnet}:10.0` tags float, so patches arrive
without a manifest change.

## Gotchas

### `ui/client/` is generated

Regenerating it needs two post-steps that are easy to miss — installing the
full set of kiota serializers and stripping ESM `.js` extensions off relative
imports, which Turbopack cannot resolve. Both are documented in
`ui/client/README.md`. Do not hand-edit the generated code.

### Lock files are enforced

Both .NET projects set `RestorePackagesWithLockFile`, so any version change
needs `dotnet restore --force-evaluate` and the regenerated
`packages.lock.json` committed, otherwise restore fails with NU1004.
