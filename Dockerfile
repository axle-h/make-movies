# The ui and the api ship as a single container: the api serves the built spa out of
# wwwroot and owns authentication for both.

FROM node:24-alpine AS ui-build
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable
WORKDIR /ui
COPY ui/package.json ui/pnpm-lock.yaml ui/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY ui/ ./
RUN pnpm run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS dotnet-build
WORKDIR /app
COPY api/make-movies.sln .
COPY api/MakeMovies.Api/*.csproj ./MakeMovies.Api/
COPY api/MakeMovies.Api/packages.lock.json ./MakeMovies.Api/
RUN dotnet restore MakeMovies.Api
COPY api/MakeMovies.Api ./MakeMovies.Api
RUN dotnet publish -c Release -o dist --no-restore MakeMovies.Api

FROM mcr.microsoft.com/dotnet/aspnet:10.0
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=dotnet-build /app/dist .
# After the publish output, so this wins if a wwwroot ever appears in the project.
COPY --from=ui-build /ui/dist ./wwwroot

ENV Meta__ImagePath=/data/images
ENV Library__MovieLibraryPath=/library
ENV Library__DownloadsPath=/downloads
ENV Db__Path=/data

HEALTHCHECK CMD curl --fail http://localhost:8080/health/live || exit

CMD ["dotnet", "MakeMovies.Api.dll"]
