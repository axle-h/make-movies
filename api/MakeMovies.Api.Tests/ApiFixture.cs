using System.Reflection;
using MakeMovies.Api.Downloads;
using MakeMovies.Api.Tests.Library.Jellyfin;
using MakeMovies.Api.Tests.Meta.Tmdb;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WireMock.Server;

namespace MakeMovies.Api.Tests;

[Collection("Api")]
public abstract class ApiTests
{
    protected ApiTests(ApiFixture fixture)
    {
        Fixture = fixture;
        Fixture.WireMock.Reset();
    }

    protected ApiFixture Fixture { get; }
}

[CollectionDefinition("Api")]
public class ApiFixtureDefinition : ICollectionFixture<ApiFixture>;

public class ApiFixture : WebApplicationFactory<Program>
{
    public string TmpPath { get; } = Path.Join(Path.GetTempPath(), $"make-movies-test-{DateTime.UtcNow:yyyy-MM-ddTHH-mm-ss}-{Guid.NewGuid():N}");
    
    public WireMockServer WireMock { get; } = WireMockServer.Start();
    
    public Db Db => Services.GetRequiredService<Db>();
    
    /// <summary>
    /// Replaces the cookie and oidc schemes with <see cref="TestAuthHandler"/>. Turn this off to
    /// exercise the real handlers, with the identity provider served by <see cref="WireMock"/>.
    /// </summary>
    protected virtual bool UseTestAuth => true;

    /// <summary>
    /// Layered over the base test configuration, so anything here wins.
    /// </summary>
    protected virtual IDictionary<string, string?> Configuration => new Dictionary<string, string?>();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        Directory.CreateDirectory(TmpPath);
        Directory.CreateDirectory(Path.Join(TmpPath, "downloads"));
        Directory.CreateDirectory(Path.Join(TmpPath, "movies"));
        
        WriteResourceToFile("MakeMovies.Api.Tests.movies.json", Path.Join(TmpPath, "movies.json"));

        builder.UseEnvironment("e2e")
            .ConfigureAppConfiguration(config => config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Db:Path"] = TmpPath,
                
                ["Scrape:ProxyUrl"] = null,
                ["Scrape:Yts:Url"] = $"{WireMock.Urls[0]}/yts/",
                ["Scrape:Yts:Limit"] = "2",
                ["Scrape:Yts:MaxRetries"] = "1",
                ["Scrape:Yts:RetryDelay"] = "00:00:01",
                
                ["Meta:Tmdb:Url"] = $"{WireMock.Urls[0]}/tmdb/",
                ["Meta:Tmdb:AccessToken"] = TmdbWireMock.AccessToken,
                ["Meta:Omdb:Url"] = $"{WireMock.Urls[0]}/omdb/",
                ["Meta:Omdb:ApiKey"] = "omdb-api-key",
                ["Meta:ImagePath"] = TmpPath,
                
                ["Library:Jellyfin:Url"] = $"{WireMock.Urls[0]}/jellyfin/",
                ["Library:Jellyfin:ApiKey"] = JellyfinWireMock.ApiKey,
                ["Library:MovieLibraryPath"] = Path.Join(TmpPath, "movies"),
                ["Library:DownloadsPath"] = Path.Join(TmpPath, "downloads"),

                ["Download:Transmission:Url"] = $"{WireMock.Urls[0]}/transmission/",
                ["Download:BackgroundJobPeriod"] = "00:00:01",
                ["Download:DownloadGracePeriod"] = "00:00:01",

                // Only exercised when UseTestAuth is off, otherwise the test scheme below replaces
                // every authentication default and these just satisfy AuthOptions.ValidateOnStart.
                ["Auth:Authority"] = "https://sso.test/",
                ["Auth:ClientId"] = "make-movies-test",
                ["Auth:ClientSecret"] = "test-secret"
            }).AddInMemoryCollection(Configuration)).ConfigureTestServices(services =>
            {
                services.Configure<DownloadOptions>(o =>
                {
                    o.Trackers = new List<string> {"udp://tracker1:1337/announce", "udp://tracker2:1337/announce"};
                });

                if (!UseTestAuth)
                {
                    return;
                }

                services.AddAuthentication()
                    .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(TestAuthHandler.SchemeName, _ => { });

                // Every default has to be overridden: the app pins DefaultChallengeScheme and
                // DefaultForbidScheme, so they do not fall back to DefaultScheme.
                services.Configure<AuthenticationOptions>(o =>
                {
                    o.DefaultScheme = TestAuthHandler.SchemeName;
                    o.DefaultAuthenticateScheme = TestAuthHandler.SchemeName;
                    o.DefaultChallengeScheme = TestAuthHandler.SchemeName;
                    o.DefaultForbidScheme = TestAuthHandler.SchemeName;
                    o.DefaultSignInScheme = TestAuthHandler.SchemeName;
                    o.DefaultSignOutScheme = TestAuthHandler.SchemeName;
                });
            });
    }

    public override async ValueTask DisposeAsync()
    {
        await base.DisposeAsync();
        WireMock.Stop();
    }
    
    private static void WriteResourceToFile(string resourceName, string fileName)
    {
        using var resource = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName)
            ?? throw new Exception($"unknown resource {resourceName}");
        using var file = new FileStream(fileName, FileMode.Create, FileAccess.Write);
        resource.CopyTo(file);
    }
}