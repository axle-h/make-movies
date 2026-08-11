# Make Movies API Client

Client generated with [Kiota](https://learn.microsoft.com/en-us/openapi/kiota).

Install kiota:

```bash
dotnet tool install --global Microsoft.OpenApi.Kiota
```

Start the API locally then:

```bash
kiota generate -l typescript -d "http://localhost:5266/swagger/v1/swagger.json" -c MakeMoviesClient -o src/client --exclude-backward-compatible
```

Kiota emits ESM style relative imports (`'./api/index.js'`). Vite resolves those
back to the `.ts` sources, so unlike under Turbopack no post-processing is needed.
The committed code has the extensions already stripped, from when this was a Next
app; regenerating will put them back, which is fine.

Do not hand edit anything else in here. `index.ts` and `user.ts` are the exceptions,
they are hand written and sit alongside deliberately.

`kiota info -l TypeScript` lists the packages the generated code needs. It
imports every serializer it knows about, so `@microsoft/kiota-serialization-form`,
`-json`, `-multipart` and `-text` all have to be installed even though this API
is JSON only.