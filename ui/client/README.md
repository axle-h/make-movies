# Make Movies API Client

Client generated with [Kiota](https://learn.microsoft.com/en-us/openapi/kiota).

Install kiota:

```bash
dotnet tool install --global Microsoft.OpenApi.Kiota
```

Start the API locally then:

```bash
kiota generate -l typescript -d "http://localhost:5266/swagger/v1/swagger.json" -c MakeMoviesClient -o client --exclude-backward-compatible

# kiota emits ESM style relative imports ('./api/index.js'). Turbopack, the
# default bundler since Next 16, cannot resolve a .js specifier to a .ts file
# and has no extensionAlias equivalent (vercel/next.js#82945), so strip the
# extension back off. Package imports are left alone.
find client -name '*.ts' -exec sed -i -E "s|(from '\.\.?/[^']*)\.js'|\1'|g" {} +
```

`kiota info -l TypeScript` lists the packages the generated code needs. It
imports every serializer it knows about, so `@microsoft/kiota-serialization-form`,
`-json`, `-multipart` and `-text` all have to be installed even though this API
is JSON only.