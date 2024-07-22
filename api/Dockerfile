FROM mcr.microsoft.com/dotnet/sdk:8.0 AS dotnet-build-env
WORKDIR /app

RUN dotnet nuget locals all --clear

# copy csproj and restore as distinct layers
COPY *.sln .
COPY MakeMovies.Api/*.csproj ./MakeMovies.Api/
COPY MakeMovies.Api/packages.lock.json ./MakeMovies.Api/
RUN dotnet restore MakeMovies.Api

# copy everything else and build app
COPY MakeMovies.Api MakeMovies.Api
RUN dotnet publish -c Release -o dist --no-restore MakeMovies.Api

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=dotnet-build-env /app/dist .

ENV Meta__ImagePath /data/images
ENV Library__MovieLibraryPath /library
ENV Library__DownloadsPath /downloads
ENV Db__Path /data

HEALTHCHECK CMD curl --fail http://localhost:8080/health/live || exit
CMD dotnet MakeMovies.Api.dll