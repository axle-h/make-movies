# Make Movies API Client

Client generated with [Kiota](https://learn.microsoft.com/en-us/openapi/kiota).

Install kiota:

```bash
dotnet tool install --global Microsoft.OpenApi.Kiota
```

Start the API locally then:

```bash
kiota generate -l typescript -d "http://localhost:5266/swagger/v1/swagger.json" -c MakeMoviesClient -o client --exclude-backward-compatible
```